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
        title="Website Development Birmingham | Professional Web Design Services"
        description="Leading website development in Birmingham. Professional web design, SEO optimization, and digital solutions for Birmingham businesses. Get a custom website that drives results and grows your business."
        canonical="https://tsvweb.com"
        googleSiteVerification={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        openGraph={{
          title: "Website Development Birmingham | TsvWeb",
          description: "Expert website development services in Birmingham. Custom web design, SEO, and digital solutions for local businesses.",
          url: "https://tsvweb.com",
          type: "website",
          images: [{
            url: "https://tsvweb.com/images/birmingham-web-development-og.jpg",
            width: 1200,
            height: 630,
            alt: "Website Development Birmingham - TsvWeb Professional Services"
          }]
        }}
        structuredData={{
          type: 'LocalBusiness',
          data: {
            '@type': 'WebDesignCompany',
            name: 'TsvWeb - Website Development Birmingham',
            description: 'Professional website development and web design services in Birmingham',
            url: 'https://tsvweb.com',
            logo: 'https://tsvweb.com/images/logo.png',
            address: {
              '@type': 'PostalAddress',
              addressLocality: 'Birmingham',
              addressRegion: 'West Midlands',
              addressCountry: 'GB'
            },
            geo: {
              '@type': 'GeoCoordinates',
              latitude: '52.4862',
              longitude: '-1.8904'
            },
            areaServed: [
              'Birmingham',
              'West Midlands',
              'Solihull',
              'Wolverhampton',
              'Coventry'
            ],
            serviceType: [
              'Website Development',
              'Web Design',
              'SEO Services',
              'E-commerce Development',
              'Responsive Web Design'
            ],
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+44-121-123-4567',
              contactType: 'customer service',
              areaServed: 'Birmingham',
              availableLanguage: 'English'
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
      <section className="pt-24 pb-12 sm:pt-32 sm:pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
                Website Development <span className="text-royal-blue dark:text-blue-400">Birmingham</span>
              </h1>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
                Professional Web Design & Digital Solutions
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">
                Transform your Birmingham business with stunning, high-performance websites that drive results. 
                We specialize in custom web development, SEO optimization, and digital solutions that help local businesses thrive online.
              </p>
              
              {/* Key Benefits - Mobile Optimized */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 sm:mb-8 text-sm sm:text-base">
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Birmingham Local SEO</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Mobile-First Design</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Fast Loading Speed</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Conversion Optimized</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="btn-primary text-center flex items-center justify-center space-x-2 text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Get Free Quote</span>
                </button>
                <Link href="/contact" className="btn-secondary text-center text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                  Call Birmingham: 0121 123 4567
                </Link>
              </div>
            </div>
            <div className="relative h-48 sm:h-64 md:h-96 lg:h-[500px] mt-8 lg:mt-0">
              {/* Mobile-optimized hero image */}
              <div className="absolute inset-0 bg-gradient-to-r from-royal-blue to-royal-blue-light rounded-lg flex items-center justify-center text-white text-sm sm:text-lg font-medium p-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold mb-2">Birmingham Web Development</div>
                  <div className="text-sm sm:text-base opacity-90">Professional websites that convert visitors into customers</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Uptime Stats Section */}
      <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 border-y border-gray-200 dark:border-gray-700">
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
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Website Development Services Birmingham</h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Comprehensive web design and development services for Birmingham businesses. From custom websites to e-commerce solutions, we help local companies grow their online presence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Custom Web Design Birmingham',
                description: 'Bespoke website designs that reflect your Birmingham business brand and engage your local audience with modern, professional aesthetics.',
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-royal-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Website Development Birmingham',
                description: 'Robust, scalable websites and web applications built with cutting-edge technologies for Birmingham businesses.',
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-royal-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                title: 'E-commerce Development',
                description: 'Professional online stores for Birmingham retailers that provide seamless shopping experiences and drive sales growth.',
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-royal-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
              },
              {
                title: 'Birmingham SEO Services',
                description: 'Local SEO optimization to improve your Birmingham business search rankings and drive more organic traffic from local customers.',
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-royal-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                title: 'Mobile-First Design',
                description: 'Responsive websites that look perfect and function flawlessly on all devices, optimized for mobile users in Birmingham.',
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-royal-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Website Maintenance Birmingham',
                description: 'Ongoing website maintenance and support services to keep your Birmingham business website secure, updated, and performing optimally.',
                icon: (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-royal-blue dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-3 sm:mb-4">{service.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{service.description}</p>
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
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">What Birmingham Businesses Say About Us</h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Real testimonials from Birmingham businesses who've transformed their online presence with our website development services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'James Mitchell',
                company: 'Birmingham Manufacturing Ltd',
                location: 'Solihull, Birmingham',
                quote: 'TsvWeb completely transformed our online presence. As a Birmingham-based manufacturer, we needed a website that showcased our capabilities professionally. The results exceeded our expectations and we\'ve seen a 150% increase in enquiries.',
              },
              {
                name: 'Sarah Williams',
                company: 'Coventry Retail Solutions',
                location: 'Coventry, West Midlands',
                quote: 'Our e-commerce sales increased by 200% after TsvWeb redesigned our website. Their Birmingham SEO expertise and mobile-first design approach made all the difference for our local customer base.',
              },
              {
                name: 'David Thompson',
                company: 'West Midlands Consultancy',
                location: 'Birmingham City Centre',
                quote: 'Working with TsvWeb was exceptional from start to finish. They understood our Birmingham market and created a website that perfectly represents our brand while driving real business results.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-3 sm:mb-4">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-royal-blue dark:bg-blue-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-3 sm:ml-4 min-w-0">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                    <p className="text-xs sm:text-sm text-royal-blue dark:text-blue-400 font-medium">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
                
                {/* Star Rating */}
                <div className="flex items-center mt-3 sm:mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">5.0 stars</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Birmingham Local Business Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-r from-royal-blue to-royal-blue-light">
        <div className="container-custom">
          <div className="text-center text-white">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">Serving Birmingham Businesses Since 2020</h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-4xl mx-auto px-4 opacity-90">
              We're proud to be Birmingham's trusted website development partner, helping local businesses from Solihull to Wolverhampton establish their digital presence and grow online.
            </p>
            
            {/* Birmingham Areas Served - Mobile Optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 mb-8 sm:mb-12 text-sm sm:text-base">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                <div className="font-semibold">Birmingham City</div>
                <div className="text-xs sm:text-sm opacity-80">Centre & Suburbs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                <div className="font-semibold">Solihull</div>
                <div className="text-xs sm:text-sm opacity-80">& Surrounding</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                <div className="font-semibold">Wolverhampton</div>
                <div className="text-xs sm:text-sm opacity-80">West Midlands</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3">
                <div className="font-semibold">Coventry</div>
                <div className="text-xs sm:text-sm opacity-80">& Warwickshire</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-3 col-span-2 sm:col-span-1">
                <div className="font-semibold">West Midlands</div>
                <div className="text-xs sm:text-sm opacity-80">Region Wide</div>
              </div>
            </div>
            
            {/* Local Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-8 sm:mb-12">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">150+</div>
                <div className="text-sm sm:text-base opacity-90">Birmingham Websites Built</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">98%</div>
                <div className="text-sm sm:text-base opacity-90">Client Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1 sm:mb-2">24/7</div>
                <div className="text-sm sm:text-base opacity-90">Local Support Available</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Ready to Transform Your Birmingham Business Online?</h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Get a free consultation and quote for your website development project. We'll help you create a powerful online presence that drives results for your Birmingham business.
            </p>
            
            {/* Mobile-Optimized CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/contact" className="w-full sm:w-auto bg-royal-blue text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-royal-blue-dark transition-colors duration-300 text-center">
                Get Free Quote Today
              </Link>
              <a href="tel:+441211234567" className="w-full sm:w-auto bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Call: 0121 123 4567
              </a>
            </div>
            
            {/* Trust Indicators */}
            <div className="mt-6 sm:mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Free Consultation</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>No Obligation Quote</span>
              </div>
              <div className="flex items-center space-x-1 sm:space-x-2">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Local Birmingham Team</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-12 sm:py-16 md:py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">Birmingham Web Development Insights</h2>
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto px-4">
              Stay updated with the latest website development trends, Birmingham business insights, and digital marketing tips to grow your local business.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Website Development Birmingham: 2025 Trends for Local Businesses',
                excerpt: 'Discover the latest website development trends specifically impacting Birmingham businesses and how to stay competitive in the West Midlands market.',
                date: 'January 28, 2025',
                category: 'Local Business',
              },
              {
                title: 'Birmingham SEO: How Local Businesses Can Dominate Search Results',
                excerpt: 'Learn proven SEO strategies that help Birmingham businesses rank higher in local search results and attract more customers from the West Midlands.',
                date: 'January 25, 2025',
                category: 'SEO Tips',
              },
              {
                title: 'Mobile-First Design: Essential for Birmingham Business Success',
                excerpt: 'Why Birmingham businesses need mobile-optimized websites and how responsive design impacts local customer engagement and conversions.',
                date: 'January 22, 2025',
                category: 'Mobile Design',
              },
            ].map((post, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Mobile-optimized blog post images */}
                <div className="h-32 sm:h-48 bg-gradient-to-br from-royal-blue-light to-royal-blue relative">
                  <div className="absolute inset-0 flex items-center justify-center text-white text-sm sm:text-lg font-medium p-4">
                    <div className="text-center">
                      <div className="text-base sm:text-xl font-bold mb-1">{post.category}</div>
                      <div className="text-xs sm:text-sm opacity-90">Birmingham Business Focus</div>
                    </div>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm bg-royal-blue/10 text-royal-blue dark:bg-blue-400/10 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{post.date}</p>
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-gray-900 dark:text-white mb-2 leading-tight">{post.title}</h3>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 leading-relaxed">{post.excerpt}</p>
                  <Link href={`/blog/post-${index + 1}`} className="inline-flex items-center text-sm sm:text-base text-royal-blue dark:text-blue-400 font-medium hover:text-royal-blue-dark dark:hover:text-blue-300 transition-colors">
                    Read More
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
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
