'use client';

import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';

export default function CTASection() {
  const { isLoggedIn } = useAuth();

  return (
    <section className="bg-blue-600 text-white py-16 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-6">Ready to Secure Your Medical College?</h2>
        <p className="text-xl mb-8">Join thousands of NEET aspirants using our platform</p>
        {!isLoggedIn ? (
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            Get Started Free →
          </Link>
        ) : (
          <Link
            href="/dashboard"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100"
          >
            Go to Dashboard →
          </Link>
        )}
      </div>
    </section>
  );
}
