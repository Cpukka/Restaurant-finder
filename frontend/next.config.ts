/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      // Add this if you're using Laragon's virtual host
      {
        protocol: 'http',
        hostname: 'restaurant-finder-backend.test',
        pathname: '/storage/**',
      },
    ],
  },
}

module.exports = nextConfig