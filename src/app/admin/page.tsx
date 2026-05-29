'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Package, ShoppingBag, TrendingUp, Eye, EyeOff, Plus,
  Edit, Trash2, Check, X, LogOut, Tag, Truck, Search, ChevronDown, ChevronUp, ExternalLink,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge, Product, Order } from '@/types'
import toast from 'react-hot-toast'

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'footydept2026'

type Tab = 'products' | 'orders' | 'badges' | 'tracking'

// ─── Constants ────────────────────────────────────────────────────────────────

const PRODUCT_TYPES = [
  { value: 'club',     label: 'Club' },
  { value: 'national', label: 'National Team' },
  { value: 'mystery',  label: 'Mystery Box' },
]

const LEAGUES = [
  'Premier League', 'La Liga', 'Serie A', 'Bundesliga', 'Ligue 1',
  'MLS', 'Liga Portugal', 'Eredivisie', 'Saudi Pro League',
  'Brasileirão', 'Liga MX', 'Primera División',
]

const COUNTRIES = [
  'Brazil', 'France', 'Argentina', 'Germany', 'Spain', 'England',
  'USA', 'Italy', 'Portugal', 'Netherlands', 'Mexico', 'Belgium',
  'Croatia', 'Uruguay', 'Japan', 'Morocco', 'Norway', 'Other',
]

const toSlug = (s: string) =>
  s.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

const extractYear = (name: string): number | null => {
  const match = name.match(/\b(1[9][0-9]{2}|2[01][0-9]{2})\b/)
  return match ? parseInt(match[1]) : null
}

const EMPTY_PRODUCT: Partial<Product> = {
  name: '', slug: '', type: 'national', country: '', league: undefined,
  version: 'fan', year: 2026, description: '', price: 0,
  compare_at_price: undefined, images: [''], sizes: ['S', 'M', 'L', 'XL'],
  featured: false, supplier_link: '', inventory: 0,
  customization_enabled: false, customization_price: 10,
}

const EMPTY_BADGE: Partial<Badge> = { name: '', image_url: '', price: 0 }

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [tab, setTab] = useState<Tab>('products')

  // Products state
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [customCountry, setCustomCountry] = useState('')
  const [customLeague, setCustomLeague] = useState('')
  const [productBadgeIds, setProductBadgeIds] = useState<Set<string>>(new Set())

  // Badges state
  const [allBadges, setAllBadges] = useState<Badge[]>([])
  const [editingBadge, setEditingBadge] = useState<Partial<Badge> | null>(null)
  const [showBadgeForm, setShowBadgeForm] = useState(false)

  // Tracking state
  const [trackingSearch, setTrackingSearch] = useState('')
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [trackingEdits, setTrackingEdits] = useState<Record<string, { tracking_number: string; tracking_url: string; status: string }>>({})
  const [savingTracking, setSavingTracking] = useState<string | null>(null)

  // ── Auth ───────────────────────────────────────────────────────────────────

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      toast.success('Welcome, Admin')
    } else {
      toast.error('Incorrect password')
    }
  }

  // ── Data fetching ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!authed) return
    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, tab])

  // Keep allBadges loaded for the product form badge multi-select
  useEffect(() => {
    if (!authed) return
    supabase.from('badges').select('*').order('name').then(({ data }) => setAllBadges(data || []))
  }, [authed])

  const fetchData = async () => {
    setLoading(true)
    if (tab === 'products') {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      setProducts(data || [])
    } else if (tab === 'orders' || tab === 'tracking') {
      const { data } = await supabase.from('orders').select('*, order_items(*, product:products(name, images))').order('created_at', { ascending: false })
      setOrders(data || [])
    } else if (tab === 'badges') {
      const { data } = await supabase.from('badges').select('*').order('name')
      setAllBadges(data || [])
    }
    setLoading(false)
  }

  // ── Product CRUD ───────────────────────────────────────────────────────────

  const openNewForm = () => {
    setEditingProduct({ ...EMPTY_PRODUCT })
    setCustomCountry('')
    setCustomLeague('')
    setProductBadgeIds(new Set())
    setShowForm(true)
  }

  const openEditForm = async (p: Product) => {
    setEditingProduct(p)
    setCustomCountry(COUNTRIES.includes(p.country) ? '' : p.country)
    setCustomLeague(p.league && LEAGUES.includes(p.league) ? '' : (p.league ?? ''))
    setShowForm(true)
    // Load this product's existing badge associations
    const { data: pb } = await supabase
      .from('product_badges')
      .select('badge_id')
      .eq('product_id', p.id)
    setProductBadgeIds(new Set(pb?.map((r: { badge_id: string }) => r.badge_id) || []))
  }

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct.slug) {
      toast.error('Name and slug are required')
      return
    }

    const productData = { ...editingProduct }
    // Apply "Other" overrides
    if (productData.country === 'Other') productData.country = customCountry
    if (productData.type !== 'club') delete productData.league
    if (productData.league === 'Other') productData.league = customLeague
    if (productData.type === 'mystery') productData.version = 'fan'
    // Strip frontend-only fields
    delete productData.id
    delete (productData as Record<string, unknown>).available_badges

    let savedProductId: string

    if (editingProduct.id) {
      const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id)
      if (error) { toast.error('Failed to update'); return }
      toast.success('Product updated')
      savedProductId = editingProduct.id
    } else {
      const { data: created, error } = await supabase
        .from('products')
        .insert(productData)
        .select('id')
        .single()
      if (error || !created) { toast.error('Failed to create'); return }
      toast.success('Product created')
      savedProductId = created.id
    }

    // Sync product_badges join table
    await supabase.from('product_badges').delete().eq('product_id', savedProductId)
    if (productBadgeIds.size > 0) {
      await supabase.from('product_badges').insert(
        Array.from(productBadgeIds).map((badge_id) => ({ product_id: savedProductId, badge_id }))
      )
    }

    setShowForm(false)
    setEditingProduct(null)
    setProductBadgeIds(new Set())
    setCustomCountry('')
    setCustomLeague('')
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

  const handleImageUpload = async (file: File) => {
    if (!file) return
    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from('product-images').upload(fileName, file)
      if (uploadError) { toast.error('Upload failed: ' + uploadError.message); return }
      const { data } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setEditingProduct({ ...editingProduct, images: [data.publicUrl] })
      toast.success('Image uploaded')
    } catch (error) {
      toast.error('Upload error: ' + (error instanceof Error ? error.message : 'Unknown'))
    } finally {
      setUploading(false)
    }
  }

  // ── Badge CRUD ─────────────────────────────────────────────────────────────

  const openNewBadgeForm = () => {
    setEditingBadge({ ...EMPTY_BADGE })
    setShowBadgeForm(true)
  }

  const openEditBadge = (badge: Badge) => {
    setEditingBadge({ ...badge })
    setShowBadgeForm(true)
  }

  const handleSaveBadge = async () => {
    if (!editingBadge?.name || !editingBadge.image_url) {
      toast.error('Name and image URL are required')
      return
    }
    const badgeData = {
      name: editingBadge.name,
      image_url: editingBadge.image_url,
      price: editingBadge.price ?? 0,
    }
    if (editingBadge.id) {
      const { error } = await supabase.from('badges').update(badgeData).eq('id', editingBadge.id)
      if (error) { toast.error('Failed to update badge'); return }
      toast.success('Badge updated')
    } else {
      const { error } = await supabase.from('badges').insert(badgeData)
      if (error) { toast.error('Failed to create badge'); return }
      toast.success('Badge created')
    }
    setShowBadgeForm(false)
    setEditingBadge(null)
    // Refresh both badge list and allBadges (used in product form)
    supabase.from('badges').select('*').order('name').then(({ data }) => setAllBadges(data || []))
    fetchData()
  }

  const handleDeleteBadge = async (id: string) => {
    if (!confirm('Delete this badge? It will be removed from all products it is attached to.')) return
    await supabase.from('badges').delete().eq('id', id)
    toast.success('Badge deleted')
    supabase.from('badges').select('*').order('name').then(({ data }) => setAllBadges(data || []))
    fetchData()
  }

  // ── Tracking ───────────────────────────────────────────────────────────────

  const initTrackingEdit = (order: Order) => {
    if (trackingEdits[order.id]) return
    setTrackingEdits((prev) => ({
      ...prev,
      [order.id]: {
        tracking_number: order.tracking_number || '',
        tracking_url: order.tracking_url || '',
        status: order.status,
      },
    }))
  }

  const handleSaveTracking = async (orderId: string) => {
    const edit = trackingEdits[orderId]
    if (!edit) return
    setSavingTracking(orderId)
    const { error } = await supabase
      .from('orders')
      .update({
        status: edit.status,
        tracking_number: edit.tracking_number || null,
        tracking_url: edit.tracking_url || null,
      })
      .eq('id', orderId)
    if (error) {
      toast.error('Failed to save tracking')
    } else {
      toast.success('Tracking saved')
      fetchData()
    }
    setSavingTracking(null)
  }

  // ── Login screen ───────────────────────────────────────────────────────────

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

  // ── Dashboard ──────────────────────────────────────────────────────────────

  const ep = editingProduct
  const isClub     = ep?.type === 'club'
  const isNational = ep?.type === 'national'
  const showVersion = isClub || isNational
  const showLeague  = isClub

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
            { label: 'Total Products', value: products.length.toString(),    icon: Package },
            { label: 'Total Orders',   value: orders.length.toString(),      icon: ShoppingBag },
            { label: 'Revenue',        value: `$${orders.reduce((s, o) => s + o.total_price, 0).toFixed(2)}`, icon: TrendingUp },
            { label: 'Badges',         value: allBadges.length.toString(),   icon: Tag },
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
          {(['products', 'orders', 'tracking', 'badges'] as Tab[]).map((t) => (
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

        {/* ── PRODUCTS TAB ─────────────────────────────────────────────────── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-2xl uppercase">Products</h2>
              <button
                onClick={openNewForm}
                className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-5 py-3 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Plus size={14} /> Add Product
              </button>
            </div>

            {/* Product form modal */}
            {showForm && ep && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#111] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-black text-xl uppercase">
                      {ep.id ? 'Edit Product' : 'Add Product'}
                    </h3>
                    <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Name</label>
                      <input type="text" value={ep.name || ''} onChange={(e) => {
                        const name = e.target.value
                        const updates: Partial<Product> = { ...ep, name }
                        if (!ep.id) {
                          updates.slug = toSlug(name)
                          const year = extractYear(name)
                          if (year) updates.year = year
                        }
                        setEditingProduct(updates)
                      }}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Slug</label>
                      <input type="text" value={ep.slug || ''} onChange={(e) => setEditingProduct({ ...ep, slug: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>

                    {/* Type */}
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Type</label>
                      <select value={ep.type || 'national'}
                        onChange={(e) => setEditingProduct({ ...ep, type: e.target.value as Product['type'], league: undefined, version: 'fan' })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                      >
                        {PRODUCT_TYPES.map(({ value, label }) => (
                          <option key={value} value={value} className="bg-[#111]">{label}</option>
                        ))}
                      </select>
                    </div>

                    {/* Country — hidden for club type */}
                    {ep.type !== 'club' && (
                      <div>
                        <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Country</label>
                        <select
                          value={COUNTRIES.includes(ep.country || '') ? ep.country : 'Other'}
                          onChange={(e) => {
                            setEditingProduct({ ...ep, country: e.target.value === 'Other' ? 'Other' : e.target.value })
                            if (e.target.value !== 'Other') setCustomCountry('')
                          }}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                        >
                          {COUNTRIES.map((c) => <option key={c} value={c} className="bg-[#111]">{c}</option>)}
                        </select>
                        {ep.country === 'Other' && (
                          <input type="text" placeholder="Enter country name" value={customCountry}
                            onChange={(e) => setCustomCountry(e.target.value)}
                            className="w-full mt-2 bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                        )}
                      </div>
                    )}

                    {/* League — only for clubs */}
                    {showLeague && (
                      <div>
                        <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">League</label>
                        <select
                          value={ep.league && LEAGUES.includes(ep.league) ? ep.league : (ep.league ? 'Other' : '')}
                          onChange={(e) => {
                            setEditingProduct({ ...ep, league: e.target.value === 'Other' ? 'Other' : e.target.value })
                            if (e.target.value !== 'Other') setCustomLeague('')
                          }}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                        >
                          <option value="" className="bg-[#111]">Select league…</option>
                          {LEAGUES.map((l) => <option key={l} value={l} className="bg-[#111]">{l}</option>)}
                          <option value="Other" className="bg-[#111]">Other</option>
                        </select>
                        {ep.league === 'Other' && (
                          <input type="text" placeholder="Enter league name" value={customLeague}
                            onChange={(e) => setCustomLeague(e.target.value)}
                            className="w-full mt-2 bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                        )}
                      </div>
                    )}

                    {/* Year */}
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Year</label>
                      <input type="number" value={ep.year || 2026}
                        onChange={(e) => setEditingProduct({ ...ep, year: parseInt(e.target.value) || 2026 })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>

                    {/* Version — only for club or national */}
                    {showVersion && (
                      <div>
                        <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Version</label>
                        <select value={ep.version || 'fan'}
                          onChange={(e) => setEditingProduct({ ...ep, version: e.target.value as 'fan' | 'player' | 'retro' })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                        >
                          <option value="fan"    className="bg-[#111]">Fan</option>
                          <option value="player" className="bg-[#111]">Player</option>
                          <option value="retro"  className="bg-[#111]">Retro</option>
                        </select>
                      </div>
                    )}

                    {/* Price */}
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Price</label>
                      <input type="number" value={ep.price || 0}
                        onChange={(e) => setEditingProduct({ ...ep, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>

                    {/* Compare price */}
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Compare Price</label>
                      <input type="number" value={ep.compare_at_price || ''}
                        onChange={(e) => setEditingProduct({ ...ep, compare_at_price: parseFloat(e.target.value) || undefined })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>

                    {/* Sold Out toggle */}
                    <div className="flex items-center justify-between bg-white/5 border border-white/10 px-4 py-3">
                      <label className="text-white/40 text-xs tracking-widest uppercase">Sold Out</label>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...ep, inventory: ep.inventory === 0 ? 1 : 0 })}
                        className={`relative w-10 h-5 rounded-full transition-colors ${ep.inventory === 0 ? 'bg-red-500' : 'bg-white/20'}`}
                      >
                        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${ep.inventory === 0 ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Description</label>
                      <textarea value={ep.description || ''} rows={3}
                        onChange={(e) => setEditingProduct({ ...ep, description: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30 resize-none" />
                    </div>

                    {/* Image upload */}
                    <div className="col-span-2">
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Product Image</label>
                      <div className="space-y-3">
                        <input type="file" accept="image/*"
                          onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
                          disabled={uploading}
                          className="w-full bg-white/5 border border-white/10 text-white/60 px-4 py-3 text-sm file:bg-blue-600 file:text-white file:border-0 file:px-3 file:py-1 file:text-xs file:font-semibold file:cursor-pointer disabled:opacity-50" />
                        {uploading && <p className="text-blue-400 text-sm">Uploading...</p>}
                        {ep.images?.[0] && (
                          <div className="relative w-full h-32 bg-white/5 border border-white/10">
                            <Image src={ep.images[0]} alt="Preview" fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Supplier link */}
                    <div className="col-span-2">
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">
                        Supplier Link <span className="text-red-400">(Private — never displayed publicly)</span>
                      </label>
                      <input type="text" value={ep.supplier_link || ''}
                        onChange={(e) => setEditingProduct({ ...ep, supplier_link: e.target.value })}
                        placeholder="https://supplier.com/product/..."
                        className="w-full bg-red-950/20 border border-red-500/20 text-white px-4 py-3 text-sm outline-none focus:border-red-500/40" />
                    </div>

                    {/* Featured toggle */}
                    <div className="col-span-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <div onClick={() => setEditingProduct({ ...ep, featured: !ep.featured })}
                          className={`w-10 h-5 rounded-full transition-colors ${ep.featured ? 'bg-blue-500' : 'bg-white/10'}`}>
                          <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${ep.featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-white/60 text-sm">Featured product</span>
                      </label>
                    </div>

                    {/* ── Customization ─────────────────────────────────── */}
                    <div className="col-span-2 border-t border-white/10 pt-4">
                      <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Customization</p>
                      <label className="flex items-center gap-3 cursor-pointer mb-3">
                        <div
                          onClick={() => setEditingProduct({ ...ep, customization_enabled: !ep.customization_enabled })}
                          className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${ep.customization_enabled ? 'bg-blue-500' : 'bg-white/10'}`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full mt-0.5 transition-transform ${ep.customization_enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
                        </div>
                        <span className="text-white/60 text-sm">Enable customization (name &amp; number)</span>
                      </label>
                      {ep.customization_enabled && (
                        <div className="w-48">
                          <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Customization fee ($)</label>
                          <input type="number" step="0.01" min="0"
                            value={ep.customization_price ?? 10}
                            onChange={(e) => setEditingProduct({ ...ep, customization_price: parseFloat(e.target.value) || 10 })}
                            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                        </div>
                      )}
                    </div>

                    {/* ── Badge multi-select ────────────────────────────── */}
                    {allBadges.length > 0 && (
                      <div className="col-span-2 border-t border-white/10 pt-4">
                        <p className="text-white/40 text-[10px] tracking-widest uppercase mb-3">Available Badges</p>
                        <div className="grid grid-cols-3 gap-2">
                          {allBadges.map((badge) => {
                            const checked = productBadgeIds.has(badge.id)
                            return (
                              <button
                                key={badge.id}
                                type="button"
                                onClick={() => {
                                  const next = new Set(productBadgeIds)
                                  if (checked) next.delete(badge.id)
                                  else next.add(badge.id)
                                  setProductBadgeIds(next)
                                }}
                                className={`flex items-center gap-2 p-2 border text-left transition-colors ${
                                  checked ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/30'
                                }`}
                              >
                                <div className="relative w-8 h-8 bg-zinc-900 flex-shrink-0 overflow-hidden">
                                  <Image src={badge.image_url} alt={badge.name} fill className="object-contain p-0.5" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-white text-xs font-medium truncate">{badge.name}</p>
                                  <p className="text-white/40 text-xs">${badge.price.toFixed(2)}</p>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={handleSaveProduct}
                      className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-6 py-3 hover:bg-blue-500 hover:text-white transition-colors">
                      <Check size={14} /> Save Product
                    </button>
                    <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Product table */}
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => <div key={i} className="h-16 bg-white/5 animate-pulse" />)}
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
                      {['Name', 'Type', 'Country', 'Year', 'Price', 'Inventory', 'Featured', 'Actions'].map((h) => (
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
                        <td className="py-4 pr-4 text-white/50 capitalize">{p.type}</td>
                        <td className="py-4 pr-4 text-white/50">{p.country}</td>
                        <td className="py-4 pr-4 text-white/50">{p.year}</td>
                        <td className="py-4 pr-4 text-white font-semibold">${p.price.toFixed(2)}</td>
                        <td className="py-4 pr-4">
                          {p.inventory === 0
                            ? <span className="text-xs font-bold text-red-400">Sold Out</span>
                            : <span className="text-xs text-white/40">In Stock</span>
                          }
                        </td>
                        <td className="py-4 pr-4">
                          {p.featured
                            ? <span className="text-blue-400 text-xs">Yes</span>
                            : <span className="text-white/20 text-xs">No</span>
                          }
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <button onClick={() => openEditForm(p)} className="text-white/40 hover:text-white transition-colors">
                              <Edit size={14} />
                            </button>
                            <button onClick={() => handleDeleteProduct(p.id)} className="text-white/40 hover:text-red-400 transition-colors">
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

        {/* ── ORDERS TAB ───────────────────────────────────────────────────── */}
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
                      <select value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-white/5 border border-white/10 text-white text-xs px-3 py-2 outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      <span className={`text-xs px-2 py-1 font-bold uppercase tracking-wider ${
                        order.status === 'delivered'  ? 'bg-green-500/10 text-green-400' :
                        order.status === 'shipped'    ? 'bg-blue-500/10 text-blue-400' :
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

        {/* ── TRACKING TAB ─────────────────────────────────────────────────── */}
        {tab === 'tracking' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-2xl uppercase">Order Tracking</h2>
              <p className="text-white/30 text-xs">{orders.length} total orders</p>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                placeholder="Search by name, email, or order ID..."
                value={trackingSearch}
                onChange={(e) => setTrackingSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 pl-10 pr-5 py-3 text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>

            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-white/5 animate-pulse" />)}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-white/10">
                <Truck size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/30">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {orders
                  .filter((o) => {
                    const q = trackingSearch.toLowerCase()
                    return !q || o.customer_name.toLowerCase().includes(q) || o.customer_email.toLowerCase().includes(q) || o.id.toLowerCase().includes(q)
                  })
                  .map((order) => {
                    const edit = trackingEdits[order.id]
                    const isExpanded = expandedOrderId === order.id
                    const statusColor =
                      order.status === 'delivered'  ? 'text-green-400 bg-green-500/10 border-green-500/20' :
                      order.status === 'shipped'    ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' :
                      order.status === 'processing' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' :
                      'text-white/40 bg-white/5 border-white/10'

                    return (
                      <div key={order.id} className="border border-white/10 hover:border-white/20 transition-colors">
                        {/* Row header — always visible */}
                        <button
                          className="w-full flex items-center justify-between px-5 py-4 text-left"
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedOrderId(null)
                            } else {
                              setExpandedOrderId(order.id)
                              initTrackingEdit(order)
                            }
                          }}
                        >
                          <div className="flex items-center gap-6 min-w-0">
                            <div className="min-w-0">
                              <p className="text-white font-bold text-sm">{order.customer_name}</p>
                              <p className="text-white/40 text-xs truncate">{order.customer_email}</p>
                            </div>
                            <p className="text-white/20 text-xs hidden md:block font-mono">{order.id.slice(0, 16)}...</p>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                            <p className="text-white font-bold text-sm">${order.total_price.toFixed(2)}</p>
                            <span className={`text-[10px] font-black px-2 py-1 uppercase tracking-wider border ${statusColor}`}>
                              {order.status}
                            </span>
                            {order.tracking_number && (
                              <span className="text-[10px] text-blue-400 border border-blue-500/20 bg-blue-500/5 px-2 py-1 uppercase tracking-wider hidden md:block">
                                Tracked
                              </span>
                            )}
                            <p className="text-white/20 text-xs hidden md:block">{new Date(order.created_at).toLocaleDateString()}</p>
                            {isExpanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
                          </div>
                        </button>

                        {/* Expanded detail */}
                        {isExpanded && edit && (
                          <div className="border-t border-white/10 px-5 py-6 grid md:grid-cols-2 gap-8">

                            {/* Left — order details */}
                            <div>
                              <p className="text-white/30 text-[10px] tracking-widest uppercase mb-4">Order Details</p>

                              {/* Customer */}
                              <div className="space-y-1 mb-5">
                                <p className="text-white text-sm font-semibold">{order.customer_name}</p>
                                <p className="text-white/50 text-xs">{order.customer_email}</p>
                              </div>

                              {/* Shipping address */}
                              <div className="bg-white/3 border border-white/5 p-4 mb-5">
                                <p className="text-white/30 text-[10px] tracking-widest uppercase mb-2">Ship To</p>
                                <p className="text-white/70 text-sm leading-relaxed">
                                  {order.shipping_address.line1}
                                  {order.shipping_address.line2 && <>, {order.shipping_address.line2}</>}<br />
                                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
                                  {order.shipping_address.country}
                                </p>
                              </div>

                              {/* Items */}
                              {order.order_items && order.order_items.length > 0 && (
                                <div>
                                  <p className="text-white/30 text-[10px] tracking-widest uppercase mb-3">Items</p>
                                  <div className="space-y-3">
                                    {order.order_items.map((item) => (
                                      <div key={item.id} className="flex items-center gap-3">
                                        {item.product?.images?.[0] && (
                                          <div className="relative w-10 h-10 bg-zinc-900 flex-shrink-0 overflow-hidden">
                                            <img src={item.product.images[0]} alt={item.product?.name} className="w-full h-full object-cover" />
                                          </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                          <p className="text-white text-xs font-medium truncate">{item.product?.name ?? 'Unknown'}</p>
                                          <p className="text-white/40 text-xs">Qty {item.quantity} · Size {item.size}</p>
                                          {item.custom_name && (
                                            <p className="text-white/30 text-xs">Name: {item.custom_name} {item.custom_number}</p>
                                          )}
                                        </div>
                                        <p className="text-white text-xs font-bold flex-shrink-0">${(item.unit_price * item.quantity).toFixed(2)}</p>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
                                    <p className="text-white/40 text-xs">Total</p>
                                    <p className="text-white font-bold text-sm">${order.total_price.toFixed(2)}</p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Right — tracking controls */}
                            <div>
                              <p className="text-white/30 text-[10px] tracking-widest uppercase mb-4">Tracking & Status</p>

                              <div className="space-y-4">
                                {/* Status */}
                                <div>
                                  <label className="block text-white/40 text-[10px] tracking-widest uppercase mb-2">Status</label>
                                  <select
                                    value={edit.status}
                                    onChange={(e) => setTrackingEdits((prev) => ({ ...prev, [order.id]: { ...edit, status: e.target.value } }))}
                                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30"
                                  >
                                    <option value="pending" className="bg-[#111]">Pending</option>
                                    <option value="processing" className="bg-[#111]">Processing</option>
                                    <option value="shipped" className="bg-[#111]">Shipped</option>
                                    <option value="delivered" className="bg-[#111]">Delivered</option>
                                  </select>
                                </div>

                                {/* Tracking number */}
                                <div>
                                  <label className="block text-white/40 text-[10px] tracking-widest uppercase mb-2">Tracking Number</label>
                                  <input
                                    type="text"
                                    value={edit.tracking_number}
                                    onChange={(e) => setTrackingEdits((prev) => ({ ...prev, [order.id]: { ...edit, tracking_number: e.target.value } }))}
                                    placeholder="1Z999AA10123456784"
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors font-mono"
                                  />
                                </div>

                                {/* Tracking URL */}
                                <div>
                                  <label className="block text-white/40 text-[10px] tracking-widest uppercase mb-2">Tracking URL</label>
                                  <input
                                    type="url"
                                    value={edit.tracking_url}
                                    onChange={(e) => setTrackingEdits((prev) => ({ ...prev, [order.id]: { ...edit, tracking_url: e.target.value } }))}
                                    placeholder="https://tracking.carrier.com/..."
                                    className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/20 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                                  />
                                  {edit.tracking_url && (
                                    <a
                                      href={edit.tracking_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="flex items-center gap-1 text-blue-400 text-xs mt-2 hover:text-blue-300 transition-colors"
                                    >
                                      <ExternalLink size={10} /> Preview tracking link
                                    </a>
                                  )}
                                </div>

                                <button
                                  onClick={() => handleSaveTracking(order.id)}
                                  disabled={savingTracking === order.id}
                                  className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-6 py-3 hover:bg-blue-500 hover:text-white transition-colors disabled:opacity-50"
                                >
                                  <Check size={14} />
                                  {savingTracking === order.id ? 'Saving...' : 'Save Tracking'}
                                </button>

                                {/* Stripe session link */}
                                <div className="border-t border-white/5 pt-4">
                                  <p className="text-white/20 text-[10px] tracking-widest uppercase mb-1">Stripe Session</p>
                                  <p className="text-white/30 text-xs font-mono break-all">{order.stripe_session_id}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        )}

        {/* ── BADGES TAB ───────────────────────────────────────────────────── */}
        {tab === 'badges' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-white font-black text-2xl uppercase">Badge Library</h2>
              <button
                onClick={openNewBadgeForm}
                className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-5 py-3 hover:bg-blue-500 hover:text-white transition-colors"
              >
                <Plus size={14} /> Add Badge
              </button>
            </div>

            {/* Badge form modal */}
            {showBadgeForm && editingBadge && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-[#111] border border-white/10 w-full max-w-md p-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-white font-black text-xl uppercase">
                      {editingBadge.id ? 'Edit Badge' : 'Add Badge'}
                    </h3>
                    <button onClick={() => setShowBadgeForm(false)} className="text-white/40 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Badge Name</label>
                      <input type="text" value={editingBadge.name || ''}
                        onChange={(e) => setEditingBadge({ ...editingBadge, name: e.target.value })}
                        placeholder="Champions League Winner"
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>

                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Image URL</label>
                      <input type="text" value={editingBadge.image_url || ''}
                        onChange={(e) => setEditingBadge({ ...editingBadge, image_url: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                      {editingBadge.image_url && (
                        <div className="relative w-16 h-16 bg-zinc-900 mt-2 overflow-hidden">
                          <Image src={editingBadge.image_url} alt="preview" fill className="object-contain p-1" />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-white/40 text-xs tracking-widest uppercase mb-1">Price ($)</label>
                      <input type="number" step="0.01" min="0"
                        value={editingBadge.price ?? 0}
                        onChange={(e) => setEditingBadge({ ...editingBadge, price: parseFloat(e.target.value) || 0 })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm outline-none focus:border-white/30" />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button onClick={handleSaveBadge}
                      className="flex items-center gap-2 bg-white text-black font-black text-xs tracking-widest uppercase px-6 py-3 hover:bg-blue-500 hover:text-white transition-colors">
                      <Check size={14} /> Save Badge
                    </button>
                    <button onClick={() => setShowBadgeForm(false)} className="text-white/40 hover:text-white text-sm transition-colors">
                      Cancel
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {/* Badge grid */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => <div key={i} className="aspect-square bg-white/5 animate-pulse" />)}
              </div>
            ) : allBadges.length === 0 ? (
              <div className="text-center py-16 border border-white/10">
                <Tag size={32} className="text-white/20 mx-auto mb-3" />
                <p className="text-white/30">No badges yet. Add your first badge.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allBadges.map((badge) => (
                  <div key={badge.id} className="bg-black border border-white/10 p-4 hover:border-white/20 transition-colors">
                    <div className="relative aspect-square bg-zinc-900 mb-3 overflow-hidden">
                      <Image src={badge.image_url} alt={badge.name} fill className="object-contain p-3" />
                    </div>
                    <p className="text-white font-semibold text-sm leading-tight">{badge.name}</p>
                    <p className="text-blue-400 text-xs font-bold mt-0.5">${badge.price.toFixed(2)}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => openEditBadge(badge)} className="text-white/40 hover:text-white transition-colors">
                        <Edit size={14} />
                      </button>
                      <button onClick={() => handleDeleteBadge(badge.id)} className="text-white/40 hover:text-red-400 transition-colors">
                        <Trash2 size={14} />
                      </button>
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
