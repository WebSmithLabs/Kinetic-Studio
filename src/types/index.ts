export type ProjectCategory =
  | 'Business Websites'
  | 'Custom Web Development'
  | 'Web Applications'
  | 'Product Websites'
  | 'Landing Pages'
  | 'Experimental Projects';

export type InquiryStatus = 
  | 'new' 
  | 'reviewed' 
  | 'accepted' 
  | 'contacted' 
  | 'ongoing' 
  | 'finished' 
  | 'advance_payment_completed' 
  | 'payment_completed' 
  | 'archived';

export type ProjectType =
  | 'Business Website'
  | 'Portfolio Website'
  | 'E-commerce Website'
  | 'Web Application'
  | 'Product Showcase Website'
  | 'Documentation Website'
  | 'Custom Digital Solution'
  | 'Other';

export interface SiteSettings {
  id: string;
  company_name: string;
  short_name: string;
  tagline: string;
  logo_url: string;
  address: string;
  contact_email: string;
  phone_number: string;
  whatsapp_number: string;
  hero_badge: string;
  hero_title: string;
  hero_description: string;
  primary_cta_text: string;
  secondary_cta_text: string;
  twitter_url: string;
  linkedin_url: string;
  github_url: string;
  instagram_url: string;
  dribbble_url: string;
  primary_bg_color: string;
  primary_accent_color: string;
  secondary_accent_color: string;
  meta_title: string;
  meta_description: string;
  footer_text: string;
  razorpay_key_id?: string;
  razorpay_enabled?: boolean;
  cashfree_app_id?: string;
  cashfree_mode?: 'sandbox' | 'production';
  cashfree_enabled?: boolean;
  currency_symbol?: string;
  gst_number?: string;
  updated_at?: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  icon: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface ProjectItem {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: ProjectCategory;
  client_name: string;
  summary: string;
  description: string;
  challenge?: string;
  solution?: string;
  results?: string;
  thumbnail_url: string;
  screenshots: string[];
  technologies: string[];
  live_url?: string;
  github_url?: string;
  completion_date: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
}

export interface InquiryItem {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  company_name?: string;
  project_type: ProjectType | string;
  description: string;
  budget_range: string;
  timeframe: string;
  reference_websites?: string;
  status: InquiryStatus;
  admin_notes?: string;
  advance_amount?: number;
  total_amount?: number;
  paid_amount?: number;
  created_at: string;
  updated_at?: string;
}

export interface TestimonialItem {
  id: string;
  client_name: string;
  role_title: string;
  company_name: string;
  avatar_url?: string;
  quote: string;
  rating: number;
  project_type?: string;
  is_featured: boolean;
  display_order: number;
  created_at?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export type UserRole = 'super_admin' | 'admin' | 'viewer' | 'client' | 'user';

export interface StudioUser {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  avatar_url?: string;
  phone?: string;
  email_verified: boolean;
  providers: string[];
  created_at?: string;
  last_sign_in_at?: string;
}

export type AdminUser = StudioUser;

export type PaymentGateway = 'razorpay' | 'cashfree' | 'demo';

export type PaymentType =
  | 'advance_deposit'
  | 'milestone_payment'
  | 'full_payment'
  | 'template_purchase'
  | 'subscription_retainer';

export interface PaymentRecord {
  id: string;
  user_id?: string;
  client_email: string;
  client_name: string;
  inquiry_id?: string;
  product_id?: string;
  subscription_id?: string;
  amount: number;
  currency: 'INR' | 'USD';
  gateway: PaymentGateway;
  payment_id: string;
  order_id: string;
  payment_type: PaymentType;
  title: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  invoice_number: string;
  notes?: string;
  receipt_url?: string;
  created_at: string;
}

export interface SubscriptionPlan {
  id: string;
  slug: string;
  name: string;
  badge?: string;
  monthly_price_inr: number;
  annual_price_inr: number;
  monthly_price_usd: number;
  annual_price_usd: number;
  description: string;
  features: string[];
  sla: string;
  support_channel: string;
  hours_included: string;
  is_popular: boolean;
}

export interface ClientSubscription {
  id: string;
  user_id?: string;
  client_email: string;
  client_name: string;
  plan_slug: string;
  plan_name: string;
  billing_cycle: 'monthly' | 'annual';
  amount: number;
  currency: 'INR' | 'USD';
  gateway: PaymentGateway;
  status: 'active' | 'cancelled' | 'paused' | 'past_due';
  start_date: string;
  next_billing_date: string;
  created_at: string;
}

export interface StoreProduct {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: string;
  price_inr: number;
  original_price_inr: number;
  price_usd: number;
  thumbnail_url: string;
  live_demo_url: string;
  tech_stack: string[];
  features: string[];
  deliverables: string[];
  badge?: string;
  is_featured: boolean;
  created_at?: string;
}

export interface CollaborationItem {
  id: string;
  inquiry_id: string;
  sender_email: string;
  sender_name: string;
  sender_role: 'client' | 'team';
  message: string;
  attachments?: { name: string; url: string; size?: string }[];
  type: 'message' | 'milestone_update' | 'deliverable_shared' | 'approval_request';
  status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
}
