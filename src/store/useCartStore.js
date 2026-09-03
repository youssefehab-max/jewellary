import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const FREE_SHIPPING_THRESHOLD = 15000 // EGP

export function lineKey(item) {
  return `${item.id}__${item.goldColor || ''}__${item.size || ''}`
}

function trackAddToCart(item) {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'AddToCart', {
      content_name: item.title || item.name || '',
      content_ids: [item.id],
      content_type: 'product',
      value: (item.price || 0) * (item.qty || 1),
      currency: 'EGP',
    })
  }
}

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        trackAddToCart(item)
        const key = lineKey(item)
        const existing = get().items.find((i) => lineKey(i) === key)
        if (existing) {
          set({
            items: get().items.map((i) =>
              lineKey(i) === key ? { ...i, qty: i.qty + item.qty } : i
            ),
          })
        } else {
          set({ items: [...get().items, item] })
        }
      },

      removeItem: (key) =>
        set({ items: get().items.filter((i) => lineKey(i) !== key) }),

      updateQty: (key, qty) =>
        set({
          items: get()
            .items.map((i) => (lineKey(i) === key ? { ...i, qty } : i))
            .filter((i) => i.qty > 0),
        }),

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getSubtotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'glamour-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)

/** Derived cart totals for components that prefer a single hook call. */
export function useCartTotals() {
  const items = useCartStore((s) => s.items)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)
  return { subtotal, count, remainingForFreeShipping, freeShippingProgress, FREE_SHIPPING_THRESHOLD }
}
