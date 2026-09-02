import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronDown, MapPin, Heart } from 'lucide-react'
import { getProductById, PRODUCTS } from '../data/products'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { ProductCard } from '../components/ProductCard'

const SWATCH_HEX = { Yellow: '#D4AF37', White: '#E9E9E9', Rose: '#E8B4A0' }

function AccordionTab({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-black/5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="pb-4 text-sm text-charcoal/70 leading-relaxed">{children}</div>}
    </div>
  )
}

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProductById(id)
  const { addItem, openCart } = useCart()
  const { isWishlisted, toggle } = useWishlist()

  const [activeImage, setActiveImage] = useState(0)
  const [goldColor, setGoldColor] = useState(product?.goldColors[0])
  const [size, setSize] = useState(product?.sizes[0] || null)

  // 1. تتبع حدث ViewContent عند فتح صفحة المنتج
  useEffect(() => {
    if (product && typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'ViewContent', {
        content_name: product.title,
        content_ids: [product.id],
        content_type: 'product',
        value: product.price,
        currency: 'EGP',
      })
    }
  }, [product?.id])

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <p className="font-serif text-2xl mb-2">Piece not found</p>
        <Link to="/" className="text-sm text-gold underline">Back to homepage</Link>
      </div>
    )
  }

  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const handleAddToBag = () => {
    // دالة addItem ستتكفل بإرسال حدث AddToCart تلقائياً بفضل التعديل السابق في CartContext
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image: product.images[0],
      goldColor,
      size,
      qty: 1,
    })
    openCart()
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <div className="grid lg:grid-cols-2 gap-10">
        {/* Gallery */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden bg-cardGrey">
            <img src={product.images[activeImage]} alt={product.title} className="w-full h-full object-cover" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-3 mt-3">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImage ? 'border-gold' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl mb-2">{product.title}</h1>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-lg">LE {product.price.toLocaleString()}</p>
            {product.compareAtPrice && (
              <p className="text-sm text-charcoal/40 line-through">LE {product.compareAtPrice.toLocaleString()}</p>
            )}
          </div>
          <p className="text-xs text-charcoal/50 mb-6">Shipping calculated at checkout.</p>

          {!product.inStock && (
            <span className="inline-block bg-charcoal text-white text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full mb-4">
              SOLD OUT
            </span>
          )}

          {product.goldColors.length > 0 && (
            <div className="mb-5">
              <p className="text-xs font-semibold mb-2">Gold Color: {goldColor}</p>
              <div className="flex gap-2">
                {product.goldColors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setGoldColor(c)}
                    aria-label={c}
                    className={`w-8 h-8 rounded-full border-2 ${goldColor === c ? 'border-charcoal' : 'border-transparent'}`}
                  >
                    <span className="block w-full h-full rounded-full border border-black/10" style={{ backgroundColor: SWATCH_HEX[c] }} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-xs font-semibold mb-2">Ring Size: {size}</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`w-10 h-10 rounded-full border text-sm ${
                      size === s ? 'bg-charcoal text-white border-charcoal' : 'border-black/15 hover:border-charcoal'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToBag}
              disabled={!product.inStock}
              className="flex-1 bg-charcoal text-white py-3.5 rounded-full text-sm font-semibold tracking-wide hover:bg-gold hover:text-charcoal transition-colors duration-300 disabled:opacity-40 disabled:pointer-events-none"
            >
              {product.inStock ? 'Add to Bag' : 'Sold Out'}
            </button>
            <button
              onClick={() => toggle(product.id)}
              aria-label="Toggle wishlist"
              className="w-14 h-14 rounded-full border border-black/10 flex items-center justify-center shrink-0"
            >
              <Heart size={18} className={isWishlisted(product.id) ? 'fill-gold text-gold' : 'text-charcoal/60'} />
            </button>
          </div>

          <div className="flex items-start gap-2 text-xs text-charcoal/60 mb-6 bg-cardGrey rounded-xl p-3">
            <MapPin size={14} className="mt-0.5 shrink-0" />
            <p>Pickup available at Glamour Jewellery — Usually ready in 24 hours</p>
          </div>

          <div>
            <AccordionTab title="Details" defaultOpen>
              <p className="mb-1">Material: {product.material}</p>
              <p className="mb-1">Weight: {product.weight}</p>
              <p>{product.description}</p>
            </AccordionTab>
            <AccordionTab title="Refund Policy">
              Items may be returned within 14 days in original, unworn condition with proof of purchase.
            </AccordionTab>
            <AccordionTab title="FAQ">
              Custom sizing and engraving are available on select pieces — contact us before ordering.
            </AccordionTab>
            {product.sizes.length > 0 && (
              <AccordionTab title="Size Chart">
                Ring sizes shown are EU/ring circumference standard (48–60). Not sure of your size? Visit any Glamour store for a free fitting.
              </AccordionTab>
            )}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-2xl mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-8">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}