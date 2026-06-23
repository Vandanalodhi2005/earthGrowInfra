'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMobileMenuOpen(false), [pathname]);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return (
    <>
      {/* Spacer to offset fixed header */}
      <div className="h-20"></div>
      <motion.header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-transparent'} backdrop-blur-sm`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 80 }}
        id="navbar"
      >
        <div className="container mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3" onClick={() => setMobileMenuOpen(false)}>
            <img src="/logo/logo.jpeg" alt="Earth Grow Infra Emblem" className="h-12 w-auto" />
            <span className={`text-2xl font-extrabold ${scrolled ? 'text-primary' : 'text-white'}`}>Earth Grow</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className={`hover:underline ${scrolled ? 'text-primary' : 'text-white'}`}>Home</Link>
            <Link href="/properties" className={`hover:underline ${scrolled ? 'text-primary' : 'text-white'}`}>Properties</Link>
            <Link href="/about" className={`hover:underline ${scrolled ? 'text-primary' : 'text-white'}`}>About</Link>
            <Link
              href="/contact"
              className="bg-primary text-white rounded-lg px-5 py-2 font-semibold hover:bg-primary-dark transition"
            >
              Contact
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-current focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              className="absolute inset-x-0 top-full bg-white shadow-lg md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex flex-col gap-6 p-6">
                <Link href="/" className="text-primary text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/properties" className="text-primary text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>Properties</Link>
                <Link href="/about" className="text-primary text-lg font-medium" onClick={() => setMobileMenuOpen(false)}>About</Link>
                <Link href="/contact" className="bg-primary text-white rounded-lg px-5 py-2 text-center font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
