import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCartStore, useCartTotals, lineKey } from '../store/useCartStore'
import { initiatePaymobCheckout } from '../services/paymob'
import { supabase } from '../supabaseClient'

const INITIAL = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  governorate: '',
  postalCode: '',
  notes: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const items = useCartStore((s) => s.items)
  const clearCart = useCartStore((s) => s.clearCart)
  const closeCart = useCartStore((s) => s.closeCart)
  const { subtotal } = useCartTotals()

  const [form, setForm] = useState(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  React.useEffect(() => {
    closeCart()
  }, [closeCart])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) return

    setSubmitting(true)
    setError('')

    try {
      const orderPayload = {
        customer_name: form.fullName.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
        shipping_address: form.address.trim(),
        city: form.city.trim(),
        governorate: form.governorate.trim() || null,
        postal_code: form.postalCode.trim() || null,
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          price: item.price,
          qty: item.qty,
          goldColor: item.goldColor || null,
          size: item.size || null,
          image: item.image || null,
        })),
        subtotal,
        total: subtotal,
        currency: 'EGP',
        status: 'pending',
        notes: form.notes.trim() || null,
      }

      let merchantOrderId
      const { data: savedOrder, error: dbError } = await supabase
        .from('orders')
        .insert(orderPayload)
        .select('id')
        .single()

      if (dbError) {
        // Allow checkout to continue if Supabase isn't configured yet.
        console.warn('Could not save order to Supabase:', dbError.message)
      } else {
        merchantOrderId = savedOrder?.id
      }

      const { iframeUrl, paymobOrderId } = await initiatePaymobCheckout({
        amountEgp: subtotal,
        cartItems: items,
        shipping: form,
        merchantOrderId,
      })

      if (merchantOrderId && paymobOrderId) {
        await supabase
          .from('orders')
          .update({ paymob_order_id: String(paymobOrderId) })
          .eq('id', merchantOrderId)
      }

      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_ids: items.map((item) => item.id),
          content_type: 'product',
          value: subtotal,
          currency: 'EGP',
        })
      }

      clearCart()
      window.location.href = iframeUrl
    } catch (err) {
      console.error(err)
      setError(err.message || 'Payment could not be started. Please try again.')
      setSubmitting(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <h1 className="font-serif text-3xl mb-3">Your bag is empty</h1>
        <p className="text-sm text-charcoal/60 mb-8">Add a piece you love, then return to checkout.</p>
        <Link
          to="/"
          className="inline-block bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-charcoal transition-colors"
        >
          Continue shopping
        </Link>
      </div>
    )
  }

  const fieldClass =
    'w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white focus:border-gold outline-none transition-colors'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl mb-2">Checkout</h1>
      <p className="text-sm text-charcoal/60 mb-10">Shipping details and secure payment via Paymob.</p>

      <div className="grid lg:grid-cols-5 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-5">
          <fieldset className="space-y-4">
            <legend className="font-serif text-xl mb-2">Contact</legend>
            <input
              required
              name="fullName"
              value={form.fullName}
              onChange={onChange}
              placeholder="Full name"
              className={fieldClass}
              autoComplete="name"
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email"
                className={fieldClass}
                autoComplete="email"
              />
              <input
                required
                type="tel"
                name="phone"
                value={form.phone}
                onChange={onChange}
                placeholder="Phone (e.g. 01xxxxxxxxx)"
                className={fieldClass}
                autoComplete="tel"
              />
            </div>
          </fieldset>

          <fieldset className="space-y-4">
            <legend className="font-serif text-xl mb-2">Shipping</legend>
            <input
              required
              name="address"
              value={form.address}
              onChange={onChange}
              placeholder="Street address"
              className={fieldClass}
              autoComplete="street-address"
            />
            <div className="grid sm:grid-cols-3 gap-4">
              <input
                required
                name="city"
                value={form.city}
                onChange={onChange}
                placeholder="City"
                className={fieldClass}
                autoComplete="address-level2"
              />
              <input
                name="governorate"
                value={form.governorate}
                onChange={onChange}
                placeholder="Governorate"
                className={fieldClass}
                autoComplete="address-level1"
              />
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={onChange}
                placeholder="Postal code"
                className={fieldClass}
                autoComplete="postal-code"
              />
            </div>
            <textarea
              name="notes"
              value={form.notes}
              onChange={onChange}
              placeholder="Order notes (optional)"
              rows={3}
              className={fieldClass}
            />
          </fieldset>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto bg-charcoal text-white px-10 py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-60"
          >
            {submitting ? 'Redirecting to Paymob…' : `Pay LE ${subtotal.toLocaleString()}`}
          </button>
        </form>

        <aside className="lg:col-span-2">
          <div className="bg-cardGrey rounded-2xl p-6 sticky top-24">
            <h2 className="font-serif text-xl mb-4">Order summary</h2>
            <ul className="divide-y divide-black/5 mb-4">
              {items.map((item) => (
                <li key={lineKey(item)} className="py-3 flex gap-3">
                  {item.image && (
                    <img
                      src={item.image}
                      alt=""
                      className="w-14 h-14 object-cover rounded-lg bg-white"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <p className="text-xs text-charcoal/50">
                      Qty {item.qty}
                      {[item.goldColor, item.size && `Size ${item.size}`]
                        .filter(Boolean)
                        .map((v) => ` · ${v}`)
                        .join('')}
                    </p>
                  </div>
                  <p className="text-sm whitespace-nowrap">
                    LE {(item.price * item.qty).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex justify-between text-sm border-t border-black/10 pt-4">
              <span className="text-charcoal/60">Total</span>
              <span className="font-semibold">LE {subtotal.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="mt-4 text-xs text-charcoal/50 hover:text-gold underline"
            >
              Return to bag
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
