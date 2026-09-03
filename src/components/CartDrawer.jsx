import React from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    subtotal,
    remainingForFreeShipping,
    freeShippingProgress,
    updateQty,
    removeItem,
    lineKey,
  } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    if (items.length === 0) return

    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'InitiateCheckout', {
        content_ids: items.map((item) => item.id),
        content_type: 'product',
        value: subtotal,
        currency: 'EGP',
      })
    }

    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-50 flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-black/5">
              <h2 className="font-serif text-2xl">Your Bag ({items.length})</h2>
              <button onClick={closeCart} aria-label="Close cart" className="text-charcoal/60 hover:text-charcoal">
                <X size={22} />
              </button>
            </div>

            {/* Free shipping progress */}
            <div className="px-5 py-4 border-b border-black/5">
              {remainingForFreeShipping > 0 ? (
                <p className="text-xs text-charcoal/70 mb-2">
                  Add <span className="font-semibold text-charcoal">LE {remainingForFreeShipping.toLocaleString()}</span> more for free shipping
                </p>
              ) : (
                <p className="text-xs text-gold font-semibold mb-2">You've unlocked free shipping!</p>
              )}
              <div className="h-1.5 bg-cardGrey rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${freeShippingProgress}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-charcoal/50 gap-2">
                  <p className="font-serif text-xl text-charcoal">Your bag is empty</p>
                  <p className="text-sm">Add a piece you love to get started.</p>
                </div>
              ) : (
                <ul className="divide-y divide-black/5">
                  {items.map((item) => {
                    const key = lineKey(item)
                    return (
                      <li key={key} className="py-4 flex gap-3">
                        <img src={item.image} alt={item.title} className="w-20 h-20 object-cover rounded-lg bg-cardGrey" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-charcoal/50 mt-0.5">
                            {[item.goldColor, item.size && `Size ${item.size}`].filter(Boolean).join(' · ')}
                          </p>
                          <p className="text-sm mt-1">LE {item.price.toLocaleString()}</p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border border-black/10 rounded-full">
                              <button
                                onClick={() => updateQty(key, item.qty - 1)}
                                className="p-1.5 hover:text-gold"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={13} />
                              </button>
                              <span className="text-xs w-6 text-center">{item.qty}</span>
                              <button
                                onClick={() => updateQty(key, item.qty + 1)}
                                className="p-1.5 hover:text-gold"
                                aria-label="Increase quantity"
                              >
                                <Plus size={13} />
                              </button>
                            </div>
                            <button
                              onClick={() => removeItem(key)}
                              aria-label="Remove item"
                              className="text-charcoal/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-5 border-t border-black/5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-charcoal/60">Subtotal</span>
                  <span className="font-semibold">LE {subtotal.toLocaleString()}</span>
                </div>
                <p className="text-[11px] text-charcoal/50">Shipping and taxes calculated at checkout.</p>
                <button
                  onClick={handleCheckout}
                  className="w-full bg-charcoal text-white py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-gold hover:text-charcoal transition-colors duration-300"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}