import React from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, ShoppingBag, X } from 'lucide-react'
import { useUIStore } from '../store/useUIStore'
import { useCart } from '../context/CartContext'
import { PRODUCTS } from '../data/products'

export function Header() {
  const openNav = useUIStore((s) => s.openNav)
  const isSearchOpen = useUIStore((s) => s.isSearchOpen)
  const toggleSearch = useUIStore((s) => s.toggleSearch)
  const { count, openCart } = useCart()
  const [query, setQuery] = React.useState('')

  const results = query.trim()
    ? PRODUCTS.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())).slice(0, 5)
    : []

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <button
          onClick={openNav}
          aria-label="Open menu"
          className="p-2 -ml-2 text-charcoal hover:text-gold transition-colors"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="font-serif text-2xl sm:text-3xl tracking-wide select-none">
          GLAMOUR
        </Link>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={toggleSearch}
            aria-label="Toggle search"
            className="p-2 text-charcoal hover:text-gold transition-colors"
          >
            {isSearchOpen ? <X size={20} /> : <Search size={20} />}
          </button>
          <button
            onClick={openCart}
            aria-label="Open cart"
            className="relative p-2 text-charcoal hover:text-gold transition-colors"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gold text-charcoal text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      {isSearchOpen && (
        <div className="border-t border-black/5 px-4 sm:px-6 py-3 bg-white">
          <div className="max-w-2xl mx-auto">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rings, necklaces, gold..."
              className="w-full border-b border-charcoal/20 py-2 text-sm focus:border-gold outline-none bg-transparent"
            />
            {results.length > 0 && (
              <ul className="mt-2 divide-y divide-black/5">
                {results.map((p) => (
                  <li key={p.id}>
                    <Link
                      to={`/products/${p.id}`}
                      onClick={toggleSearch}
                      className="flex items-center gap-3 py-2 hover:bg-cardGrey px-2 -mx-2 rounded"
                    >
                      <img src={p.images[0]} alt="" className="w-10 h-10 object-cover rounded" />
                      <span className="text-sm">{p.title}</span>
                      <span className="ml-auto text-sm text-charcoal/60">LE {p.price.toLocaleString()}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
