export interface Badge {
  id: string
  name: string
  image_url: string
  price: number
  created_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  type: 'club' | 'national' | 'mystery'
  country: string
  league?: string
  version: 'fan' | 'player' | 'retro'
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
  // Customization — opt-in per product (default false)
  customization_enabled?: boolean
  customization_price?: number
  // Populated by product detail page fetch, not a DB column
  available_badges?: Badge[]
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
  custom_name?: string
  custom_number?: number
  selected_badges?: Array<{ badge_id: string; name: string; price: number }>
  customization_total?: number
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
  cartKey: string
  product: Product
  quantity: number
  size: string
  customName?: string
  customNumber?: number
  selectedBadges?: Badge[]
  customizationTotal?: number
}

export interface Collection {
  id: string
  name: string
  slug: string
  description: string
  image: string
  country?: string
}
