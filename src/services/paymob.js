/**
 * Paymob Accept API helpers (classic 3-step flow).
 * Docs: https://docs.paymob.com/
 *
 * Amounts are in the smallest currency unit (piastres for EGP): LE 100.00 → 10000.
 */

const PAYMOB_BASE = 'https://accept.paymob.com/api'

function requireEnv(name) {
  const value = import.meta.env[name]
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`)
  }
  return value
}

/** Convert EGP pounds to cents/piastres for Paymob. */
export function toCents(amountEgp) {
  return Math.round(Number(amountEgp) * 100)
}

/**
 * Step 1 — Authenticate and obtain an auth token.
 * @returns {Promise<string>} auth_token
 */
export async function authenticatePaymob() {
  const apiKey = requireEnv('VITE_PAYMOB_API_KEY')

  const res = await fetch(`${PAYMOB_BASE}/auth/tokens`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Paymob auth failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  if (!data.token) throw new Error('Paymob auth response missing token')
  return data.token
}

/**
 * Step 2 — Register an order with Paymob.
 * @param {object} params
 * @param {string} params.authToken
 * @param {number} params.amountCents - total in cents
 * @param {Array<{name:string, amount_cents:number, quantity:number, description?:string}>} [params.items]
 * @param {string} [params.merchantOrderId]
 * @returns {Promise<{id:number}>}
 */
export async function registerOrder({ authToken, amountCents, items = [], merchantOrderId }) {
  const res = await fetch(`${PAYMOB_BASE}/ecommerce/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      merchant_order_id: merchantOrderId || undefined,
      items: items.map((item) => ({
        name: item.name,
        amount_cents: item.amount_cents,
        quantity: item.quantity,
        description: item.description || item.name,
      })),
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Paymob order registration failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  if (!data.id) throw new Error('Paymob order response missing id')
  return data
}

/**
 * Step 3 — Generate a payment key for the iframe / checkout.
 * @param {object} params
 * @param {string} params.authToken
 * @param {number} params.amountCents
 * @param {number|string} params.orderId - Paymob order id
 * @param {object} params.billingData
 * @returns {Promise<string>} payment_key token
 */
export async function generatePaymentKey({ authToken, amountCents, orderId, billingData }) {
  const integrationId = Number(requireEnv('VITE_PAYMOB_INTEGRATION_ID'))

  const res = await fetch(`${PAYMOB_BASE}/acceptance/payment_keys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: orderId,
      billing_data: {
        apartment: billingData.apartment || 'NA',
        email: billingData.email,
        floor: billingData.floor || 'NA',
        first_name: billingData.first_name,
        street: billingData.street || 'NA',
        building: billingData.building || 'NA',
        phone_number: billingData.phone_number,
        shipping_method: billingData.shipping_method || 'NA',
        postal_code: billingData.postal_code || 'NA',
        city: billingData.city || 'NA',
        country: billingData.country || 'EG',
        last_name: billingData.last_name,
        state: billingData.state || 'NA',
      },
      currency: 'EGP',
      integration_id: integrationId,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Paymob payment key failed (${res.status}): ${text}`)
  }

  const data = await res.json()
  if (!data.token) throw new Error('Paymob payment key response missing token')
  return data.token
}

/**
 * Build the hosted iframe URL for card payment.
 * @param {string} paymentToken
 * @returns {string}
 */
export function getIframeUrl(paymentToken) {
  const iframeId = requireEnv('VITE_PAYMOB_IFRAME_ID')
  return `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentToken}`
}

/**
 * Full checkout: auth → register order → payment key → iframe URL.
 * @param {object} opts
 * @param {number} opts.amountEgp - total in EGP pounds
 * @param {Array} opts.cartItems - cart line items
 * @param {object} opts.shipping - customer / shipping form values
 * @param {string} [opts.merchantOrderId]
 * @returns {Promise<{ iframeUrl: string, paymobOrderId: number, paymentToken: string }>}
 */
export async function initiatePaymobCheckout({ amountEgp, cartItems, shipping, merchantOrderId }) {
  const amountCents = toCents(amountEgp)

  const paymobItems = (cartItems || []).map((item) => ({
    name: item.title || item.name || 'Item',
    amount_cents: toCents(item.price),
    quantity: item.qty || item.quantity || 1,
    description: [item.goldColor, item.size && `Size ${item.size}`].filter(Boolean).join(' · ') || undefined,
  }))

  const nameParts = (shipping.fullName || '').trim().split(/\s+/)
  const firstName = nameParts[0] || shipping.firstName || 'Customer'
  const lastName = nameParts.slice(1).join(' ') || shipping.lastName || 'Customer'

  const billingData = {
    first_name: firstName,
    last_name: lastName,
    email: shipping.email,
    phone_number: shipping.phone,
    street: shipping.address,
    city: shipping.city,
    state: shipping.governorate || shipping.state || 'NA',
    postal_code: shipping.postalCode || shipping.postal_code || 'NA',
    country: 'EG',
  }

  const authToken = await authenticatePaymob()
  const order = await registerOrder({
    authToken,
    amountCents,
    items: paymobItems,
    merchantOrderId,
  })
  const paymentToken = await generatePaymentKey({
    authToken,
    amountCents,
    orderId: order.id,
    billingData,
  })

  return {
    iframeUrl: getIframeUrl(paymentToken),
    paymobOrderId: order.id,
    paymentToken,
  }
}
