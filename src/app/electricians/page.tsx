"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'

export default function ElectriciansPage() {
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
          projectType: 'electrician-website',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['local-seo', 'certifications', 'quote-forms'],
          additionalInfo: `Electrician business inquiry from ${formData.businessName}`
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
              Professional Websites That <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
                Power Your Electrical Business
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Show your certifications. Get more local jobs in Birmingham. Build trust with customers. <br className="hidden md:block" />
              Websites built for Birmingham electricians who want to grow.
            </p>
            <a
              href="#quote-form"
              className="inline-block bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
            >
              Request Your Free Quote
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
              Built for <span className="text-[#007BFF]">Professional Electricians</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Show Your Certifications",
                description: "Display your NICEIC, NAPIT, or other certifications prominently. Build instant trust with potential customers.",
                icon: "⚡"
              },
              {
                title: "Get More Local Jobs",
                description: "Optimized for local searches. Show up when people search for electricians in your area. More visibility, more jobs.",
                icon: "📍"
              },
              {
                title: "Fast, Responsive Sites",
                description: "Loads in seconds on any device. Customers can find your number and contact you instantly from their phones.",
                icon: "📱"
              },
              {
                title: "Built for Google Visibility",
                description: "SEO-optimized from day one. Rank higher in search results and get found by more customers looking for electricians.",
                icon: "🔍"
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
              Websites We've Built
            </h2>
            <p className="text-2xl text-gray-700 dark:text-gray-300">Real electricians. Real results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: "Spark Electrical Services",
                location: "Birmingham City Centre",
                result: "5x more quote requests"
              },
              {
                name: "PowerUp Electricians",
                location: "Solihull, Birmingham",
                result: "Fully booked 3 weeks ahead"
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
                  ⚡
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
                quote: "TsvWeb built us a professional site that shows our NICEIC certification front and center. Quote requests across Birmingham have gone through the roof. Brilliant work.",
                author: "David Richards",
                business: "Richards Electrical, Edgbaston"
              },
              {
                quote: "Clean, fast, and professional. Customers in Birmingham can see we're certified and trusted. Best investment we've made for the business.",
                author: "Paul Henderson",
                business: "Henderson Electrics, Sutton Coldfield"
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
                <p className="text-2xl text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t border-gray-300 dark:border-gray-600 pt-6">
                  <p className="text-[#007BFF] font-black text-xl">{testimonial.author}</p>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">{testimonial.business}</p>
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
                Get Your Website Live This Week
              </h2>
              <p className="text-2xl text-white font-bold">Fast, professional, and built for electricians.</p>
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
                    placeholder="Your Electrical Business"
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
                  placeholder="john@electrical.com"
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
                question: "Can you include my NICEIC logo?",
                answer: "Absolutely. We'll prominently display your NICEIC, NAPIT, or any other certifications you have. It builds trust and shows customers you're qualified and insured."
              },
              {
                question: "Will I get more local jobs?",
                answer: "Yes. We optimize your site for local searches so you show up when people search for electricians in your area. More visibility means more jobs."
              },
              {
                question: "How fast can my site be ready?",
                answer: "Most electrician sites are live in 1-2 weeks. We work fast and don't waste time. You review it, approve it, and we launch it."
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
                <p className="text-gray-700 dark:text-gray-300 text-xl leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer SEO Section */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-t-4 border-[#007BFF]">
        <div className="container-custom text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            <span className="text-[#007BFF] font-bold">TsvWeb</span> builds websites for electricians across Birmingham and the West Midlands. 
            Professional, fast, and optimized for local searches. Show your certifications. Get more jobs in Birmingham. Grow your electrical business.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  )
}
