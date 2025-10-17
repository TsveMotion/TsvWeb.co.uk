"use client"

import { useState, useEffect } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  SparklesIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  CpuChipIcon,
  ChatBubbleLeftRightIcon,
  BellAlertIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  UserGroupIcon,
  CreditCardIcon,
  ChartPieIcon,
} from '@heroicons/react/24/outline'
import Image from 'next/image'

interface PortfolioItem {
  _id: string
  title: string
  slug: string
  shortDescription: string
  clientName?: string
  projectType: string
  technologies: string[]
  thumbnailImage: string
  projectUrl?: string
  featured: boolean
}

interface UptimeStats {
  totalMonitors: number
  upMonitors: number
  downMonitors: number
  avgUptime: number
  avgResponseTime: number
  lastUpdated: string
}

export default function ClientPresentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' })
  const [submitted, setSubmitted] = useState(false)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, uptimeRes] = await Promise.all([
          fetch('/api/portfolio'),
          fetch('/api/public/uptime?type=stats')
        ])

        const portfolioData = await portfolioRes.json()
        const uptimeData = await uptimeRes.json()

        if (portfolioData.success) {
          setPortfolioItems(portfolioData.data)
        }
        if (uptimeData.success) {
          setUptimeStats(uptimeData.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const slides = [
    {
      title: 'Welcome to TsvWeb',
      subtitle: 'Your Partner in Digital Excellence',
      content: (
        <div className="text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-8 bg-gradient-to-br from-blue-500 via-cyan-500 to-purple-500 rounded-full shadow-2xl animate-pulse">
              <RocketLaunchIcon className="h-32 w-32 text-white" />
            </div>
          </div>
          <p className="text-3xl text-gray-700 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            We build <span className="font-bold text-blue-600">stunning</span>, 
            <span className="font-bold text-cyan-600"> high-performance</span> websites 
            that drive <span className="font-bold text-purple-600">real results</span>
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto mt-12">
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-lg hover:scale-110 transition-all duration-300">
              <p className="text-6xl font-bold text-blue-600 mb-2">{portfolioItems.length}+</p>
              <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">Projects Delivered</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl shadow-lg hover:scale-110 transition-all duration-300">
              <p className="text-6xl font-bold text-green-600 mb-2">
                {uptimeStats ? uptimeStats.avgUptime.toFixed(1) : '99.9'}%
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">Uptime</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl shadow-lg hover:scale-110 transition-all duration-300">
              <p className="text-6xl font-bold text-purple-600 mb-2">24/7</p>
              <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">Support</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl shadow-lg hover:scale-110 transition-all duration-300">
              <p className="text-6xl font-bold text-orange-600 mb-2">
                {uptimeStats ? Math.round(uptimeStats.avgResponseTime) : '150'}ms
              </p>
              <p className="text-base text-gray-600 dark:text-gray-400 font-semibold">Response Time</p>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Advanced Tech Stack',
      subtitle: 'Built with Cutting-Edge Technology',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-8 text-white shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <CpuChipIcon className="h-12 w-12 mr-3" />
                <h3 className="text-2xl font-bold">AI-Powered</h3>
              </div>
              <p className="text-blue-100 mb-4">OpenAI GPT-4 integration for intelligent content generation and chatbots</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Blog post generation</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />AI chat support</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />DALL-E image creation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-8 text-white shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <ChartPieIcon className="h-12 w-12 mr-3" />
                <h3 className="text-2xl font-bold">Admin Dashboard</h3>
              </div>
              <p className="text-purple-100 mb-4">Complete business management system with role-based access control</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />User management</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Analytics & reports</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Content management</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-8 text-white shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <UserGroupIcon className="h-12 w-12 mr-3" />
                <h3 className="text-2xl font-bold">Customer Portal</h3>
              </div>
              <p className="text-green-100 mb-4">Dedicated client dashboard for project management and communication</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Project tracking</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Invoice management</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Support tickets</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-8 text-white shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <BellAlertIcon className="h-12 w-12 mr-3" />
                <h3 className="text-2xl font-bold">Announcements</h3>
              </div>
              <p className="text-orange-100 mb-4">Real-time notification system with email integration</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Popup notifications</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Email campaigns</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Read tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-8 text-white shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-12 w-12 mr-3" />
                <h3 className="text-2xl font-bold">Contracts & Legal</h3>
              </div>
              <p className="text-indigo-100 mb-4">Complete contract management with e-signature support</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />PDF generation</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />File management</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Status tracking</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-xl p-8 text-white shadow-2xl hover:scale-105 transition-all">
              <div className="flex items-center mb-4">
                <CreditCardIcon className="h-12 w-12 mr-3" />
                <h3 className="text-2xl font-bold">Invoicing</h3>
              </div>
              <p className="text-pink-100 mb-4">Automated invoicing and payment tracking system</p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Quote generation</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Payment tracking</li>
                <li className="flex items-center"><CheckCircleIcon className="h-4 w-4 mr-2" />Recurring billing</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4 text-center">Technologies We Use</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {['Next.js 14', 'React 18', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'OpenAI GPT-4', 'Resend Email', 'Uptime Kuma', 'NextAuth', 'Vercel'].map((tech) => (
                <span key={tech} className="px-6 py-3 bg-white/10 backdrop-blur-sm rounded-lg font-semibold hover:bg-white/20 transition-all">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Our Complete Portfolio',
      subtitle: `${portfolioItems.length} Projects Delivered`,
      content: (
        <div className="space-y-8">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolioItems.map((item) => (
                <div
                  key={item._id}
                  className="group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  <div className="relative h-48 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30">
                    {item.thumbnailImage ? (
                      <Image
                        src={item.thumbnailImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <CodeBracketIcon className="h-20 w-20 text-blue-400 opacity-50" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded-full">
                        {item.projectType}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h3>
                    {item.clientName && (
                      <p className="text-sm text-gray-500 mb-2">Client: {item.clientName}</p>
                    )}
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                      {item.shortDescription}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md">
                          {tech}
                        </span>
                      ))}
                      {item.technologies.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-md">
                          +{item.technologies.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Our Services & Pricing',
      subtitle: 'Transparent, Affordable Solutions',
      content: (
        <div className="space-y-8">
          {/* Monthly Plans */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">Monthly Website Plans</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white shadow-xl hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2">WordPress Website</h4>
                <p className="text-3xl font-bold mb-2">£30<span className="text-lg">/mo</span></p>
                <p className="text-blue-100 text-sm mb-4">3-5 days delivery</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ WordPress CMS</li>
                  <li>✓ Responsive Design</li>
                  <li>✓ SEO Optimized</li>
                  <li>✓ Hosting Included</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white shadow-xl hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2">WordPress E-commerce</h4>
                <p className="text-3xl font-bold mb-2">£50<span className="text-lg">/mo</span></p>
                <p className="text-purple-100 text-sm mb-4">3-5 days delivery</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ WooCommerce</li>
                  <li>✓ Payment Gateway</li>
                  <li>✓ Product Management</li>
                  <li>✓ Inventory System</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-500 rounded-xl p-6 text-white shadow-xl hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2">WordPress Booking</h4>
                <p className="text-3xl font-bold mb-2">£45<span className="text-lg">/mo</span></p>
                <p className="text-green-100 text-sm mb-4">3-5 days delivery</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ Online Booking</li>
                  <li>✓ Email Notifications</li>
                  <li>✓ Calendar Integration</li>
                  <li>✓ WordPress CMS</li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-xl hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2">WordPress Portfolio</h4>
                <p className="text-3xl font-bold mb-2">£35<span className="text-lg">/mo</span></p>
                <p className="text-orange-100 text-sm mb-4">3-5 days delivery</p>
                <ul className="space-y-2 text-sm">
                  <li>✓ Image Galleries</li>
                  <li>✓ Video Support</li>
                  <li>✓ Portfolio Showcase</li>
                  <li>✓ SEO Optimized</li>
                </ul>
              </div>
            </div>
          </div>

          {/* One-Time Packages */}
          <div>
            <h3 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">One-Time Packages</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-blue-200 dark:border-blue-700 hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">WordPress Website</h4>
                <p className="text-3xl font-bold mb-2 text-blue-600">From £295</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Professional 5-page business site</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ Mobile Optimized</li>
                  <li>✓ Contact Forms</li>
                  <li>✓ Google Maps</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-purple-200 dark:border-purple-700 hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">WordPress E-commerce</h4>
                <p className="text-3xl font-bold mb-2 text-purple-600">From £395</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Full WooCommerce store</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ Payment Integration</li>
                  <li>✓ Product Upload</li>
                  <li>✓ SSL Security</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl border-2 border-green-200 dark:border-green-700 hover:scale-105 transition-all">
                <h4 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Custom Coded Website</h4>
                <p className="text-3xl font-bold mb-2 text-green-600">Contact Us</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Fully bespoke solution</p>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li>✓ Advanced Features</li>
                  <li>✓ Custom Design</li>
                  <li>✓ Scalable</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Design & Branding */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Design & Branding</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 rounded-lg p-4 border-2 border-pink-300 dark:border-pink-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Logo Design</h4>
                <p className="text-2xl font-bold text-pink-600 mb-2">From £50</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">3 concepts + revisions</p>
              </div>
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4 border-2 border-indigo-300 dark:border-indigo-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Branding Pack</h4>
                <p className="text-2xl font-bold text-indigo-600 mb-2">From £75</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cards, letterhead, social kit</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-lg p-4 border-2 border-cyan-300 dark:border-cyan-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Website Rebranding</h4>
                <p className="text-2xl font-bold text-cyan-600 mb-2">From £150</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Refresh outdated sites</p>
              </div>
            </div>
          </div>

          {/* Marketing Services */}
          <div>
            <h3 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">Marketing & Growth</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 border-blue-500">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">SEO Optimisation</h4>
                <p className="text-xl font-bold text-blue-600">From £100</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 border-green-500">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Google Ads</h4>
                <p className="text-xl font-bold text-green-600">£150/mo</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 border-purple-500">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Social Media</h4>
                <p className="text-xl font-bold text-purple-600">From £60</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border-l-4 border-orange-500">
                <h4 className="font-bold text-gray-900 dark:text-white mb-1">Email Marketing</h4>
                <p className="text-xl font-bold text-orange-600">From £75</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Client Success Stories',
      subtitle: 'What Our Clients Say',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: 'Sarah Johnson', role: 'CEO, Birmingham Retail Co.', text: 'TsvWeb transformed our online presence. Website is fast, beautiful, and brings more customers than ever!', gradient: 'from-blue-500 to-cyan-500' },
              { name: 'Michael Chen', role: 'Founder, Tech Startup', text: 'Professional, responsive, results-driven. Delivered exactly what we needed and exceeded expectations.', gradient: 'from-purple-500 to-pink-500' },
              { name: 'Emma Williams', role: 'Marketing Director', text: 'Incredible team. They understood our vision and brought it to life with stunning design.', gradient: 'from-green-500 to-teal-500' },
              { name: 'David Brown', role: 'Restaurant Owner', text: 'Outstanding service. New website exceeded expectations and grew online orders by 300%!', gradient: 'from-orange-500 to-red-500' },
            ].map((review, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl hover:-translate-y-1 transition-all">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-4 italic">"{review.text}"</p>
                <div className="flex items-center">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${review.gradient} flex items-center justify-center text-white font-bold text-xl mr-3`}>
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{review.name}</p>
                    <p className="text-xs text-gray-500">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center p-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} className="h-8 w-8 text-yellow-400 fill-current" />
              ))}
            </div>
            <p className="text-4xl font-bold text-blue-600">4.9/5.0</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">50+ Happy Clients</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Performance & Reliability',
      subtitle: 'Built for Speed, Designed for Uptime',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-500 rounded-full">
                  <ChartBarIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <p className="text-5xl font-bold text-green-600 mb-2">
                {uptimeStats ? uptimeStats.avgUptime.toFixed(2) : '99.9'}%
              </p>
              <p className="font-bold text-lg mb-2">Uptime</p>
              <p className="text-sm text-gray-500">24/7/365 online</p>
              {uptimeStats && (
                <p className="text-xs text-gray-400 mt-3">
                  {uptimeStats.upMonitors}/{uptimeStats.totalMonitors} monitors up
                </p>
              )}
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-500 rounded-full">
                  <RocketLaunchIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <p className="text-5xl font-bold text-blue-600 mb-2">
                {uptimeStats ? Math.round(uptimeStats.avgResponseTime) : '150'}ms
              </p>
              <p className="font-bold text-lg mb-2">Response Time</p>
              <p className="text-sm text-gray-500">Lightning fast</p>
            </div>
            <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 rounded-xl shadow-lg">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-purple-500 rounded-full">
                  <ShieldCheckIcon className="h-16 w-16 text-white" />
                </div>
              </div>
              <p className="text-5xl font-bold text-purple-600 mb-2">SSL</p>
              <p className="font-bold text-lg mb-2">Secure</p>
              <p className="text-sm text-gray-500">Bank-level security</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <SparklesIcon className="h-6 w-6 mr-2 text-blue-600" />
                Real-Time Monitoring
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />24/7 monitoring</li>
                <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />Instant alerts</li>
                <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />Daily backups</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 rounded-xl p-6 border-2 border-purple-200 dark:border-purple-700">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <ArrowTrendingUpIcon className="h-6 w-6 mr-2 text-purple-600" />
                Optimization
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />CDN integration</li>
                <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />Image optimization</li>
                <li className="flex items-center"><CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />Code minification</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Why Choose TsvWeb?',
      subtitle: 'Your Success is Our Mission',
      content: (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <CodeBracketIcon className="h-8 w-8" />, title: 'Expert Development', desc: 'Next.js, React, Node.js experts', color: 'blue' },
              { icon: <DevicePhoneMobileIcon className="h-8 w-8" />, title: 'Mobile-First', desc: 'Perfect on all devices', color: 'green' },
              { icon: <GlobeAltIcon className="h-8 w-8" />, title: 'SEO Optimized', desc: 'Rank higher on Google', color: 'purple' },
              { icon: <ClockIcon className="h-8 w-8" />, title: 'Fast Delivery', desc: 'Quick turnaround times', color: 'orange' },
              { icon: <ShieldCheckIcon className="h-8 w-8" />, title: 'Secure', desc: 'SSL & DDoS protection', color: 'cyan' },
              { icon: <SparklesIcon className="h-8 w-8" />, title: '24/7 Support', desc: 'Always here to help', color: 'pink' },
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-${f.color}-400 to-${f.color}-600 flex items-center justify-center text-white mb-4`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-bold mb-3">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl p-8 text-white text-center shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h3>
            <p className="text-xl mb-6">Join 50+ satisfied clients</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:scale-105"
            >
              Get Free Consultation →
            </button>
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
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status: 'Viewed Presentation',
          interestLevel: 'Very Interested',
          source: 'Presentation',
          notes: 'Viewed full public presentation',
        }),
      })
      const data = await response.json()
      if (data.success) setSubmitted(true)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (showForm && !submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="p-6 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-2xl">
                <RocketLaunchIcon className="h-20 w-20 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold mb-4">Let's Build Something Amazing!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">We'll get in touch within 24 hours</p>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Your Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 border-2 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Phone (Optional)</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 border-2 rounded-lg dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="+44 123 456 7890"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-bold text-lg rounded-lg hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 shadow-lg hover:scale-105 transition-all"
            >
              Get Free Consultation 🚀
            </button>
          </form>
          <button
            onClick={() => setShowForm(false)}
            className="mt-6 w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 font-semibold"
          >
            ← Back to Presentation
          </button>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-full">
              <CheckCircleIcon className="h-24 w-24 text-green-600" />
            </div>
          </div>
          <h2 className="text-4xl font-bold mb-4">Thank You!</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            We've received your information and will contact you within 24 hours to discuss your project.
          </p>
          <button
            onClick={() => {
              setShowForm(false)
              setSubmitted(false)
              setCurrentSlide(0)
              setFormData({ name: '', email: '', phone: '' })
            }}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-600 shadow-lg hover:scale-105 transition-all"
          >
            View Presentation Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      <div className="h-full flex flex-col">
        <div className="flex-1 bg-white dark:bg-gray-800 m-4 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
          <div className="flex-1 p-8 md:p-12 overflow-y-auto">
            <div className="text-center mb-8">
              <h2 className="text-5xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                {slides[currentSlide].title}
              </h2>
              <p className="text-2xl text-blue-600 dark:text-blue-400">
                {slides[currentSlide].subtitle}
              </p>
            </div>
            <div className="mt-8">{slides[currentSlide].content}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 px-8 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 flex-shrink-0 h-20">
            <button
              onClick={handlePrevious}
              disabled={currentSlide === 0}
              className={`flex items-center px-6 py-3 rounded-lg font-semibold transition-all w-32 justify-center ${
                currentSlide === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
                    index === currentSlide ? 'bg-blue-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-cyan-600 shadow-md hover:shadow-lg transition-all w-32 justify-center"
            >
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRightIcon className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
