import React, { createContext, useContext, useMemo, useReducer } from 'react'

const CartContext = createContext(null)

const FREE_SHIPPING_THRESHOLD = 15000 // EGP

function lineKey(item) {
  return `${item.id}__${item.goldColor || ''}__${item.size || ''}`
}

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const key = lineKey(action.payload)
      const existing = state.items.find((i) => lineKey(i) === key)
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            lineKey(i) === key ? { ...i, qty: i.qty + action.payload.qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, action.payload] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => lineKey(i) !== action.key) }
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) => (lineKey(i) === action.key ? { ...i, qty: action.qty } : i))
          .filter((i) => i.qty > 0),
      }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, { items: [], isOpen: false })

  const value = useMemo(() => {
    const subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
    const count = state.items.reduce((sum, i) => sum + i.qty, 0)
    const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal)
    const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)

    const addItem = (item) => {
      // 1. تحديث الـ State في السلة
      dispatch({ type: 'ADD', payload: item })

      // 2. إرسال حدث Meta Pixel تلقائيًا
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

    return {
      items: state.items,
      isOpen: state.isOpen,
      subtotal,
      count,
      remainingForFreeShipping,
      freeShippingProgress,
      lineKey,
      addItem,
      removeItem: (key) => dispatch({ type: 'REMOVE', key }),
      updateQty: (key, qty) => dispatch({ type: 'UPDATE_QTY', key, qty }),
      openCart: () => dispatch({ type: 'OPEN' }),
      closeCart: () => dispatch({ type: 'CLOSE' }),
    }
  }, [state])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
