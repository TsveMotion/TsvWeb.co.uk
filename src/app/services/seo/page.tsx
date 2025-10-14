"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'

export default function SEOServicePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
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
          company: formData.website,
          projectType: 'seo-optimization',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['improve-rankings', 'increase-traffic', 'local-seo'],
          additionalInfo: formData.message || `SEO inquiry for ${formData.website}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', website: '', message: '' })
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
      icon: "🎯",
      title: "Keyword Research & Strategy",
      description: "Target the right keywords that your Birmingham customers are actually searching for"
    },
    {
      icon: "⚡",
      title: "Technical SEO Optimization",
      description: "Lightning-fast loading speeds, mobile optimization, and clean code structure"
    },
    {
      icon: "📍",
      title: "Local SEO Domination",
      description: "Rank #1 in Birmingham local searches and Google Maps results"
    },
    {
      icon: "📊",
      title: "Content Optimization",
      description: "SEO-friendly content that ranks high and converts visitors into customers"
    },
    {
      icon: "🔗",
      title: "Link Building",
      description: "High-quality backlinks from authoritative Birmingham and UK websites"
    },
    {
      icon: "📈",
      title: "Analytics & Reporting",
      description: "Monthly reports showing your ranking improvements and traffic growth"
    }
  ]

  const results = [
    {
      metric: "300%",
      label: "Average Traffic Increase",
      description: "Within 6 months"
    },
    {
      metric: "#1",
      label: "Google Rankings",
      description: "For local searches"
    },
    {
      metric: "85%",
      label: "More Leads",
      description: "From organic search"
    }
  ]

  const packages = [
    {
      name: "SEO Starter",
      price: "£100",
      period: "one-time",
      description: "Perfect for new websites",
      features: [
        "Full SEO Audit",
        "Keyword Research (10 keywords)",
        "On-Page Optimization",
        "Meta Tags & Descriptions",
        "Google Search Console Setup",
        "Basic Technical SEO"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "SEO Pro",
      price: "£250",
      period: "/month",
      description: "Most popular for growing businesses",
      features: [
        "Everything in Starter",
        "Advanced Keyword Research (30+ keywords)",
        "Monthly Content Optimization",
        "Link Building Campaign",
        "Local SEO Optimization",
        "Google My Business Optimization",
        "Monthly Performance Reports",
        "Competitor Analysis"
      ],
      cta: "Start Ranking",
      popular: true
    },
    {
      name: "SEO Enterprise",
      price: "£500",
      period: "/month",
      description: "For serious market domination",
      features: [
        "Everything in Pro",
        "Unlimited Keywords",
        "Weekly Content Creation",
        "Advanced Link Building",
        "Multi-Location SEO",
        "E-commerce SEO",
        "Weekly Reports & Calls",
        "Dedicated SEO Manager",
        "Priority Support"
      ],
      cta: "Dominate Search",
      popular: false
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              🚀 #1 SEO Agency in Birmingham
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
              Rank <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">#1 on Google</span><br />
              Get More Customers
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional SEO services that actually work. <br className="hidden md:block" />
              300% more traffic. 85% more leads. Guaranteed results in Birmingham.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#packages"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                View SEO Packages
              </a>
              <a
                href="#contact"
                className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-black text-xl px-12 py-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                Free SEO Audit
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Guaranteed Results</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">No Long Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Birmingham Experts</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {results.map((result, index) => (
              <motion.div
                key={index}
                className="text-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                  {result.metric}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{result.label}</h3>
                <p className="text-gray-600 dark:text-gray-400">{result.description}</p>
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
              Complete <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">SEO Solution</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to dominate Google search results in Birmingham
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
              SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the perfect SEO package for your Birmingham business
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-2xl ${
                  pkg.popular 
                    ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl scale-105' 
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
                <p className={`mb-6 ${pkg.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pkg.description}
                </p>
                
                <div className="mb-8">
                  <span className="text-5xl font-black">{pkg.price}</span>
                  <span className={`text-xl ${pkg.popular ? 'text-blue-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {pkg.period}
                  </span>
                </div>

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
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl'
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
      <section id="contact" className="py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Get Your Free SEO Audit
              </h2>
              <p className="text-2xl text-white font-bold">See exactly how we'll rank you #1 in Birmingham</p>
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
                  <label className="block text-blue-600 font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-blue-600 font-black mb-3 text-lg">YOUR WEBSITE</label>
                  <input
                    type="text"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="yourwebsite.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-blue-600 font-black mb-3 text-lg">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="john@business.com"
                />
              </div>
              <div>
                <label className="block text-blue-600 font-black mb-3 text-lg">PHONE</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="07XXX XXXXXX"
                />
              </div>
              <div>
                <label className="block text-blue-600 font-black mb-3 text-lg">MESSAGE (OPTIONAL)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-blue-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="Tell us about your SEO goals..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Get My Free SEO Audit →"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Request Sent!</p>
                  <p className="text-sm">We'll send your free SEO audit within 24 hours!</p>
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
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t-4 border-blue-600">
        <div className="container-custom text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-bold text-lg transition-colors"
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
