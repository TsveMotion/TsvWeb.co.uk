"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'

export default function EcommercePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    products: '',
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
          projectType: 'ecommerce-website',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['online-store', 'payment-gateway', 'product-management'],
          additionalInfo: `E-commerce inquiry - Products: ${formData.products}. ${formData.message}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', business: '', products: '', message: '' })
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

  const features = [
    {
      icon: "🛒",
      title: "Complete Online Store",
      description: "Beautiful product pages, shopping cart, and seamless checkout experience"
    },
    {
      icon: "💳",
      title: "Secure Payment Gateway",
      description: "Accept all major cards, PayPal, Apple Pay, and Google Pay securely"
    },
    {
      icon: "📦",
      title: "Inventory Management",
      description: "Track stock levels, manage variants, and automate low-stock alerts"
    },
    {
      icon: "📱",
      title: "Mobile Shopping",
      description: "Fully responsive design optimized for mobile shoppers"
    },
    {
      icon: "🚚",
      title: "Shipping Integration",
      description: "Automated shipping calculations and tracking for UK and worldwide"
    },
    {
      icon: "📊",
      title: "Sales Analytics",
      description: "Real-time dashboard showing sales, revenue, and customer insights"
    }
  ]

  const packages = [
    {
      name: "E-commerce Starter",
      price: "£50",
      period: "/month",
      setup: "£0 setup",
      description: "Perfect for small shops",
      features: [
        "Up to 50 Products",
        "Secure Payment Gateway",
        "Mobile-Optimized Design",
        "SSL Certificate Included",
        "Basic SEO Setup",
        "Email Support",
        "Free Hosting Included",
        "Product Management System"
      ],
      cta: "Start Selling",
      popular: false
    },
    {
      name: "E-commerce Pro",
      price: "£395",
      period: "one-time",
      setup: "No monthly fees",
      description: "Most popular - Own it forever",
      features: [
        "Unlimited Products",
        "Advanced Payment Options",
        "Premium Design Templates",
        "Full SEO Optimization",
        "Inventory Management",
        "Discount & Coupon System",
        "Customer Accounts",
        "Email Marketing Integration",
        "Analytics Dashboard",
        "Priority Support"
      ],
      cta: "Get Started",
      popular: true
    },
    {
      name: "E-commerce Enterprise",
      price: "Custom",
      period: "pricing",
      setup: "Tailored solution",
      description: "For serious online retailers",
      features: [
        "Everything in Pro",
        "Multi-Currency Support",
        "Advanced Shipping Rules",
        "Wholesale Portal",
        "Multi-Warehouse Management",
        "Custom Integrations",
        "Dedicated Account Manager",
        "24/7 Priority Support",
        "Custom Features",
        "Migration Assistance"
      ],
      cta: "Contact Us",
      popular: false
    }
  ]

  const benefits = [
    {
      stat: "24/7",
      label: "Always Open",
      description: "Sell while you sleep"
    },
    {
      stat: "3-5 Days",
      label: "Quick Launch",
      description: "Start selling fast"
    },
    {
      stat: "100%",
      label: "Secure",
      description: "SSL & PCI compliant"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="E-commerce Website Birmingham | WordPress WooCommerce Birmingham | Online Store"
        description="Birmingham e-commerce website design. WordPress WooCommerce experts. From £50/month or £395 one-time. Secure payments, mobile-optimized. Start selling in Birmingham today. Call 07444 358808."
        canonical="https://tsvweb.com/services/ecommerce"
        keywords="ecommerce website Birmingham, WooCommerce Birmingham, online store Birmingham, e-commerce development Birmingham, Birmingham online shop, WordPress ecommerce Birmingham, ecommerce web design Birmingham, Birmingham web shop, online shopping website Birmingham, ecommerce developer Birmingham"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              💰 Start Selling Online Today
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
              Launch Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Online Store</span><br />
              in 3-5 Days
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional e-commerce websites built for Birmingham businesses. <br className="hidden md:block" />
              Secure payments. Easy management. Start selling 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#packages"
                className="inline-block bg-gradient-to-r from-green-600 to-blue-600 text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                View Packages
              </a>
              <a
                href="#contact"
                className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-black text-xl px-12 py-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                Get Free Quote
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Mobile Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Fast Setup</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-4">
                  {benefit.stat}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{benefit.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Everything You Need <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">To Sell Online</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Professional e-commerce features that help you sell more
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl mb-6">{feature.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{feature.description}</p>
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
              E-commerce <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the perfect package for your online store
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-2xl ${
                  pkg.popular 
                    ? 'bg-gradient-to-br from-green-600 to-blue-600 text-white shadow-2xl scale-105' 
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
                <p className={`mb-4 ${pkg.popular ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pkg.description}
                </p>
                
                <div className="mb-2">
                  <span className="text-5xl font-black">{pkg.price}</span>
                  <span className={`text-xl ${pkg.popular ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {pkg.period}
                  </span>
                </div>
                <p className={`mb-8 text-sm ${pkg.popular ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'}`}>
                  {pkg.setup}
                </p>

                <ul className="space-y-4 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className={`w-6 h-6 flex-shrink-0 ${pkg.popular ? 'text-yellow-300' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
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
                      ? 'bg-white text-green-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-xl'
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
      <section id="contact" className="py-24 bg-gradient-to-br from-green-600 to-blue-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Start Selling Online
              </h2>
              <p className="text-2xl text-white font-bold">Get your free e-commerce quote today</p>
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
                  <label className="block text-green-600 font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-green-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-green-600 font-black mb-3 text-lg">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({...formData, business: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-green-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="Your Shop"
                  />
                </div>
              </div>
              <div>
                <label className="block text-green-600 font-black mb-3 text-lg">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-green-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="john@shop.com"
                />
              </div>
              <div>
                <label className="block text-green-600 font-black mb-3 text-lg">PHONE</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-green-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="07XXX XXXXXX"
                />
              </div>
              <div>
                <label className="block text-green-600 font-black mb-3 text-lg">WHAT WILL YOU SELL?</label>
                <input
                  type="text"
                  required
                  value={formData.products}
                  onChange={(e) => setFormData({...formData, products: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-green-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="e.g., Clothing, Electronics, Handmade goods..."
                />
              </div>
              <div>
                <label className="block text-green-600 font-black mb-3 text-lg">MESSAGE (OPTIONAL)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-green-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="Tell us about your online store vision..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-green-600 to-blue-600 text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Get My Free Quote →"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Quote Request Sent!</p>
                  <p className="text-sm">We'll send your custom e-commerce quote within 24 hours!</p>
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
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t-4 border-green-600">
        <div className="container-custom text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-green-600 hover:text-blue-600 font-bold text-lg transition-colors"
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
