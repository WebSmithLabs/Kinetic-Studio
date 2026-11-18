-- ==============================================================================
-- WEB SMITH LABS — SUPABASE DATABASE SCHEMA
-- Production-Ready Relational Setup with Row Level Security (RLS) & Performance Indexes
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles (Admin & Staff Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'viewer')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Central Site Settings (Single Row Config with Fallbacks)
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'primary',
    company_name TEXT NOT NULL DEFAULT 'Web Smith Labs',
    short_name TEXT NOT NULL DEFAULT 'WSL',
    tagline TEXT NOT NULL DEFAULT 'Forging Digital Excellence Through Modern Web Engineering.',
    logo_url TEXT DEFAULT '',
    address TEXT DEFAULT 'Global Remote Studio / Bengaluru, India',
    contact_email TEXT DEFAULT 'hello@websmithlabs.com',
    phone_number TEXT DEFAULT '+91 (0) 80 4820 1920',
    whatsapp_number TEXT DEFAULT '+919876543210',
    hero_badge TEXT DEFAULT 'FULL-STACK WEB & DIGITAL ENGINEERING',
    hero_title TEXT DEFAULT 'Building Modern Websites, Portfolios & Web Applications That Deliver.',
    hero_description TEXT DEFAULT 'From domain-less starter websites and personal portfolios to custom business platforms and full-stack web applications, we engineer clean, accessible, and high-performance digital solutions tailored to your goals.',
    primary_cta_text TEXT DEFAULT 'Start a Project',
    secondary_cta_text TEXT DEFAULT 'Explore Our Work',
    twitter_url TEXT DEFAULT 'https://x.com/websmithlabs',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/company/websmithlabs',
    github_url TEXT DEFAULT 'https://github.com/websmithlabs',
    instagram_url TEXT DEFAULT 'https://instagram.com/websmithlabs',
    dribbble_url TEXT DEFAULT 'https://dribbble.com/websmithlabs',
    primary_bg_color TEXT DEFAULT '#0B0D12',
    primary_accent_color TEXT DEFAULT '#6366F1',
    secondary_accent_color TEXT DEFAULT '#8B5CF6',
    meta_title TEXT DEFAULT 'Web Smith Labs | Modern Websites, Web Applications & Digital Platforms',
    meta_description TEXT DEFAULT 'Web Smith Labs builds modern websites, custom web applications and high-impact digital experiences for businesses, startups and individuals.',
    footer_text TEXT DEFAULT 'Web Smith Labs is a full-service web engineering and digital solutions company. Delivering tailored websites, domain-less starter options, and custom web applications with 100% client code ownership.',
    razorpay_key_id TEXT DEFAULT 'rzp_test_wsl1024demo',
    razorpay_key_secret TEXT DEFAULT '',
    razorpay_webhook_secret TEXT DEFAULT '',
    razorpay_enabled BOOLEAN DEFAULT true,
    cashfree_app_id TEXT DEFAULT 'cf_app_sandbox_wsl8838',
    cashfree_secret_key TEXT DEFAULT '',
    cashfree_webhook_secret TEXT DEFAULT '',
    cashfree_mode TEXT DEFAULT 'sandbox',
    cashfree_enabled BOOLEAN DEFAULT true,
    default_payment_gateway TEXT DEFAULT 'customer_choice',
    enable_store BOOLEAN DEFAULT false,
    enable_maintenance BOOLEAN DEFAULT false,
    india_only_notice BOOLEAN DEFAULT true,
    currency_symbol TEXT DEFAULT '₹',
    gst_number TEXT DEFAULT '29ABCDE1234F1Z5',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Services
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    icon TEXT NOT NULL DEFAULT 'Globe',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Projects (Portfolio)
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Business Websites',
        'Custom Web Development',
        'Web Applications',
        'Product Websites',
        'Landing Pages',
        'Experimental Projects'
    )),
    client_name TEXT NOT NULL,
    summary TEXT NOT NULL,
    description TEXT NOT NULL,
    challenge TEXT,
    solution TEXT,
    results TEXT,
    thumbnail_url TEXT NOT NULL,
    screenshots JSONB NOT NULL DEFAULT '[]'::jsonb,
    technologies JSONB NOT NULL DEFAULT '[]'::jsonb,
    live_url TEXT,
    github_url TEXT,
    completion_date TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Inquiries (Contact and Start a Project form submissions)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    project_type TEXT NOT NULL,
    description TEXT NOT NULL,
    budget_range TEXT NOT NULL,
    timeframe TEXT NOT NULL,
    reference_websites TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'accepted', 'contacted', 'ongoing', 'finished', 'advance_payment_completed', 'payment_completed', 'archived')),
    admin_notes TEXT DEFAULT '',
    quote_notes TEXT DEFAULT '',
    advance_amount NUMERIC DEFAULT 0,
    total_amount NUMERIC DEFAULT 0,
    paid_amount NUMERIC DEFAULT 0,
    domain_preference TEXT DEFAULT '',
    cloud_preference TEXT DEFAULT '',
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Testimonials (Client Feedback)
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_name TEXT NOT NULL,
    role_title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    avatar_url TEXT,
    quote TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    project_type TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. FAQs
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'General',
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Payments (Razorpay & Cashfree Transactions)
CREATE TABLE IF NOT EXISTS public.payments (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    client_email TEXT NOT NULL,
    client_name TEXT NOT NULL,
    inquiry_id TEXT,
    product_id TEXT,
    subscription_id TEXT,
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    gateway TEXT NOT NULL CHECK (gateway IN ('razorpay', 'cashfree', 'demo', 'manual')),
    payment_id TEXT NOT NULL,
    order_id TEXT NOT NULL,
    payment_type TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'pending', 'failed', 'refunded')),
    invoice_number TEXT NOT NULL,
    notes TEXT,
    receipt_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Subscriptions (Maintenance Retainers)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    client_email TEXT NOT NULL,
    client_name TEXT NOT NULL,
    plan_slug TEXT NOT NULL,
    plan_name TEXT NOT NULL,
    billing_cycle TEXT NOT NULL DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'annual')),
    amount NUMERIC NOT NULL,
    currency TEXT NOT NULL DEFAULT 'INR',
    gateway TEXT NOT NULL DEFAULT 'razorpay',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'paused', 'past_due')),
    start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    next_billing_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Store Products (Ready-Made Websites & Turnkey Templates)
CREATE TABLE IF NOT EXISTS public.store_products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    tagline TEXT NOT NULL,
    category TEXT NOT NULL,
    price_inr NUMERIC NOT NULL,
    original_price_inr NUMERIC NOT NULL,
    price_usd NUMERIC NOT NULL,
    thumbnail_url TEXT NOT NULL,
    live_demo_url TEXT NOT NULL,
    tech_stack JSONB NOT NULL DEFAULT '[]'::jsonb,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    deliverables JSONB NOT NULL DEFAULT '[]'::jsonb,
    badge TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Collaboration Messages
CREATE TABLE IF NOT EXISTS public.collaboration_messages (
    id TEXT PRIMARY KEY,
    inquiry_id TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    sender_role TEXT NOT NULL DEFAULT 'client' CHECK (sender_role IN ('client', 'team')),
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    type TEXT NOT NULL DEFAULT 'message',
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Subscription Plans (Maintenance & Retainer Tiers)
CREATE TABLE IF NOT EXISTS public.subscription_plans (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    badge TEXT,
    monthly_price_inr NUMERIC NOT NULL,
    annual_price_inr NUMERIC NOT NULL,
    monthly_price_usd NUMERIC NOT NULL DEFAULT 0,
    annual_price_usd NUMERIC NOT NULL DEFAULT 0,
    description TEXT NOT NULL,
    features JSONB NOT NULL DEFAULT '[]'::jsonb,
    sla TEXT NOT NULL,
    support_channel TEXT NOT NULL,
    hours_included TEXT NOT NULL,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Safe Column Additions for Existing Databases
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS enable_store BOOLEAN DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS enable_maintenance BOOLEAN DEFAULT false;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS india_only_notice BOOLEAN DEFAULT true;
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS razorpay_key_secret TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS razorpay_webhook_secret TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cashfree_secret_key TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS cashfree_webhook_secret TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS default_payment_gateway TEXT DEFAULT 'customer_choice';

ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS quote_notes TEXT DEFAULT '';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS advance_amount NUMERIC DEFAULT 0;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS total_amount NUMERIC DEFAULT 0;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS paid_amount NUMERIC DEFAULT 0;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS domain_preference TEXT DEFAULT '';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS cloud_preference TEXT DEFAULT '';

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON public.projects(is_published, is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_payments_client ON public.payments(client_email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_client ON public.subscriptions(client_email, status);
CREATE INDEX IF NOT EXISTS idx_collab_inquiry ON public.collaboration_messages(inquiry_id, created_at ASC);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_slug ON public.subscription_plans(slug);

-- ==============================================================================
-- DATA API GRANTS
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

-- 12. SUBSCRIPTION PLANS POLICIES
DROP POLICY IF EXISTS "Public can view subscription plans" ON public.subscription_plans;
CREATE POLICY "Public can view subscription plans"
    ON public.subscription_plans FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can manage subscription plans" ON public.subscription_plans;
CREATE POLICY "Authenticated can manage subscription plans"
    ON public.subscription_plans FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 8. PAYMENTS POLICIES
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
CREATE POLICY "Users can view own payments"
    ON public.payments FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Public can record payments" ON public.payments;
CREATE POLICY "Public can record payments"
    ON public.payments FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- 9. SUBSCRIPTIONS POLICIES
DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
CREATE POLICY "Users can view own subscriptions"
    ON public.subscriptions FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Authenticated can manage subscriptions"
    ON public.subscriptions FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 10. STORE PRODUCTS POLICIES
DROP POLICY IF EXISTS "Public can view store products" ON public.store_products;
CREATE POLICY "Public can view store products"
    ON public.store_products FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can manage store products" ON public.store_products;
CREATE POLICY "Authenticated can manage store products"
    ON public.store_products FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 11. COLLABORATION POLICIES
DROP POLICY IF EXISTS "Public can exchange collaboration messages" ON public.collaboration_messages;
CREATE POLICY "Public can exchange collaboration messages"
    ON public.collaboration_messages FOR ALL
    TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- 1. PROFILES POLICIES
DROP POLICY IF EXISTS "Users can view own profile or admins view all" ON public.profiles;
CREATE POLICY "Users can view own profile or admins view all"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = id)
    WITH CHECK ((select auth.uid()) = id);

-- 2. SITE SETTINGS POLICIES
DROP POLICY IF EXISTS "Public can view site settings" ON public.site_settings;
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can update site settings" ON public.site_settings;
CREATE POLICY "Authenticated can update site settings"
    ON public.site_settings FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can insert site settings" ON public.site_settings;
CREATE POLICY "Authenticated can insert site settings"
    ON public.site_settings FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- 3. SERVICES POLICIES
DROP POLICY IF EXISTS "Public can view active services" ON public.services;
CREATE POLICY "Public can view active services"
    ON public.services FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can view all services" ON public.services;
CREATE POLICY "Authenticated can view all services"
    ON public.services FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can insert services" ON public.services;
CREATE POLICY "Authenticated can insert services"
    ON public.services FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update services" ON public.services;
CREATE POLICY "Authenticated can update services"
    ON public.services FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete services" ON public.services;
CREATE POLICY "Authenticated can delete services"
    ON public.services FOR DELETE
    TO authenticated
    USING (true);

-- 4. PROJECTS POLICIES
DROP POLICY IF EXISTS "Public can view published projects" ON public.projects;
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    TO anon, authenticated
    USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated can view all projects" ON public.projects;
CREATE POLICY "Authenticated can view all projects"
    ON public.projects FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can insert projects" ON public.projects;
CREATE POLICY "Authenticated can insert projects"
    ON public.projects FOR INSERT
    TO authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can update projects" ON public.projects;
CREATE POLICY "Authenticated can update projects"
    ON public.projects FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete projects" ON public.projects;
CREATE POLICY "Authenticated can delete projects"
    ON public.projects FOR DELETE
    TO authenticated
    USING (true);

-- 5. INQUIRIES POLICIES
DROP POLICY IF EXISTS "Public can submit inquiries" ON public.inquiries;
CREATE POLICY "Public can submit inquiries"
    ON public.inquiries FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can view inquiries" ON public.inquiries;
CREATE POLICY "Authenticated can view inquiries"
    ON public.inquiries FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can update inquiries" ON public.inquiries;
CREATE POLICY "Authenticated can update inquiries"
    ON public.inquiries FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated can delete inquiries" ON public.inquiries;
CREATE POLICY "Authenticated can delete inquiries"
    ON public.inquiries FOR DELETE
    TO authenticated
    USING (true);

-- 6. TESTIMONIALS POLICIES
DROP POLICY IF EXISTS "Public can view testimonials" ON public.testimonials;
CREATE POLICY "Public can view testimonials"
    ON public.testimonials FOR SELECT
    TO anon, authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can manage testimonials" ON public.testimonials;
CREATE POLICY "Authenticated can manage testimonials"
    ON public.testimonials FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. FAQS POLICIES
DROP POLICY IF EXISTS "Public can view active FAQs" ON public.faqs;
CREATE POLICY "Public can view active FAQs"
    ON public.faqs FOR SELECT
    TO anon, authenticated
    USING (is_active = true);

DROP POLICY IF EXISTS "Authenticated can view all FAQs" ON public.faqs;
CREATE POLICY "Authenticated can view all FAQs"
    ON public.faqs FOR SELECT
    TO authenticated
    USING (true);

DROP POLICY IF EXISTS "Authenticated can manage FAQs" ON public.faqs;
CREATE POLICY "Authenticated can manage FAQs"
    ON public.faqs FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
