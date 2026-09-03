import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { XCircle } from 'lucide-react'

export default function OrderFailed() {
  const [params] = useSearchParams()
  const reason = params.get('message') || params.get('error')

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <XCircle className="mx-auto text-charcoal/40 mb-6" size={56} strokeWidth={1.25} />
      <h1 className="font-serif text-3xl sm:text-4xl mb-3">Payment unsuccessful</h1>
      <p className="text-sm text-charcoal/60 mb-2 leading-relaxed">
        We could not complete your payment. No charge was finalized — you can try again or choose another method.
      </p>
      {reason && (
        <p className="text-xs text-red-600/80 mb-8">{reason}</p>
      )}
      {!reason && <div className="mb-8" />}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/checkout"
          className="inline-block bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-charcoal transition-colors"
        >
          Try checkout again
        </Link>
        <Link
          to="/"
          className="inline-block text-sm text-charcoal/60 hover:text-gold underline"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  )
}
