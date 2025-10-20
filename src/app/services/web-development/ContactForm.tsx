"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function ContactForm() {
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

  return (
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
  )
}
