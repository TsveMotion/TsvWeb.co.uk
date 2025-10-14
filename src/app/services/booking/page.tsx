"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'

export default function BookingWebsitePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    businessType: '',
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
          projectType: 'booking-website',
          budget: '£45/month',
          timeline: '3-5 days',
          goals: ['online-booking', 'calendar-integration', 'email-notifications'],
          additionalInfo: `Business Type: ${formData.businessType}. ${formData.message}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', business: '', businessType: '', message: '' })
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
      icon: "📅",
      title: "Online Booking System",
      description: "24/7 booking system that lets customers book appointments anytime"
    },
    {
      icon: "📧",
      title: "Email Notifications",
      description: "Automatic email confirmations and reminders for you and your customers"
    },
    {
      icon: "🗓️",
      title: "Calendar Integration",
      description: "Sync with Google Calendar and manage all bookings in one place"
    },
    {
      icon: "👥",
      title: "Customer Management",
      description: "Store customer details and booking history for better service"
    },
    {
      icon: "💳",
      title: "Payment Options",
      description: "Accept deposits or full payments online at booking time"
    },
    {
      icon: "📱",
      title: "Mobile Booking",
      description: "Perfect mobile experience for customers booking on the go"
    }
  ]

  const perfectFor = [
    {
      type: "Barber Shops",
      icon: "✂️",
      features: ["Multiple barbers", "Service selection", "Walk-in management"]
    },
    {
      type: "Hair Salons",
      icon: "💇",
      features: ["Stylist selection", "Treatment booking", "Package deals"]
    },
    {
      type: "Beauty Salons",
      icon: "💅",
      features: ["Treatment menu", "Therapist booking", "Package options"]
    },
    {
      type: "Spas & Wellness",
      icon: "🧖",
      features: ["Room booking", "Package treatments", "Membership options"]
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="Booking Website Birmingham | WordPress Booking System | Salon & Barber Websites"
        description="Birmingham booking website specialists. WordPress booking system for salons, barbers, spas. £45/month. 24/7 online booking, calendar sync. Ready in 3-5 days. Call 07444 358808."
        canonical="https://tsvweb.com/services/booking"
        keywords="booking website Birmingham, online booking system Birmingham, salon website Birmingham, barber booking Birmingham, WordPress booking Birmingham, appointment booking Birmingham, Birmingham booking software, spa booking website Birmingham, beauty salon website Birmingham, online appointment system Birmingham"
      />
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-full text-sm font-bold"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              📅 WordPress Booking Website
            </motion.div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
              Let Customers Book <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Anytime, Anywhere</span><br />
              24/7 Online Booking
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              WordPress booking website perfect for barbers, salons, and service businesses. <br className="hidden md:block" />
              Accept bookings 24/7. Automatic reminders. Calendar sync. Ready in 3-5 days.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <div className="bg-white dark:bg-gray-800 px-8 py-4 rounded-lg shadow-lg border-2 border-teal-600">
                <div className="text-4xl font-black text-teal-600">£45</div>
                <div className="text-gray-600 dark:text-gray-400">/month</div>
                <div className="text-sm text-gray-500 dark:text-gray-500">⚡ Ready in 3-5 days</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="#contact"
                className="inline-block bg-gradient-to-r from-teal-600 to-blue-600 text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
              >
                Get Started Now
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center gap-8 items-center text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">WordPress Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">No Setup Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold">Hosting Included</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Perfect For <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">Your Business</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {perfectFor.map((item, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4">{item.type}</h3>
                <ul className="space-y-2">
                  {item.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300 text-sm">✓ {feature}</li>
                  ))}
                </ul>
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
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-blue-600">To Take Bookings</span>
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

      {/* Contact Form */}
      <section id="contact" className="py-24 bg-gradient-to-br from-teal-600 to-blue-600">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Start Taking Bookings Today
              </h2>
              <p className="text-2xl text-white font-bold">Get your booking website in 3-5 days</p>
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
                  <label className="block text-teal-600 font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-teal-600 font-black mb-3 text-lg">BUSINESS NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.business}
                    onChange={(e) => setFormData({...formData, business: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="Your Salon"
                  />
                </div>
              </div>
              <div>
                <label className="block text-teal-600 font-black mb-3 text-lg">EMAIL</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="john@salon.com"
                />
              </div>
              <div>
                <label className="block text-teal-600 font-black mb-3 text-lg">PHONE</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="07XXX XXXXXX"
                />
              </div>
              <div>
                <label className="block text-teal-600 font-black mb-3 text-lg">BUSINESS TYPE</label>
                <select
                  required
                  value={formData.businessType}
                  onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                >
                  <option value="">Select business type...</option>
                  <option value="barber">Barber Shop</option>
                  <option value="salon">Hair Salon</option>
                  <option value="beauty">Beauty Salon</option>
                  <option value="spa">Spa & Wellness</option>
                  <option value="other">Other Service Business</option>
                </select>
              </div>
              <div>
                <label className="block text-teal-600 font-black mb-3 text-lg">ADDITIONAL INFO (OPTIONAL)</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-teal-600 text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  placeholder="Number of staff, services offered, special requirements..."
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Get My Booking Website →"}
              </button>
              
              {submitStatus === 'success' && (
                <div className="bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Request Sent!</p>
                  <p className="text-sm">We'll contact you within 24 hours to get started!</p>
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
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t-4 border-teal-600">
        <div className="container-custom text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-blue-600 font-bold text-lg transition-colors"
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
