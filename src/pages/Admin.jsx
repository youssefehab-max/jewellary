import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Admin() {
  const [session, setSession] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [authError, setAuthError] = useState('')
  const [loading, setLoading] = useState(true)

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('orders')
  const [saving, setSaving] = useState(false)

  const [productForm, setProductForm] = useState({
    title: '',
    price: '',
    category: 'rings',
    description: '',
    images: '',
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!session) return
    loadData()
  }, [session])

  async function loadData() {
    const [{ data: productRows }, { data: orderRows }] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ])
    setProducts(productRows || [])
    setOrders(orderRows || [])
  }

  async function handleLogin(e) {
    e.preventDefault()
    setAuthError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setAuthError(error.message)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleCreateProduct(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('products').insert({
      title: productForm.title.trim(),
      price: Number(productForm.price),
      category: productForm.category,
      description: productForm.description.trim() || null,
      images: productForm.images
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean),
      in_stock: true,
    })
    setSaving(false)
    if (error) {
      alert(error.message)
      return
    }
    setProductForm({ title: '', price: '', category: 'rings', description: '', images: '' })
    loadData()
  }

  async function updateOrderStatus(id, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id)
    if (error) {
      alert(error.message)
      return
    }
    loadData()
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20 text-center text-sm text-charcoal/50">
        Loading…
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-serif text-3xl mb-2">Admin</h1>
        <p className="text-sm text-charcoal/60 mb-8">Sign in with your Supabase admin account.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full border border-black/10 rounded-lg px-4 py-3 text-sm"
          />
          {authError && <p className="text-sm text-red-600">{authError}</p>}
          <button
            type="submit"
            className="w-full bg-charcoal text-white py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-charcoal transition-colors"
          >
            Sign in
          </button>
        </form>
        <Link to="/" className="block text-center text-xs text-charcoal/40 mt-6 hover:text-gold">
          ← Back to store
        </Link>
      </div>
    )
  }

  const fieldClass = 'w-full border border-black/10 rounded-lg px-4 py-3 text-sm bg-white'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl">Admin</h1>
          <p className="text-xs text-charcoal/50 mt-1">{session.user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-charcoal/60 hover:text-gold underline"
        >
          Sign out
        </button>
      </div>

      <div className="flex gap-2 mb-8 border-b border-black/5 pb-3">
        {['orders', 'products'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm rounded-full capitalize ${
              tab === t ? 'bg-charcoal text-white' : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'orders' && (
        <div className="overflow-x-auto">
          {orders.length === 0 ? (
            <p className="text-sm text-charcoal/50">No orders yet.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-black/10 text-charcoal/50">
                  <th className="py-2 pr-3 font-medium">Customer</th>
                  <th className="py-2 pr-3 font-medium">Total</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                  <th className="py-2 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-black/5 align-top">
                    <td className="py-3 pr-3">
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-xs text-charcoal/50">{order.customer_email}</p>
                      <p className="text-xs text-charcoal/40">{order.city}</p>
                    </td>
                    <td className="py-3 pr-3 whitespace-nowrap">
                      LE {Number(order.total).toLocaleString()}
                    </td>
                    <td className="py-3 pr-3">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="border border-black/10 rounded-lg px-2 py-1 text-xs bg-white"
                      >
                        {['pending', 'paid', 'failed', 'cancelled', 'shipped', 'delivered'].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                    <td className="py-3 text-xs text-charcoal/50 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === 'products' && (
        <div className="grid lg:grid-cols-2 gap-10">
          <form onSubmit={handleCreateProduct} className="space-y-3">
            <h2 className="font-serif text-xl mb-2">Add product</h2>
            <input
              required
              value={productForm.title}
              onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
              placeholder="Title"
              className={fieldClass}
            />
            <input
              required
              type="number"
              min="0"
              step="0.01"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
              placeholder="Price (EGP)"
              className={fieldClass}
            />
            <select
              value={productForm.category}
              onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
              className={fieldClass}
            >
              {['rings', 'necklaces', 'bracelets', 'diamonds', 'gold', 'mens'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <textarea
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              placeholder="Description"
              rows={3}
              className={fieldClass}
            />
            <textarea
              value={productForm.images}
              onChange={(e) => setProductForm({ ...productForm, images: e.target.value })}
              placeholder="Image URLs (one per line)"
              rows={3}
              className={fieldClass}
            />
            <button
              type="submit"
              disabled={saving}
              className="bg-charcoal text-white px-8 py-3 rounded-full text-sm font-semibold hover:bg-gold hover:text-charcoal transition-colors disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Create product'}
            </button>
          </form>

          <div>
            <h2 className="font-serif text-xl mb-4">Catalog ({products.length})</h2>
            {products.length === 0 ? (
              <p className="text-sm text-charcoal/50">No products in Supabase yet.</p>
            ) : (
              <ul className="divide-y divide-black/5">
                {products.map((p) => (
                  <li key={p.id} className="py-3 flex justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{p.title}</p>
                      <p className="text-xs text-charcoal/50 capitalize">{p.category}</p>
                    </div>
                    <p className="text-sm whitespace-nowrap">LE {Number(p.price).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
