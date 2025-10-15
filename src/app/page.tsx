"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession, signIn } from 'next-auth/react'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import FAQSchema from '@/components/seo/FAQSchema'

interface UptimeStats {
  totalMonitors: number
  upMonitors: number
  avgUptime: number
  avgResponseTime: number
}

export default function Home() {
  const { data: session } = useSession()
  const [emailFormData, setEmailFormData] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null)
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  
  // Auto-fill form when user signs in with Google
  useEffect(() => {
    if (session?.user) {
      setEmailFormData({
        name: session.user.name || '',
        email: session.user.email || ''
      })
    }
  }, [session])

  // Fetch uptime stats
  useEffect(() => {
    fetchUptimeStats()
    const interval = setInterval(fetchUptimeStats, 30000)
    return () => clearInterval(interval)
  }, [])

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + 7) // 7 days from now
    
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate.getTime() - now
      
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const fetchUptimeStats = async () => {
    try {
      const response = await fetch('/api/public/uptime?type=stats')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setUptimeStats(result.data)
        }
      }
    } catch (error) {
      console.error('Failed to fetch uptime stats:', error)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent, location: string) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/get-quote/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: emailFormData.name,
          email: emailFormData.email,
        })
      })

      const data = await response.json()

      if (data.success) {
        setSubmitStatus('success')
        setEmailFormData({ name: '', email: '' })
        
        // Redirect to quote page after 2 seconds
        setTimeout(() => {
          window.location.href = data.data.quoteUrl
        }, 2000)
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

  const industries = [
    { name: 'Restaurants', url: '/restaurants', icon: '🍽️', desc: 'Online menus & bookings' },
    { name: 'Barbers', url: '/barbers', icon: '💈', desc: 'Booking systems built in' },
    { name: 'Plumbers', url: '/plumbers', icon: '🔧', desc: '24/7 callout pages' },
    { name: 'Electricians', url: '/electricians', icon: '⚡', desc: 'Show certifications' },
    { name: 'Cleaning', url: '/cleaning', icon: '✨', desc: 'Get more bookings' },
    { name: 'Removals', url: '/removals', icon: '🚚', desc: 'Quote calculators' },
    { name: 'E-commerce', url: '/ecommerce', icon: '🛒', desc: 'Sell online fast' }
  ]

  const faqData = [
    {
      question: 'How long does a website take?',
      answer: 'Most websites are live in 48-72 hours. We work fast without compromising quality. You review it, approve it, and we launch it.'
    },
    {
      question: 'Do you handle SEO?',
      answer: 'Yes. Every website is SEO-optimised from day one. We target local Birmingham searches so you show up when customers are looking for your services.'
    },
    {
      question: 'Can you manage updates for me?',
      answer: 'Absolutely. You can update content yourself, or we can do it for you. Simple updates are free. We\'re here to help.'
    },
    {
      question: 'What if I need changes later?',
      answer: 'Easy. Message us and we\'ll make the changes. Minor tweaks are included. We want you to be 100% happy with your site.'
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <FAQSchema faqs={faqData} />
      <Navbar />

      {/* Hero Section with Email Capture */}
      <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-5xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              Get More Customers <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
                Online in Birmingham
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Fast, SEO-optimised websites that actually bring you leads. <br className="hidden md:block" />
              No fluff. Just results.
            </p>

            {/* Email Capture Form */}
            <motion.form 
              onSubmit={(e) => handleEmailSubmit(e, 'hero')}
              className="max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl border-2 border-[#007BFF]">
                {session && (
                  <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 text-green-800 dark:text-green-300 p-3 rounded-lg text-center flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">Form auto-filled with your Google account!</span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    required
                    value={emailFormData.name}
                    onChange={(e) => setEmailFormData({...emailFormData, name: e.target.value})}
                    placeholder="Your Name"
                    className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-[#007BFF] text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  />
                  <input
                    type="email"
                    required
                    value={emailFormData.email}
                    onChange={(e) => setEmailFormData({...emailFormData, email: e.target.value})}
                    placeholder="Your Email"
                    className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-[#007BFF] text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                  />
                </div>
                {!session && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={() => signIn('google', { redirect: false })}
                      className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-semibold text-lg py-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      <svg className="h-6 w-6" viewBox="0 0 24 24">
                        <path
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          fill="#34A853"
                        />
                        <path
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          fill="#FBBC05"
                        />
                        <path
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          fill="#EA4335"
                        />
                      </svg>
                      Continue with Google (Faster!)
                    </button>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="bg-white dark:bg-gray-800 px-4 text-gray-500 dark:text-gray-400">
                          or fill manually
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-xl py-5 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Sending...' : '🎁 Get My Free Quote + SEO Checklist'}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="mt-4 bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                    <p className="font-bold">✓ Success! Check your email for your FREE SEO Audit!</p>
                    <p className="text-sm mt-2">Redirecting to your personalized quote page...</p>
                  </div>
                )}
                
                {submitStatus === 'error' && (
                  <div className="mt-4 bg-red-50 border-2 border-red-500 text-red-800 p-4 rounded-lg text-center">
                    <p className="font-bold">✗ Something went wrong. Please try again.</p>
                  </div>
                )}
              </div>
            </motion.form>

            {/* Secondary CTA */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href="tel:+4407444358808"
                className="inline-flex items-center gap-2 text-[#007BFF] dark:text-blue-400 font-bold text-lg hover:text-[#0056D2] dark:hover:text-blue-300 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call: 07444 358808
              </a>
              <span className="text-gray-400 dark:text-gray-500">or</span>
              <span className="text-gray-600 dark:text-gray-400">Get instant quote above ↑</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white dark:bg-gray-900 border-y-2 border-blue-100 dark:border-gray-700">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Trusted by <span className="text-[#007BFF]">500+</span> Birmingham Businesses
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">100% uptime guaranteed. Real results. Real businesses.</p>
          </motion.div>

          {/* Uptime Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <motion.div 
              className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-[#007BFF] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-4xl font-black text-[#007BFF] mb-2">
                {uptimeStats && uptimeStats.avgUptime > 0 ? `${uptimeStats.avgUptime.toFixed(1)}%` : '99.9%'}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-bold">Uptime</div>
            </motion.div>

            <motion.div 
              className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-[#007BFF] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-black text-[#007BFF] mb-2">
                {uptimeStats && uptimeStats.avgResponseTime > 0 ? `${Math.round(uptimeStats.avgResponseTime)}ms` : '170ms'}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-bold">Load Time</div>
            </motion.div>

            <motion.div 
              className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-[#007BFF] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-black text-[#007BFF] mb-2">500+</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-bold">Happy Clients</div>
            </motion.div>

            <motion.div 
              className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-[#007BFF] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-black text-[#007BFF] mb-2">24/7</div>
              <div className="text-sm text-gray-700 dark:text-gray-300 font-bold">Support</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Why Birmingham Businesses <span className="text-[#007BFF]">Choose Us</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: '3x More Leads in 30 Days',
                description: 'Our websites are built to convert. SEO-optimised, fast-loading, and designed to turn visitors into customers.',
                icon: '📈'
              },
              {
                title: 'Rank #1 on Google',
                description: 'Local SEO built in. Show up when Birmingham customers search for your services. Dominate your local market.',
                icon: '🏆'
              },
              {
                title: 'Mobile-Ready in 48 Hours',
                description: 'Fast turnaround. Your website live in days, not months. Mobile-first design that works on every device.',
                icon: '⚡'
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border-2 border-transparent hover:border-[#007BFF] transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-6xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Showcase Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              We Build Websites For <span className="text-[#007BFF]">Your Industry</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Click your industry to see how we can help</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 max-w-7xl mx-auto">
            {industries.map((industry, index) => (
              <Link
                key={index}
                href={industry.url}
                className="group"
              >
                <motion.div
                  className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-transparent hover:border-[#007BFF] hover:shadow-xl transition-all duration-300 text-center h-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{industry.icon}</div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2 group-hover:text-[#007BFF] transition-colors">
                    {industry.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{industry.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Urgency Section */}
      <section className="py-16 bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
        <div className="container-custom">
          <motion.div 
            className="text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              ⚠️ Only 5 New Client Spots Left This Month
            </h2>
            <p className="text-xl mb-8 opacity-90">
              We limit our monthly intake to ensure quality. Don't miss out.
            </p>

            {/* Countdown Timer */}
            <div className="flex justify-center gap-4 mb-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 min-w-[80px]">
                  <div className="text-4xl font-black">{String(item.value).padStart(2, '0')}</div>
                  <div className="text-sm opacity-80">{item.label}</div>
                </div>
              ))}
            </div>

            <a 
              href="#quote-form"
              className="inline-block bg-white text-[#007BFF] font-black text-xl px-12 py-5 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase"
            >
              Claim Your Spot Now
            </a>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Real Results. <span className="text-[#007BFF]">Real Businesses.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "TsvWeb delivered our website in 3 days. We've had 5x more bookings since launch. ROI was immediate.",
                author: "Sarah Mitchell",
                business: "The Cutting Room, Birmingham",
                rating: 5
              },
              {
                quote: "Fast delivery, clean design, and our Google ranking shot up. We're now #1 for 'plumber Birmingham'. Worth every penny.",
                author: "James Carter",
                business: "Carter Plumbing, Solihull",
                rating: 5
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-lg border-2 border-[#007BFF] shadow-lg"
                initial={{ opacity: 0, x: index === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-[#007BFF] text-3xl">★</span>
                  ))}
                </div>
                <p className="text-xl text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="border-t-2 border-[#007BFF] dark:border-[#007BFF] pt-4">
                  <p className="text-[#007BFF] font-black text-lg">{testimonial.author}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-blue-50 dark:bg-gray-800">
        <div className="container-custom max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Common <span className="text-[#007BFF]">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: 'How long does a website take?',
                answer: 'Most websites are live in 48-72 hours. We work fast without compromising quality. You review it, approve it, and we launch it.'
              },
              {
                question: 'Do you handle SEO?',
                answer: 'Yes. Every website is SEO-optimised from day one. We target local Birmingham searches so you show up when customers are looking for your services.'
              },
              {
                question: 'Can you manage updates for me?',
                answer: 'Absolutely. You can update content yourself, or we can do it for you. Simple updates are free. We\'re here to help.'
              },
              {
                question: 'What if I need changes later?',
                answer: 'Easy. Message us and we\'ll make the changes. Minor tweaks are included. We want you to be 100% happy with your site.'
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border-2 border-[#007BFF] shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-xl font-black text-[#007BFF] mb-3">{faq.question}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="quote-form" className="py-24 bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
                Ready to Get More Customers?
              </h2>
              <p className="text-2xl text-white font-bold">Get your free quote + SEO checklist now</p>
            </motion.div>

            <motion.form 
              onSubmit={(e) => handleEmailSubmit(e, 'footer')}
              className="bg-white dark:bg-gray-800 p-10 md:p-12 rounded-lg shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <input
                  type="text"
                  required
                  value={emailFormData.name}
                  onChange={(e) => setEmailFormData({...emailFormData, name: e.target.value})}
                  placeholder="Your Name"
                  className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-[#007BFF] text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                />
                <input
                  type="email"
                  required
                  value={emailFormData.email}
                  onChange={(e) => setEmailFormData({...emailFormData, email: e.target.value})}
                  placeholder="Your Email"
                  className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 focus:border-[#007BFF] text-gray-900 dark:text-white text-lg focus:outline-none rounded-lg"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-2xl py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : '🎁 Get My Free Quote + SEO Checklist'}
              </button>
              
              {submitStatus === 'success' && (
                <div className="mt-6 bg-green-50 border-2 border-green-500 text-green-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✓ Success! Check your email for your SEO checklist.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mt-6 bg-red-50 border-2 border-red-500 text-red-800 p-4 rounded-lg text-center">
                  <p className="font-bold text-lg">✗ Something went wrong. Please try again or call 07444 358808</p>
                </div>
              )}
            </motion.form>

            {/* SEO Footer Text */}
            <div className="mt-12 text-center text-white">
              <p className="text-lg leading-relaxed opacity-90">
                <span className="font-bold">TsvWeb</span> - Professional web design Birmingham. Affordable websites for local businesses. 
                SEO optimisation UK. Fast, mobile-ready websites that get results. Serving Birmingham, Solihull, and the West Midlands. 
                Get more customers online with expert web design Birmingham services.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
