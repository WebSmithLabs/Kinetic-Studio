-- ==============================================================================
-- KINETIC STUDIO — SEED DATA
-- Default Studio Configuration, Services, Projects, FAQs & Sample Feedback
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
    'Kinetic Studio',
    'KS',
    'Turning Ideas Into Digital Experiences.',
    '',
    'Bengaluru, India / Global Remote Studio',
    'hello@kineticstudio.co',
    '+91 (0) 80 4820 1920',
    '+919876543210',
    'INDEPENDENT DIGITAL STUDIO',
    'Building Digital Experiences That Move Businesses Forward.',
    'From business websites to custom digital platforms, Kinetic Studio transforms ideas into meaningful online experiences through thoughtful design and modern technology.',
    'Start a Project',
    'Explore Our Work',
    'https://x.com/kineticstudio',
    'https://linkedin.com/company/kineticstudio',
    'https://github.com/kineticstudio',
    'https://instagram.com/kineticstudio',
    'https://dribbble.com/kineticstudio',
    '#0B0D12',
    '#6366F1',
    '#8B5CF6',
    'Kinetic Studio | Digital Experiences & Web Development',
    'Kinetic Studio builds modern websites, custom web applications and digital experiences for businesses, startups and individuals.',
    'Kinetic Studio is an independent technology and digital solutions company. Collaborating with select technology innovators including RadianForgeLabs.'
)
ON CONFLICT (id) DO UPDATE SET
    hero_title = EXCLUDED.hero_title,
    hero_description = EXCLUDED.hero_description,
    tagline = EXCLUDED.tagline;

-- 2. Insert Core Services
INSERT INTO public.services (slug, title, category, summary, description, deliverables, technologies, icon, display_order, is_active)
VALUES
(
    'business-websites',
    'Business Websites',
    'Web Architecture',
    'High-conversion corporate sites, local business presences, and brand portfolios built for credibility and discoverability.',
    'We craft high-performing websites tailored to offline businesses, local shops, professional practices, and corporate enterprises. Every site is engineered to communicate brand authority, load instantly, and turn visitors into qualified leads.',
    '["Corporate Brand Websites", "Local Shop & Offline Business Pages", "Executive Portfolios", "High-Converting Landing Pages", "Local SEO & Google Maps Sync", "CMS Integration"]'::jsonb,
    '["React", "Next.js", "Tailwind CSS", "Headless CMS", "SEO Engine"]'::jsonb,
    'Building2',
    1,
    true
),
(
    'custom-web-development',
    'Custom Web Development',
    'Engineering',
    'Bespoke web applications, interactive web tools, and full-stack platforms engineered from the ground up.',
    'When off-the-shelf templates limit your vision, we build custom web platforms with clean code, scalable architecture, and bespoke APIs. Designed to handle growth, real-time interactivity, and unique business workflows.',
    '["Interactive Web Applications", "Full-Stack Custom Platforms", "Third-Party API Integrations", "Secure Database Architecture", "Role-Based Access Control", "Microservices & Serverless Functions"]'::jsonb,
    '["TypeScript", "React", "Node.js", "Supabase", "PostgreSQL", "Cloudflare"]'::jsonb,
    'Code2',
    2,
    true
),
(
    'ui-ux-design',
    'UI/UX Design',
    'Design Systems',
    'Intuitive, visually arresting digital product interfaces guided by user research and design systems.',
    'User experience is the bridge between human emotion and digital technology. We conduct thorough user flow mapping, wireframing, interactive prototyping, and design system creation to deliver interfaces that are effortless and memorable.',
    '["User Flow Mapping & Wireframes", "Interactive High-Fidelity Prototypes", "Design System & Component Library", "Mobile-First UX Optimization", "Accessibility (WCAG 2.1 AA)", "Micro-Interactions & Motion Design"]'::jsonb,
    '["Figma", "Design Tokens", "Framer Motion", "Tailwind CSS"]'::jsonb,
    'Palette',
    3,
    true
),
(
    'product-showcase-websites',
    'Product Showcase Websites',
    'Product Launch',
    'Visually striking showcase experiences for software products, mobile apps, games, and technical platforms.',
    'Your product deserves an unveiling that captures imagination. We design immersive showcase experiences featuring 3D product previews, interactive feature tours, interactive documentation portals, and seamless download/signup flows.',
    '["Software Showcase Portals", "SaaS & Mobile App Landing Pages", "Game Showcase & Studio Sites", "Interactive Documentation Hubs", "Dynamic Feature Demos", "App Store & Web Checkout Links"]'::jsonb,
    '["React", "Canvas 2D/3D", "Tailwind CSS", "MDX Docs", "Vite"]'::jsonb,
    'Sparkles',
    4,
    true
),
(
    'digital-solutions',
    'Digital Solutions',
    'Digital Transformation',
    'Modernize operational workflows with internal dashboards, automation pipelines, and custom business tools.',
    'Empower your team with tailor-made digital tools. We build internal administrative portals, automated client onboarding pipelines, custom analytics dashboards, and system integrations that eliminate manual friction.',
    '["Custom Business Dashboards", "Workflow & CRM Automations", "Multi-System Data Sync", "Client Portals & Invoicing Tools", "Third-Party Webhook Handlers", "Real-Time Activity Telemetry"]'::jsonb,
    '["Supabase", "PostgreSQL", "REST/GraphQL", "Automation Webhooks", "TypeScript"]'::jsonb,
    'Cpu',
    5,
    true
),
(
    'website-maintenance',
    'Website Maintenance',
    'Support & Security',
    'Continuous performance monitoring, security hardening, content updates, and zero-downtime evolution.',
    'A digital presence is a living asset. Our maintenance partnerships provide proactive security patching, dependency upgrades, Lighthouse speed tuning, content updates, and disaster recovery so your team stays focused on business growth.',
    '["24/7 Uptime & Health Monitoring", "Core Web Vitals Speed Tuning", "Security Patches & Vulnerability Audits", "Scheduled Automated Backups", "Content & Feature Enhancements", "Dedicated Slack/Email Support"]'::jsonb,
    '["Edge CDN", "SSL/TLS Hardening", "Lighthouse CI", "Automated Backups"]'::jsonb,
    'ShieldCheck',
    6,
    true
)
ON CONFLICT (slug) DO NOTHING;

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
    'Real-time infrastructure monitoring dashboard & business intelligence interface',
    'Web Applications',
    'Apex Cloud Technologies (Showcase Project)',
    'A high-throughput telemetry platform designed to visualize multi-region server health, latency metrics, and automated alerts for engineering teams.',
    'Apex Cloud required a unified command center capable of visualizing 100k+ data points per second with sub-100ms UI latency. Kinetic Studio designed and built a sleek, dark-mode analytics platform utilizing virtualized tables, canvas charts, and WebSockets.',
    'Handling live high-frequency streaming events without UI frame drops, while maintaining intuitive navigation for non-technical stakeholders.',
    'Engineered an event-driven front end utilizing optimized canvas rendering, Web Workers for message processing, and an atomic design system.',
    'Reduced average incident triage time by 44% and achieved 60fps rendering even during high telemetry traffic spikes.',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80", "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "TypeScript", "Tailwind CSS", "Canvas Charts", "Supabase", "WebSockets"]'::jsonb,
    'https://apex-telemetry.example.com',
    'https://github.com/kineticstudio/apex-telemetry-demo',
    'October 2026',
    true,
    true,
    1
),
(
    'lumina-architectural-studio',
    'Lumina Architecture & Interiors',
    'Minimalist corporate identity and project showcase for an award-winning architecture firm',
    'Business Websites',
    'Lumina Architectural Atelier (Showcase Project)',
    'A serene, typography-focused editorial website crafted to exhibit luxury architectural masterworks, blueprint specifications, and client inquiries.',
    'Kinetic Studio designed an editorial digital portfolio that matches the physical elegance of Lumina’s structures. The experience integrates smooth page transitions, high-resolution media galleries with progressive image loading, and an interactive project index.',
    'Balancing full-bleed architectural photography with strict sub-second load times across mobile and desktop devices.',
    'Implemented next-generation image transcoding, blur-up placeholders, and a responsive grid system inspired by Swiss modernist typography.',
    'Client inquiry conversion rate surged by 65% in the first quarter post-launch, with international inquiries expanding twofold.',
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
    'Immersive product showcase and interactive audio plugin documentation',
    'Product Websites',
    'Vortex Sound Labs (Showcase Project)',
    'An interactive product showcase featuring live WebAudio frequency analyzers, 3D hardware rotators, and interactive preset auditions.',
    'Vortex needed a website that let prospective music producers experience sound quality directly in the browser before downloading the VST plugin suite.',
    'Rendering accurate real-time audio waveforms without audio glitching while loading sleek 3D models of studio equipment.',
    'Created a WebAudio API DSP engine combined with lightweight CSS 3D perspectives and interactive frequency modulation knobs.',
    'Over 12,000 preset auditions conducted in the first week, generating a 38% conversion to plugin trial downloads.',
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
    'High-energy landing page with kinetic typography and particle visualizer',
    'Landing Pages',
    'Nexus Compute Network (Showcase Project)',
    'A high-impact landing page tailored to introduce a distributed GPU compute protocol to AI engineers and node operators.',
    'Communicating complex distributed computing architecture in a clear, compelling visual narrative with interactive staking and computing calculators.',
    'Complex technical concepts required instant visual clarity and high engagement on mobile devices.',
    'Developed dynamic compute cost calculator widgets, interactive protocol architecture diagrams, and fluid scroll-linked animations.',
    'Achieved a 99/100 Google Lighthouse performance score and 4.2 minutes average session engagement.',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "Tailwind CSS", "Framer Motion", "Canvas VFX", "Lucide Icons"]'::jsonb,
    'https://nexus-compute.example.com',
    NULL,
    'June 2026',
    true,
    true,
    4
),
(
    'hyperion-quantum-sim',
    'Hyperion Quantum Simulator',
    'Interactive web-based circuit simulator and algorithmic visualization canvas',
    'Experimental Projects',
    'Kinetic Studio R&D Lab',
    'An exploratory experiment in browser-based quantum circuit composition, state vector sphere visualization, and gate sequencing.',
    'Pushing modern web browsers to the limit of mathematical visualization using interactive state-vector Bloch spheres and gate drag-and-drop mechanics.',
    'Real-time matrix transformations in client JavaScript without stalling the DOM render tree.',
    'Utilized WebAssembly and matrix caching to simulate up to 12 qubits in pure client-side browser runtime.',
    'Open-sourced to the developer community with 1,200+ GitHub stars and featured in web engineering compilations.',
    'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "TypeScript", "Canvas 2D", "Tailwind CSS", "WebAssembly"]'::jsonb,
    'https://hyperion.kineticstudio.co',
    'https://github.com/kineticstudio/hyperion-sim',
    'May 2026',
    false,
    true,
    5
),
(
    'solis-artisan-roasters',
    'Solis Artisan Coffee Collective',
    'E-commerce showcase & regional retail hub for a multi-location specialty roaster',
    'Business Websites',
    'Solis Specialty Coffee (Showcase Project)',
    'A rich, sensory web experience for a specialty coffee roaster featuring bean origins mapping, flavor notes selector, and local cafe finder.',
    'Merging brand storytelling with smooth wholesale and retail customer conversion paths.',
    'Creating a distinct sensory atmosphere with rapid checkout access and mobile ordering integration.',
    'Constructed interactive flavor profile wheel, subscription configurator, and location locator with operating hours status.',
    'Wholesale partner inquiries grew 80% within 60 days of launch.',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"]'::jsonb,
    '["React", "Tailwind CSS", "Headless Commerce", "Framer Motion"]'::jsonb,
    'https://soliscoffee.example.com',
    NULL,
    'April 2026',
    false,
    true,
    6
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Insert FAQs
INSERT INTO public.faqs (question, answer, category, display_order, is_active)
VALUES
(
    'What types of projects does Kinetic Studio take on?',
    'Kinetic Studio specializes in business websites, bespoke web applications, UI/UX design systems, product showcase websites, digital platforms, and ongoing maintenance. We collaborate with startups, established brands, independent businesses, and technical organizations.',
    'General',
    1,
    true
),
(
    'How does Kinetic Studio collaborate with RadianForgeLabs?',
    'Kinetic Studio is an independent studio. We maintain our own company identity, ownership, and operations. We collaborate with RadianForgeLabs as strategic technology partners on selected high-complexity technical engagements and specialized research initiatives.',
    'Company',
    2,
    true
),
(
    'What is your standard project timeline?',
    'Typical timelines vary by scope: a focused business website or high-impact landing page typically takes 2 to 4 weeks. Custom web platforms, complex interactive portals, or full design systems take between 6 to 12 weeks. Every project begins with a clear scope document and milestone calendar.',
    'Process',
    3,
    true
),
(
    'Do you provide ongoing maintenance and technical updates after launch?',
    'Yes. Every project includes a 30-day post-launch warranty period with proactive monitoring. Following that, we offer flexible website maintenance and retainer plans covering security updates, speed optimization, feature iterations, and regular backups.',
    'Services',
    4,
    true
),
(
    'Will our team be able to edit content without writing code?',
    'Absolutely. We integrate intuitive content management solutions (including Supabase, headless CMS, or customized admin dashboards) so your internal team can easily update copy, projects, blog entries, and media without engineering assistance.',
    'Technology',
    5,
    true
),
(
    'How do we initiate a project with Kinetic Studio?',
    'You can start by submitting our "Start a Project" inquiry form. We will review your goals, budget range, and timeline, then schedule an initial discovery consultation within 24 to 48 hours to outline technical direction and initial estimates.',
    'Process',
    6,
    true
)
ON CONFLICT DO NOTHING;

-- 5. Insert Sample Client Feedback (Identified as Sample Showcase)
INSERT INTO public.testimonials (client_name, role_title, company_name, avatar_url, quote, rating, project_type, is_featured, display_order)
VALUES
(
    'Marcus Vance',
    'Founder & VP of Product',
    'Apex Cloud Technologies (Showcase Partner)',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'Kinetic Studio delivered a digital command center that exceeded our technical expectations. Their attention to fluid interactions, sub-second data streaming, and refined typography gave our platform instant enterprise credibility.',
    5,
    'Web Application',
    true,
    1
),
(
    'Elena Rostova',
    'Principal Architect',
    'Lumina Architectural Atelier (Showcase Partner)',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    'Working with Kinetic Studio felt like collaborating with fellow craftsmen. They understood architectural proportion and translated it into a digital space that feels calm, tactile, and unforgettable.',
    5,
    'Business Website',
    true,
    2
),
(
    'David Chen',
    'Lead Audio Engineer',
    'Vortex Sound Labs (Showcase Partner)',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'The WebAudio integration and kinetic animations gave our plugin release momentum that a standard landing page could never achieve. Our launch numbers were double our initial forecast.',
    5,
    'Product Showcase',
    true,
    3
)
ON CONFLICT DO NOTHING;
