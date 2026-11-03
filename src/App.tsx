import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { StudioProvider } from './context/StudioContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Eager load Home for instant First Contentful Paint
import { HomePage } from './pages/HomePage';

// Lazy load secondary routes for optimal bundle code-splitting
const ServicesPage = lazy(() =>
  import('./pages/ServicesPage').then(m => ({ default: m.ServicesPage }))
);
const WorkPage = lazy(() =>
  import('./pages/WorkPage').then(m => ({ default: m.WorkPage }))
);
const ProjectDetailPage = lazy(() =>
  import('./pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage }))
);
const AboutPage = lazy(() =>
  import('./pages/AboutPage').then(m => ({ default: m.AboutPage }))
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then(m => ({ default: m.ContactPage }))
);
const StartProjectPage = lazy(() =>
  import('./pages/StartProjectPage').then(m => ({ default: m.StartProjectPage }))
);
const PrivacyPolicyPage = lazy(() =>
  import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() =>
  import('./pages/TermsPage').then(m => ({ default: m.TermsPage }))
);
const AdminDashboard = lazy(() =>
  import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard }))
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
);

const AppLayout: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-[#0B0D12] dark:bg-[#0B0D12] light:bg-[#FAFAFC] text-white dark:text-white light:text-slate-900 transition-colors">
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/work" element={<WorkPage />} />
            <Route path="/work/:slug" element={<ProjectDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/start-project" element={<StartProjectPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </div>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <StudioProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </StudioProvider>
  );
}
