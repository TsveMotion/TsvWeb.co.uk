/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://tsvweb.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  additionalPaths: async (config) => {
    const result = [];

    // Fetch blog posts from API
    try {
      const blogResponse = await fetch('https://tsvweb.com/api/blog?status=published');
      if (blogResponse.ok) {
        const blogData = await blogResponse.json();
        if (blogData.success && blogData.data) {
          blogData.data.forEach((post) => {
            result.push({
              loc: `/blog/${post.slug}`,
              changefreq: 'monthly',
              priority: 0.8,
              lastmod: post.updatedAt || post.createdAt,
            });
          });
        }
      }
    } catch (error) {
      console.log('Could not fetch blog posts for sitemap');
    }

    // Fetch portfolio items from API
    try {
      const portfolioResponse = await fetch('https://tsvweb.com/api/portfolio');
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        if (portfolioData.success && portfolioData.data) {
          portfolioData.data.forEach((item) => {
            result.push({
              loc: `/portfolio/${item.slug}`,
              changefreq: 'monthly',
              priority: 0.7,
              lastmod: item.updatedAt || item.createdAt,
            });
          });
        }
      }
    } catch (error) {
      console.log('Could not fetch portfolio items for sitemap');
    }

    return result;
  },
  exclude: [
    '/admin*',
    '/customer*',
    '/api*',
    '/sign-contract*',
    '/invoice/*/payment-success',
    '/agreements*',
    '/quote*',
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
    // High priority pages (including /about)
    else if (highPriorityPages.includes(path) || path === '/about') {
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
