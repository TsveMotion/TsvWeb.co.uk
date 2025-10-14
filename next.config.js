/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ['en', 'fr', 'es', 'de'],
    defaultLocale: 'en',
  },
  async redirects() {
    return [
      // Redirect all known spam paths to home
      {
        source: '/:path(Mixer|Chevrolet|Brake|Plastic|Curtain|Feekoon|Fans|Snack|Handlebar|Drive|Adjustable|DB37|Chassis|Snap|Steel|New|Bits)*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/reviews/:path*',
        destination: '/',
        permanent: false,
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        pathname: '**',
      },
    ],
  },
}

module.exports = nextConfig
