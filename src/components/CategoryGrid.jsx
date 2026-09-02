import React from 'react'
import { Link } from 'react-router-dom'

const QUICK_DESIGNS = [
  { label: 'Pearls', image: 'https://images.unsplash.com/photo-1620656798579-1984d9e87df7?w=400&q=80', slug: 'necklaces' },
  { label: 'Gourmets', image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&q=80', slug: 'necklaces' },
  { label: 'CZ', image: 'https://images.unsplash.com/photo-1599459183200-59c7687a0275?w=400&q=80', slug: 'bracelets' },
  { label: 'Beads', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80', slug: 'bracelets' },
]

const RING_BANNERS = [
  { label: 'Diamond Bands', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
  { label: 'Heart Rings', image: 'https://images.unsplash.com/photo-1612459284970-e8bf4e5a6f7a?w=600&q=80' },
  { label: 'Eternity Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
  { label: 'Signet Rings', image: 'https://images.unsplash.com/photo-1612459284970-e8bf4e5a6f7a?w=600&q=80' },
]

const FEATURE_COLLECTIONS = [
  { label: "Men's Collection", slug: 'mens-collection', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80' },
  { label: 'Diamond Collection', slug: 'diamonds', image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&q=80' },
  { label: 'Gold Collection', slug: 'gold', image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=600&q=80' },
  { label: 'Just Arrived', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
]

export function SectionHeading({ title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-3xl">{title}</h2>
      {subtitle && <p className="text-sm text-charcoal/60 mt-1">{subtitle}</p>}
    </div>
  )
}

export function FeatureCollections() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
      <SectionHeading title="Shop by Collection" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {FEATURE_COLLECTIONS.map((c) => (
          <Link key={c.slug} to={`/collections/${c.slug}`} className="group block">
            <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-cardGrey">
              <img
                src={c.image}
                alt={c.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <p className="mt-3 text-sm font-medium text-center">{c.label}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function QuickDesigns() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SectionHeading title="Pick Your Design" />
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {QUICK_DESIGNS.map((d) => (
          <Link
            key={d.label}
            to={`/collections/${d.slug}?category=${encodeURIComponent(d.label)}`}
            className="shrink-0 w-32 text-center group"
          >
            <div className="w-32 h-32 rounded-full overflow-hidden bg-cardGrey border border-gold/20">
              <img src={d.image} alt={d.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <p className="mt-2 text-sm">{d.label}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

export function RingBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <SectionHeading title="Rings Collection" subtitle="A style for every hand." />
      <div className="grid grid-cols-2 gap-4">
        {RING_BANNERS.map((r) => (
          <Link
            key={r.label}
            to={`/collections/rings?category=${encodeURIComponent(r.label)}`}
            className="relative rounded-2xl overflow-hidden aspect-square group"
          >
            <img src={r.image} alt={r.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <span className="absolute bottom-3 left-3 text-white text-sm font-medium">{r.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
