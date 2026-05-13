'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          🎯 Your Path to Medical Excellence
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-blue-100">
          Complete NEET Counseling & Preparation Hub - Predict Your College, Master Your Skills
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/college-predictor"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 flex items-center justify-center gap-2"
          >
            Start Predicting <ArrowRight size={20} />
          </Link>
          <Link
            href="/mock-tests"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-600"
          >
            Take Mock Test
          </Link>
        </div>
      </div>
    </section>
  );
}
