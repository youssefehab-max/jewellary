import React, { createContext, useContext, useState, useCallback } from 'react'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [ids, setIds] = useState([])

  const toggle = useCallback((id) => {
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }, [])

  const isWishlisted = useCallback((id) => ids.includes(id), [ids])

  return (
    <WishlistContext.Provider value={{ ids, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
