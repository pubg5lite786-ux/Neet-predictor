'use client';

import { useEffect, useState } from 'react';
import Header from '@/src/components/common/Header';
import Hero from '@/src/components/home/Hero';
import Features from '@/src/components/home/Features';
import AlertBar from '@/src/components/common/AlertBar';
import NewsSection from '@/src/components/home/NewsSection';
import CTASection from '@/src/components/home/CTASection';
import Footer from '@/src/components/common/Footer';

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <Header />
      <AlertBar />
      <Hero />
      <Features />
      <NewsSection />
      <CTASection />
      <Footer />
    </>
  );
}
