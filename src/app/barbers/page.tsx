"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import SimpleSetupWizard from '@/components/setup-wizard/simple-setup-wizard'

export default function BarbersPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    name: '',
    shopName: '',
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
          company: formData.shopName,
          projectType: 'barber-website',
          budget: 'discuss',
          timeline: 'asap',
          goals: ['online-booking', 'photo-gallery'],
          additionalInfo: `Barber shop inquiry from ${formData.shopName}`
        })
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', shopName: '', email: '', phone: '' })
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
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Websites That Bring <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
                More Clients
              </span>
              <br />
              to Your Chair
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Sleek design. Online booking built in. Mobile-ready. <br className="hidden md:block" />
              Stand out in your city and let clients book straight from your site.
            </p>
            <a
              href="#quote-form"
              className="inline-block bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
            >
              Get a Free Barber Website Quote
            </a>
          </motion.div>
        </div>
      </section>

      {/* Visual Showcase Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Clean Design. <span className="text-[#007BFF]">Clean Fade.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { caption: "Show off your freshest cuts", emoji: "✂️" },
              { caption: "Premium look. Premium clients.", emoji: "💈" },
              { caption: "Book online 24/7", emoji: "📱" }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="relative h-96 bg-gradient-to-br from-[#007BFF] to-[#0056D2] overflow-hidden group"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20 group-hover:opacity-30 transition-opacity">
                  {item.emoji}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <p className="text-white text-2xl font-bold">{item.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-blue-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white">
              Everything You Need. <br />
              <span className="text-[#007BFF]">Nothing You Don't.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Online Booking Built In",
                description: "Let clients book straight from your site. No more missed calls. No more double bookings.",
                icon: "📅"
              },
              {
                title: "Fast & Mobile-Friendly",
                description: "Looks sharp on every phone. Loads in seconds. Your clients won't wait around.",
                icon: "⚡"
              },
              {
                title: "Show Off Your Instagram Feed",
                description: "Connect your Instagram. Every fresh cut automatically shows on your site.",
                icon: "📸"
              },
              {
                title: "Easy to Update",
                description: "Change prices, add services, update hours. All from your phone. No tech skills needed.",
                icon: "✏️"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 border-l-4 border-[#007BFF] hover:shadow-xl transition-all duration-300"
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
      <section className="py-24 bg-white dark:bg-gray-900">
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
            <p className="text-2xl text-gray-700 dark:text-gray-300">Your work deserves a site that shows it off.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "The Fade Room",
                location: "Manchester",
                result: "Bookings up 400%"
              },
              {
                name: "Kings Cuts",
                location: "London",
                result: "Fully booked 8 weeks ahead"
              },
              {
                name: "Sharp Edge Barbers",
                location: "Birmingham",
                result: "50+ new clients monthly"
              }
            ].map((shop, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 shadow-lg overflow-hidden group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-80 bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center text-8xl group-hover:scale-110 transition-transform duration-500">
                  💈
                </div>
                <div className="p-8 bg-white dark:bg-gray-800">
                  <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-2">{shop.name}</h3>
                  <p className="text-gray-700 dark:text-gray-300 text-lg mb-4">{shop.location}</p>
                  <p className="text-[#007BFF] font-bold text-xl">✓ {shop.result}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-blue-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {[
              {
                quote: "TsvWeb gets it. They built us a site that looks as good as our cuts. Bookings tripled in the first month. Worth every penny.",
                author: "Jake Morrison",
                shop: "Morrison's Barber Shop, Leeds"
              },
              {
                quote: "Clean site. Easy booking. My clients love it. I love not answering the phone every 5 minutes. Best move I made for my business.",
                author: "Tariq Ahmed",
                shop: "Elite Cuts, Birmingham"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-10 border-l-4 border-[#007BFF] shadow-lg"
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
                  <p className="text-gray-600 dark:text-gray-400">{testimonial.shop}</p>
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
                Book a Free Call
              </h2>
              <p className="text-2xl text-white font-bold">Get Online Fast.</p>
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
                  <label className="block text-[#007BFF] font-black mb-3 text-lg uppercase tracking-wider">Your Name</label>
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
                  <label className="block text-[#007BFF] font-black mb-3 text-lg uppercase tracking-wider">Shop Name</label>
                  <input
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={(e) => setFormData({...formData, shopName: e.target.value})}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                    placeholder="Your Barbershop"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[#007BFF] font-black mb-3 text-lg uppercase tracking-wider">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-300 focus:border-[#007BFF] text-gray-900 text-lg focus:outline-none rounded-lg"
                  placeholder="john@barbershop.com"
                />
              </div>
              <div>
                <label className="block text-[#007BFF] font-black mb-3 text-lg uppercase tracking-wider">Phone</label>
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
                No spam. No pushy sales. Just a genuine conversation about your site.
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
            <h2 className="text-5xl md:text-6xl font-black mb-4 text-gray-900 dark:text-white">
              Common <span className="text-[#007BFF]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "Can clients book directly through my website?",
                answer: "Yes. We build in online booking that syncs with your calendar. Clients pick a time, book, and you get notified. Simple as that. No more phone tag."
              },
              {
                question: "How fast can you build my site?",
                answer: "Most barber sites are live in 1-2 weeks. We don't mess around. You tell us what you want, we build it, you review it, we launch it. Fast and clean."
              },
              {
                question: "What if I want to change my prices or services later?",
                answer: "Easy. You can update everything yourself from your phone. Or just message us and we'll do it for you. No extra charge for simple updates."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-blue-50 dark:bg-gray-800 p-8 border-l-4 border-[#007BFF] shadow-md"
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

      {/* Footer with SEO text */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 border-t-4 border-[#007BFF]">
        <div className="container-custom text-center">
          <p className="text-gray-700 dark:text-gray-300 text-lg max-w-4xl mx-auto leading-relaxed">
            <span className="text-[#007BFF] font-bold">TsvWeb</span> builds websites for barbers, salons, and beauty businesses across the UK. 
            Fast, affordable, and designed to impress. Stand out in your city. Get more clients. Grow your business.
          </p>
        </div>
      </section>

      <Footer />
      
      <SimpleSetupWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </main>
  )
}
