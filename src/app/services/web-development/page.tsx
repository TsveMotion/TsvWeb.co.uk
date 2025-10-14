"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'

export default function WebDevelopmentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    projectType: '',
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
          projectType: 'web-development',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['custom-development', 'modern-tech', 'scalable-solution'],
          additionalInfo: `Project Type: ${formData.projectType}. ${formData.message}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', business: '', projectType: '', message: '' })
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

  const technologies = [
    { name: "React", icon: "⚛️", color: "from-cyan-500 to-blue-500" },
    { name: "Next.js", icon: "▲", color: "from-gray-700 to-black" },
    { name: "Node.js", icon: "🟢", color: "from-green-600 to-green-800" },
    { name: "TypeScript", icon: "📘", color: "from-blue-600 to-blue-800" },
    { name: "MongoDB", icon: "🍃", color: "from-green-500 to-green-700" },
    { name: "Tailwind", icon: "🎨", color: "from-cyan-400 to-blue-500" }
  ]

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast Performance",
      description: "Optimized code and modern frameworks for blazing-fast load times"
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level security with SSL, encryption, and regular security audits"
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      description: "Perfect experience on desktop, tablet, and mobile devices"
    },
    {
      icon: "🚀",
      title: "Scalable Architecture",
      description: "Built to grow with your business from startup to enterprise"
    },
    {
      icon: "🔧",
      title: "Custom Solutions",
      description: "Tailored features and integrations specific to your business needs"
    },
    {
      icon: "📊",
      title: "Analytics Integration",
      description: "Track user behavior, conversions, and business metrics in real-time"
    }
  ]

  const packages = [
    {
      name: "Business Website",
      price: "£30",
      period: "/month",
      setup: "£0 setup fee",
      description: "Perfect for small businesses",
      features: [
        "5-Page Professional Website",
        "Mobile-Responsive Design",
        "Contact Forms",
        "Google Maps Integration",
        "SEO Optimization",
        "SSL Certificate",
        "Free Hosting",
        "Email Support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Custom Development",
      price: "£2000",
      period: " + £150/month",
      setup: "One-time build fee",
      description: "Most popular for growing businesses",
      features: [
        "Custom Design & Features",
        "Advanced Functionality",
        "Database Integration",
        "User Authentication",
        "Admin Dashboard",
        "API Integrations",
        "Payment Processing",
        "Priority Support",
        "Free Revisions",
        "Lifetime Updates"
      ],
      cta: "Start Building",
      popular: true
    },
    {
      name: "Enterprise Solution",
      price: "Custom",
      period: "pricing",
      setup: "Full-scale solution",
      description: "For complex applications",
      features: [
        "Everything in Custom",
        "Multi-User Systems",
        "Advanced Security",
        "Cloud Infrastructure",
        "Microservices Architecture",
        "Real-time Features",
        "Third-party Integrations",
        "Dedicated Dev Team",
        "24/7 Support",
        "SLA Guarantee"
      ],
      cta: "Contact Us",
      popular: false
    }
  ]

  const projectTypes = [
    {
      title: "Web Applications",
      description: "Custom web apps with complex functionality and user management",
      examples: "CRM systems, booking platforms, dashboards"
    },
    {
      title: "E-commerce Platforms",
      description: "Full-featured online stores with inventory and payment systems",
      examples: "Product catalogs, shopping carts, order management"
    },
    {
      title: "Business Websites",
      description: "Professional corporate websites with modern design",
      examples: "Company sites, portfolios, landing pages"
    },
    {
      title: "API Development",
      description: "RESTful APIs and backend services for mobile apps",
      examples: "Mobile backends, integrations, webhooks"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="Web Development Birmingham | Custom Coded Websites Birmingham | Bespoke Development"
        description="Birmingham web development experts. Custom coded websites from £2000. WordPress from £30/month. React, Next.js, Node.js. Fast, secure, scalable. Birmingham's top developers. Call 07444 358808."
        canonical="https://tsvweb.com/services/web-development"
        keywords="web development Birmingham, custom website development Birmingham, bespoke web development Birmingham, Birmingham web developers, web app development Birmingham, React development Birmingham, Next.js Birmingham, custom coded website Birmingham, Birmingham software development, web developer Birmingham"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-full text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              💻 Modern Web Development
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
              Build Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Digital Future</span><br />
              With Expert Developers
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Custom web development using cutting-edge technology. <br className="hidden md:block" />
              Fast, secure, and built to scale. Birmingham's trusted developers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#packages"
                className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
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

            {/* Technologies */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  className={`px-6 py-3 bg-gradient-to-r ${tech.color} text-white rounded-full font-bold flex items-center gap-2`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <span>{tech.icon}</span>
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Types */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Build</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {projectTypes.map((type, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border-l-4 border-indigo-600"
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{type.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{type.description}</p>
                <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                  Examples: {type.examples}
                </p>
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
              Built With <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Modern Standards</span>
            </h2>
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
              Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Packages</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Choose the perfect package for your project
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <motion.div
                key={index}
                className={`relative p-8 rounded-2xl ${
                  pkg.popular 
                    ? 'bg-gradient-to-br from-indigo-600 to-pink-600 text-white shadow-2xl scale-105' 
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
                <p className={`mb-4 ${pkg.popular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pkg.description}
                </p>
                
                <div className="mb-2">
                  <span className="text-5xl font-black">{pkg.price}</span>
                  <span className={`text-xl ${pkg.popular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                    {pkg.period}
                  </span>
                </div>
                <p className={`mb-8 text-sm ${pkg.popular ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
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
                      ? 'bg-white text-indigo-600 hover:bg-gray-100'
                      : 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:shadow-xl'
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
      <section id="contact" className="py-24 bg-gradient-to-br from-indigo-600 to-pink-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Let's Build Something Amazing
              </h2>
              <p className="text-2xl text-white font-bold">Get your free development quote today</p>
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
                  <label className="block text-indigo-600 font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-indigo-600 font-black mb-3 text-lg">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({...formData, business: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="Your Company"
                  />
                </div>
              </div>
              <div>
                <label className="block text-indigo-600 font-black mb-3 text-lg">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-indigo-600 font-black mb-3 text-lg">PHONE</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="07XXX XXXXXX"
                />
              </div>
              <div>
                <label className="block text-indigo-600 font-black mb-3 text-lg">PROJECT TYPE</label>
                <select
                  required
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                >
                  <option value="">Select project type...</option>
                  <option value="web-app">Web Application</option>
                  <option value="ecommerce">E-commerce Platform</option>
                  <option value="business-website">Business Website</option>
                  <option value="api">API Development</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-indigo-600 font-black mb-3 text-lg">PROJECT DETAILS</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-indigo-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="Tell us about your project requirements..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Get My Free Quote →"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Quote Request Sent!</p>
                  <p className="text-sm">We'll send your custom development quote within 24 hours!</p>
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
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t-4 border-indigo-600">
        <div className="container-custom text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-pink-600 font-bold text-lg transition-colors"
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
