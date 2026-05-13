'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Package, ShoppingBag, TrendingUp, Eye, EyeOff, Plus,
  Edit, Trash2, Check, X, LogOut
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Product, Order } from '@/types'
import toast from 'react-hot-toast'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'footydept2026'

type Tab = 'products' | 'orders'

const EMPTY_PRODUCT: Partial<Product> = {
  name: '', slug: '', category: 'jersey', country: '', season: '2026',
  version_type: 'fan', description: '', price: 0, compare_at_price: undefined,
  images: [''], sizes: ['S', 'M', 'L', 'XL'], featured: false,
  supplier_link: '', inventory: 0,
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [tab, setTab] = useState<Tab>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      toast.success('Welcome, Admin')
    } else {
      toast.error('Incorrect password')
    }
  }

  useEffect(() => {
    if (!authed) return
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab])

  const fetchData = async () => {
    setLoading(true)
    if (tab === 'products') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data || [])
    } else {
      const { data } = await supabase.from('orders').select('*, order_items(*, product:products(name))').order('created_at', { ascending: false })
      setOrders(data || [])
    }
    setLoading(false)
  }

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct.slug) {
      toast.error('Name and slug are required')
      return
    }
    const productData = { ...editingProduct }
    delete productData.id

    if (editingProduct.id) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('Product updated')
    } else {
      const { error } = await supabase.from('products').insert(productData)
      if (error) { toast.error('Failed to create'); return }
      toast.success('Product created')
    }
    setShowForm(false)
    setEditingProduct(null)
    fetchData()
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    toast.success('Product deleted')
    fetchData()
  }

  const handleUpdateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    toast.success('Order status updated')
    fetchData()
  }

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <p className="font-black text-2xl tracking-widest text-white uppercase mb-1">Footy Dept.</p>
          <p className="text-white/30 text-xs tracking-widest uppercase mb-10">Admin Access</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-5 py-4 text-sm outline-none focus:border-white/30 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button
              type="submit"
              className="w-full bg-white text-black font-black text-sm tracking-widest uppercase py-4 hover:bg-blue-500 hover:text-white transition-colors duration-300"
            >
              Enter Dashboard
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Admin header */}
      <div className="bg-black border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <p className="font-black text-xl tracking-widest text-white uppercase">Footy Dept.</p>
          <span className="text-white/20 text-xs px-2 py-0.5 border border-white/10">Admin</span>
        </div>
        <button
          onClick={() => setAuthed(false)}
          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors"
        >
          <LogOut size={14} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length.toString(), icon: Package },
            { label: 'Total Orders', value: orders.length.toString(), icon: ShoppingBag },
            { label: 'Revenue', value: `$${orders.reduce((s, o) => s + o.total_price, 0).toFixed(2)}`, icon: TrendingUp },
            { label: 'Pending', value: orders.filter((o) => o.status === 'pending').length.toString(), icon: Package },
          ].map((stat) => (
            <div key={stat.label} className="bg-black border border-white/10 p-5">
              <stat.icon size={18} className="text-blue-400 mb-3" />
              <p className="text-3xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-white/30 text-xs tracking-widest uppercase">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 border-b border-white/10 mb-8">
          {(['products', 'orders'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-semibold tracking-wider uppercase transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-blue-500 text-white'
                  : 'border-transparent text-white/30 hover:text-white/60'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-2xl uppercase">Products</h2>
              <button
                onClick={() => { setEditingProduct({ ...EMPTY_PRODUCT }); setShowForm(true) }}
                className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-5 py-3 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Product form modal */}
            {showForm && editingProduct && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-black text-xl uppercase">
                      {editingProduct.id ? 'Edit Product' : 'Add Product'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Name', key: 'name', type: 'text' },
                      { label: 'Slug', key: 'slug', type: 'text' },
                      { label: 'Price', key: 'price', type: 'number' },
                      { label: 'Compare Price', key: 'compare_at_price', type: 'number' },
                      { label: 'Country', key: 'country', type: 'text' },
                      { label: 'Season', key: 'season', type: 'text' },
                      { label: 'Inventory', key: 'inventory', type: 'number' },
                    ].map((field) => (
                      <div key={field.key}>
                        <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          value={(editingProduct as Record<string, unknown>)[field.key] as string || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              [field.key]: field.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value,
                            })
                          }
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                        />
                      </div>
                    ))}

                    <div className="col-span-2">
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Description</label>
                      <textarea
                        value={editingProduct.description || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                        rows={3}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 resize-none"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Image URL</label>
                      <input
                        type="text"
                        value={editingProduct.images?.[0] || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                      />
                    </div>

                    {/* IMPORTANT: Supplier link — never visible publicly */}
                    <div className="col-span-2">
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">
                        Supplier Link <span className="text-red-400">(Private — never displayed publicly)</span>
                      </label>
                      <input
                        type="text"
                        value={editingProduct.supplier_link || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, supplier_link: e.target.value })}
                        placeholder="https://supplier.com/product/..."
                        className="w-full bg-red-950/20 border border-red-500/20 text-white px-4 py-3 text-sm outline-none focus:border-red-500/40"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div
                          onClick={() => setEditingProduct({ ...editingProduct, featured: !editingProduct.featured })}
                          className={`w-10 h-5 rounded-full transition-colors ${editingProduct.featured ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${editingProduct.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-white/60 text-sm">Featured product</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button
                      onClick={handleSaveProduct}
                      className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-6 py-3 hover:bg-blue-500 hover:text-white transition-colors"
                    >
                      <Check size={14} /> Save Product
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="text-white/40 hover:text-white text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Product table */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-16 bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 border border-white/10">
                <Package size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/30">No products yet. Add your first product.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      {['Product', 'Category', 'Price', 'Inventory', 'Featured', 'Actions'].map((h) => (
                        <th key={h} className="text-left text-white/40 text-xs tracking-widest uppercase pb-3 pr-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-white/2 transition-colors">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            {p.images[0] && (
                              <div className="w-10 h-10 bg-zinc-900 flex-shrink-0 overflow-hidden relative">
                                <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                              </div>
                            )}
                            <div>
                              <p className="text-white font-medium">{p.name}</p>
                              <p className="text-white/30 text-xs">{p.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 pr-4 text-white/50 capitalize">{p.category}</td>
                        <td className="py-4 pr-4 text-white font-semibold">${p.price.toFixed(2)}</td>
                        <td className="py-4 pr-4">
                          <span className={`text-xs font-bold ${p.inventory < 5 ? 'text-red-400' : 'text-white/60'}`}>
                            {p.inventory}
                          </span>
                        </td>
                        <td className="py-4 pr-4">
                          {p.featured ? (
                            <span className="text-blue-400 text-xs">Yes</span>
                          ) : (
                            <span className="text-white/20 text-xs">No</span>
                          )}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => { setEditingProduct(p); setShowForm(true) }}
                              className="text-white/40 hover:text-white transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-white/40 hover:text-red-400 transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div>
            <h2 className="text-white font-black text-2xl uppercase mb-6">Orders</h2>
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-white/10">
                <ShoppingBag size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/30">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border border-white/10 p-5 hover:border-white/20 transition-colors">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-white font-bold">{order.customer_name}</p>
                        <p className="text-white/40 text-xs">{order.customer_email}</p>
                        <p className="text-white/20 text-xs mt-1">{order.id.slice(0, 12)}...</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-bold text-lg">${order.total_price.toFixed(2)}</p>
                        <p className="text-white/30 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-xs px-3 py-2 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <span className={`text-xs px-2 py-1 font-bold uppercase tracking-wider ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                        order.status === 'shipped' ? 'bg-blue-500/10 text-blue-400' :
                        order.status === 'processing' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-white/5 text-white/40'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
