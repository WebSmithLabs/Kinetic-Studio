export type ProjectCategory =
  | 'Business Websites'
  | 'Custom Web Development'
  | 'Web Applications'
  | 'Product Websites'
  | 'Landing Pages'
  | 'Experimental Projects';

export type InquiryStatus = 'new' | 'reviewing' | 'contacted' | 'converted' | 'archived';

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

export interface AdminUser {
  id: string;
  email: string;
  role: 'super_admin' | 'admin' | 'viewer';
  full_name: string;
}
