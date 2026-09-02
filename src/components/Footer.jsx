import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FOOTER_COLUMNS = [
  {
    title: 'GLAMOUR',
    links: ['About Us', 'Our Stores', 'Careers', 'Contact Us'],
  },
  {
    title: "Don't Miss",
    links: ["Men's Collection", 'Just Arrived', 'Gold Collection', 'Diamond Collection'],
  },
  {
    title: 'Policies',
    links: ['Refund Policy', 'Shipping Policy', 'Terms of Service', 'Privacy Policy'],
  },
]

function FooterColumn({ column }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-white/10 sm:border-none py-4 sm:py-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between sm:hidden"
      >
        <span className="font-serif text-lg">{column.title}</span>
        <ChevronDown size={16} className={`transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <h3 className="hidden sm:block font-serif text-lg mb-4">{column.title}</h3>
      <ul className={`${open ? 'block' : 'hidden'} sm:block mt-3 sm:mt-0 space-y-2.5`}>
        {column.links.map((link) => (
          <li key={link}>
            <a href="#" className="text-sm text-white/60 hover:text-gold transition-colors">
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitted(true)
  }

  return (
    <footer className="bg-charcoal text-white pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="mb-10 max-w-md">
          <h3 className="font-serif text-2xl mb-2">Stay in the light</h3>
          <p className="text-sm text-white/60 mb-4">New arrivals and offers, once or twice a month — nothing more.</p>
          {submitted ? (
            <p className="text-sm text-gold">You're on the list. Thank you.</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 bg-transparent border border-white/20 rounded-full px-4 py-2.5 text-sm focus:border-gold outline-none"
              />
              <button
                type="submit"
                className="bg-gold text-charcoal text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white transition-colors duration-300"
              >
                Sign Up
              </button>
            </form>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-x-8 border-t border-white/10 sm:border-none pt-2">
          {FOOTER_COLUMNS.map((col) => (
            <FooterColumn key={col.title} column={col} />
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="border border-white/20 rounded-lg px-4 py-2 text-xs">App Store</span>
            <span className="border border-white/20 rounded-lg px-4 py-2 text-xs">Google Play</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {['Cash', 'Visa', 'ValU', 'InstaPay'].map((m) => (
              <span key={m} className="border border-white/20 rounded px-3 py-1.5 text-[11px] text-white/70">
                {m}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-8 text-center text-[11px] text-white/40">
          © {new Date().getFullYear()} Glamour Jewellery. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
