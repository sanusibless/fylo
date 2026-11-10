import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Menu, X, ArrowRight, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import useAuth from "@/hooks/use-auth";

interface HomeLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function HomeLayout({ title, children }: HomeLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1523] text-white selection:bg-teal-400 selection:text-slate-900 font-sans">
      <Head title={title} />

      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0b1523]/95 backdrop-blur border-b border-slate-800/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <img
                  src="/images/logo.svg"
                  alt="Fylo Logo"
                  className="h-9 w-auto transition-transform group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <Link href="/" className="text-gray-300 hover:text-white transition">
                Home
              </Link>
              <Link href="/features" className="text-gray-300 hover:text-white transition">
                Features
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition">
                Pricing
              </Link>
              <Link href="/faqs" className="text-gray-300 hover:text-white transition">
                FAQs
              </Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition">
                Contact
              </Link>
            </nav>

            {/* Desktop Auth CTAs */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-teal-500/20 transition-all"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-300 hover:text-white text-sm font-medium px-4 py-2 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex items-center space-x-1.5 bg-gradient-to-r from-teal-400 to-blue-500 hover:from-teal-300 hover:to-blue-400 text-slate-950 font-semibold text-sm px-5 py-2.5 rounded-full shadow-md shadow-teal-500/20 transition-all"
                  >
                    <span>Get Started Free</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <div className="flex md:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-slate-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0b1523] border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
            >
              Home
            </Link>
            <Link
              href="/features"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
            >
              Pricing
            </Link>
            <Link
              href="/faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
            >
              FAQs
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-200 hover:bg-slate-800"
            >
              Contact
            </Link>

            <div className="pt-4 border-t border-slate-800 flex flex-col space-y-2">
              {user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-semibold px-4 py-2.5 rounded-lg"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center text-gray-200 hover:bg-slate-800 border border-slate-700 font-medium px-4 py-2.5 rounded-lg"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center bg-gradient-to-r from-teal-400 to-blue-500 text-slate-950 font-semibold px-4 py-2.5 rounded-lg shadow-md"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-[#0b1523] border-t border-slate-800/80 text-gray-400 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-block">
                <img src="/images/logo.svg" alt="Fylo Logo" className="h-8 w-auto mb-2" />
              </Link>
              <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
                Fylo delivers military-grade encrypted cloud storage, seamless team collaboration,
                and anywhere access. Keep your files organized, protected, and under your control.
              </p>
              <div className="space-y-2 pt-2 text-sm text-gray-300">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>San Francisco, CA &amp; Lagos, Nigeria</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>+1 (800) 555-FYLO / +234 1 234 5678</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-teal-400 shrink-0" />
                  <span>support@fylo.storage</span>
                </div>
              </div>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
                Product
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/features" className="hover:text-teal-300 transition">
                    Features Overview
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-teal-300 transition">
                    Plans &amp; Pricing
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-teal-300 transition">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-teal-300 transition">
                    Web App Sign In
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support & Community */}
            <div>
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
                Help &amp; Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/faqs" className="hover:text-teal-300 transition">
                    Frequently Asked Questions
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-teal-300 transition">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <a
                    href="mailto:security@fylo.storage"
                    className="hover:text-teal-300 transition flex items-center space-x-1"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                    <span>Security Center</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-teal-300 transition">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-teal-300 transition">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <span className="text-xs text-gray-500 block pt-2">
                    Compliant with NDPR &amp; GDPR standards.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} Fylo Cloud Storage Inc. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-gray-400">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-gray-400">
                Terms
              </Link>
              <Link href="/contact" className="hover:text-gray-400">
                Security
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
