'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import SimpleSetupWizard from '@/components/setup-wizard/simple-setup-wizard'
import { useState } from 'react'
import Link from 'next/link'

export default function ServicesPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  // Monthly Website Plans (WordPress)
  const monthlyPlans = [
    {
      title: 'WordPress Website & Hosting',
      description: 'WordPress website with modern design, hosting included, zero upfront.',
      price: '£30',
      period: '/month',
      timeframe: '3–5 days',
      link: '/services/web-design',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      features: ['WordPress CMS', 'Responsive Design', 'Mobile-Friendly', 'SEO Optimized']
    },
    {
      title: 'WordPress E-commerce',
      description: 'WordPress WooCommerce store with payment gateway, SSL, and full shop setup.',
      price: '£50',
      period: '/month',
      timeframe: '3–5 days',
      link: '/services/ecommerce',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      features: ['WooCommerce', 'Payment Gateway', 'Product Management', 'Inventory System']
    },
    {
      title: 'WordPress Booking Site',
      description: 'WordPress booking website for barbers, salons, or service businesses.',
      price: '£45',
      period: '/month',
      timeframe: '3–5 days',
      link: '/services/booking',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: ['WordPress', 'Online Booking', 'Email Notifications', 'Calendar Integration']
    },
    {
      title: 'WordPress Portfolio',
      description: 'WordPress portfolio website with beautiful image/video galleries and SEO.',
      price: '£35',
      period: '/month',
      timeframe: '3–5 days',
      link: '/services/portfolio',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      features: ['WordPress', 'Image Galleries', 'Video Support', 'Portfolio Showcase']
    }
  ]

  // One-Time Packages (WordPress)
  const oneTimePackages = [
    {
      title: 'WordPress Website',
      subtitle: '(Business Site)',
      description: 'Professional 5-page WordPress website with mobile optimization.',
      price: 'From £295',
      link: '/services/web-design',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    },
    {
      title: 'WordPress E-commerce',
      subtitle: '(WooCommerce)',
      description: 'Fully functional WordPress online store with WooCommerce and payment integration.',
      price: 'From £395',
      link: '/services/ecommerce',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      )
    },
    {
      title: 'Custom Coded Website',
      subtitle: '(Fully Bespoke)',
      description: 'Fully custom-coded website built from scratch with advanced features. Contact for quote.',
      price: 'Contact Us',
      link: '/services/web-development',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    }
  ]

  // Design & Branding
  const brandingServices = [
    {
      title: 'Logo Design',
      description: 'Professional logo with 3 concept options and revisions.',
      price: 'From £50'
    },
    {
      title: 'Business Cards & Branding Pack',
      description: 'Matching business card, letterhead, and social media kit.',
      price: 'From £75'
    },
    {
      title: 'Website Rebranding',
      description: 'Refresh outdated websites with new visuals and layout.',
      price: 'From £150'
    }
  ]

  // Marketing & Growth
  const marketingServices = [
    {
      title: 'SEO Optimisation',
      description: 'Full on-page optimisation, speed, tags, and ranking improvements.',
      price: 'From £100',
      link: '/services/seo'
    },
    {
      title: 'Google & Meta Ads Management',
      description: 'Monthly ad campaign setup and management.',
      price: 'From £150/month'
    },
    {
      title: 'Social Media Setup',
      description: 'Branded setup for Facebook, Instagram, TikTok, LinkedIn.',
      price: 'From £60'
    },
    {
      title: 'Email Marketing Setup',
      description: 'Mailchimp or Brevo setup with newsletter template.',
      price: 'From £75'
    }
  ]

  // Add-Ons
  const addOns = [
    {
      title: 'Domain Registration & DNS Setup',
      description: 'Secure domain name and DNS configuration.',
      price: '£20–£30'
    },
    {
      title: 'Maintenance & Updates',
      description: 'Monthly plugin updates and security checks.',
      price: '£20/month'
    },
    {
      title: 'Content Writing (SEO-Friendly)',
      description: 'Website text written for ranking and conversions.',
      price: 'From £50/page'
    },
    {
      title: 'Analytics & Reporting',
      description: 'Monthly traffic report and performance insights.',
      price: '£30/month'
    }
  ]

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Professional <span className="text-[#007BFF]">Web Design</span> & Digital Services
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              Affordable, high-quality websites and digital solutions for businesses of all sizes. 
              From monthly plans to one-time packages, we've got you covered.
            </p>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Get Started Today
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </motion.div>
        </div>
      </section>

      {/* Monthly Website Plans */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🌐 <span className="text-[#007BFF]">Monthly WordPress Plans</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Pay monthly with no upfront costs. All WordPress plans include hosting, SSL, and ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {monthlyPlans.map((plan, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 border-2 border-[#EAF2FF] dark:border-gray-700 hover:border-[#007BFF] group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-[#007BFF] mb-4 group-hover:scale-110 transition-transform duration-300">
                  {plan.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{plan.description}</p>
                
                <div className="mb-4">
                  <div className="text-3xl font-bold text-[#007BFF]">
                    {plan.price}<span className="text-lg text-gray-500 dark:text-gray-400">{plan.period}</span>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">⚡ {plan.timeframe}</div>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="space-y-2">
                  <button
                    onClick={() => setIsWizardOpen(true)}
                    className="w-full py-3 bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Get Started
                  </button>
                  {plan.link && (
                    <Link
                      href={plan.link}
                      className="block w-full py-3 bg-white dark:bg-gray-700 text-[#007BFF] dark:text-blue-400 font-semibold rounded-lg border-2 border-[#007BFF] dark:border-blue-400 hover:bg-[#007BFF] hover:text-white dark:hover:bg-blue-600 transition-all duration-300 text-center"
                    >
                      Learn More →
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* One-Time Packages */}
      <section className="py-20 bg-gradient-to-br from-[#EAF2FF] to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              💻 <span className="text-[#007BFF]">One-Time Website Packages</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              WordPress websites or fully custom-coded solutions. One-time payment, own it forever.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {oneTimePackages.map((pkg, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-[#007BFF] mb-4 flex justify-center">
                  {pkg.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{pkg.title}</h3>
                {pkg.subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{pkg.subtitle}</p>}
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{pkg.description}</p>
                <div className="text-2xl font-bold text-[#007BFF] mb-4">{pkg.price}</div>
                {pkg.link ? (
                  <Link
                    href={pkg.link}
                    className="block w-full py-3 bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-300"
                  >
                    Learn More →
                  </Link>
                ) : (
                  <button
                    onClick={() => setIsWizardOpen(true)}
                    className="w-full py-3 bg-white dark:bg-gray-900 border-2 border-[#007BFF] text-[#007BFF] font-semibold rounded-lg hover:bg-[#007BFF] hover:text-white transition-all duration-300"
                  >
                    Get Quote
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Design & Branding */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🎨 <span className="text-[#007BFF]">Design & Branding</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Professional branding services to make your business stand out.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {brandingServices.map((service, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-[#EAF2FF] dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-[#007BFF]/10 dark:border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{service.description}</p>
                <div className="text-xl font-bold text-[#007BFF]">{service.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Marketing & Growth */}
      <section className="py-20 bg-gradient-to-br from-[#EAF2FF] to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🚀 <span className="text-[#007BFF]">Marketing & Growth</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Drive traffic, increase visibility, and grow your online presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketingServices.map((service, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{service.description}</p>
                <div className="text-lg font-bold text-[#007BFF] mb-3">{service.price}</div>
                {service.link && (
                  <Link
                    href={service.link}
                    className="inline-flex items-center text-[#007BFF] hover:text-[#0056D2] font-semibold text-sm transition-colors"
                  >
                    Learn More →
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add-Ons & Extras */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🧩 <span className="text-[#007BFF]">Add-On Services</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Enhance your website with additional features and ongoing support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {addOns.map((addon, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-white to-[#EAF2FF] dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-[#007BFF]/10 dark:border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{addon.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{addon.description}</p>
                <div className="text-lg font-bold text-[#007BFF]">{addon.price}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="py-20 bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
        <div className="container-custom">
          <motion.div 
            className="text-center text-white max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Let's Build Your Website Today
            </h2>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Get started with affordable monthly plans or one-time packages. 
              Fast delivery, professional results, and ongoing support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="px-8 py-4 bg-white text-[#007BFF] font-semibold rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                Get Free Quote
              </button>
              <a
                href="tel:+4407444358808"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#007BFF] transition-all duration-300"
              >
                Call: 07444 358808
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

      {/* Setup Wizard Modal */}
      <SimpleSetupWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </main>
  )
}
