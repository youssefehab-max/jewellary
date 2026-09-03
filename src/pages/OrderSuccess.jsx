import React from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export default function OrderSuccess() {
  const [params] = useSearchParams()
  const orderId = params.get('id') || params.get('order') || params.get('merchant_order_id')

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <CheckCircle className="mx-auto text-gold mb-6" size={56} strokeWidth={1.25} />
      <h1 className="font-serif text-3xl sm:text-4xl mb-3">Order confirmed</h1>
      <p className="text-sm text-charcoal/60 mb-2 leading-relaxed">
        Thank you for shopping with Glamour. Your payment was received and we will prepare your pieces shortly.
      </p>
      {orderId && (
        <p className="text-xs text-charcoal/40 mb-8">Reference: {orderId}</p>
      )}
      {!orderId && <div className="mb-8" />}
      <Link
        to="/"
        className="inline-block bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-charcoal transition-colors"
      >
        Back to homepage
      </Link>
    </div>
  )
}
