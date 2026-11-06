-- ==============================================================================
-- WEB SMITH LABS — SEED DATA
-- Default Studio Configuration, Core Services, Portfolio Projects, FAQs & Feedback
-- ==============================================================================

-- 1. Insert Initial Site Settings
INSERT INTO public.site_settings (
    id,
    company_name,
    short_name,
    tagline,
    logo_url,
    address,
    contact_email,
    phone_number,
    whatsapp_number,
    hero_badge,
    hero_title,
    hero_description,
    primary_cta_text,
    secondary_cta_text,
    twitter_url,
    linkedin_url,
    github_url,
    instagram_url,
    dribbble_url,
    primary_bg_color,
    primary_accent_color,
    secondary_accent_color,
    meta_title,
    meta_description,
    footer_text
) VALUES (
    'primary',
    'Web Smith Labs',
    'WSL',
    'Forging Digital Excellence Through Modern Web Engineering.',
    '',
    'Bengaluru, India / Global Remote Studio',
    'hello@websmithlabs.com',
    '+91 (0) 80 4820 1920',
    '+919876543210',
    'INDEPENDENT DIGITAL & WEB LAB',
    'Building High-Impact Web Experiences That Move Businesses Forward.',
    'From high-performance business websites to custom web applications and scalable digital solutions, Web Smith Labs transforms ideas into digital reality through modern engineering.',
    'Start a Project',
    'Explore Our Work',
    'https://x.com/websmithlabs',
    'https://linkedin.com/company/websmithlabs',
    'https://github.com/websmithlabs',
    'https://instagram.com/websmithlabs',
    'https://dribbble.com/websmithlabs',
    '#0B0D12',
    '#6366F1',
    '#8B5CF6',
    'Web Smith Labs | Modern Websites, Web Applications & Digital Platforms',
    'Web Smith Labs builds modern websites, custom web applications and high-impact digital experiences for businesses, startups and individuals.',
    'Web Smith Labs is an independent digital engineering and web technology company. Collaborating with select technology innovators.'
)
ON CONFLICT (id) DO UPDATE SET
    company_name = EXCLUDED.company_name,
    short_name = EXCLUDED.short_name,
    hero_title = EXCLUDED.hero_title,
    hero_description = EXCLUDED.hero_description,
    tagline = EXCLUDED.tagline,
    contact_email = EXCLUDED.contact_email;

-- 2. Insert Core Services
INSERT INTO public.services (slug, title, category, summary, description, deliverables, technologies, icon, display_order, is_active)
VALUES
(
    'business-websites',
    'Business Websites',
    'Web Architecture',
    'High-performance websites and portfolios designed to establish authority and convert visitors into clients.',
    'We craft high-performing websites tailored to offline businesses, local shops, and corporate enterprises. Every site is engineered to load instantly, look exceptional, and turn visitors into qualified leads.',
    '["Websites for local businesses & shops", "Corporate websites with executive polish", "Business portfolios & brand showcases", "High-converting landing pages", "Local search discovery & SEO", "Self-serve content management (CMS)"]'::jsonb,
    '["React", "Next.js", "Tailwind CSS", "Headless CMS", "Modern SEO"]'::jsonb,
    'Building2',
    1,
    true
),
(
    'custom-web-development',
    'Custom Web Development',
    'Full-Stack Engineering',
    'Tailored web applications and platforms built with clean code and modern full-stack architectures.',
    'When off-the-shelf templates limit your vision, we build custom web platforms with clean code, scalable architecture, and bespoke APIs designed to handle growth and real-time interactivity.',
    '["Custom-designed web architectures", "Interactive web applications & portals", "Responsive multi-device platforms", "Custom functionality & API integrations", "Database modeling & role-based auth", "Edge deployment & serverless functions"]'::jsonb,
    '["TypeScript", "React", "Node.js", "Supabase", "PostgreSQL", "Cloudflare"]'::jsonb,
    'Code2',
    2,
    true
),
(
    'ui-ux-design',
    'UI/UX Design',
    'Design Systems',
    'Intuitive user interfaces, scalable design systems, and fluid micro-interactions tailored to your brand.',
    'User experience is the bridge between human emotion and digital technology. We craft intuitive flows, wireframes, prototypes, and design systems that make complex software feel effortless.',
    '["Website interface design (UI)", "User experience optimization (UX)", "Interactive wireframing & prototyping", "Responsive design systems & token libraries", "Accessibility auditing (WCAG AA)", "Fluid micro-interactions & motion design"]'::jsonb,
    '["Figma", "Design Tokens", "Framer Motion", "Tailwind CSS"]'::jsonb,
    'Palette',
    3,
    true
),
(
    'product-showcase-websites',
    'Product Showcase Websites',
    'Product Launch',
    'Immersive showcase experiences and landing pages for software products, apps, and games.',
    'Your product deserves an unveiling that captures imagination. We design immersive showcase experiences featuring 3D product previews, interactive feature tours, and seamless conversion funnels.',
    '["Software showcase websites", "App landing pages with conversion funnels", "Game showcase & studio sites", "Interactive documentation portals", "Live in-browser feature previews", "Checkout & store integration"]'::jsonb,
    '["React", "Canvas 2D/3D", "Tailwind CSS", "MDX Docs", "Vite"]'::jsonb,
    'Sparkles',
    4,
    true
),
(
    'digital-solutions',
    'Digital Solutions',
    'Transformation',
    'Custom internal tools, dashboards, and automated workflows that streamline your operations.',
    'Empower your team with tailor-made digital tools. We build internal administrative portals, automated client onboarding pipelines, custom dashboards, and system integrations.',
    '["Business digital transformation roadmaps", "Third-party website & SaaS integrations", "Custom internal analytics dashboards", "Process automation & webhook orchestrations", "Client onboarding portals", "Real-time metrics & reporting pipelines"]'::jsonb,
    '["Supabase", "PostgreSQL", "REST/GraphQL", "Automation Webhooks", "TypeScript"]'::jsonb,
    'Cpu',
    5,
    true
),
(
    'website-maintenance',
    'Website Maintenance',
    'Support & Security',
    'Continuous updates, speed optimization, and security support to keep your site at peak performance.',
    'A digital presence is a living asset. Our maintenance partnerships provide proactive security patching, dependency upgrades, speed tuning, and ongoing support so your team can focus on growth.',
    '["Continuous updates and improvements", "Rapid bug fixes and troubleshooting", "Core Web Vitals & performance optimization", "Security patches, SSL & maintenance support", "Automated off-site database backups", "Direct developer emergency channel"]'::jsonb,
    '["Edge CDN", "SSL/TLS Hardening", "Lighthouse CI", "Automated Backups"]'::jsonb,
    'ShieldCheck',
    6,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description,
    deliverables = EXCLUDED.deliverables,
    technologies = EXCLUDED.technologies;

-- 3. Insert Portfolio Projects
INSERT INTO public.projects (
    slug,
    title,
    subtitle,
    category,
    client_name,
    summary,
    description,
    challenge,
    solution,
    results,
    thumbnail_url,
    screenshots,
    technologies,
    live_url,
    github_url,
    completion_date,
    is_featured,
    is_published,
    display_order
)
VALUES
(
    'apex-cloud-analytics',
    'Apex Cloud Telemetry Platform',
    'Real-time multi-region infrastructure telemetry & intelligence dashboard',
    'Web Applications',
    'Apex Cloud',
    'High-throughput telemetry platform visualizing multi-region server health and latency metrics with sub-second performance.',
    'Apex Cloud required a unified command center capable of visualizing 100k+ data points per second with sub-100ms UI latency. Web Smith Labs built a sleek analytics platform utilizing virtualized tables, canvas charts, and WebSockets.',
    'Streaming high-frequency live events without UI frame drops.',
    'Engineered an event-driven front end utilizing optimized canvas rendering, Web Workers, and an atomic design system.',
    'Reduced incident triage time by 44% with stable 60fps rendering.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "TypeScript", "Tailwind CSS", "Canvas Charts", "Supabase", "WebSockets"]'::jsonb,
    'https://apex-telemetry.example.com',
    'https://github.com/websmithlabs/apex-telemetry-demo',
    'October 2026',
    true,
    true,
    1
),
(
    'lumina-architectural-studio',
    'Lumina Architecture & Interiors',
    'Minimalist corporate identity and project showcase for an architecture atelier',
    'Business Websites',
    'Lumina Atelier',
    'Serene, typography-focused editorial website crafted to exhibit luxury architectural masterworks and specifications.',
    'Web Smith Labs designed an editorial digital portfolio that matches the physical elegance of Lumina’s structures, integrating smooth page transitions and progressive image loading.',
    'Balancing full-bleed architectural photography with strict sub-second load times.',
    'Implemented modern image transcoding, blur-up placeholders, and a responsive Swiss-modern grid system.',
    'Client inquiry conversion rate surged by 65% in the first quarter post-launch.',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "Framer Motion", "Tailwind CSS", "Edge CDN", "Responsive Typography"]'::jsonb,
    'https://lumina-architects.example.com',
    NULL,
    'August 2026',
    true,
    true,
    2
),
(
    'vortex-audio-engine',
    'Vortex DSP & Spatial Audio Suite',
    'Interactive product showcase and audio plugin demonstration portal',
    'Product Websites',
    'Vortex Sound',
    'Interactive product showcase featuring live WebAudio frequency analyzers, 3D rotators, and sound auditions.',
    'Vortex needed a website that allowed prospective music producers to experience sound quality directly in the browser before downloading the plugin suite.',
    'Rendering accurate real-time audio waveforms without audio glitching.',
    'Created a WebAudio API DSP engine combined with lightweight CSS 3D perspectives and interactive frequency knobs.',
    'Over 12,000 preset auditions conducted in the first week, generating a 38% conversion to plugin trials.',
    'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "WebAudio API", "TypeScript", "Tailwind CSS", "Framer Motion"]'::jsonb,
    'https://vortex-sound.example.com',
    NULL,
    'July 2026',
    true,
    true,
    3
),
(
    'nexus-protocol-landing',
    'Nexus Decentralized Computing',
    'High-energy landing page with kinetic typography and particle compute visualizer',
    'Landing Pages',
    'Nexus Network',
    'High-impact landing page introducing a distributed compute protocol to developers and node operators.',
    'Communicating complex distributed computing architecture in a clear, compelling visual narrative with interactive calculators.',
    'Presenting complex technical concepts with instant visual clarity on mobile devices.',
    'Developed dynamic compute cost calculators, interactive protocol diagrams, and fluid scroll animations.',
    'Achieved a 99/100 Google Lighthouse score and 4.2 minutes average session engagement.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "Tailwind CSS", "Framer Motion", "Canvas VFX", "Lucide Icons"]'::jsonb,
    'https://nexus-compute.example.com',
    NULL,
    'June 2026',
    true,
    true,
    4
)
ON CONFLICT (slug) DO UPDATE SET
    title = EXCLUDED.title,
    subtitle = EXCLUDED.subtitle,
    summary = EXCLUDED.summary,
    description = EXCLUDED.description;

-- 4. Insert FAQs
INSERT INTO public.faqs (question, answer, category, display_order, is_active)
VALUES
(
    'What types of projects does Web Smith Labs take on?',
    'We build high-performance business websites, custom full-stack web applications, design systems, product showcases, and scalable digital solutions for businesses, startups, and creators.',
    'General',
    1,
    true
),
(
    'Is Web Smith Labs an independent studio?',
    'Yes. Web Smith Labs operates as an independent web engineering and digital design lab. We maintain direct client engagements and technical ownership while collaborating with select technical partners on specialized initiatives.',
    'Company',
    2,
    true
),
(
    'What is your typical project timeline?',
    'Landing pages and business websites typically launch in 2 to 4 weeks. Custom web platforms and complex applications usually take 6 to 10 weeks.',
    'Process',
    3,
    true
),
(
    'Do you offer ongoing maintenance and support?',
    'Yes. Every project includes a 30-day post-launch warranty, with optional ongoing maintenance for security, performance, updates, and cloud telemetry.',
    'Services',
    4,
    true
),
(
    'Can our team update content independently?',
    'Yes. We provide easy-to-use content management tools and an intuitive admin dashboard connected directly to Supabase so you can update copy, images, and projects in real time without writing code.',
    'Technology',
    5,
    true
),
(
    'How do we get started?',
    'Submit a brief via our "Start a Project" form. We review your goals and respond within 24 to 48 hours to schedule an introductory discovery session.',
    'Process',
    6,
    true
);

-- 5. Insert Testimonials
INSERT INTO public.testimonials (client_name, role_title, company_name, avatar_url, quote, rating, project_type, is_featured, display_order)
VALUES
(
    'Marcus Vance',
    'VP of Product',
    'Apex Cloud',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'Web Smith Labs delivered an exceptional telemetry platform. Their speed, eye for design, and engineering precision gave our product instant enterprise credibility.',
    5,
    'Web Application',
    true,
    1
),
(
    'Elena Rostova',
    'Principal Architect',
    'Lumina Atelier',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    'They translated our architectural philosophy into a digital space that feels calm, tactile, and beautifully proportioned.',
    5,
    'Business Website',
    true,
    2
),
(
    'David Chen',
    'Lead Audio Engineer',
    'Vortex Sound',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'The interactive WebAudio demos and smooth animations doubled our expected launch conversion rate.',
    5,
    'Product Showcase',
    true,
    3
);
