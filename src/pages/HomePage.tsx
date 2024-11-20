import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import { Hero } from '../components/Hero';
import { CareerAnalysisPreview } from '../components/CareerAnalysisPreview';
import { Loader } from 'lucide-react';

const Features = lazy(() => import('../components/Features').then(m => ({ default: m.Features })));
const Pricing = lazy(() => import('../components/Pricing').then(m => ({ default: m.Pricing })));
const Testimonials = lazy(() => import('../components/Testimonials').then(m => ({ default: m.Testimonials })));
const CallToAction = lazy(() => import('../components/CallToAction').then(m => ({ default: m.CallToAction })));

const SectionLoader = () => (
  <div className="py-24 flex items-center justify-center">
    <Loader className="w-8 h-8 animate-spin text-indigo-600" />
  </div>
);

export const HomePage = () => {
  return (
    <>
      <Helmet>
        <title>CareerMentor - AI-Powered Career Guidance</title>
        <meta name="description" content="Transform your career with AI-powered guidance. Get personalized career advice, skill recommendations, and mentorship from CareerMentorAI." />
        <meta name="keywords" content="career guidance, AI career advisor, professional development, career planning" />
        <link rel="canonical" href="https://careermentorai.org" />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "url": "https://careermentor.ai",
            "name": "CareerMentor",
            "description": "AI-powered career guidance platform",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://careermentorai.org/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>
      <Hero />
      <Suspense fallback={<SectionLoader />}>
        <Features />
      </Suspense>
      <CareerAnalysisPreview />
      <Suspense fallback={<SectionLoader />}>
        <Pricing />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<SectionLoader />}>
        <CallToAction />
      </Suspense>
    </>
  );
};