import React, { useMemo, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { ChevronDown, SlidersHorizontal, X } from 'lucide-react'
import { PRODUCTS, GOLD_COLORS, CATEGORIES } from '../data/products'
import { ProductCard } from '../components/ProductCard'

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'best-selling', label: 'Best Selling' },
  { value: 'alphabetical', label: 'Alphabetically' },
]

function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-black/5 py-4">
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between">
        <span className="text-sm font-semibold">{title}</span>
        <ChevronDown size={15} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

export default function Collection() {
  const { slug } = useParams()
  const [searchParams] = useSearchParams()
  const categoryLabel = CATEGORIES.find((c) => c.slug === slug)?.label || 'All Jewelry'

  const [sort, setSort] = useState('featured')
  const [availability, setAvailability] = useState({ inStock: false, soldOut: false })
  const [priceRange, setPriceRange] = useState([0, 30000])
  const [goldColor, setGoldColor] = useState([])
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const toggleGoldColor = (c) =>
    setGoldColor((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

  const filtered = useMemo(() => {
    let list = PRODUCTS.filter((p) => p.category === slug)
    if (list.length === 0 && !slug) list = PRODUCTS

    if (availability.inStock && !availability.soldOut) list = list.filter((p) => p.inStock)
    if (availability.soldOut && !availability.inStock) list = list.filter((p) => !p.inStock)

    list = list.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])

    if (goldColor.length > 0) list = list.filter((p) => p.goldColors.some((c) => goldColor.includes(c)))

    switch (sort) {
      case 'price-asc':
        list = [...list].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list = [...list].sort((a, b) => b.price - a.price)
        break
      case 'alphabetical':
        list = [...list].sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }
    return list
  }, [slug, sort, availability, priceRange, goldColor])

  const filtersPanel = (
    <div>
      <FilterSection title="Availability">
        <label className="flex items-center gap-2 text-sm mb-2">
          <input
            type="checkbox"
            checked={availability.inStock}
            onChange={(e) => setAvailability((a) => ({ ...a, inStock: e.target.checked }))}
          />
          In Stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={availability.soldOut}
            onChange={(e) => setAvailability((a) => ({ ...a, soldOut: e.target.checked }))}
          />
          Sold Out
        </label>
      </FilterSection>

      <FilterSection title="Price Range">
        <div className="flex items-center gap-2 text-sm">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-full border border-black/10 rounded-lg px-2 py-1.5"
          />
          <span className="text-charcoal/40">—</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-full border border-black/10 rounded-lg px-2 py-1.5"
          />
        </div>
      </FilterSection>

      <FilterSection title="Gold Color">
        {GOLD_COLORS.map((c) => (
          <label key={c} className="flex items-center gap-2 text-sm mb-2">
            <input type="checkbox" checked={goldColor.includes(c)} onChange={() => toggleGoldColor(c)} />
            {c}
          </label>
        ))}
      </FilterSection>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-serif text-3xl sm:text-4xl mb-1">{categoryLabel}</h1>
      <p className="text-sm text-charcoal/50 mb-8">{filtered.length} pieces</p>

      <div className="flex items-center justify-between mb-6 gap-3">
        <button
          onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden flex items-center gap-2 text-sm border border-black/10 rounded-full px-4 py-2"
        >
          <SlidersHorizontal size={14} /> Filter
        </button>
        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-black/10 rounded-full px-4 py-2 outline-none bg-white"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                Sort: {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-[220px_1fr] gap-8">
        <aside className="hidden lg:block">{filtersPanel}</aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 bg-white lg:hidden overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-serif text-xl">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                <X size={20} />
              </button>
            </div>
            {filtersPanel}
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-semibold mt-4"
            >
              Show {filtered.length} results
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-sm text-charcoal/50 py-16 text-center">
              No pieces match these filters yet.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
