-- ==============================================================================
-- KINETIC STUDIO — SUPABASE DATABASE SCHEMA
-- Production-Ready Relational Setup with Row Level Security (RLS)
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
    company_name TEXT NOT NULL DEFAULT 'Kinetic Studio',
    short_name TEXT NOT NULL DEFAULT 'KS',
    tagline TEXT NOT NULL DEFAULT 'Turning Ideas Into Digital Experiences.',
    logo_url TEXT DEFAULT '',
    address TEXT DEFAULT 'Global Remote Studio / Bengaluru, India',
    contact_email TEXT DEFAULT 'hello@kineticstudio.co',
    phone_number TEXT DEFAULT '',
    whatsapp_number TEXT DEFAULT '',
    hero_badge TEXT DEFAULT 'INDEPENDENT DIGITAL STUDIO',
    hero_title TEXT DEFAULT 'Building Digital Experiences That Move Businesses Forward.',
    hero_description TEXT DEFAULT 'From business websites to custom digital platforms, Kinetic Studio transforms ideas into meaningful online experiences through thoughtful design and modern technology.',
    primary_cta_text TEXT DEFAULT 'Start a Project',
    secondary_cta_text TEXT DEFAULT 'Explore Our Work',
    twitter_url TEXT DEFAULT 'https://x.com/kineticstudio',
    linkedin_url TEXT DEFAULT 'https://linkedin.com/company/kineticstudio',
    github_url TEXT DEFAULT 'https://github.com/kineticstudio',
    instagram_url TEXT DEFAULT '',
    dribbble_url TEXT DEFAULT '',
    primary_bg_color TEXT DEFAULT '#0B0D12',
    primary_accent_color TEXT DEFAULT '#6366F1',
    secondary_accent_color TEXT DEFAULT '#8B5CF6',
    meta_title TEXT DEFAULT 'Kinetic Studio | Digital Experiences & Web Development',
    meta_description TEXT DEFAULT 'Kinetic Studio builds modern websites, custom web applications and digital experiences for businesses, startups and individuals.',
    footer_text TEXT DEFAULT 'Kinetic Studio is an independent technology and digital solutions company. Collaborating with select technology innovators including RadianForgeLabs.',
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

-- 6. Inquiries (Start a Project form submissions)
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
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_published_featured ON public.projects(is_published, is_featured, display_order);
CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active, display_order);

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

-- Helper function to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        auth.role() = 'authenticated' AND
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES POLICIES
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can update profiles"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

-- 2. SITE SETTINGS POLICIES
CREATE POLICY "Public can view site settings"
    ON public.site_settings FOR SELECT
    USING (true);

CREATE POLICY "Admins can update site settings"
    ON public.site_settings FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can insert site settings"
    ON public.site_settings FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- 3. SERVICES POLICIES
CREATE POLICY "Public can view active services"
    ON public.services FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can insert services"
    ON public.services FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update services"
    ON public.services FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete services"
    ON public.services FOR DELETE
    USING (auth.role() = 'authenticated');

-- 4. PROJECTS POLICIES
CREATE POLICY "Public can view published projects"
    ON public.projects FOR SELECT
    USING (is_published = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can insert projects"
    ON public.projects FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admins can update projects"
    ON public.projects FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete projects"
    ON public.projects FOR DELETE
    USING (auth.role() = 'authenticated');

-- 5. INQUIRIES POLICIES
-- Anyone can submit an inquiry
CREATE POLICY "Public can submit inquiries"
    ON public.inquiries FOR INSERT
    WITH CHECK (true);

-- Only authenticated users/admins can view and modify inquiries
CREATE POLICY "Admins can view inquiries"
    ON public.inquiries FOR SELECT
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can update inquiries"
    ON public.inquiries FOR UPDATE
    USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can delete inquiries"
    ON public.inquiries FOR DELETE
    USING (auth.role() = 'authenticated');

-- 6. TESTIMONIALS POLICIES
CREATE POLICY "Public can view testimonials"
    ON public.testimonials FOR SELECT
    USING (true);

CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    USING (auth.role() = 'authenticated');

-- 7. FAQS POLICIES
CREATE POLICY "Public can view active FAQs"
    ON public.faqs FOR SELECT
    USING (is_active = true OR auth.role() = 'authenticated');

CREATE POLICY "Admins can manage FAQs"
    ON public.faqs FOR ALL
    USING (auth.role() = 'authenticated');

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
        'admin' -- In initial deployment, signed-up users are granted admin access
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
