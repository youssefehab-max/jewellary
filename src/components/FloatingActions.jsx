import React from 'react'
import { Phone, MessageCircle } from 'lucide-react'

export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-30 flex flex-col gap-3">
      <a
        href="tel:+201000000000"
        aria-label="Call us"
        className="w-12 h-12 rounded-full bg-charcoal text-white flex items-center justify-center shadow-lg hover:bg-gold hover:text-charcoal transition-colors duration-300"
      >
        <Phone size={20} />
      </a>
      <a
        href="https://wa.me/201000000000"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:brightness-95 transition-all duration-300"
      >
        <MessageCircle size={20} />
      </a>
    </div>
  )
}
