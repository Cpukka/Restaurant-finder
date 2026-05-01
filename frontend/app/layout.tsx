import type { Metadata, Viewport } from 'next'; // ← Add Viewport import
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext'; // ← Use relative path
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

// Separate metadata configuration
export const metadata: Metadata = {
  title: 'RestaurantFinder - Discover Best Restaurants in Abuja',
  description: 'Find and review the best restaurants in Abuja, Nigeria. Discover authentic Nigerian cuisine, fast food, fine dining and more.',
  keywords: 'restaurants, Abuja, Nigeria, food, dining, reviews, cuisine',
  authors: [{ name: 'RestaurantFinder' }],
  openGraph: {
    title: 'RestaurantFinder - Discover Best Restaurants',
    description: 'Find the best dining spots in Abuja, Nigeria',
    type: 'website',
    locale: 'en_NG',
  },
};

// Separate viewport configuration (required for Next.js 15+)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#111827' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const isDark = localStorage.getItem('darkMode') === 'true';
                if (isDark) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}