"use client"

import { useState } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export default function PresentationView() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '' })
  const [submitted, setSubmitted] = useState(false)

  const slides = [
    {
      title: 'Welcome to TsvWeb',
      subtitle: 'Your Partner in Digital Excellence',
      content: (
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
              <RocketLaunchIcon className="h-24 w-24 text-white" />
            </div>
          </div>
          <p className="text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            We build stunning, high-performance websites that drive results for businesses in Birmingham and beyond.
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mt-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">50+</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Happy Clients</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">99.9%</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Uptime</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">24/7</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Support</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Our Portfolio',
      subtitle: 'Proven Track Record of Success',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">E-Commerce Solutions</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Built scalable online stores with seamless payment integration and inventory management.
              </p>
              <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
                <CheckCircleIcon className="h-5 w-5" />
                <span>150% increase in sales</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Corporate Websites</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Professional business websites with modern design and powerful SEO optimization.
              </p>
              <div className="flex items-center space-x-2 text-sm text-purple-600 dark:text-purple-400">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Top 3 Google rankings</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Custom Web Apps</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Tailored web applications with advanced features and seamless user experiences.
              </p>
              <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                <CheckCircleIcon className="h-5 w-5" />
                <span>99.9% uptime guarantee</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Mobile-First Design</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Responsive designs that look perfect on all devices, from phones to desktops.
              </p>
              <div className="flex items-center space-x-2 text-sm text-orange-600 dark:text-orange-400">
                <CheckCircleIcon className="h-5 w-5" />
                <span>Mobile conversion +200%</span>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Client Reviews',
      subtitle: 'What Our Clients Say',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "TsvWeb transformed our online presence. Our website is fast, beautiful, and brings in more customers than ever before!"
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">— Sarah Johnson</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">CEO, Birmingham Retail Co.</p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "Professional, responsive, and results-driven. TsvWeb delivered exactly what we needed and more."
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">— Michael Chen</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Founder, Tech Startup</p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "The team at TsvWeb is incredible. They understood our vision and brought it to life perfectly."
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">— Emma Williams</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Marketing Director, Local Business</p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
                "Outstanding service from start to finish. Our new website has exceeded all expectations!"
              </p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">— David Brown</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Owner, Birmingham Restaurant</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">4.9/5.0</p>
            <p className="text-gray-600 dark:text-gray-400">Average Rating from 50+ Reviews</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Performance & Uptime',
      subtitle: 'Reliable, Fast, and Secure',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <ChartBarIcon className="h-12 w-12 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">99.9%</p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">Uptime Guarantee</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Your website stays online 24/7
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <RocketLaunchIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">&lt;1s</p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">Page Load Time</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Lightning-fast performance
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <ShieldCheckIcon className="h-12 w-12 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">SSL</p>
              <p className="text-gray-700 dark:text-gray-300 font-semibold">Secure Encryption</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Bank-level security for your data
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-8 border-2 border-blue-200 dark:border-blue-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" />
              Real-Time Monitoring
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We monitor your website 24/7 from multiple locations worldwide to ensure maximum uptime and performance.
            </p>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Instant alerts for any issues
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                Automated backups every 24 hours
              </li>
              <li className="flex items-center text-gray-700 dark:text-gray-300">
                <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                DDoS protection included
              </li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: 'Why Choose TsvWeb?',
      subtitle: 'Your Success is Our Mission',
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border-l-4 border-blue-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-blue-500 mr-2" />
                Expert Team
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Experienced developers and designers dedicated to your project's success.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border-l-4 border-green-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-500 mr-2" />
                Modern Technology
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We use the latest frameworks and tools to build future-proof websites.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border-l-4 border-purple-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-purple-500 mr-2" />
                SEO Optimized
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Built-in SEO best practices to help you rank higher on Google.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border-l-4 border-orange-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-orange-500 mr-2" />
                Ongoing Support
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                24/7 support and maintenance to keep your website running smoothly.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border-l-4 border-cyan-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-cyan-500 mr-2" />
                Transparent Pricing
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                No hidden fees. Clear, upfront pricing for all our services.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-750 rounded-xl p-6 shadow-lg border-l-4 border-pink-500">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-pink-500 mr-2" />
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Quick turnaround times without compromising on quality.
              </p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    } else {
      setShowForm(true)
    }
  }

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          status: 'Viewed Presentation',
          interestLevel: 'Somewhat Interested',
          source: 'Presentation',
          notes: 'Viewed full presentation and submitted contact form',
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  if (showForm && !submitted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full">
              <RocketLaunchIcon className="h-16 w-16 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Leave your details and we'll get in touch to discuss your project!
          </p>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              required
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="john@example.com"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-lg rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg hover:shadow-xl"
          >
            Get Your Free Consultation
          </button>
        </form>

        <button
          onClick={() => setShowForm(false)}
          className="mt-4 w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          ← Back to Presentation
        </button>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
            <CheckCircleIcon className="h-20 w-20 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Thank You!
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          We've received your information and will be in touch shortly to discuss how we can help bring your vision to life.
        </p>
        <button
          onClick={() => {
            setShowForm(false)
            setSubmitted(false)
            setCurrentSlide(0)
            setFormData({ name: '', email: '' })
          }}
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
        >
          View Presentation Again
        </button>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* Slide Content */}
      <div className="p-8 md:p-12 min-h-[600px]">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xl text-blue-600 dark:text-blue-400">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        <div className="mt-8">{slides[currentSlide].content}</div>
      </div>

      {/* Navigation */}
      <div className="bg-gray-50 dark:bg-gray-750 px-8 py-6 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all ${
            currentSlide === 0
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-700 dark:text-gray-600'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
          }`}
        >
          <ChevronLeftIcon className="h-5 w-5 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-3 w-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-blue-600 w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all shadow-md hover:shadow-lg"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRightIcon className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  )
}
