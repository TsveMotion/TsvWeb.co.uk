"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'

export default function PlumbersPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: ''
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
          projectType: 'plumber-website',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['local-seo', 'google-maps', '24-7-callouts'],
          additionalInfo: `Plumbing business inquiry from ${formData.businessName}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', businessName: '', email: '', phone: '' })
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

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900 text-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
              Websites That Keep <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
                Your Phone Ringing 24/7
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Rank higher on Google Maps in Birmingham. Show you're reliable. Get more emergency callouts. <br className="hidden md:block" />
              Built for Birmingham plumbers who want more local jobs.
            </p>
            <a
              href="#quote-form"
              className="inline-block bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
            >
              Get a Free Quote in 24 Hours
            </a>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
              Everything a <span className="text-[#007BFF]">Plumber Needs</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Rank Higher on Google Maps",
                description: "Show up when locals search 'plumber near me.' We optimize your site for local searches so you get found first.",
                icon: "📍"
              },
              {
                title: "24/7 Callout Pages",
                description: "Dedicated emergency pages that show you're available round the clock. Build trust and get more urgent jobs.",
                icon: "🚨"
              },
              {
                title: "Fast, Mobile-Ready Design",
                description: "Most people call plumbers from their phones. Your site loads fast and looks perfect on every device.",
                icon: "📱"
              },
              {
                title: "Built to Earn Trust",
                description: "Show your certifications, reviews, and service areas. Make customers confident they're calling the right plumber.",
                icon: "✓"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 dark:bg-gray-800 p-8 border-l-4 border-[#007BFF] hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl mb-6">{benefit.icon}</div>
                <h3 className="text-2xl font-black mb-4 text-[#007BFF]">{benefit.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-24 bg-blue-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Sites We've Built
            </h2>
            <p className="text-2xl text-gray-700 dark:text-gray-300">Real Birmingham plumbers. Real results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Birmingham Emergency Plumbing",
                location: "Birmingham City Centre",
                result: "3x more emergency callouts"
              },
              {
                name: "Edgbaston Plumbing Services",
                location: "Edgbaston, Birmingham",
                result: "Ranking #1 for 'plumber near me Birmingham'"
              }
            ].map((business, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 shadow-lg overflow-hidden group rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-80 bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center text-9xl group-hover:scale-110 transition-transform duration-500">
                  🔧
                </div>
                <div className="p-8 bg-white dark:bg-gray-900">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{business.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">{business.location}</p>
                  <p className="text-[#007BFF] font-bold text-xl">✓ {business.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              {
                quote: "TsvWeb built us a site that actually brings in jobs. We're ranking on Google Maps in Birmingham now and getting calls every day. Worth every penny.",
                author: "Mike Thompson",
                business: "Thompson Plumbing, Birmingham"
              },
              {
                quote: "Simple, fast, and it works. Customers can find us easily across Birmingham and we look professional. Best decision we made for the business.",
                author: "James Carter",
                business: "Carter & Sons Plumbing, Solihull"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 dark:bg-gray-800 p-10 border-l-4 border-[#007BFF] shadow-lg"
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-[#007BFF] text-3xl">★</span>
                  ))}
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">"{testimonial.quote}"</p>
                <div className="border-t-2 border-[#007BFF] pt-4">
                  <p className="text-[#007BFF] font-black text-lg">{testimonial.author}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
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
                Need More Calls?
              </h2>
              <p className="text-2xl text-white font-bold">Let's talk.</p>
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
                  <label className="block text-[#007BFF] font-black mb-3 text-lg">YOUR NAME</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-[#007BFF] text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
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
                    className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-[#007BFF] text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                    placeholder="Your Plumbing Business"
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
                  placeholder="john@plumbing.com"
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
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : "Get Your Free Quote →"}
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
                No spam. No pushy sales. Just a genuine conversation about your business.
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
            <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-4">
              Common <span className="text-[#007BFF]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Can you help me rank locally on Google?",
                answer: "Yes. We optimize your site for local searches like 'plumber near me' and 'emergency plumber [your area].' We also set up your Google Business Profile properly so you show up on Google Maps."
              },
              {
                question: "How fast can my website be live?",
                answer: "Most plumber sites are live in 1-2 weeks. We don't mess around. You tell us what you need, we build it, you review it, we launch it. Fast and professional."
              },
              {
                question: "Can I show my service areas on the site?",
                answer: "Absolutely. We can add a map showing exactly where you cover, plus dedicated pages for each area you serve. Great for local SEO."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 dark:bg-gray-800 p-8 border-l-4 border-[#007BFF]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-black text-[#007BFF] mb-4">{faq.question}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer SEO Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-t-4 border-[#007BFF]">
        <div className="container-custom text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            <span className="text-[#007BFF] font-bold">TsvWeb</span> builds websites for plumbers across Birmingham. and the West Midlands. 
            Fast, affordable, and optimized for Google Maps. Get more emergency callouts. Rank higher in Birmingham. Grow your plumbing business.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
