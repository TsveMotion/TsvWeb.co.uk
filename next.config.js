/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable SWC minification for better performance
  swcMinify: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Enable gzip compression
  compress: true,
  
  // Experimental features for better performance
  // Note: optimizeCss disabled due to build compatibility issues
  // CSS is still optimized through other means (Tailwind purge, minification)
  experimental: {
    // optimizeCss: true, // Disabled - causing build errors with critters
  },
  
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
    formats: ['image/webp'], // Use WebP for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
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
  
  // Add caching headers for static assets
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|gif|woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },

  // Webpack configuration to handle PDF.js properly
  webpack: (config, { isServer }) => {
    // Fix for pdfjs-dist
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
      encoding: false,
    };

    // Ignore canvas module warnings
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        encoding: false,
      };
    }

    return config;
  },
}

module.exports = nextConfig
