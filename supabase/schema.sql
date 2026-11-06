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
    hero_badge TEXT DEFAULT 'INDEPENDENT DIGITAL & WEB LAB',
    hero_title TEXT DEFAULT 'Building High-Impact Web Experiences That Move Businesses Forward.',
    hero_description TEXT DEFAULT 'From high-performance business websites to custom web applications and scalable digital solutions, Web Smith Labs transforms ideas into digital reality through modern engineering.',
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
    footer_text TEXT DEFAULT 'Web Smith Labs is an independent digital engineering and web technology company. Collaborating with select technology innovators.',
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
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'contacted', 'converted', 'archived')),
    admin_notes TEXT DEFAULT '',
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

-- ==============================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON public.projects(is_published, is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active, display_order);

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
