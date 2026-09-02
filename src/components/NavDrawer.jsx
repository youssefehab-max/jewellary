import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ChevronDown, Instagram, Facebook } from 'lucide-react'
import { useUIStore } from '../store/useUIStore'

const NAV_TREE = [
  {
    label: "Men's Collection",
    slug: 'mens-collection',
    children: ['Chains', 'Bracelets', 'Rings'],
  },
  {
    label: 'Rings',
    slug: 'rings',
    children: ['Diamond Bands', 'Heart Rings', 'Eternity Rings', 'Signet Rings'],
  },
  {
    label: 'Necklaces',
    slug: 'necklaces',
    children: ['Pearls', 'Gourmets', 'Pendants'],
  },
  {
    label: 'Bracelets',
    slug: 'bracelets',
    children: ['Tennis', 'Beads', 'Chain'],
  },
  { label: 'Diamonds', slug: 'diamonds', children: [] },
  { label: 'Gold', slug: 'gold', children: [] },
]

function AccordionItem({ item, onNavigate }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children.length > 0

  return (
    <div className="border-b border-white/10">
      <div className="flex items-center justify-between">
        <Link
          to={`/collections/${item.slug}`}
          onClick={onNavigate}
          className="flex-1 py-4 text-left text-base tracking-wide hover:text-gold transition-colors"
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label={`Toggle ${item.label} submenu`}
            className="p-4 text-white/60"
          >
            <ChevronDown
              size={16}
              className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>
      <AnimatePresence initial={false}>
        {hasChildren && open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden pl-4 pb-2"
          >
            {item.children.map((child) => (
              <li key={child}>
                <Link
                  to={`/collections/${item.slug}?category=${encodeURIComponent(child)}`}
                  onClick={onNavigate}
                  className="block py-2 text-sm text-white/70 hover:text-gold transition-colors"
                >
                  {child}
                </Link>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

export function NavDrawer() {
  const isOpen = useUIStore((s) => s.isNavOpen)
  const close = useUIStore((s) => s.closeNav)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-charcoal text-white z-50 flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <span className="font-serif text-xl">GLAMOUR</span>
              <button onClick={close} aria-label="Close menu" className="text-white/70 hover:text-white">
                <X size={22} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-5 py-2">
              {NAV_TREE.map((item) => (
                <AccordionItem key={item.slug} item={item} onNavigate={close} />
              ))}
            </nav>

            <div className="p-5 border-t border-white/10 flex items-center gap-4">
              <a href="#" aria-label="Instagram" className="text-white/60 hover:text-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="Facebook" className="text-white/60 hover:text-gold transition-colors">
                <Facebook size={20} />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
