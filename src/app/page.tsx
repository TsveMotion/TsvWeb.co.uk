"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import SimpleSetupWizard from '@/components/setup-wizard/simple-setup-wizard'

interface UptimeStats {
  totalMonitors: number
  upMonitors: number
  downMonitors: number
  avgUptime: number
  avgResponseTime: number
  lastUpdated: string
}

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null)
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    fetchUptimeStats()
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchUptimeStats, 30000)
    return () => clearInterval(interval)
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
    } finally {
      setStatsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="Professional Web Design & Development Services"
        description="TsvWeb offers professional web design and development services that drive results. Get a custom, SEO-optimized website for your business."
        structuredData={{
          type: 'Organization',
          data: {
            name: 'TsvWeb',
            url: 'https://tsvweb.com',
            logo: 'https://tsvweb.com/images/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-555-123-4567',
              contactType: 'customer service',
              areaServed: 'US',
              availableLanguage: ['English', 'French', 'Spanish', 'German']
            },
            sameAs: [
              'https://facebook.com/tsvweb',
              'https://twitter.com/tsvweb',
              'https://linkedin.com/company/tsvweb',
              'https://instagram.com/tsvweb'
            ]
          }
        }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Professional <span className="text-royal-blue dark:text-blue-400">Web Design</span> & Development
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
                Transform your business with stunning, high-performance websites that drive results. 
                We create digital experiences that captivate your audience and grow your brand.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="btn-primary text-center flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Start Project Wizard</span>
                </button>
                <Link href="/contact" className="btn-secondary text-center">
                  Get Started
                </Link>
                <Link href="/portfolio" className="btn-secondary text-center">
                  View Our Work
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96 lg:h-[500px]">
              {/* This would be replaced with an actual AI-generated image */}
              <div className="absolute inset-0 bg-gradient-to-r from-royal-blue to-royal-blue-light rounded-lg flex items-center justify-center text-white text-lg font-medium">
                AI-Generated Hero Image Will Go Here
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uptime Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-gray-800 border-y border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="text-blue-600 dark:text-blue-400">99%</span> Uptime Guarantee
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              Our infrastructure is monitored 24/7 to ensure your website stays online and performs optimally.
            </p>
          </div>

          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Average Uptime */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {uptimeStats ? `${uptimeStats.avgUptime.toFixed(1)}%` : '99%'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Average Uptime</div>
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${uptimeStats ? uptimeStats.avgUptime : 99}%` }}
                  ></div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {uptimeStats ? `${Math.round(uptimeStats.avgResponseTime)}ms` : '170ms'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Avg Response Time</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Lightning fast performance worldwide
                </div>
              </div>

              {/* Active Monitors */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {uptimeStats ? uptimeStats.totalMonitors : '5'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Active Monitors</div>
                  </div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {uptimeStats ? uptimeStats.upMonitors : 5} online, {uptimeStats ? uptimeStats.downMonitors : 0} offline
                </div>
              </div>

              {/* Status */}
              <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {uptimeStats && uptimeStats.downMonitors > 0 ? 'Issues' : 'All Systems'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {uptimeStats && uptimeStats.downMonitors > 0 ? 'Degraded' : 'Operational'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${uptimeStats && uptimeStats.downMonitors > 0 ? 'bg-red-500' : 'bg-blue-500 dark:bg-blue-400'} animate-pulse`}></div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Last updated: {uptimeStats ? new Date(uptimeStats.lastUpdated).toLocaleTimeString() : 'Just now'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-8 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>24/7 Monitoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Instant Alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Global CDN</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>SSL Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We offer a comprehensive range of web design and development services to help your business succeed online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Web Design',
                description: 'Custom website designs that reflect your brand and engage your audience.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Web Development',
                description: 'Robust, scalable websites and web applications built with the latest technologies.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                title: 'E-commerce',
                description: 'Online stores that provide seamless shopping experiences and drive sales.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
              },
              {
                title: 'SEO Optimization',
                description: 'Improve your search engine rankings and drive more organic traffic to your website.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                ),
              },
              {
                title: 'Responsive Design',
                description: 'Websites that look and function perfectly on all devices, from desktops to smartphones.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Website Maintenance',
                description: 'Keep your website secure, up-to-date, and performing at its best with our maintenance services.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Our Recent Work</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Take a look at some of our recent projects and see how we've helped businesses like yours succeed online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* This would be replaced with actual portfolio images */}
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-royal-blue-light to-royal-blue">
                  <div className="flex items-center justify-center text-white text-lg font-medium h-full">
                    Portfolio Item {item}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Project Title {item}</h3>
                  <p className="text-gray-200 mb-4">Brief description of the project and the results achieved.</p>
                  <Link href={`/portfolio/project-${item}`} className="text-white font-medium hover:text-royal-blue-light transition-colors">
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/portfolio" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Jane Smith',
                company: 'Tech Solutions Inc.',
                quote: 'TsvWeb transformed our online presence. Their team was professional, creative, and delivered a website that exceeded our expectations.',
              },
              {
                name: 'John Doe',
                company: 'Local Retail Shop',
                quote: 'Our e-commerce sales increased by 200% after TsvWeb redesigned our website. Their SEO expertise and user-friendly design made all the difference.',
              },
              {
                name: 'Sarah Johnson',
                company: 'Marketing Agency',
                quote: 'Working with TsvWeb was a pleasure from start to finish. They understood our vision and created a website that perfectly represents our brand.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-royal-blue flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-royal-blue">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-2 text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss your project and find out how we can help your business succeed online.
            </p>
            <Link href="/contact" className="bg-white text-royal-blue font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors duration-300">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Latest from Our Blog</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Stay up to date with the latest web design trends, tips, and insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '10 Web Design Trends to Watch in 2025',
                excerpt: 'Explore the latest web design trends that are shaping the digital landscape in 2025.',
                date: 'July 25, 2025',
              },
              {
                title: 'Why SEO is Essential for Your Business Website',
                excerpt: 'Learn why search engine optimization is crucial for your business website and how it can drive growth.',
                date: 'July 20, 2025',
              },
              {
                title: 'The Importance of Mobile-Friendly Websites',
                excerpt: 'Discover why having a mobile-friendly website is no longer optional in today\'s digital world.',
                date: 'July 15, 2025',
              },
            ].map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                {/* This would be replaced with actual blog post images */}
                <div className="h-48 bg-gradient-to-br from-royal-blue-light to-royal-blue">
                  <div className="flex items-center justify-center text-white text-lg font-medium h-full">
                    Blog Image {index + 1}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/post-${index + 1}`} className="text-royal-blue font-medium hover:text-royal-blue-dark transition-colors">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog" className="btn-primary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* Setup Wizard Modal */}
      <SimpleSetupWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </main>
  )
}
