import React from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { useWishlist } from '../context/WishlistContext'

const SWATCH_HEX = { Yellow: '#D4AF37', White: '#E9E9E9', Rose: '#E8B4A0' }

export function ProductCard({ product }) {
  const { isWishlisted, toggle } = useWishlist()
  const wishlisted = isWishlisted(product.id)

  return (
    <div className="group relative">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-cardGrey">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {!product.inStock && (
            <span className="absolute top-3 left-3 bg-charcoal text-white text-[10px] font-semibold tracking-wide px-2.5 py-1 rounded-full">
              SOLD OUT
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              toggle(product.id)
            }}
            aria-label="Toggle wishlist"
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center"
          >
            <Heart size={15} className={wishlisted ? 'fill-gold text-gold' : 'text-charcoal/60'} />
          </button>
        </div>

        <div className="mt-3">
          <p className="text-sm font-medium truncate">{product.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-sm">LE {product.price.toLocaleString()}</p>
            {product.compareAtPrice && (
              <p className="text-xs text-charcoal/40 line-through">LE {product.compareAtPrice.toLocaleString()}</p>
            )}
          </div>
          {product.goldColors.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2">
              {product.goldColors.map((c) => (
                <span
                  key={c}
                  title={c}
                  className="w-3.5 h-3.5 rounded-full border border-black/10"
                  style={{ backgroundColor: SWATCH_HEX[c] }}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}
