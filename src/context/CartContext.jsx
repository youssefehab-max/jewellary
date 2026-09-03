import React, { createContext, useContext, useMemo } from 'react'
import { lineKey, useCartStore, useCartTotals } from '../store/useCartStore'

const CartContext = createContext(null)

/**
 * Thin compatibility provider so existing `useCart()` consumers keep working
 * while cart state lives in the Zustand store.
 */
export function CartProvider({ children }) {
  const items = useCartStore((s) => s.items)
  const isOpen = useCartStore((s) => s.isOpen)
  const addItem = useCartStore((s) => s.addItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const updateQty = useCartStore((s) => s.updateQty)
  const clearCart = useCartStore((s) => s.clearCart)
  const openCart = useCartStore((s) => s.openCart)
  const closeCart = useCartStore((s) => s.closeCart)
  const { subtotal, count, remainingForFreeShipping, freeShippingProgress } = useCartTotals()

  const value = useMemo(
    () => ({
      items,
      isOpen,
      subtotal,
      count,
      remainingForFreeShipping,
      freeShippingProgress,
      lineKey,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart,
      closeCart,
    }),
    [
      items,
      isOpen,
      subtotal,
      count,
      remainingForFreeShipping,
      freeShippingProgress,
      addItem,
      removeItem,
      updateQty,
      clearCart,
      openCart,
      closeCart,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
