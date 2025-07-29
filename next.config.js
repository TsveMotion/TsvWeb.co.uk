/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'fr', 'es', 'de'],
    defaultLocale: 'en',
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
}

module.exports = nextConfig
