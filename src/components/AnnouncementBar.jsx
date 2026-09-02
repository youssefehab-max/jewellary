import React from 'react'
import { X, Star, Smartphone } from 'lucide-react'
import { useUIStore } from '../store/useUIStore'

export function AnnouncementBar() {
  const isVisible = useUIStore((s) => s.isAnnouncementVisible)
  if (!isVisible) return null
  return (
    <div className="bg-charcoal text-white text-xs sm:text-sm tracking-wide py-2 px-4 text-center font-medium">
      Payment Upon DELIVERY — shop now, pay when it arrives.
    </div>
  )
}

export function AppPromoBar() {
  const isVisible = useUIStore((s) => s.isAppBarVisible)
  const dismiss = useUIStore((s) => s.dismissAppBar)
  if (!isVisible) return null

  return (
    <div className="flex items-center justify-between gap-3 bg-cardGrey border-b border-black/5 px-4 py-2.5">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={dismiss}
          aria-label="Dismiss app promotion"
          className="text-charcoal/50 hover:text-charcoal transition-colors shrink-0"
        >
          <X size={16} />
        </button>
        <div className="w-9 h-9 rounded-xl bg-charcoal text-gold flex items-center justify-center shrink-0">
          <Smartphone size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">Glamour Jewellery App</p>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={11} className="fill-gold text-gold" />
            ))}
            <span className="text-[11px] text-charcoal/50 ml-1">4.8 · 12k ratings</span>
          </div>
        </div>
      </div>
      <button className="shrink-0 text-xs font-semibold bg-charcoal text-white px-4 py-2 rounded-full hover:bg-gold hover:text-charcoal transition-colors duration-300">
        Get Now
      </button>
    </div>
  )
}
