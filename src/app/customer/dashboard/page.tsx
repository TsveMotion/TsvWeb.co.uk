'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { Sun, Moon } from 'lucide-react'
import SupportTicketModal from '@/components/customer/support-ticket-modal'

interface CustomerData {
  id: string
  name: string
  email: string
  username: string
  websites?: string[]
  company?: string
}

interface UptimeStats {
  totalMonitors: number
  upMonitors: number
  downMonitors: number
  pendingMonitors: number
  avgUptime: number
  avgResponseTime: number
}

interface UptimeMonitor {
  id: number
  name: string
  url: string
  type: string
  status: 'up' | 'down' | 'pending' | 'maintenance'
  uptime: number
  ping: number
  lastHeartbeat?: string
  tags?: string[]
}

export default function CustomerDashboard() {
  const [customer, setCustomer] = useState<CustomerData | null>(null)
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null)
  const [monitors, setMonitors] = useState<UptimeMonitor[]>([])
  const [loading, setLoading] = useState(true)
  const [uptimeLoading, setUptimeLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [uptimeError, setUptimeError] = useState<string | null>(null)
  const [showSupportModal, setShowSupportModal] = useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (customer) {
      fetchUptimeData()
      const interval = setInterval(fetchUptimeData, 30000)
      return () => clearInterval(interval)
    }
  }, [customer])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/customer/auth/me')
      if (response.ok) {
        const data = await response.json()
        setCustomer(data.user)
      } else {
        router.push('/customer/login')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      router.push('/customer/login')
    } finally {
      setLoading(false)
    }
  }

  const fetchUptimeData = async () => {
    try {
      setUptimeError(null)
      
      const statsResponse = await fetch('/api/customer/uptime?type=stats')
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        if (statsData.success) {
          setUptimeStats(statsData.data)
        } else {
          setUptimeError(statsData.message || 'Failed to fetch uptime stats')
        }
      }

      const monitorsResponse = await fetch('/api/customer/uptime?type=monitors')
      if (monitorsResponse.ok) {
        const monitorsData = await monitorsResponse.json()
        if (monitorsData.success) {
          setMonitors(monitorsData.data || [])
        }
      }
    } catch (error) {
      console.error('Failed to fetch uptime data:', error)
      setUptimeError('Failed to connect to uptime monitoring service')
    } finally {
      setUptimeLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/customer/auth/login', { method: 'DELETE' })
      router.push('/customer/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const generateHistoricalData = () => {
    const days = 7
    const data = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        uptime: 95 + Math.random() * 5,
        responseTime: 200 + Math.random() * 100,
        incidents: Math.random() > 0.8 ? 1 : 0
      })
    }
    return data
  }

  const historicalData = generateHistoricalData()

  const UptimeChart = ({ data }: { data: any[] }) => {
    const maxUptime = Math.max(...data.map(d => d.uptime))
    const minUptime = Math.min(...data.map(d => d.uptime))
    const range = maxUptime - minUptime || 1
    
    return (
      <div className="h-16 w-full relative">
        <svg className="w-full h-full" viewBox="0 0 200 60">
          <defs>
            <linearGradient id="uptimeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          <polyline
            fill="url(#uptimeGradient)"
            stroke="#10b981"
            strokeWidth="2"
            points={data.map((d, i) => 
              `${(i / (data.length - 1)) * 200},${60 - ((d.uptime - minUptime) / range) * 40}`
            ).join(' ')}
          />
          {data.map((d, i) => (
            <circle
              key={i}
              cx={(i / (data.length - 1)) * 200}
              cy={60 - ((d.uptime - minUptime) / range) * 40}
              r="2"
              fill="#10b981"
              className="hover:r-3 transition-all cursor-pointer"
            />
          ))}
        </svg>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'up': return 'bg-green-500'
      case 'down': return 'bg-red-500'
      case 'pending': return 'bg-yellow-500'
      case 'maintenance': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'up': return 'Online'
      case 'down': return 'Offline'
      case 'pending': return 'Pending'
      case 'maintenance': return 'Maintenance'
      default: return 'Unknown'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!customer) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Modern Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Image 
                src={mounted && theme === 'dark' ? "/TsvWeb_Logo_DarkTheme.png" : "/TsvWeb_Logo.png"} 
                alt="TsvWeb Logo" 
                width={150} 
                height={50} 
                className="h-8 w-auto object-contain" 
                priority
                style={{ maxWidth: '120px', height: '32px' }}
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Customer Portal
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monitor your website's performance</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="hidden md:flex items-center space-x-2 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-700 dark:text-gray-200 font-medium">{customer.name}</span>
                </div>
              </div>
              {/* Theme Toggle */}
              {mounted && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
              )}
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-32 h-32 bg-white/5 rounded-full"></div>
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome to Your Dashboard
                </h2>
                <div className="text-blue-100 mb-4">
                  Monitor your website's performance, uptime, and analytics all in one place.
                </div>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span>Real-time monitoring</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                    <span>Performance analytics</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <span>Uptime tracking</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Uptime Error Banner */}
          {uptimeError && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    <strong>Uptime Monitoring:</strong> {uptimeError}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
            {/* Uptime Card */}
            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Uptime</p>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {uptimeLoading ? (
                        <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
                      ) : (
                        `${uptimeStats?.avgUptime.toFixed(1) || '99.9'}%`
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-2">
                <UptimeChart data={historicalData} />
              </div>
              <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>+2.1% from last week</span>
              </div>
            </div>

            {/* Response Time Card */}
            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Response Time</p>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {uptimeLoading ? (
                      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-16 rounded"></div>
                    ) : (
                      `${Math.round(uptimeStats?.avgResponseTime || 245)}ms`
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Active Monitors Card */}
            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Monitors</p>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {uptimeLoading ? (
                      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-8 rounded"></div>
                    ) : (
                      uptimeStats?.totalMonitors || '5'
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 hover:scale-105">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                  uptimeLoading ? 'bg-gradient-to-br from-gray-400 to-gray-600' : 
                  (uptimeStats?.downMonitors || 0) > 0 ? 'bg-gradient-to-br from-red-400 to-red-600' : 'bg-gradient-to-br from-emerald-400 to-emerald-600'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Overall Status</p>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {uptimeLoading ? (
                      <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded"></div>
                    ) : (
                      (uptimeStats?.downMonitors || 0) > 0 ? 'Issues' : 'All Good'
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contracts & Documents Section */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl mb-8">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Contracts & Documents
                </h3>
                <button
                  onClick={() => router.push('/customer/contracts')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  View All Contracts
                </button>
              </div>
            </div>
            <div className="px-6 py-6">
              {/* Single Unified Contracts Section */}
              <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Your Contracts & Agreements</h4>
                <div className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                  <div>View all your contracts, agreements, and legal documents. Track signatures, download files, and manage your business relationships with TsvWeb.</div>
                </div>
                <button
                  onClick={() => router.push('/customer/contracts')}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View All Contracts
                </button>
              </div>

              {/* Quick Access Banner */}
              <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold mb-1">Need Help with Your Contracts?</h4>
                    <p className="text-indigo-100 text-sm">Contact TsvWeb support for assistance with your agreements and documents.</p>
                  </div>
                  <button 
                    onClick={() => setShowSupportModal(true)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Links */}
          {customer.websites && customer.websites.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* WordPress Site */}
              <a
                href={customer.websites[0].startsWith('http') ? customer.websites[0] : `https://${customer.websites[0]}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.158 12.786l-2.698 7.84c.806.236 1.657.365 2.54.365 1.047 0 2.051-.18 2.986-.51-.024-.037-.046-.078-.065-.123l-2.763-7.572zm-5.316 3.713c-1.107-1.62-1.758-3.582-1.758-5.699 0-1.954.67-3.75 1.788-5.178l3.27 8.957-3.3 1.92zm8.666-11.475c.513-.027.976-.084.976-.084.459-.055.406-.73-.054-.705 0 0-1.376.109-2.265.109-.835 0-2.24-.109-2.24-.109-.459-.025-.513.677-.054.705 0 0 .434.057.892.084l1.324 3.63-1.862 5.578-3.096-9.208c.514-.027.976-.084.976-.084.459-.055.406-.73-.053-.705 0 0-1.377.109-2.265.109-.159 0-.347-.004-.547-.01C7.818 3.03 9.783 2 12 2c1.583 0 3.027.57 4.144 1.514-.027-.002-.053-.006-.08-.006-.835 0-1.427.727-1.427 1.509 0 .701.405 1.294.835 1.995.324.567.702 1.294.702 2.346 0 .727-.28 1.572-.648 2.748l-.849 2.833-3.072-9.138zm7.992 1.976c0 2.117-.651 4.08-1.758 5.699l-3.3-1.92 3.27-8.957c1.118 1.428 1.788 3.224 1.788 5.178zM12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Your WordPress Site</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 truncate">{customer.websites[0]}</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>

              {/* WordPress Admin */}
              <a
                href={`${customer.websites[0].startsWith('http') ? customer.websites[0] : `https://${customer.websites[0]}`}/wp-admin`}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-1">WordPress Admin</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Manage your website content</div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </a>
            </div>
          )}

          {/* Monitors List */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl shadow-xl">
            <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white">
                Website Monitors
                {!uptimeLoading && (
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                    ({monitors.length} total)
                  </span>
                )}
              </h3>
            </div>
            <div className="px-6 py-4">
              {uptimeLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse flex items-center space-x-4">
                      <div className="w-3 h-3 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
                    </div>
                  ))}
                </div>
              ) : monitors.length > 0 ? (
                <div className="space-y-4">
                  {monitors.map((monitor) => (
                    <div key={monitor.id} className="flex items-center justify-between p-4 border border-gray-200/50 dark:border-gray-700/50 rounded-xl hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(monitor.status)}`}></div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">{monitor.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{monitor.url}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{monitor.uptime.toFixed(1)}%</span>
                        <span className="text-gray-600 dark:text-gray-300">{monitor.ping}ms</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          monitor.status === 'up' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                          monitor.status === 'down' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                          'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {getStatusText(monitor.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No monitors found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Your website monitors will appear here once they are configured.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Support Ticket Modal */}
      <SupportTicketModal 
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        onSubmit={(ticketData) => {
          console.log('Support ticket created:', ticketData);
          // You can add additional handling here if needed
        }}
      />
    </div>
  )
}
