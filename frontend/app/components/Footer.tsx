'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock
} from 'react-icons/fa';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  // Quick links
  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Restaurants', href: '/restaurants' },
    { name: 'Search', href: '/search' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ];

  // For restaurant owners
  const ownerLinks = [
    { name: 'List Your Restaurant', href: '/dashboard/add' },
    { name: 'Owner Dashboard', href: '/dashboard' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Success Stories', href: '/success-stories' },
  ];

  // Popular categories
  const categories = [
    'Fast Food', 'Nigerian', 'Chinese', 'Italian', 
    'Seafood', 'Vegetarian', 'Grill', 'Fine Dining'
  ];

  // Social media links
  const socialLinks = [
    { name: 'Facebook', icon: FaFacebook, href: 'https://facebook.com', color: 'hover:text-[#1877f2]' },
    { name: 'Twitter', icon: FaTwitter, href: 'https://twitter.com', color: 'hover:text-[#1da1f2]' },
    { name: 'Instagram', icon: FaInstagram, href: 'https://instagram.com', color: 'hover:text-[#e4405f]' },
    { name: 'LinkedIn', icon: FaLinkedin, href: 'https://linkedin.com', color: 'hover:text-[#0077b5]' },
    { name: 'YouTube', icon: FaYoutube, href: 'https://youtube.com', color: 'hover:text-[#ff0000]' },
  ];

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                  RestaurantFinder
                </span>
              </Link>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
              Discover the best restaurants in Abuja, Nigeria. Read reviews, view ratings, and find your next favorite dining spot.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center 
                               text-gray-600 dark:text-gray-400 transition-all duration-200 ${social.color}
                               hover:scale-110 hover:bg-gray-200 dark:hover:bg-gray-700`}
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 
                             transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-1 h-1 bg-primary-600 rounded-full transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Restaurant Owners */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              For Restaurant Owners
            </h3>
            <ul className="space-y-2">
              {ownerLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 
                             transition-colors duration-200 flex items-center group"
                  >
                    <span className="w-0 group-hover:w-1 h-1 bg-primary-600 rounded-full transition-all duration-200 mr-0 group-hover:mr-2"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Contact Us
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <FaMapMarkerAlt className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <span>123 Ahmadu Bello Way, Central Business District, Abuja, Nigeria</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <FaPhone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a href="tel:+2341234567890" className="hover:text-primary-600 transition-colors">
                  +234 123 456 7890
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
                <FaEnvelope className="w-5 h-5 text-primary-600 flex-shrink-0" />
                <a href="mailto:info@restaurantfinder.com" className="hover:text-primary-600 transition-colors">
                  info@restaurantfinder.com
                </a>
              </li>
              <li className="flex items-start space-x-3 text-gray-600 dark:text-gray-400">
                <FaClock className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p>Mon - Fri: 9:00 AM - 8:00 PM</p>
                  <p>Sat - Sun: 10:00 AM - 6:00 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Popular Categories */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 text-center">
            Popular Categories
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link
                key={category}
                href={`/restaurants?category=${category}`}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 
                         rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900/30 
                         hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200
                         hover:scale-105"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get the latest restaurant updates, exclusive offers, and food tips delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="input flex-1"
                required
              />
              <button
                type="submit"
                className="btn-primary whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {year} RestaurantFinder. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-primary-600 hover:bg-primary-700 text-white 
                   w-12 h-12 rounded-full shadow-lg flex items-center justify-center
                   transition-all duration-200 hover:scale-110 z-50
                   focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </footer>
  );
}