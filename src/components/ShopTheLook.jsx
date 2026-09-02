import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { SHOP_THE_LOOK, getProductById } from '../data/products'
import { SectionHeading } from './CategoryGrid'
import { useCart } from '../context/CartContext'

function Hotspot({ hotspot, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label="View product"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
    >
      <span
        className={`relative flex items-center justify-center w-8 h-8 rounded-full bg-white/90 shadow-lg transition-transform duration-300 ${
          active ? 'scale-90' : 'scale-100 animate-pulse'
        }`}
      >
        <Plus size={16} className={`text-charcoal transition-transform duration-300 ${active ? 'rotate-45' : ''}`} />
      </span>
    </button>
  )
}

function ProductPopup({ product, onClose }) {
  const { addItem, openCart } = useCart()

  const handleAdd = () => {
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      goldColor: product.goldColors[0],
      size: product.sizes[0] || null,
      qty: 1,
    })
    openCart()
    onClose()
  }

  return (
    <motion.div
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 40, opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-72 bg-white rounded-2xl shadow-2xl p-3 flex gap-3"
    >
      <img src={product.images[0]} alt={product.title} className="w-16 h-16 rounded-lg object-cover shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{product.title}</p>
        <p className="text-sm text-charcoal/60 mt-0.5">LE {product.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
          <Link
            to={`/products/${product.id}`}
            className="text-xs font-semibold border border-charcoal rounded-full px-3 py-1.5 hover:bg-charcoal hover:text-white transition-colors"
          >
            View
          </Link>
          <button
            onClick={handleAdd}
            className="text-xs font-semibold bg-gold text-charcoal rounded-full px-3 py-1.5 hover:bg-charcoal hover:text-white transition-colors"
          >
            Add to Bag
          </button>
        </div>
      </div>
      <button onClick={onClose} aria-label="Close" className="text-charcoal/40 hover:text-charcoal shrink-0 h-fit">
        <X size={16} />
      </button>
    </motion.div>
  )
}

function LookImage({ look }) {
  const [activeHotspot, setActiveHotspot] = useState(null)
  const activeProduct = activeHotspot ? getProductById(activeHotspot.productId) : null

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[16/9] rounded-2xl overflow-hidden bg-cardGrey">
      <img src={look.image} alt="Shop the look" className="w-full h-full object-cover" />
      {look.hotspots.map((h) => (
        <Hotspot
          key={h.id}
          hotspot={h}
          active={activeHotspot?.id === h.id}
          onClick={() => setActiveHotspot(activeHotspot?.id === h.id ? null : h)}
        />
      ))}
      <AnimatePresence>
        {activeProduct && <ProductPopup product={activeProduct} onClose={() => setActiveHotspot(null)} />}
      </AnimatePresence>
    </div>
  )
}

export function ShopTheLook() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeading title="Shop The Look" subtitle="Tap the markers to shop each piece." />
      <div className="grid sm:grid-cols-2 gap-6">
        {SHOP_THE_LOOK.map((look) => (
          <LookImage key={look.id} look={look} />
        ))}
      </div>
    </section>
  )
}
