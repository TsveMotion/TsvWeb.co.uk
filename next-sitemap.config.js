/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://tsvweb.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/admin/*',
    '/customer/*',
    '/api/*',
    '/sign-contract/*',
    '/invoice/*/payment-success',
    '/agreements/*',
    '/quote/*',
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/customer',
          '/api',
          '/sign-contract',
          '/agreements',
        ],
      },
    ],
  },
  transform: async (config, path) => {
    // Custom priority for important pages
    const highPriorityPages = ['/', '/services', '/contact', '/portfolio', '/blog'];
    const servicePriority = [
      '/services/seo',
      '/services/ecommerce',
      '/services/web-development',
      '/services/web-design',
      '/services/booking',
      '/services/portfolio',
    ];
    const industryPages = [
      '/restaurants',
      '/barbers',
      '/plumbers',
      '/electricians',
      '/builders',
      '/cleaning',
      '/removals',
    ];

    let priority = config.priority;
    let changefreq = config.changefreq;

    // Homepage gets highest priority
    if (path === '/') {
      priority = 1.0;
      changefreq = 'daily';
    }
    // High priority pages
    else if (highPriorityPages.includes(path)) {
      priority = 0.9;
      changefreq = 'weekly';
    }
    // Service pages
    else if (servicePriority.includes(path)) {
      priority = 0.95;
      changefreq = 'weekly';
    }
    // Industry pages
    else if (industryPages.includes(path)) {
      priority = 0.9;
      changefreq = 'monthly';
    }
    // Blog posts
    else if (path.startsWith('/blog/')) {
      priority = 0.8;
      changefreq = 'monthly';
    }
    // Legal pages
    else if (path === '/privacy-policy' || path === '/terms-of-service') {
      priority = 0.3;
      changefreq = 'yearly';
    }

    return {
      loc: path,
      changefreq: changefreq,
      priority: priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
};
