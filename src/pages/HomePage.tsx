import React from 'react';
import { SEO } from '../components/common/SEO';
import { HeroSection } from '../components/home/HeroSection';
import { CollaborationBanner } from '../components/home/CollaborationBanner';
import { ServicesOverview } from '../components/home/ServicesOverview';
import { FeaturedProjects } from '../components/home/FeaturedProjects';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { DevelopmentProcess } from '../components/home/DevelopmentProcess';
import { TechStackSection } from '../components/home/TechStackSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { FaqSection } from '../components/home/FaqSection';
import { ContactCtaBanner } from '../components/home/ContactCtaBanner';
import { useStudio } from '../context/StudioContext';

export const HomePage: React.FC = () => {
  const { settings } = useStudio();

  return (
    <>
      <SEO
        title={settings.company_name}
        description={settings.meta_description}
        canonical="https://websmithlabs.com/"
      />

      <main className="w-full">
        {/* Hero Section */}
        <HeroSection />

        {/* Independence & Strategic Collaboration Banner */}
        <CollaborationBanner />

        {/* Services Overview */}
        <ServicesOverview />

        {/* Featured Projects Portfolio */}
        <FeaturedProjects />

        {/* Why Choose Web Smith Labs */}
        <WhyChooseUs />

        {/* 6-Stage Development Process */}
        <DevelopmentProcess />

        {/* Modern Technologies & Tools */}
        <TechStackSection />

        {/* Client Testimonials (Clearly Identified Showcase) */}
        <TestimonialsSection />

        {/* Interactive FAQ Accordion */}
        <FaqSection />

        {/* Bottom Contact CTA */}
        <ContactCtaBanner />
      </main>
    </>
  );
};
