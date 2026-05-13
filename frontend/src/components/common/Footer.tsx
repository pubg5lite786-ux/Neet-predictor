'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">🏥 NEET Predictor</h3>
            <p className="text-sm">Your complete guide to NEET counseling and medical college admission.</p>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white font-bold mb-4">Features</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/college-predictor" className="hover:text-white">College Predictor</Link></li>
              <li><Link href="/mock-tests" className="hover:text-white">Mock Tests</Link></li>
              <li><Link href="/forum" className="hover:text-white">Forum</Link></li>
              <li><Link href="/cutoff-data" className="hover:text-white">Cut-off Data</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-bold mb-4">Follow Us</h4>
            <div className="space-y-2 text-sm">
              <p>📧 <a href="mailto:support@neetpredictor.com" className="hover:text-white">support@neetpredictor.com</a></p>
              <p>📞 +91-XXXX-XXXXXX</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>&copy; 2026 NEET Predictor. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
