import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUp,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import {
  TwitterIcon,
  GithubIcon,
  LinkedinIcon,
  InstagramIcon,
  DribbbleIcon,
} from '../common/SocialIcons';
import { useStudio } from '../../context/StudioContext';

export const Footer: React.FC = () => {
  const { settings } = useStudio();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#08090D] dark:bg-[#08090D] light:bg-slate-50 transition-colors">
      {/* Decorative ambient gradient backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-5xl h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          {/* Col 1 & 2: Brand & Positioning */}
          <div className="lg:col-span-2 space-y-5">
            <Logo size="md" />
            <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 text-sm leading-relaxed max-w-md">
              An independent creative technology and digital solutions studio. We transform ideas into
              meaningful digital experiences through modern engineering, bespoke design, and scalable architecture.
            </p>

            {/* Studio Availability Status Indicator */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Available for selected projects</span>
            </div>

            {/* Contact details */}
            <div className="space-y-2 text-xs text-zinc-400 dark:text-zinc-400 light:text-slate-600 pt-2">
              {settings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-indigo-400" />
                  <a
                    href={`mailto:${settings.contact_email}`}
                    className="hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                  >
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings.phone_number && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{settings.phone_number}</span>
                </div>
              )}
              {settings.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{settings.address}</span>
                </div>
              )}
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {settings.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="Kinetic Studio on X (Twitter)"
                >
                  <TwitterIcon className="w-4 h-4" />
                </a>
              )}
              {settings.linkedin_url && (
                <a
                  href={settings.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="Kinetic Studio on LinkedIn"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
              )}
              {settings.github_url && (
                <a
                  href={settings.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="Kinetic Studio on GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
              )}
              {settings.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="Kinetic Studio on Instagram"
                >
                  <InstagramIcon className="w-4 h-4" />
                </a>
              )}
              {settings.dribbble_url && (
                <a
                  href={settings.dribbble_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620] dark:bg-[#121620] light:bg-white text-zinc-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-colors"
                  aria-label="Kinetic Studio on Dribbble"
                >
                  <DribbbleIcon className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 3: Studio Links */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 dark:text-zinc-300 light:text-slate-800 mb-4">
              Studio
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/work"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Our Work
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/start-project"
                  className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
                >
                  Start a Project &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Services */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 dark:text-zinc-300 light:text-slate-800 mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  to="/services#business-websites"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Business Websites
                </Link>
              </li>
              <li>
                <Link
                  to="/services#custom-web-development"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Custom Web Development
                </Link>
              </li>
              <li>
                <Link
                  to="/services#ui-ux-design"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  UI/UX Design
                </Link>
              </li>
              <li>
                <Link
                  to="/services#product-showcase-websites"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Product Showcase Sites
                </Link>
              </li>
              <li>
                <Link
                  to="/services#digital-solutions"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Digital Solutions
                </Link>
              </li>
              <li>
                <Link
                  to="/services#website-maintenance"
                  className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
                >
                  Website Maintenance
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Independent Relationship & Admin */}
          <div>
            <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 dark:text-zinc-300 light:text-slate-800 mb-4">
              Partnership & Governance
            </h4>
            <div className="p-3.5 rounded-xl border border-[#252A36] dark:border-[#252A36] light:border-slate-200 bg-[#121620]/60 dark:bg-[#121620]/60 light:bg-white text-xs space-y-2.5">
              <div className="flex items-center gap-1.5 text-zinc-200 dark:text-zinc-200 light:text-slate-800 font-semibold">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Independent Studio</span>
              </div>
              <p className="text-zinc-400 dark:text-zinc-400 light:text-slate-600 leading-relaxed text-[11px]">
                Kinetic Studio is an independent technology company. We collaborate with select technology partners,
                including RadianForgeLabs, on specialized technical engagements.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 space-y-2 text-xs">
              <Link
                to="/privacy-policy"
                className="block text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="block text-zinc-400 dark:text-zinc-400 light:text-slate-600 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
              >
                Terms and Conditions
              </Link>
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 text-zinc-500 hover:text-zinc-300 transition-colors pt-1"
              >
                <Shield className="w-3 h-3" />
                <span>Studio Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#252A36] dark:border-[#252A36] light:border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-500 light:text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} {settings.company_name} (KS). All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>Bengaluru &bull; Global Remote</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 hover:text-white dark:hover:text-white light:hover:text-slate-900 transition-colors"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
