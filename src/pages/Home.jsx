import React, { useEffect, useState } from 'react'
import { HeroCarousel } from '../components/HeroCarousel'
import { FeatureCollections, QuickDesigns, RingBanners, SectionHeading } from '../components/CategoryGrid'
import { ShopTheLook } from '../components/ShopTheLook'
import { ProductCard } from '../components/ProductCard'
import { supabase } from '../supabaseClient'

function mapProduct(row) {
  return {
    id: row.id,
    title: row.title,
    price: Number(row.price),
    compareAtPrice: row.compare_at_price != null ? Number(row.compare_at_price) : null,
    category: row.category,
    tags: row.tags || [],
    inStock: row.in_stock ?? true,
    goldColors: row.gold_colors || [],
    sizes: row.sizes || [],
    images: row.images || [],
    material: row.material,
    weight: row.weight,
    description: row.description,
  }
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase.from('products').select('*')

      if (cancelled) return

      if (fetchError) {
        console.error(fetchError)
        setError(fetchError.message)
        setProducts([])
      } else {
        setProducts((data || []).map(mapProduct))
      }
      setLoading(false)
    }

    loadProducts()
    return () => {
      cancelled = true
    }
  }, [])

  const featured = products.slice(0, 8)

  return (
    <>
      <HeroCarousel />
      <FeatureCollections />
      <QuickDesigns />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <SectionHeading title="Just Arrived" subtitle="Pieces curated from our latest arrivals." />

        {loading && (
          <p className="text-sm text-charcoal/50 py-16 text-center">Loading pieces…</p>
        )}

        {!loading && error && (
          <p className="text-sm text-red-600/80 py-16 text-center">{error}</p>
        )}

        {!loading && !error && featured.length === 0 && (
          <p className="text-sm text-charcoal/50 py-16 text-center">No products available yet.</p>
        )}

        {!loading && !error && featured.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      <ShopTheLook />
      <RingBanners />
    </>
  )
}
