export interface InformationPage {
  slug: string
  title: string
  description: string
  icon: string
  seo: {
    title: string
    description: string
    keywords: string
  }
  sections: {
    title: string
    content: string[]
    list?: string[]
  }[]
  benefits?: {
    title: string
    description: string
  }[]
  faqs?: {
    question: string
    answer: string
  }[]
}

export const informationPages: InformationPage[] = [
  {
    slug: 'web-design-birmingham',
    title: 'Web Design Birmingham: Complete Guide',
    description: 'Everything you need to know about professional web design services in Birmingham and the West Midlands.',
    icon: '🎨',
    seo: {
      title: 'Web Design Birmingham | Complete Guide 2025 | TsvWeb',
      description: 'Complete guide to web design in Birmingham. Learn about costs, processes, SEO, and how to choose the best web designer for your Birmingham business.',
      keywords: 'web design Birmingham, Birmingham web design, website design Birmingham, web designer Birmingham, affordable web design Birmingham, professional web design Birmingham'
    },
    sections: [
      {
        title: 'What is Professional Web Design?',
        content: [
          'Professional web design in Birmingham combines aesthetics, functionality, and user experience to create websites that convert visitors into customers. It\'s not just about making things look pretty – it\'s about creating a digital presence that drives real business results.',
          'A well-designed website serves as your 24/7 salesperson, working around the clock to attract, engage, and convert potential customers in Birmingham and beyond.'
        ]
      },
      {
        title: 'Why Birmingham Businesses Need Professional Web Design',
        content: [
          'Birmingham is a competitive market with thousands of businesses vying for customer attention. Your website is often the first impression potential customers have of your business.',
          'Professional web design helps Birmingham businesses stand out, build trust, and convert more visitors into paying customers.'
        ],
        list: [
          'First impressions matter – 94% of first impressions are design-related',
          'Mobile-responsive design reaches customers on any device',
          'SEO-optimized design helps you rank higher on Google',
          'Fast-loading websites reduce bounce rates',
          'Professional design builds credibility with Birmingham customers'
        ]
      },
      {
        title: 'Web Design Costs in Birmingham',
        content: [
          'Web design costs in Birmingham vary widely. Basic websites start from £30/month, while custom e-commerce solutions can range from £2,000 to £10,000+.',
          'At TsvWeb, we offer transparent, affordable pricing starting from just £30/month with no hidden fees.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Increased Credibility',
        description: 'Professional design builds trust with Birmingham customers'
      },
      {
        title: 'Better User Experience',
        description: 'Intuitive navigation keeps visitors engaged'
      },
      {
        title: 'Higher Conversions',
        description: 'Strategic design guides visitors toward taking action'
      },
      {
        title: 'Mobile Optimization',
        description: 'Reach customers on any device'
      }
    ],
    faqs: [
      {
        question: 'How much does web design cost in Birmingham?',
        answer: 'Web design in Birmingham ranges from £30/month for basic websites to £10,000+ for complex solutions. At TsvWeb, we offer affordable plans starting at £30/month.'
      },
      {
        question: 'How long does it take to design a website?',
        answer: 'Most websites are designed and launched within 48-72 hours. Complex projects may take 1-2 weeks.'
      }
    ]
  },
  {
    slug: 'seo-birmingham-guide',
    title: 'SEO Birmingham: Local SEO Guide',
    description: 'Master local SEO in Birmingham and rank #1 on Google for your target keywords.',
    icon: '🔍',
    seo: {
      title: 'SEO Birmingham Guide 2025 | Rank #1 on Google | TsvWeb',
      description: 'Complete SEO guide for Birmingham businesses. Learn local SEO strategies and Google ranking factors.',
      keywords: 'SEO Birmingham, Birmingham SEO, local SEO Birmingham, SEO services Birmingham'
    },
    sections: [
      {
        title: 'What is SEO?',
        content: [
          'SEO (Search Engine Optimization) helps your website rank higher in search results. For Birmingham businesses, this means showing up when local customers search for your services.',
          'Good SEO drives organic traffic and brings qualified leads without paying for ads.'
        ]
      },
      {
        title: 'Local SEO for Birmingham',
        content: [
          'Local SEO helps you appear in "near me" searches and Google Maps results.',
          'It\'s crucial for Birmingham businesses serving local customers.'
        ],
        list: [
          'Claim your Google Business Profile',
          'Build local citations',
          'Gather customer reviews',
          'Create Birmingham-specific content',
          'Build local backlinks'
        ]
      }
    ],
    benefits: [
      {
        title: 'Increased Visibility',
        description: 'Appear at the top of Google search results'
      },
      {
        title: 'More Qualified Leads',
        description: 'Attract customers actively searching for your services'
      }
    ],
    faqs: [
      {
        question: 'How long does SEO take?',
        answer: 'Initial improvements in 4-6 weeks, significant results in 3-6 months.'
      },
      {
        question: 'How much does SEO cost?',
        answer: 'Basic local SEO starts around £300/month.'
      }
    ]
  },
  {
    slug: 'mobile-website-design',
    title: 'Mobile Website Design Guide',
    description: 'Learn why mobile-first design is essential for modern websites.',
    icon: '📱',
    seo: {
      title: 'Mobile Website Design Guide 2025 | TsvWeb Birmingham',
      description: 'Complete guide to mobile website design and responsive design techniques.',
      keywords: 'mobile website design, responsive web design, mobile-first design'
    },
    sections: [
      {
        title: 'Why Mobile Design Matters',
        content: [
          'Over 60% of web traffic comes from mobile devices. If your website doesn\'t work well on smartphones, you\'re losing customers.',
          'Google uses mobile-first indexing, so mobile experience affects your rankings.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Better User Experience',
        description: 'Mobile-optimized sites are easier to use'
      },
      {
        title: 'Higher Rankings',
        description: 'Google prioritizes mobile-friendly websites'
      }
    ],
    faqs: [
      {
        question: 'Is mobile design included?',
        answer: 'Yes! All TsvWeb websites are mobile-responsive at no extra cost.'
      }
    ]
  },
  {
    slug: 'ecommerce-website-guide',
    title: 'E-commerce Website Guide',
    description: 'Build and run a successful online store.',
    icon: '🛒',
    seo: {
      title: 'E-commerce Website Guide 2025 | TsvWeb Birmingham',
      description: 'Complete guide to e-commerce websites and online stores.',
      keywords: 'ecommerce website, online store, ecommerce Birmingham'
    },
    sections: [
      {
        title: 'What is E-commerce?',
        content: [
          'E-commerce allows Birmingham businesses to sell online 24/7 and reach customers beyond local markets.',
          'Modern e-commerce sites offer seamless shopping with secure payments and order management.'
        ]
      }
    ],
    benefits: [
      {
        title: '24/7 Sales',
        description: 'Your store never closes'
      },
      {
        title: 'Expanded Reach',
        description: 'Sell beyond Birmingham'
      }
    ],
    faqs: [
      {
        question: 'How much does an e-commerce site cost?',
        answer: 'Basic stores start around £29/month. Custom solutions range from £2,000 to £20,000+.'
      }
    ]
  },
  {
    slug: 'website-maintenance-guide',
    title: 'Website Maintenance Guide',
    description: 'Keep your website secure, fast, and up-to-date.',
    icon: '🔧',
    seo: {
      title: 'Website Maintenance Guide 2025 | TsvWeb Birmingham',
      description: 'Learn about website maintenance, updates, security, and backups.',
      keywords: 'website maintenance, website updates, website security'
    },
    sections: [
      {
        title: 'What is Website Maintenance?',
        content: [
          'Website maintenance keeps your site secure, fast, and up-to-date through regular updates and monitoring.',
          'Neglecting maintenance leads to security issues and poor performance.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Enhanced Security',
        description: 'Protection against hackers and malware'
      },
      {
        title: 'Better Performance',
        description: 'Keep your website fast'
      }
    ],
    faqs: [
      {
        question: 'Do you offer maintenance services?',
        answer: 'Yes! All TsvWeb plans include ongoing maintenance and support.'
      }
    ]
  },
  {
    slug: 'website-hosting-guide',
    title: 'Website Hosting Guide',
    description: 'Choose the right hosting for your Birmingham business.',
    icon: '🌐',
    seo: {
      title: 'Website Hosting Guide 2025 | TsvWeb Birmingham',
      description: 'Complete guide to website hosting, servers, and performance.',
      keywords: 'website hosting, web hosting Birmingham, hosting guide'
    },
    sections: [
      {
        title: 'What is Website Hosting?',
        content: [
          'Website hosting stores your website files on servers that make them accessible online 24/7.',
          'Quality hosting ensures fast loading, high uptime, and good security.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Fast Loading',
        description: 'Quality hosting means faster websites'
      },
      {
        title: 'High Uptime',
        description: 'Your site stays online 99.9% of the time'
      }
    ],
    faqs: [
      {
        question: 'Is hosting included in your plans?',
        answer: 'Yes! All TsvWeb plans include fast, secure hosting.'
      }
    ]
  },
  {
    slug: 'wordpress-development-birmingham',
    title: 'WordPress Development Birmingham',
    description: 'Professional WordPress development services for Birmingham businesses. Custom themes, plugins, and optimization.',
    icon: '⚙️',
    seo: {
      title: 'WordPress Development Birmingham | Expert WordPress Developer',
      description: 'Professional WordPress development in Birmingham. Custom themes, plugins, WooCommerce, and optimization. Fast, secure WordPress websites from £30/month.',
      keywords: 'wordpress development Birmingham, wordpress developer Birmingham, custom wordpress Birmingham, wordpress website Birmingham'
    },
    sections: [
      {
        title: 'Why Choose WordPress?',
        content: [
          'WordPress powers over 43% of all websites globally, making it the world\'s most popular content management system. For Birmingham businesses, WordPress offers the perfect balance of flexibility, ease of use, and powerful features.',
          'Whether you need a simple business website, a complex e-commerce store, or a membership platform, WordPress can handle it all while remaining easy to update and manage.'
        ]
      },
      {
        title: 'Custom WordPress Development',
        content: [
          'Off-the-shelf WordPress themes rarely meet all business needs. Our custom WordPress development services create tailored solutions that perfectly match your Birmingham business requirements.',
          'From custom themes that reflect your brand identity to bespoke plugins that add unique functionality, we build WordPress websites that stand out and perform.'
        ],
        list: [
          'Custom WordPress theme development',
          'Plugin development and customization',
          'WooCommerce e-commerce solutions',
          'WordPress API integrations',
          'Performance optimization',
          'Security hardening'
        ]
      },
      {
        title: 'WordPress vs Other Platforms',
        content: [
          'While platforms like Wix and Squarespace offer simplicity, WordPress provides unmatched flexibility and control. You own your content, can customize anything, and aren\'t locked into proprietary systems.',
          'For Birmingham businesses planning to grow, WordPress scales effortlessly from small sites to enterprise-level platforms handling millions of visitors.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Easy Content Management',
        description: 'Update your website yourself with WordPress\'s intuitive interface'
      },
      {
        title: 'SEO-Friendly',
        description: 'WordPress is built for SEO with clean code and powerful plugins'
      },
      {
        title: 'Thousands of Plugins',
        description: 'Extend functionality with 60,000+ free and premium plugins'
      },
      {
        title: 'Cost-Effective',
        description: 'Open-source platform means no licensing fees'
      }
    ],
    faqs: [
      {
        question: 'Is WordPress free?',
        answer: 'WordPress software is free and open-source. You only pay for hosting, domain, and development services. At TsvWeb, our WordPress plans start from £30/month including hosting.'
      },
      {
        question: 'Can I update my WordPress site myself?',
        answer: 'Absolutely! WordPress is designed for non-technical users. We provide training and ongoing support to help you manage your content confidently.'
      },
      {
        question: 'Is WordPress secure?',
        answer: 'Yes, when properly maintained. We implement security best practices, regular updates, and monitoring to keep your Birmingham WordPress site secure.'
      }
    ]
  },
  {
    slug: 'web-design-cost-birmingham',
    title: 'Web Design Cost Birmingham: Pricing Guide',
    description: 'Understand web design costs in Birmingham. Transparent pricing, packages, and what affects website development costs.',
    icon: '💰',
    seo: {
      title: 'Web Design Cost Birmingham | Website Pricing Guide 2025',
      description: 'Complete guide to web design costs in Birmingham. Learn about pricing, packages, and what you should expect to pay for professional web design.',
      keywords: 'web design cost Birmingham, website cost Birmingham, web design prices Birmingham, affordable web design Birmingham'
    },
    sections: [
      {
        title: 'How Much Does Web Design Cost in Birmingham?',
        content: [
          'Web design costs in Birmingham vary dramatically based on complexity, features, and the provider you choose. Understanding these costs helps you budget appropriately and avoid surprises.',
          'Basic websites start from £30/month with subscription models, while custom-built sites can range from £1,000 to £10,000+. The key is understanding what you\'re paying for and ensuring it matches your business needs.'
        ]
      },
      {
        title: 'Web Design Pricing Models',
        content: [
          'Birmingham web designers typically offer three pricing models: one-time fees, monthly subscriptions, or hourly rates. Each has advantages depending on your situation and budget.'
        ],
        list: [
          'Monthly Subscription (£30-£150/month) - Includes hosting, maintenance, updates',
          'One-Time Build (£1,000-£10,000+) - Pay upfront, own the site',
          'Hourly Rate (£50-£150/hour) - Flexible for ongoing work',
          'Template Customization (£500-£2,000) - Faster, more affordable',
          'Custom Development (£3,000-£20,000+) - Unique, tailored solutions',
          'E-commerce Sites (£2,000-£15,000+) - Online stores with payment processing'
        ]
      },
      {
        title: 'What Affects Web Design Cost?',
        content: [
          'Several factors influence the final cost of your Birmingham website. Understanding these helps you make informed decisions about where to invest your budget.',
          'Complexity is the biggest factor - a 5-page brochure site costs far less than a 50-page e-commerce platform with custom features. Other factors include design customization, functionality requirements, content creation, and ongoing maintenance needs.'
        ]
      },
      {
        title: 'Hidden Costs to Watch For',
        content: [
          'Many Birmingham businesses are surprised by hidden costs after signing contracts. Be aware of charges for domain registration, SSL certificates, email hosting, content updates, additional pages, plugin licenses, and ongoing maintenance.',
          'At TsvWeb, we believe in transparent pricing with no hidden fees. Our monthly plans include everything you need: hosting, SSL, updates, and support.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Transparent Pricing',
        description: 'Know exactly what you\'re paying for with no hidden fees'
      },
      {
        title: 'Flexible Options',
        description: 'Choose between monthly plans or one-time builds'
      },
      {
        title: 'All-Inclusive Packages',
        description: 'Hosting, SSL, maintenance included in monthly plans'
      },
      {
        title: 'No Long Contracts',
        description: 'Cancel anytime with monthly subscriptions'
      }
    ],
    faqs: [
      {
        question: 'What\'s the cheapest way to get a website in Birmingham?',
        answer: 'DIY website builders like Wix start around £10/month, but lack professional design and SEO. Our professional service starts at £30/month with custom design, SEO, and support - better value for businesses serious about growth.'
      },
      {
        question: 'Should I pay monthly or one-time?',
        answer: 'Monthly plans spread costs and include hosting, maintenance, and updates. One-time builds have higher upfront costs but you own the site. For most Birmingham businesses, monthly plans offer better value and peace of mind.'
      },
      {
        question: 'What\'s included in your £30/month plan?',
        answer: 'Our starter plan includes custom design, mobile-responsive layout, up to 5 pages, hosting, SSL certificate, basic SEO, and ongoing support. Perfect for small Birmingham businesses.'
      }
    ]
  },
  {
    slug: 'local-seo-birmingham',
    title: 'Local SEO Birmingham: Dominate Local Search',
    description: 'Master local SEO in Birmingham. Rank higher on Google Maps, attract more local customers, and dominate your Birmingham market.',
    icon: '📍',
    seo: {
      title: 'Local SEO Birmingham | Rank #1 on Google Maps 2025',
      description: 'Complete local SEO guide for Birmingham businesses. Dominate Google Maps, local search results, and attract more customers in the West Midlands.',
      keywords: 'local SEO Birmingham, Birmingham local SEO, Google Maps Birmingham, local search Birmingham, Birmingham SEO services'
    },
    sections: [
      {
        title: 'What is Local SEO?',
        content: [
          'Local SEO is the practice of optimizing your online presence to attract customers from local searches. When someone in Birmingham searches for "plumber near me" or "web designer Birmingham", local SEO determines whether your business appears.',
          'For Birmingham businesses serving local customers, local SEO is crucial. It\'s the difference between being invisible and dominating your local market.'
        ]
      },
      {
        title: 'Google Business Profile Optimization',
        content: [
          'Your Google Business Profile (formerly Google My Business) is the foundation of local SEO. It controls how your business appears on Google Maps and local search results.',
          'Optimizing your profile with complete information, regular posts, photos, and customer reviews dramatically improves your visibility in Birmingham local searches.'
        ],
        list: [
          'Claim and verify your Google Business Profile',
          'Complete all business information fields',
          'Choose accurate business categories',
          'Add high-quality photos of your business',
          'Post regular updates and offers',
          'Respond to all customer reviews',
          'Add products and services',
          'Use Google Posts for announcements'
        ]
      },
      {
        title: 'Local Citations and NAP Consistency',
        content: [
          'Citations are online mentions of your business name, address, and phone number (NAP). Google uses these to verify your business exists and build trust in your location.',
          'Consistency is critical - your NAP must match exactly across all directories. Even small differences like "St" vs "Street" can confuse Google and hurt your rankings.'
        ]
      },
      {
        title: 'Birmingham-Specific SEO Strategies',
        content: [
          'Optimize for Birmingham-specific keywords like "web design Birmingham", "Birmingham web developer", and neighborhood-specific terms like "web design Edgbaston" or "SEO Solihull".',
          'Create location pages for different Birmingham areas you serve, build local backlinks from Birmingham websites, and create content about Birmingham business topics.'
        ]
      }
    ],
    benefits: [
      {
        title: 'More Local Customers',
        description: 'Appear when Birmingham customers search for your services'
      },
      {
        title: 'Higher Conversion Rates',
        description: 'Local searchers have high intent and convert better'
      },
      {
        title: 'Competitive Advantage',
        description: 'Outrank competitors in your Birmingham area'
      },
      {
        title: 'Cost-Effective Marketing',
        description: 'Free organic traffic from local searches'
      }
    ],
    faqs: [
      {
        question: 'How long does local SEO take to work?',
        answer: 'Initial improvements in 4-8 weeks, significant results in 3-6 months. Local SEO is faster than traditional SEO because you\'re competing in a smaller geographic area.'
      },
      {
        question: 'Do I need a physical Birmingham address for local SEO?',
        answer: 'For Google Business Profile, yes if you serve customers at your location. Service-area businesses can hide their address but must serve Birmingham to rank there.'
      },
      {
        question: 'How important are Google reviews for local SEO?',
        answer: 'Extremely important. Reviews are a major ranking factor and influence customer decisions. Businesses with more positive reviews rank higher and convert better.'
      }
    ]
  },
  {
    slug: 'website-speed-optimization',
    title: 'Website Speed Optimization Guide',
    description: 'Make your website lightning fast. Improve loading times, boost SEO rankings, and increase conversions.',
    icon: '⚡',
    seo: {
      title: 'Website Speed Optimization Guide 2025 | Make Your Site Faster',
      description: 'Complete guide to website speed optimization. Learn how to make your Birmingham website load faster, improve SEO, and increase conversions.',
      keywords: 'website speed optimization, page speed, website performance, fast loading website, optimize website speed'
    },
    sections: [
      {
        title: 'Why Website Speed Matters',
        content: [
          'Website speed directly impacts your bottom line. Studies show that 53% of mobile users abandon sites that take longer than 3 seconds to load. Every second of delay can reduce conversions by 7%.',
          'Google also uses page speed as a ranking factor. Faster websites rank higher, get more traffic, and convert better. For Birmingham businesses, speed optimization is essential for competing online.'
        ]
      },
      {
        title: 'How to Test Your Website Speed',
        content: [
          'Before optimizing, measure your current performance. Use tools like Google PageSpeed Insights, GTmetrix, or Pingdom to test your site and identify specific issues.',
          'Test from multiple locations and devices. Your site might load quickly on your office computer but slowly for mobile users in Birmingham on 4G connections.'
        ]
      },
      {
        title: 'Key Speed Optimization Techniques',
        content: [
          'Image optimization is the biggest quick win - compress images without losing quality. Enable browser caching so returning visitors load faster. Minify CSS and JavaScript to reduce file sizes.',
          'Use a Content Delivery Network (CDN) to serve files from servers closer to your Birmingham visitors. Enable compression (Gzip/Brotli) on your web server. Reduce server response time with quality hosting.'
        ],
        list: [
          'Optimize and compress images',
          'Enable browser caching',
          'Minify CSS, JavaScript, and HTML',
          'Use a Content Delivery Network (CDN)',
          'Enable Gzip/Brotli compression',
          'Reduce server response time',
          'Eliminate render-blocking resources',
          'Lazy load images and videos',
          'Use modern image formats (WebP)',
          'Reduce redirects'
        ]
      }
    ],
    benefits: [
      {
        title: 'Better SEO Rankings',
        description: 'Google ranks faster websites higher in search results'
      },
      {
        title: 'Higher Conversions',
        description: 'Fast sites convert more visitors into customers'
      },
      {
        title: 'Lower Bounce Rates',
        description: 'Users stay longer on fast-loading websites'
      },
      {
        title: 'Better User Experience',
        description: 'Fast sites provide better experiences across all devices'
      }
    ],
    faqs: [
      {
        question: 'What is a good page load time?',
        answer: 'Under 3 seconds is good, under 2 seconds is excellent. Mobile should load in under 3 seconds on 4G. Every second counts for user experience and conversions.'
      },
      {
        question: 'Will speed optimization affect my website design?',
        answer: 'No! Proper optimization maintains your design while improving performance. We optimize behind the scenes without changing how your site looks.'
      },
      {
        question: 'How much does speed optimization cost?',
        answer: 'Basic optimization starts around £200-£500. All TsvWeb websites include speed optimization as standard, with load times under 3 seconds guaranteed.'
      }
    ]
  },
  {
    slug: 'website-security-guide',
    title: 'Website Security Guide',
    description: 'Protect your Birmingham website from hackers, malware, and security threats. Essential security practices for business websites.',
    icon: '🔒',
    seo: {
      title: 'Website Security Guide 2025 | Protect Your Birmingham Website',
      description: 'Complete website security guide. Learn how to protect your Birmingham business website from hackers, malware, and security threats.',
      keywords: 'website security, website protection, secure website, website hacking prevention, SSL certificate'
    },
    sections: [
      {
        title: 'Why Website Security Matters',
        content: [
          'Website security isn\'t optional - it\'s essential. Hacked websites lose customer trust, face Google penalties, and can expose sensitive customer data leading to legal issues and fines.',
          'For Birmingham businesses, a security breach can be devastating. Beyond the immediate costs of cleanup and recovery, the damage to reputation can take years to rebuild.'
        ]
      },
      {
        title: 'Essential Security Measures',
        content: [
          'SSL certificates encrypt data between your website and visitors, protecting sensitive information. They\'re now standard and required for any site collecting data.',
          'Regular updates patch security vulnerabilities in your website software. Strong passwords prevent unauthorized access. Firewalls block malicious traffic. Backups ensure quick recovery if something goes wrong.'
        ],
        list: [
          'Install SSL certificate (HTTPS)',
          'Keep software and plugins updated',
          'Use strong, unique passwords',
          'Enable two-factor authentication',
          'Install security plugins/firewalls',
          'Regular malware scanning',
          'Daily automated backups',
          'Limit login attempts',
          'Hide WordPress version',
          'Disable file editing in admin'
        ]
      },
      {
        title: 'Common Security Threats',
        content: [
          'Brute force attacks try thousands of password combinations to break in. SQL injection attacks exploit database vulnerabilities. Cross-site scripting (XSS) injects malicious code. DDoS attacks overwhelm your server with traffic.',
          'Understanding these threats helps you implement appropriate defenses and recognize when your Birmingham website might be under attack.'
        ]
      }
    ],
    benefits: [
      {
        title: 'Protect Customer Data',
        description: 'Keep customer information safe and maintain trust'
      },
      {
        title: 'Avoid Google Penalties',
        description: 'Hacked sites get blacklisted and lose rankings'
      },
      {
        title: 'Maintain Uptime',
        description: 'Security measures prevent downtime from attacks'
      },
      {
        title: 'Legal Compliance',
        description: 'Meet GDPR and data protection requirements'
      }
    ],
    faqs: [
      {
        question: 'Do I need an SSL certificate?',
        answer: 'Yes! SSL is essential for any website. It encrypts data, builds trust, and is required by Google. All TsvWeb websites include SSL certificates as standard.'
      },
      {
        question: 'How often should I update my website?',
        answer: 'Check for updates weekly, apply them promptly. Security updates should be applied immediately. We handle all updates for TsvWeb clients automatically.'
      },
      {
        question: 'What should I do if my website is hacked?',
        answer: 'Contact your web developer immediately. Take the site offline if necessary. Restore from a clean backup. Change all passwords. Scan for malware. We provide 24/7 security monitoring and rapid response for TsvWeb clients.'
      }
    ]
  }
]
