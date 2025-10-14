"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'

export default function WebDesignPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    industry: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

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
          company: formData.business,
          projectType: 'web-design',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['modern-design', 'user-experience', 'brand-identity'],
          additionalInfo: `Industry: ${formData.industry}. ${formData.message}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', business: '', industry: '', message: '' })
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

  const designPrinciples = [
    {
      icon: "🎨",
      title: "Beautiful Design",
      description: "Stunning visuals that capture your brand and engage visitors"
    },
    {
      icon: "👥",
      title: "User-Focused",
      description: "Intuitive navigation and seamless user experience"
    },
    {
      icon: "📱",
      title: "Mobile-First",
      description: "Perfect on every device - phone, tablet, and desktop"
    },
    {
      icon: "⚡",
      title: "Fast Loading",
      description: "Optimized for speed to keep visitors engaged"
    },
    {
      icon: "♿",
      title: "Accessible",
      description: "Designed for everyone, following WCAG standards"
    },
    {
      icon: "🔄",
      title: "Conversion Focused",
      description: "Designed to turn visitors into customers"
    }
  ]

  const packages = [
    {
      name: "Starter Design",
      price: "£30",
      period: "/month",
      setup: "£0 setup",
      description: "Perfect for new businesses",
      features: [
        "5-Page Website Design",
        "Mobile-Responsive Layout",
        "Modern Professional Design",
        "Stock Photos Included",
        "Contact Form",
        "Google Maps",
        "Social Media Links",
        "Free Hosting & SSL"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Premium Design",
      price: "£295",
      period: "one-time",
      setup: "Own it forever",
      description: "Most popular choice",
      features: [
        "Custom Unique Design",
        "Unlimited Pages",
        "Professional Copywriting",
        "Custom Graphics",
        "Advanced Animations",
        "SEO Optimization",
        "Speed Optimization",
        "Analytics Setup",
        "Free Revisions",
        "Priority Support"
      ],
      cta: "Choose Premium",
      popular: true
    },
    {
      name: "Brand Experience",
      price: "Custom",
      period: "pricing",
      setup: "Full branding",
      description: "Complete brand identity",
      features: [
        "Everything in Premium",
        "Brand Strategy",
        "Logo Design",
        "Brand Guidelines",
        "Marketing Materials",
        "Social Media Graphics",
        "Email Templates",
        "Dedicated Designer",
        "Unlimited Revisions",
        "White-Glove Service"
      ],
      cta: "Contact Us",
      popular: false
    }
  ]

  const designStyles = [
    {
      style: "Modern & Minimal",
      description: "Clean, spacious layouts with bold typography",
      bestFor: "Tech, SaaS, Professional Services"
    },
    {
      style: "Bold & Vibrant",
      description: "Eye-catching colors and dynamic elements",
      bestFor: "Creative Agencies, Entertainment, Retail"
    },
    {
      style: "Classic & Professional",
      description: "Timeless elegance with sophisticated details",
      bestFor: "Law Firms, Finance, Corporate"
    },
    {
      style: "Playful & Fun",
      description: "Bright colors, illustrations, and animations",
      bestFor: "Kids Products, Food & Beverage, Events"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="Web Design Birmingham | WordPress Website Design Birmingham | Professional Designers"
        description="Birmingham web design experts. Beautiful WordPress websites from £30/month or £295 one-time. Mobile-first, conversion-focused design. Award-winning Birmingham designers. Call 07444 358808."
        canonical="https://tsvweb.com/services/web-design"
        keywords="web design Birmingham, website design Birmingham, WordPress design Birmingham, Birmingham web designers, professional web design Birmingham, modern website design Birmingham, web designer Birmingham, Birmingham website designer, responsive web design Birmingham, creative web design Birmingham"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-purple-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-purple-600 to-orange-600 text-white rounded-full text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🎨 Award-Winning Design
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
              Designs That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">Make You Stand Out</span><br />
              & Convert Visitors
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Beautiful, modern web design that captures your brand. <br className="hidden md:block" />
              User-focused. Mobile-first. Built to convert. Birmingham's top designers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#packages"
                className="inline-block bg-gradient-to-r from-purple-600 to-orange-600 text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                View Design Packages
              </a>
              <a
                href="#contact"
                className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-black text-xl px-12 py-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                Get Free Mockup
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">100% Custom</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Unlimited Revisions</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">3-5 Day Delivery</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Design Styles */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">Styles</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              We create designs that match your brand personality
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {designStyles.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-purple-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border-l-4 border-purple-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{item.style}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{item.description}</p>
                <p className="text-sm text-purple-600 dark:text-purple-400 font-semibold">
                  Best for: {item.bestFor}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Design Principles */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Our Design <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">Philosophy</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {designPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl mb-6">{principle.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">{principle.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{principle.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section id="packages" className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-orange-600">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the perfect design package for your business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-2xl ${
                  pkg.popular 
                    ? 'bg-gradient-to-br from-purple-600 to-orange-600 text-white shadow-2xl scale-105' 
                    : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                }`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-black">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className={`text-3xl font-black mb-2 ${pkg.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {pkg.name}
                </h3>
                <p className={`mb-4 ${pkg.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pkg.description}
                </p>
                
                <div className="mb-2">
                  <span className="text-5xl font-black">{pkg.price}</span>
                  <span className={`text-xl ${pkg.popular ? 'text-purple-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {pkg.period}
                  </span>
                </div>
                <p className={`mb-8 text-sm ${pkg.popular ? 'text-purple-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {pkg.setup}
                </p>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className={`w-6 h-6 flex-shrink-0 ${pkg.popular ? 'text-yellow-300' : 'text-purple-500'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className={pkg.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`block w-full text-center font-black text-lg px-8 py-4 rounded-lg transition-all duration-300 ${
                    pkg.popular
                      ? 'bg-white text-purple-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-purple-600 to-orange-600 text-white hover:shadow-xl'
                  }`}
                >
                  {pkg.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-gradient-to-br from-purple-600 to-orange-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Let's Design Your Dream Website
              </h2>
              <p className="text-2xl text-white font-bold">Get your free design mockup today</p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-800 p-10 md:p-12 space-y-6 shadow-2xl rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-purple-600 font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-purple-600 font-black mb-3 text-lg">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({...formData, business: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="Your Company"
                  />
                </div>
              </div>
              <div>
                <label className="block text-purple-600 font-black mb-3 text-lg">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-purple-600 font-black mb-3 text-lg">PHONE</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="07XXX XXXXXX"
                />
              </div>
              <div>
                <label className="block text-purple-600 font-black mb-3 text-lg">INDUSTRY</label>
                <input
                  type="text"
                  required
                  value={formData.industry}
                  onChange={(e) => setFormData({...formData, industry: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="e.g., Restaurant, Retail, Professional Services..."
                />
              </div>
              <div>
                <label className="block text-purple-600 font-black mb-3 text-lg">DESIGN PREFERENCES</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-purple-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="Tell us about your design vision, colors you like, websites you admire..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-purple-600 to-orange-600 text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Get My Free Mockup →"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Request Sent!</p>
                  <p className="text-sm">We'll send your free design mockup within 48 hours!</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="bg-red-50 border-2 border-red-500 text-red-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✗ Something went wrong</p>
                  <p className="text-sm">Please try again or call us at 07444 358808</p>
                </div>
              )}
            </motion.form>
          </div>
        </div>
      </section>

      {/* Back to Services */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t-4 border-purple-600">
        <div className="container-custom text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-orange-600 font-bold text-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View All Services
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
