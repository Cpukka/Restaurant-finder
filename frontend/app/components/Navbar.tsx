'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  UserCircleIcon,
  HomeIcon,
  BuildingStorefrontIcon,
  PlusCircleIcon,
  ClipboardDocumentListIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
  };

  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Restaurants', href: '/restaurants', icon: BuildingStorefrontIcon },
    { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  ];

  const authNavigation = user && (user.role === 'vendor' || user.role === 'admin')
    ? [
        { name: 'Dashboard', href: '/dashboard', icon: ClipboardDocumentListIcon },
        { name: 'Add Restaurant', href: '/dashboard/add', icon: PlusCircleIcon },
      ]
    : [];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Left side */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-400 bg-clip-text text-transparent">
                RestaurantFinder
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Center/Middle */}
          <div className="hidden md:flex items-center justify-center flex-1 px-4">
            <div className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
              {authNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      pathname === item.href
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50'
                        : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side - Search, Theme, User */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Desktop Search */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 lg:w-64 px-3 py-1.5 pl-9 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                           focus:ring-2 focus:ring-primary-500 focus:border-transparent
                           bg-gray-50 dark:bg-gray-800"
                />
                <MagnifyingGlassIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>

            <ThemeToggle />
            
            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800">
                  <UserCircleIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-2">
              <Link href="/search" className="p-2 text-gray-700 dark:text-gray-300">
                <MagnifyingGlassIcon className="w-5 h-5" />
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 focus:outline-none"
              >
                {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-3 space-y-1 bg-white dark:bg-gray-900 shadow-lg border-t border-gray-200 dark:border-gray-800">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2.5 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 bg-gray-50 dark:bg-gray-800"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>
          
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  pathname === item.href
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/50'
                    : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {authNavigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 dark:text-gray-300 
                         hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
          
          {user ? (
            <>
              <div className="flex items-center space-x-3 px-3 py-2.5 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-800 mt-2 pt-3">
                <UserCircleIcon className="w-5 h-5" />
                <span className="font-medium">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 w-full px-3 py-2.5 rounded-lg text-base font-medium 
                         bg-red-600 text-white hover:bg-red-700"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/login"
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-center text-gray-700 dark:text-gray-300 
                         hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
  href="/register"
  className="block px-3 py-2.5 rounded-lg text-base font-medium text-center bg-primary-600 
           text-white hover:bg-primary-700"
  onClick={() => setIsOpen(false)}  // ← Added the missing '=>'
>
  Sign Up
</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}