'use client'

import { useState } from 'react'
import PageSEO from '@/components/seo/page-seo'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0)

  // Enhanced Services data with pricing and detailed features
  const services = [
    {
      id: 'web-design',
      title: 'Web Design & UI/UX',
      shortDesc: 'Beautiful, conversion-focused designs',
      description: 'Transform your vision into stunning, user-friendly designs that captivate your audience and drive conversions. Our design process focuses on your brand identity, user experience, and business goals.',
      price: 'From £2,500',
      duration: '2-4 weeks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      features: [
        'Custom UI/UX Design',
        'Mobile-First Responsive Design',
        'Brand Identity Integration',
        'User Journey Optimization',
        'Conversion Rate Optimization',
        'Interactive Prototypes',
        'Design System Creation',
        'Accessibility Compliance'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision'],
      deliverables: ['Design Mockups', 'Interactive Prototypes', 'Style Guide', 'Asset Library'],
      cta: 'Start Your Design',
    },
    {
      id: 'web-development',
      title: 'Web Development',
      shortDesc: 'Modern, scalable web applications',
      description: 'Build powerful, fast, and secure websites using cutting-edge technologies. From simple landing pages to complex web applications, we deliver solutions that perform exceptionally.',
      price: 'From £3,500',
      duration: '4-8 weeks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: [
        'React/Next.js Development',
        'Node.js Backend Development',
        'Database Design & Integration',
        'API Development & Integration',
        'Performance Optimization',
        'Security Implementation',
        'SEO-Friendly Architecture',
        'Progressive Web App (PWA)'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL'],
      deliverables: ['Source Code', 'Documentation', 'Deployment', 'Training'],
      cta: 'Build Your Website',
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Solutions',
      shortDesc: 'Complete online store solutions',
      description: 'Launch your online store with our comprehensive e-commerce solutions. From product catalogs to payment processing, we handle everything to get you selling online quickly and securely.',
      price: 'From £5,000',
      duration: '6-10 weeks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      features: [
        'Custom E-commerce Platform',
        'Product Catalog Management',
        'Secure Payment Processing',
        'Inventory Management',
        'Order Management System',
        'Customer Account Portal',
        'Multi-currency Support',
        'Analytics & Reporting'
      ],
      technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Mailchimp'],
      deliverables: ['Online Store', 'Admin Dashboard', 'Payment Setup', 'Training'],
      cta: 'Launch Your Store',
    },
    {
      id: 'seo-marketing',
      title: 'SEO & Digital Marketing',
      shortDesc: 'Drive traffic and increase visibility',
      description: 'Boost your online presence with our comprehensive SEO and digital marketing services. We help you rank higher, drive more traffic, and convert visitors into customers.',
      price: 'From £1,500/month',
      duration: 'Ongoing',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      features: [
        'Technical SEO Audit',
        'Keyword Research & Strategy',
        'On-page Optimization',
        'Content Marketing',
        'Link Building',
        'Local SEO',
        'Performance Tracking',
        'Monthly Reporting'
      ],
      technologies: ['Google Analytics', 'Search Console', 'SEMrush', 'Ahrefs'],
      deliverables: ['SEO Strategy', 'Monthly Reports', 'Content Calendar', 'Performance Metrics'],
      cta: 'Boost Your Rankings',
    },
    {
      id: 'maintenance',
      title: 'Website Maintenance',
      shortDesc: 'Keep your site secure and updated',
      description: 'Ensure your website stays secure, fast, and up-to-date with our comprehensive maintenance services. Focus on your business while we handle the technical details.',
      price: 'From £200/month',
      duration: 'Ongoing',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      features: [
        'Regular Security Updates',
        'Performance Monitoring',
        'Automated Backups',
        'Uptime Monitoring',
        'Content Updates',
        'Bug Fixes',
        'Security Scanning',
        '24/7 Support'
      ],
      technologies: ['Monitoring Tools', 'Security Scanners', 'Backup Systems', 'CDN'],
      deliverables: ['Monthly Reports', 'Security Scans', 'Backup Verification', 'Support'],
      cta: 'Secure Your Site',
    },
    {
      id: 'consulting',
      title: 'Digital Strategy Consulting',
      shortDesc: 'Strategic guidance for digital growth',
      description: 'Get expert advice on your digital strategy, technology choices, and growth opportunities. Our consultants help you make informed decisions for your online presence.',
      price: 'From £150/hour',
      duration: 'Flexible',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      features: [
        'Digital Strategy Planning',
        'Technology Assessment',
        'Competitive Analysis',
        'Growth Opportunity Identification',
        'ROI Analysis',
        'Implementation Roadmap',
        'Team Training',
        'Ongoing Advisory'
      ],
      technologies: ['Analytics Tools', 'Market Research', 'Strategy Frameworks'],
      deliverables: ['Strategy Document', 'Roadmap', 'Recommendations', 'Action Plan'],
      cta: 'Get Strategic Advice',
    },
  ]

  // Process steps
  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Strategy',
      description: 'We start by understanding your business goals, target audience, and project requirements through detailed consultation.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      step: '02',
      title: 'Design & Planning',
      description: 'Our team creates detailed wireframes, mockups, and project timelines to ensure we\'re aligned on the vision.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
    },
    {
      step: '03',
      title: 'Development & Testing',
      description: 'We build your solution using modern technologies and conduct thorough testing to ensure quality.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      step: '04',
      title: 'Launch & Support',
      description: 'After final approval, we launch your project and provide ongoing support to ensure continued success.',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ]

  // SEO metadata
  const seoData = {
    title: 'Professional Web Services | TsvWeb - Design, Development & Digital Marketing',
    description: 'Comprehensive web design, development, e-commerce, SEO, and maintenance services for businesses of all sizes. Get a custom solution for your online presence.',
    canonical: 'https://tsvweb.com/services',
    openGraph: {
      title: 'Professional Web Services | TsvWeb',
      description: 'Comprehensive web design, development, e-commerce, SEO, and maintenance services for businesses of all sizes.',
      url: 'https://tsvweb.com/services',
      type: 'website',
      images: [
        {
          url: 'https://tsvweb.com/images/og-services.jpg',
          width: 1200,
          height: 630,
          alt: 'TsvWeb Services',
        },
      ],
    },
  }

  return (
    <>
      <PageSEO {...seoData} />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 py-24">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
                Professional <span className="text-royal-blue dark:text-blue-400">Web Services</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Transform your digital presence with our comprehensive web solutions. From stunning designs to powerful development, we help businesses thrive online.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="btn-primary inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Free Consultation
                </Link>
                <Link 
                  href="#services" 
                  className="btn-secondary inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Overview */}
        <section id="services" className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="text-royal-blue dark:text-blue-400">Services</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We offer a complete range of digital services to help your business succeed online. From initial concept to ongoing support, we\'re your trusted partner.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div 
                  key={service.id} 
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-royal-blue/20 dark:hover:border-blue-400/20"
                >
                  <div className="p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-royal-blue/10 to-blue-500/10 dark:from-blue-400/10 dark:to-royal-blue/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <div className="text-royal-blue dark:text-blue-400">
                        {service.icon}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {service.title}
                      </h3>
                      <p className="text-sm text-royal-blue dark:text-blue-400 font-medium">
                        {service.shortDesc}
                      </p>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">
                          {service.price}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    
                    <Link 
                      href={`/contact?service=${service.id}`}
                      className="w-full btn-primary text-center group-hover:bg-royal-blue-dark dark:group-hover:bg-blue-500 transition-colors duration-300"
                    >
                      {service.cta}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Service Details Modal/Expandable Section */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                  Service <span className="text-royal-blue dark:text-blue-400">Details</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Get detailed information about each service, including features, technologies, and deliverables.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-3">
                  {/* Service Navigation */}
                  <div className="lg:col-span-1 bg-gray-50 dark:bg-gray-900 p-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Select a Service</h3>
                    <div className="space-y-2">
                      {services.map((service, index) => (
                        <button
                          key={service.id}
                          onClick={() => setActiveService(index)}
                          className={`w-full text-left p-4 rounded-xl transition-all duration-300 ${
                            activeService === index
                              ? 'bg-royal-blue text-white shadow-lg'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                              activeService === index
                                ? 'bg-white/20'
                                : 'bg-royal-blue/10'
                            }`}>
                              <div className={activeService === index ? 'text-white' : 'text-royal-blue dark:text-blue-400'}>
                                {service.icon}
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-sm">{service.title}</div>
                              <div className={`text-xs ${
                                activeService === index
                                  ? 'text-white/80'
                                  : 'text-gray-500 dark:text-gray-400'
                              }`}>
                                {service.price}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  {/* Service Details */}
                  <div className="lg:col-span-2 p-8">
                    <div className="mb-8">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-royal-blue/10 to-blue-500/10 dark:from-blue-400/10 dark:to-royal-blue/10 rounded-xl flex items-center justify-center mr-4">
                          <div className="text-royal-blue dark:text-blue-400">
                            {services[activeService].icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {services[activeService].title}
                          </h3>
                          <p className="text-royal-blue dark:text-blue-400 font-medium">
                            {services[activeService].shortDesc}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                        {services[activeService].description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                      {/* Features */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Key Features</h4>
                        <ul className="space-y-3">
                          {services[activeService].features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                              <svg className="w-5 h-5 text-royal-blue dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Technologies & Deliverables */}
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Technologies</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                          {services[activeService].technologies.map((tech, index) => (
                            <span key={index} className="px-3 py-1 bg-royal-blue/10 dark:bg-blue-400/10 text-royal-blue dark:text-blue-400 rounded-full text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Deliverables</h4>
                        <ul className="space-y-2">
                          {services[activeService].deliverables.map((deliverable, index) => (
                            <li key={index} className="flex items-center">
                              <svg className="w-4 h-4 text-royal-blue dark:text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-600 dark:text-gray-300 text-sm">{deliverable}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                      <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                          {services[activeService].price}
                        </div>
                        <div className="text-gray-500 dark:text-gray-400">
                          Timeline: {services[activeService].duration}
                        </div>
                      </div>
                      <Link
                        href={`/contact?service=${services[activeService].id}`}
                        className="btn-primary"
                      >
                        {services[activeService].cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our <span className="text-royal-blue dark:text-blue-400">Process</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We follow a proven methodology to deliver exceptional results on time and within budget.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {processSteps.map((step, index) => (
                <div key={index} className="relative group">
                  <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-700 group-hover:border-royal-blue/20 dark:group-hover:border-blue-400/20">
                    <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-blue-600 dark:from-blue-400 dark:to-royal-blue text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      {step.icon}
                    </div>
                    <div className="text-3xl font-bold text-royal-blue dark:text-blue-400 mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                  {index < processSteps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <div className="w-8 h-8 bg-royal-blue/10 dark:bg-blue-400/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-royal-blue dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Client <span className="text-royal-blue dark:text-blue-400">Success Stories</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                See how we've helped businesses transform their digital presence and achieve their goals.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  company: 'Tech Innovators Ltd',
                  role: 'CEO',
                  quote: 'TsvWeb transformed our online presence with a beautiful, functional website that perfectly represents our brand. Their team was professional and responsive throughout the entire process.',
                  rating: 5,
                  project: 'Web Design & Development',
                },
                {
                  name: 'Michael Chen',
                  company: 'Global Solutions',
                  role: 'Marketing Director',
                  quote: 'The e-commerce site TsvWeb built for us has significantly increased our online sales by 150%. Their attention to detail and focus on user experience made all the difference.',
                  rating: 5,
                  project: 'E-commerce Platform',
                },
                {
                  name: 'Emily Rodriguez',
                  company: 'Creative Studios',
                  role: 'Founder',
                  quote: 'Working with TsvWeb was a pleasure from start to finish. They took the time to understand our needs and delivered a website that exceeded our expectations.',
                  rating: 5,
                  project: 'Brand Website',
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-royal-blue/10 to-blue-500/10 dark:from-blue-400/10 dark:to-royal-blue/10 rounded-full flex items-center justify-center mr-4">
                      <svg className="w-8 h-8 text-royal-blue dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.role} at {testimonial.company}
                      </p>
                      <div className="flex items-center mt-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 dark:text-gray-300 italic mb-4 leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="text-sm text-royal-blue dark:text-blue-400 font-medium">
                    Project: {testimonial.project}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-600 dark:from-blue-600 dark:to-royal-blue">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Transform Your Digital Presence?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                Let's discuss your project and create a custom solution that drives results for your business. Get started with a free consultation today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/contact" 
                  className="bg-white text-royal-blue hover:bg-gray-100 font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Get Free Consultation
                </Link>
                <Link 
                  href="/portfolio" 
                  className="border-2 border-white text-white hover:bg-white hover:text-royal-blue font-bold py-4 px-8 rounded-xl transition-all duration-300 inline-flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  View Our Work
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
