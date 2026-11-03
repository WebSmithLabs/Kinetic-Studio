# Kinetic Studio — Official Company Website

> **Turning Ideas Into Digital Experiences.**

Kinetic Studio (KS) is an independent technology and digital solutions studio specializing in business websites, bespoke web applications, UI/UX design systems, product showcase experiences, and enterprise digital solutions.

This repository contains the complete, modern, production-grade website for Kinetic Studio, built with React, TypeScript, Tailwind CSS, and a turnkey Supabase PostgreSQL backend with Row Level Security (RLS).

---

## 🚀 Live Demo & Core Pages

| Page | Route | Description |
| :--- | :--- | :--- |
| **Home** | `/` | Kinetic Hero Canvas, Collaboration highlights, Services Overview, Featured Projects, Process Timeline, Tech Stack, Testimonials, FAQ, Contact CTA |
| **Services** | `/services` | In-depth breakdown of all 6 core practices, deliverables, tech stacks, and direct commission triggers |
| **Our Work** | `/work` | Dynamic portfolio with category filters (Business, Web Apps, Product, Landing Pages, Experiments) & search |
| **Case Study** | `/work/:slug` | Project detail page with executive challenge, solution architecture, metrics, interface gallery, and live links |
| **About Us** | `/about` | Studio philosophy, mission, vision, 6 core values, and our independent partnership model with RadianForgeLabs |
| **Start a Project** | `/start-project` | Multi-step interactive project inquiry planner with real-time validation, budget selector, and DB submission |
| **Contact** | `/contact` | Direct communication channels, working hours, headquarters, and interactive contact form |
| **Admin Portal** | `/admin` | Complete secure administrative dashboard for managing projects, inquiries, site settings, services, FAQs, and testimonials |
| **Legal** | `/privacy-policy`, `/terms` | Professional legal policies & governance |

---

## 🎨 Design System & Visual Identity

* **Design Personality**: Modern, creative, minimal, technology-oriented with kinetic motion dynamics.
* **Dark Theme Palette**:
  * Primary Background: `#0B0D12`
  * Secondary Background: `#121620`
  * Card Background: `rgba(18, 22, 32, 0.7)`
  * Primary Accent: `#6366F1` (Indigo)
  * Secondary Accent: `#8B5CF6` (Violet)
  * Text Colors: `#FFFFFF` (Primary), `#A1A1AA` (Secondary)
  * Borders: `#252A36`
* **Light Theme Palette**:
  * Background: `#FFFFFF`
  * Secondary Background: `#F5F6FA`
  * Primary Text: `#171923`
  * Secondary Text: `#64748B`
  * Primary Accent: `#4F46E5`
* **Typography**: Clean geometric typography using *Plus Jakarta Sans* and *JetBrains Mono*.
* **Logo**: Minimalist Kinetic Studio wordmark with an original geometric `KS` shield monogram (no generic AI/robot icons).

---

## ⚡ Tech Stack

* **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Framer Motion
* **Visuals & Motion**: HTML5 Kinetic Canvas VFX, Lucide Icons, Canvas Confetti
* **Routing**: React Router DOM (v7) with route-level code splitting & lazy loading
* **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS) & Auth
* **SEO**: Dynamic title tags, meta descriptions, Open Graph, Twitter cards, canonical tags, `robots.txt`, and `sitemap.xml`

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🗄️ Supabase Database Setup

When you are ready to connect your Supabase database:

### 1. Create a Project on Supabase
1. Go to [supabase.com](https://supabase.com) and create a project named **Kinetic Studio**.
2. Note your **Project URL** and **Anon Public Key** in **Project Settings -> API**.

### 2. Run Database Schema & Seed
1. Open the **SQL Editor** in your Supabase Dashboard.
2. Copy the entire contents of [`supabase/schema.sql`](supabase/schema.sql) and click **Run**. This creates:
   * `profiles` (with automatic admin profile trigger)
   * `site_settings` (central company configuration)
   * `services` (6 core practices)
   * `projects` (portfolio items with challenge/solution/results)
   * `inquiries` (secure form submissions with RLS)
   * `testimonials` (client reviews)
   * `faqs` (frequently asked questions)
   * Complete Row Level Security policies (public can read published projects, public can submit inquiries, authenticated admins have full CRUD).
3. Copy the contents of [`supabase/seed.sql`](supabase/seed.sql) and click **Run** to populate initial studio content.

### 3. Configure Local Environment
Create a `.env.local` file in the root workspace:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here
```
Restart the dev server. The application will automatically detect your Supabase instance and sync directly!

> **Note**: Even before entering Supabase credentials, the website runs smoothly in **Preview Storage Mode** using local persistence, allowing you to test all client interactions and admin features immediately!

---

## 🛡️ Admin Dashboard (`/admin`)

* **URL**: [http://localhost:5173/admin](http://localhost:5173/admin)
* **Initial Demo Login**:
  * Email: `admin@kineticstudio.co`
  * Password: `KineticStudio2026!`
  *(Or click "Instant Sign-In with Demo Credentials" button on the login screen)*

### Admin Features:
1. **Overview**: Live metrics for Total Projects, Published Projects, New Inquiries, and Pending Pipeline.
2. **Projects**:
   * Add new projects with custom slugs, categories, thumbnails, screenshots, and case study narrative.
   * Edit existing projects.
   * Toggle Published / Draft status.
   * Toggle Featured status.
   * Delete projects with confirmation.
3. **Inquiries**:
   * Review all client project inquiries with scope, budget, and timeframe details.
   * Update inquiry status (`new`, `reviewing`, `contacted`, `converted`, `archived`).
   * Add internal team notes.
   * Filter and search inquiries.
4. **Website Settings**:
   * Company name, short name, tagline, address.
   * Contact email, phone, and WhatsApp numbers.
   * Social media links (X/Twitter, LinkedIn, GitHub, Instagram, Dribbble).
   * Hero section badge, main title, supporting description, and CTA buttons.
   * SEO meta titles, descriptions, and footer notices.
5. **Content Manager**:
   * Services manager (toggle active, view deliverables).
   * FAQ manager (add, edit, toggle active, delete).
   * Testimonials manager (add, edit, toggle featured, delete).
6. **Supabase Setup Hub**:
   * Real-time connection status.
   * Quick setup guide and `.env.local` reference.

---

## 🌐 Production Deployment

The project is built to deploy seamlessly to **Cloudflare Pages**, **Vercel**, or **Netlify**:

### Deploying to Cloudflare Pages:
1. Connect your GitHub repository.
2. Build command: `npm run build`
3. Build output directory: `dist`
4. Add environment variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the Cloudflare dashboard.

---

&copy; 2026 **Kinetic Studio**. Independent Technology &amp; Digital Solutions Studio.
