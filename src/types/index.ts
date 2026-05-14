export interface Product {
  id: string
  name: string
  slug: string
  type: 'club' | 'national' | 'retro' | 'mystery'
  country: string
  league?: string
  version: 'fan' | 'player'
  year: number
  description: string
  price: number
  compare_at_price?: number
  images: string[]
  sizes: string[]
  featured: boolean
  supplier_link?: string
  inventory: number
  created_at: string
}

export interface Order {
  id: string
  customer_email: string
  customer_name: string
  shipping_address: ShippingAddress
  total_price: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  stripe_session_id: string
  created_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  size: string
  unit_price: number
  product?: Product
}

export interface ShippingAddress {
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  image: string
  country?: string
}
