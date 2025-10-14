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
      // Redirect known spam paths to home
      // Each spam keyword must be an exact match or have additional path segments
      {
        source: '/Mixer/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Chevrolet/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Brake/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Plastic/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Curtain/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Feekoon/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Fans/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Snack/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Handlebar/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Drive/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Adjustable/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/DB37/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Chassis/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Snap/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Steel/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/New/:path*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/Bits/:path*',
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
