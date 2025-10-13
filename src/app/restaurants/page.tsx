"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import SimpleSetupWizard from '@/components/setup-wizard/simple-setup-wizard'

export default function RestaurantsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  const portfolioItems = [
    {
      trade: "Builder",
      business: "Birmingham Building Services",
      result: "3x more quote requests in first month",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      )
    },
    {
      trade: "Plumber",
      business: "West Midlands Plumbing",
      result: "Now ranking #1 for 'plumber Birmingham'",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    {
      trade: "Electrician",
      business: "Solihull Electrical Solutions",
      result: "50+ new customers from website",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ]

  const testimonials = [
    {
      name: "Mike Thompson",
      trade: "Builder",
      business: "Thompson Building Ltd",
      location: "Erdington, Birmingham",
      quote: "Since getting my website from TsvWeb, I've had to turn work away. The phone doesn't stop ringing. Best investment I've made in my business.",
      avatar: "MT"
    },
    {
      name: "Sarah Jenkins",
      trade: "Electrician",
      business: "Jenkins Electrical",
      location: "Solihull",
      quote: "I was skeptical about needing a website, but TsvWeb made it so easy and affordable. Now I get 5-10 enquiries a week just from Google. Brilliant service.",
      avatar: "SJ"
    },
    {
      name: "Dave Wilson",
      trade: "Plumber",
      business: "Wilson Plumbing Services",
      location: "Birmingham City Centre",
      quote: "The lads at TsvWeb understand tradespeople. They built me a simple, professional site that brings in work. No fancy stuff, just what I needed.",
      avatar: "DW"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="Restaurant Website Design Birmingham | Online Ordering & Table Booking | TsvWeb"
        description="Professional restaurant website design in Birmingham. Online ordering systems, table booking & mobile-friendly menus. Perfect for restaurants, cafés, takeaways & pubs. From £40/month with free consultation."
        canonical="https://tsvweb.com/restaurants"
        keywords="restaurant website design Birmingham, online ordering system, table booking website, takeaway website Birmingham, café website design, pub website, restaurant menu online, food ordering website, Birmingham restaurant web design, hospitality website design"
        openGraph={{
          title: "Restaurant Website Design Birmingham | Online Ordering & Table Bookings",
          description: "Beautiful, mobile-friendly restaurant websites with online ordering and table booking. Perfect for Birmingham restaurants, cafés, takeaways & pubs. From £40/month.",
          url: "https://tsvweb.com/restaurants",
          type: "website",
          images: [{
            url: "https://tsvweb.com/restaurant.png",
            width: 1200,
            height: 630,
            alt: "Birmingham Restaurant Website Design Services"
          }]
        }}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "Restaurant Website Design & Development",
          "provider": {
            "@type": "Organization",
            "name": "TsvWeb",
            "url": "https://tsvweb.com",
            "telephone": "+44-07444-358808",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Birmingham",
              "addressCountry": "GB"
            }
          },
          "areaServed": {
            "@type": "City",
            "name": "Birmingham"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Restaurants, Cafés, Takeaways, Pubs, Food & Beverage Businesses"
          },
          "offers": {
            "@type": "Offer",
            "price": "30",
            "priceCurrency": "GBP",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "40",
              "priceCurrency": "GBP",
              "unitText": "MONTH"
            }
          },
          "description": "Professional website design for Birmingham restaurants, cafés, takeaways and pubs. Features include online ordering systems, table booking, mobile-friendly menus, and SEO optimization to attract more customers."
        }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div className="text-center lg:text-left" {...fadeInUp}>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Restaurant Website Design in <span className="text-orange-600">Birmingham</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Get more bookings & online orders with a beautiful, mobile-friendly website. Perfect for restaurants, cafés, takeaways & pubs.
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-8 text-sm sm:text-base">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Show up on Google</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Get more phone calls</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Look professional</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>From £30/month</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="btn-primary text-center flex items-center justify-center space-x-2 text-sm sm:text-base px-6 py-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Get a Free Quote</span>
                </button>
                <a href="tel:+4407444358808" className="btn-secondary text-center text-sm sm:text-base px-6 py-3">
                  Call: 07444 358808
                </a>
              </div>
            </motion.div>
            <motion.div 
              className="relative h-64 md:h-96 lg:h-[500px] mt-8 lg:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 rounded-lg overflow-hidden">
                <img 
                  src="/trades.png" 
                  alt="Birmingham tradespeople - builders, electricians, plumbers" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/80 to-transparent flex items-end justify-center p-6">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">Built for Trades</div>
                    <div className="text-base opacity-90">Professional websites that win you more work</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Trades Choose Us */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Birmingham Tradespeople Choose TsvWeb
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Specialist website design for builders, plumbers, electricians & roofers. No jargon, no fuss – just professional websites that bring you more work.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Easy to Update",
                description: "Change your phone number, add photos, update prices – all by yourself, anytime.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              {
                title: "Looks Great on Mobile",
                description: "Most customers will find you on their phone. Your site will look perfect on every device.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Rank Higher on Google",
                description: "We build your site to show up when people search for your trade in Birmingham.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                )
              },
              {
                title: "Affordable Monthly Plans",
                description: "From £30/month. No huge upfront costs. Cancel anytime.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center mb-4 text-royal-blue dark:text-royal-blue-light">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Real Results for Real Tradespeople
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              See how we've helped Birmingham trades grow their business online.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="bg-gradient-to-br from-royal-blue to-royal-blue-dark p-8 text-white">
                  <div className="flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-center">{item.trade}</h3>
                </div>
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{item.business}</h4>
                  <div className="flex items-start space-x-2 text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="font-medium">{item.result}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              What Birmingham Tradespeople Say
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it – hear from trades who've grown their business with us.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-royal-blue dark:bg-blue-600 flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.trade}</p>
                    <p className="text-xs text-royal-blue dark:text-blue-400 font-medium">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                
                {/* Star Rating */}
                <div className="flex items-center mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-royal-blue to-royal-blue-dark">
        <div className="container-custom">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Let's Build Your Site This Week</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Get your professional tradesperson website up and running in days, not months. 
              Start getting more calls and quotes from Birmingham customers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => setIsWizardOpen(true)}
                className="bg-white text-royal-blue font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg"
              >
                Book a Free Call
              </button>
              <a 
                href="tel:+4407444358808" 
                className="border-2 border-white text-white font-semibold py-4 px-8 rounded-lg hover:bg-white hover:text-royal-blue transition-colors duration-300 text-lg"
              >
                Call: 07444 358808
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-sm opacity-90">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Long Contracts</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Birmingham Based</span>
              </div>
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
