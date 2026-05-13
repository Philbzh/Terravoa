// Database types — will be auto-generated later via `supabase gen types typescript`
// This is a manual starter matching our schema

/** Avoids circular `Database[...]Row` refs that collapse `Insert` to `never`. */
export type ProducerApplicationRow = {
  id: string
  created_at: string
  full_name: string
  business_name: string | null
  /** Country where the legal entity is registered (for invoicing / eligibility). */
  company_registration_country: string | null
  /** VAT / EU VAT ID / tax ID as supplied by the applicant. */
  vat_id: string | null
  email: string
  phone: string | null
  country: string
  region: string
  production_location: string | null
  product_categories: string[]
  product_description: string
  product_differentiator: string | null
  story: string
  website: string | null
  instagram: string | null
  shipping_countries: string | null
  shipping_speed: string
  shipping_experience: boolean | null
  status: 'pending' | 'accepted' | 'rejected'
  reviewed_at: string | null
  notes: string | null
  other_links: string | null
  product_image_urls: string[]
  production_image_urls: string[]
  environment_image_urls: string[]
  source_language: string | null
  desired_plan: 'founding' | 'growth' | 'premium' | null
}

type ProducerApplicationInsert = Omit<
  ProducerApplicationRow,
  'id' | 'created_at' | 'status' | 'reviewed_at' | 'notes'
>

type ContactMessageRow = {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  audience: string
  message: string
}

type ContactMessageInsert = Omit<ContactMessageRow, 'id' | 'created_at'>

/** Avoids circular `Database[...]Row` refs that collapse `Insert`/`Update` to `never`. */
export type OrdersRow = {
  id: string
  created_at: string
  updated_at: string
  customer_email: string
  customer_name: string
  shipping_address: Record<string, string>
  status: 'new' | 'processing' | 'shipped' | 'delivered'
  fulfillment_status: string
  payment_status: string
  payout_status: string
  shipped_at: string | null
  delivered_at: string | null
  closed_at: string | null
  total: number
  stripe_payment_id: string | null
}

export type OrdersInsert =
  Omit<OrdersRow, 'id' | 'created_at' | 'updated_at' | 'shipped_at' | 'delivered_at' | 'closed_at'>

export type OrderItemsRow = {
  id: string
  order_id: string
  product_id: string
  producer_id: string
  quantity: number
  price: number
  tracking_number: string | null
  status: string
  /** 'pending' = awaiting payout, 'due' = tracking entered (payout owed), 'paid' = SEPA sent */
  payout_status: 'pending' | 'due' | 'paid' | null
  carrier: string | null
  tracking_url: string | null
  eta_at: string | null
  shipped_at: string | null
  refunded_cents: number | null
  commission_rate_pct: number | null
  commission_cents: number
}

type OrderItemsInsert =
  Omit<OrderItemsRow, 'id' | 'carrier' | 'tracking_url' | 'eta_at' | 'shipped_at' | 'refunded_cents'>

export type Database = {
  public: {
    Tables: {
      producers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string | null
          name: string
          slug: string
          region: string
          country: string
          specialty: string
          tagline: string
          story: string
          story_headline: string
          quote: string
          image_src: string
          image_alt: string
          hero_image_src: string | null
          hero_image_alt: string | null
          secondary_image_src: string | null
          secondary_image_alt: string | null
          established: string | null
          badges: string[]
          savoir_faire: { title: string; description: string }[]
          status: 'pending' | 'approved' | 'suspended'
          plan: 'founding' | 'growth' | 'premium' | null
          featured_placement: boolean
          commission_rate_pct: number | null
          /** ISO 639-1 locale for producer portal emails. Derived from country at signup. */
          preferred_language: 'en' | 'de' | 'fr' | null
          /** Bank details for SEPA payout */
          bank_iban: string | null
          bank_bic: string | null
          bank_account_name: string | null
        }
        Insert: Omit<Database['public']['Tables']['producers']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['producers']['Insert']>
      }
      products: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          producer_id: string
          name: string
          slug: string
          price: number
          origin: string
          description: string
          details: string[]
          image_src: string
          image_alt: string
          badge_label: string | null
          badge_variant: 'producer' | 'bestseller' | null
          category: string
          status: 'pending' | 'approved' | 'rejected'
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      orders: {
        Row: OrdersRow
        Insert: OrdersInsert
        Update: Partial<OrdersInsert>
      }
      order_items: {
        Row: OrderItemsRow
        Insert: OrderItemsInsert
        Update: Partial<OrderItemsInsert>
      }
      contact_messages: {
        Row: ContactMessageRow
        Insert: ContactMessageInsert
        Update: Partial<ContactMessageRow>
      }
      producer_applications: {
        Row: ProducerApplicationRow
        Insert: ProducerApplicationInsert
        Update: Partial<
          ProducerApplicationInsert & {
            status: string
            reviewed_at: string
            notes: string
          }
        >
      }
      admin_audit_logs: {
        Row: {
          id: number
          created_at: string
          actor_email: string
          action: string
          entity_type: string
          entity_id: string
          metadata: Record<string, unknown>
        }
        Insert: Omit<Database['public']['Tables']['admin_audit_logs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['admin_audit_logs']['Insert']>
      }
      producer_admin_notes: {
        Row: {
          id: number
          created_at: string
          producer_id: string
          actor_email: string
          note: string
        }
        Insert: Omit<Database['public']['Tables']['producer_admin_notes']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['producer_admin_notes']['Insert']>
      }
      admin_user_access: {
        Row: {
          id: string
          email: string
          full_name: string | null
          is_active: boolean
          can_supplier: boolean
          can_customer: boolean
          can_marketing: boolean
          can_finance: boolean
          can_operations: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['admin_user_access']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['admin_user_access']['Insert'] & {
          updated_at: string
        }>
      }
      producer_plan_requests: {
        Row: {
          id: string
          producer_id: string
          request_type: 'plan_upgrade' | 'addon_featured_placement' | 'addon_homepage_feature'
          current_plan: string | null
          requested_plan: 'growth' | 'premium' | null
          message: string | null
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          requester_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['producer_plan_requests']['Row'], 'id' | 'created_at' | 'updated_at' | 'status'>
        Update: Partial<Database['public']['Tables']['producer_plan_requests']['Insert'] & {
          status: 'pending' | 'approved' | 'rejected'
          admin_notes: string | null
          updated_at: string
        }>
      }
      producer_fulfillment_followups: {
        Row: {
          id: string
          order_id: string
          producer_id: string
          status: 'open' | 'contacted' | 'snoozed' | 'resolved'
          contact_count: number
          last_contacted_at: string | null
          next_follow_up_at: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['producer_fulfillment_followups']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['producer_fulfillment_followups']['Insert'] & {
          updated_at: string
        }>
      }
      producer_payouts: {
        Row: {
          id: string
          created_at: string
          producer_id: string
          order_id: string
          amount_cents: number
          commission_cents: number
          status: string
          scheduled_at: string
          paid_at: string | null
          stripe_transfer_id: string | null
        }
        Insert: Omit<Database['public']['Tables']['producer_payouts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['producer_payouts']['Insert']>
      }
      email_jobs: {
        Row: {
          id: number
          created_at: string
          kind: string
          order_id: string | null
          customer_email: string
          payload: Record<string, unknown>
          send_at: string
          sent_at: string | null
          attempts: number
          last_error: string | null
        }
        Insert: Omit<Database['public']['Tables']['email_jobs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['email_jobs']['Insert']>
      }
      regions: {
        Row: {
          id: string
          slug: string
          name: string
          country: string
          specialty: string
          description: string
          long_description: string
          image_src: string
          image_alt: string
        }
        Insert: Omit<Database['public']['Tables']['regions']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['regions']['Insert']>
      }
      coupons: {
        Row: {
          id: string
          created_at: string
          code: string
          /** Percentage off, 1–100 */
          discount_pct: number
          /** ISO date string; null = no expiry */
          expires_at: string | null
          /** Max number of uses; null = unlimited */
          max_uses: number | null
          /** How many times this code has been used */
          use_count: number
          is_active: boolean
          description: string | null
        }
        Insert: Omit<Database['public']['Tables']['coupons']['Row'], 'id' | 'created_at' | 'use_count'>
        Update: Partial<Database['public']['Tables']['coupons']['Insert'] & { use_count: number }>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      producer_status: 'pending' | 'approved' | 'suspended'
      product_status: 'pending' | 'approved' | 'rejected'
      order_status: 'new' | 'processing' | 'shipped' | 'delivered'
      application_status: 'pending' | 'accepted' | 'rejected'
      plan_type: 'founding' | 'growth' | 'premium'
    }
  }
}
