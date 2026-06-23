'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';

export default function Footer() {
  return (
    <motion.footer
      className="relative overflow-hidden bg-white text-gray-800 pt-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-100/10 rounded-full pointer-events-none transform -translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <img src="/logo/footer-logo.jpeg" alt="Earth Grow Logo" className="h-16" />
            </Link>
            <p className="text-gray-600 max-w-xs">
              Setting the gold standard in premium real estate. We turn your property dreams into prestigious addresses.
            </p>
            <div className="flex space-x-4 text-gray-500">
              <a href="https://www.instagram.com/therealtyxperts?igsh=YnV0OW4yb3dqd3o5" aria-label="Instagram" className="hover:text-primary">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://youtube.com/@therealtyxperts?si=MrwWCerbQMucsMBn" aria-label="YouTube" className="hover:text-primary">
                <i className="fab fa-youtube" />
              </a>
              <a href="https://www.facebook.com/share/1KdeJWGb8b/" aria-label="Facebook" className="hover:text-primary">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="https://www.linkedin.com/in/therealtyxperts-trx-group-627b651b2?utm_source=share_via&utm_content=profile&utm_medium=member_android" aria-label="LinkedIn" className="hover:text-primary">
                <i className="fab fa-linkedin-in" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-primary font-semibold border-b pb-2">Quick Links</h3>
            <ul className="space-y-2 text-gray-700">
              <li>
                <Link href="/" className="flex items-center gap-2 hover:text-primary">
                  <i className="fas fa-chevron-right text-primary" /> Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="flex items-center gap-2 hover:text-primary">
                  <i className="fas fa-chevron-right text-primary" /> About
                </Link>
              </li>
              <li>
                <Link href="/properties" className="flex items-center gap-2 hover:text-primary">
                  <i className="fas fa-chevron-right text-primary" /> Properties
                </Link>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 hover:text-primary">
                  <i className="fas fa-chevron-right text-primary" /> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-primary font-semibold border-b pb-2">Get In Touch</h3>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <i className="fas fa-user" />
                </div>
                <span>TRX Group</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HiOutlinePhone className="w-5 h-5" />
                </div>
                <a href="tel:9264175587" className="hover:text-primary">926-417-5587</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                  <HiOutlineMail className="w-5 h-5" />
                </div>
                <a href="mailto:emailtotrx@gmail.com" className="hover:text-primary">emailtotrx@gmail.com</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-teal-100 text-teal">
                  <HiOutlineClock className="w-5 h-5" />
                </div>
                <span>Est. 2016</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 border-t pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 md:mb-0">&copy; {new Date().getFullYear()} The Realty Xperts. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
