import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=1600&q=80',
    eyebrow: 'New Season',
    title: 'Light, worn daily',
    subtitle: 'Fine 18K gold pieces made for everyday wear.',
    cta: '/collections/gold',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1600&q=80',
    eyebrow: 'Diamond Edit',
    title: 'Clarity you can see',
    subtitle: 'Hand-set diamonds in classic and modern settings.',
    cta: '/collections/diamonds',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=1600&q=80',
    eyebrow: "Men's Edit",
    title: 'Weight that means something',
    subtitle: 'Chains and bands built for daily wear.',
    cta: '/collections/mens-collection',
  },
]

export function HeroCarousel() {
  const [index, setIndex] = useState(0)

  const next = useCallback(() => setIndex((i) => (i + 1) % SLIDES.length), [])
  const prev = useCallback(() => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length), [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  const slide = SLIDES[index]

  return (
    <section className="relative h-[70vh] min-h-[420px] max-h-[720px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <img src={slide.image} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <p className="text-xs tracking-[0.2em] mb-3 text-gold">{slide.eyebrow}</p>
            <h1 className="font-serif text-4xl sm:text-6xl mb-4 max-w-2xl">{slide.title}</h1>
            <p className="text-sm sm:text-base text-white/85 mb-7 max-w-md mx-auto">{slide.subtitle}</p>
            <Link
              to={slide.cta}
              className="inline-block bg-white text-charcoal px-8 py-3 rounded-full text-sm font-semibold tracking-wide hover:bg-gold transition-colors duration-300"
            >
              Shop Now
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        aria-label="Previous slide"
        className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        aria-label="Next slide"
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 text-white items-center justify-center hover:bg-white/30 transition-colors"
      >
        <ChevronRight size={20} />
      </button>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {SLIDES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'w-6 bg-gold' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
