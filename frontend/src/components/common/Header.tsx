'use client';

import Link from 'next/link';
import { useAuth } from '@/src/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const { isLoggedIn, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            🏥 NEET Predictor
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 items-center">
            <Link href="/college-predictor" className="text-gray-700 hover:text-blue-600">
              Predictor
            </Link>
            <Link href="/mock-tests" className="text-gray-700 hover:text-blue-600">
              Mock Tests
            </Link>
            <Link href="/forum" className="text-gray-700 hover:text-blue-600">
              Forum
            </Link>
            <Link href="/cutoff-data" className="text-gray-700 hover:text-blue-600">
              Cut-offs
            </Link>

            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  {user?.name}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden pb-4 flex flex-col gap-2">
            <Link href="/college-predictor" className="text-gray-700 py-2">
              Predictor
            </Link>
            <Link href="/mock-tests" className="text-gray-700 py-2">
              Mock Tests
            </Link>
            <Link href="/forum" className="text-gray-700 py-2">
              Forum
            </Link>
            <Link href="/cutoff-data" className="text-gray-700 py-2">
              Cut-offs
            </Link>
            {!isLoggedIn && (
              <>
                <Link href="/login" className="text-gray-700 py-2">
                  Login
                </Link>
                <Link href="/signup" className="bg-blue-600 text-white px-4 py-2 rounded">
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
