"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'

export default function RestaurantsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/wizard-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          company: formData.businessName,
          projectType: 'restaurant-website',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['online-ordering', 'table-booking', 'menu-display'],
          additionalInfo: formData.message || `Restaurant inquiry from ${formData.businessName}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', businessName: '', email: '', phone: '', message: '' })
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Submission error:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const portfolioItems = [
    {
      type: "Fine Dining",
      business: "The Birmingham Bistro",
      result: "200% increase in online reservations",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      type: "Takeaway",
      business: "Curry House Birmingham",
      result: "50+ online orders per week",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    {
      type: "Café",
      business: "Solihull Coffee & Brunch",
      result: "Ranking #1 for 'brunch Solihull'",
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    }
  ]

  const testimonials = [
    {
      name: "Maria Rossi",
      type: "Italian Restaurant",
      business: "Bella Italia Birmingham",
      location: "Birmingham City Centre",
      quote: "Our website from TsvWeb has transformed our business. Online bookings have tripled and we're fully booked most weekends. The online menu and reservation system are perfect.",
      avatar: "MR"
    },
    {
      name: "Raj Patel",
      type: "Indian Takeaway",
      business: "Spice Garden",
      location: "Edgbaston, Birmingham",
      quote: "We needed a website with online ordering. TsvWeb delivered exactly what we needed at an affordable price. Orders come in automatically and customers love how easy it is.",
      avatar: "RP"
    },
    {
      name: "Emma Thompson",
      type: "Café Owner",
      business: "The Morning Brew",
      location: "Solihull",
      quote: "TsvWeb understood our vision for a cozy, welcoming online presence. The website showcases our menu beautifully and we get enquiries every day. Brilliant service!",
      avatar: "ET"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="Restaurant Website Design in Birmingham | Professional Websites for Restaurants, Cafés & Takeaways"
        description="Expert restaurant website design in Birmingham. Beautiful, mobile-friendly websites with online ordering, table booking & digital menus. Serving Birmingham restaurants, cafés, takeaways & pubs. From £45/month. Free consultation available."
        canonical="https://tsvweb.com/restaurants"
        keywords="restaurant website design Birmingham, Birmingham restaurant web design, restaurant website designer Birmingham, online ordering system Birmingham, table booking website, takeaway website Birmingham, café website design Birmingham, pub website Birmingham, restaurant menu online, food ordering website Birmingham, hospitality website design, Birmingham web design restaurants"
        openGraph={{
          title: "Restaurant Website Design in Birmingham | Professional Websites for Hospitality Businesses",
          description: "Expert restaurant website design in Birmingham. Beautiful, mobile-friendly websites with online ordering, table booking & digital menus for restaurants, cafés, takeaways & pubs. From £45/month.",
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
            "price": "45",
            "priceCurrency": "GBP",
            "priceSpecification": {
              "@type": "UnitPriceSpecification",
              "price": "45",
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
            <motion.div className="text-center lg:text-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
                Websites That Bring <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056D2]">More Customers</span> <br />
                to Your Tables
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
                Online ordering. Table bookings. Menu visibility. <br className="hidden md:block" />
                Get a website that actually brings in more orders and fills your tables.
              </p>
              
              {/* Key Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-8 text-sm sm:text-base">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Online ordering system</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Table booking integration</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Digital menu display</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>From £45/month</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <a
                  href="#quote-form"
                  className="btn-primary text-center flex items-center justify-center space-x-2 text-sm sm:text-base px-6 py-3"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Get a Free Quote</span>
                </a>
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
                  src="/restaurant.png" 
                  alt="Birmingham restaurant website design - online ordering and table booking" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-royal-blue/80 to-transparent flex items-end justify-center p-6">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold mb-2">Built for Hospitality</div>
                    <div className="text-base opacity-90">Websites that bring customers through your door</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Restaurants Choose Us */}
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
              Why Birmingham Restaurants Choose TsvWeb
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Specialist website design for restaurants, cafés, takeaways & pubs. Beautiful designs that showcase your food and bring in more customers.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Online Ordering System",
                description: "Let customers order directly from your website. No commission fees to third-party apps. Keep 100% of your profits.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                title: "Table Booking Integration",
                description: "Accept reservations 24/7 with an integrated booking system. Reduce no-shows and manage your tables efficiently.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Beautiful Menu Display",
                description: "Showcase your dishes with mouth-watering photos. Easy-to-update digital menus that look perfect on any device.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                )
              },
              {
                title: "Local SEO Optimization",
                description: "Rank higher on Google for local searches. We optimize your site so hungry customers find you first.",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                <div className="w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center mb-4 text-royal-blue dark:text-blue-400">
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
              Real Results for Birmingham Restaurants
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              See how we've helped Birmingham food businesses grow their online presence and increase revenue.
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
                  <h3 className="text-2xl font-bold text-center">{item.type}</h3>
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
              What Birmingham Restaurant Owners Say
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it – hear from restaurant owners who've grown their business with us.
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
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.type}</p>
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

      {/* Quote Form Section */}
      <section id="quote-form" className="py-24 bg-gradient-to-br from-[#007BFF] to-[#0056D2]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Let's Grow Your Restaurant Online
              </h2>
              <p className="text-2xl text-white font-bold">Get your free quote today.</p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              className="bg-white p-10 md:p-12 space-y-6 shadow-2xl rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#007BFF] font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-[#007BFF] font-black mb-3 text-lg">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                    placeholder="Your Restaurant"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#007BFF] font-black mb-3 text-lg">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                  placeholder="john@restaurant.com"
                />
              </div>
              <div>
                <label className="block text-[#007BFF] font-black mb-3 text-lg">PHONE</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                  placeholder="07XXX XXXXXX"
                />
              </div>
              <div>
                <label className="block text-[#007BFF] font-black mb-3 text-lg">MESSAGE (OPTIONAL)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                  placeholder="Tell us about your restaurant..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Let's Talk →"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Message Sent!</p>
                  <p className="text-sm">We'll call you within 24 hours. Check your email for confirmation.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-500 text-red-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✗ Something went wrong</p>
                  <p className="text-sm">Please try again or call us at 07444 358808</p>
                </div>
              )}
              
              <p className="text-center text-gray-600 text-sm">
                No spam. No pushy sales. Just a genuine conversation about your restaurant.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
              Common <span className="text-[#007BFF]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Can I update my menu easily?",
                answer: "Yes! You can update your menu, prices, and specials anytime from your phone or computer. No technical skills needed. Or just message us and we'll update it for you — no extra charge."
              },
              {
                question: "Can customers order online?",
                answer: "Absolutely. We build in online ordering that connects to your kitchen. Customers order, you get notified, and orders come in automatically. Simple as that."
              },
              {
                question: "Do you set up delivery links like Uber Eats?",
                answer: "Yes. We can integrate your existing delivery platforms (Uber Eats, Deliveroo, Just Eat) or set up your own ordering system so you keep 100% of the profits."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 p-8 border-l-4 border-[#007BFF]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-black text-[#007BFF] mb-4">{faq.question}</h3>
                <p className="text-gray-700 text-xl leading-relaxed">{faq.answer}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Grow Your Restaurant Online?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Get your professional restaurant website with online ordering and table booking. 
              Start attracting more Birmingham customers today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <a
                href="#quote-form"
                className="bg-white text-royal-blue font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors duration-300 text-lg"
              >
                Book a Free Consultation
              </a>
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
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Menu Updates</span>
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
    </main>
  )
}
