"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  BriefcaseIcon,
  EnvelopeIcon,
  CogIcon,
  BellIcon,
  CurrencyDollarIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  NewspaperIcon,
  PhotoIcon,
  ClipboardDocumentListIcon,
  ArrowTrendingUpIcon,
  ServerIcon,
  MegaphoneIcon
} from '@heroicons/react/24/outline'

interface DashboardSection {
  id: string
  title: string
  description: string
  icon: any
  href: string
  color: string
  stats?: { label: string; value: string | number }[]
  allowedRoles: string[]
}

export default function AdminDashboard() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin/login')
    },
  })

  const [stats, setStats] = useState({
    totalUsers: 0,
    newInquiries: 0,
    blogPosts: 0,
    portfolioItems: 0,
    activeContracts: 0,
    pendingInvoices: 0,
    totalInvoices: 0,
    activeAnnouncements: 0,
    newsletterSubscribers: 0,
    chatConversations: 0,
    totalLeads: 0
  })
  const [analyticsData, setAnalyticsData] = useState({
    pageViews: 0,
    users: 0,
    sessions: 0,
    bounceRate: 0,
    avgSessionDuration: 0
  })
  const [loading, setLoading] = useState(true)
  const [userRole, setUserRole] = useState<string>('viewer')

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role || 'viewer'
      setUserRole(role)
      fetchStats()
    }
  }, [session])

  const fetchStats = async () => {
    try {
      const [usersRes, inquiriesRes, blogRes, portfolioRes, contractsRes, invoicesRes, announcementsRes, newsletterRes, chatRes, leadsRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/inquiries?status=new&limit=100'),
        fetch('/api/admin/blog'),
        fetch('/api/admin/portfolio'),
        fetch('/api/admin/contracts'),
        fetch('/api/admin/invoices'),
        fetch('/api/admin/announcements'),
        fetch('/api/admin/newsletter?page=1&limit=1000'),
        fetch('/api/admin/chat-history?page=1&limit=1000'),
        fetch('/api/admin/leads')
      ])

      const [users, inquiries, blog, portfolio, contracts, invoices, announcements, newsletter, chat, leads] = await Promise.all([
        usersRes.json(),
        inquiriesRes.json(),
        blogRes.json(),
        portfolioRes.json(),
        contractsRes.json(),
        invoicesRes.json(),
        announcementsRes.json(),
        newsletterRes.json(),
        chatRes.json(),
        leadsRes.json()
      ])

      // Count active contracts
      const activeContracts = contracts.data?.filter((c: any) => c.status === 'Signed' || c.status === 'Sent').length || 0
      
      // Count pending invoices
      const pendingInvoices = invoices.data?.filter((i: any) => i.status === 'sent' || i.status === 'viewed').length || 0
      
      // Count total invoices
      const totalInvoices = invoices.data?.length || 0
      
      // Count active announcements
      const activeAnnouncements = announcements.data?.filter((a: any) => a.isActive).length || 0
      
      // Count newsletter subscribers
      const newsletterSubscribers = newsletter.pagination?.totalItems || 0
      
      // Count chat conversations
      const chatConversations = chat.pagination?.totalItems || 0
      
      // Count total leads
      const totalLeads = leads.stats?.total || 0

      setStats({
        totalUsers: users.length || 0,
        newInquiries: inquiries.length || 0,
        blogPosts: blog.data?.length || 0,
        portfolioItems: portfolio.data?.length || 0,
        activeContracts,
        pendingInvoices,
        totalInvoices,
        activeAnnouncements,
        newsletterSubscribers,
        chatConversations,
        totalLeads
      })

      // Fetch Google Analytics data
      try {
        const analyticsRes = await fetch('/api/admin/analytics/google')
        const analyticsData = await analyticsRes.json()
        if (analyticsData.success) {
          setAnalyticsData(analyticsData.data)
        }
      } catch (error) {
        console.log('Google Analytics not configured:', error)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  // Define all dashboard sections with role-based access
  const sections: DashboardSection[] = [
    {
      id: 'users',
      title: 'User Management',
      description: 'Manage customers, admins, and user roles',
      icon: UserGroupIcon,
      href: '/admin/users',
      color: 'from-blue-500 to-blue-600',
      stats: [
        { label: 'Total Users', value: stats.totalUsers },
        { label: 'Active', value: stats.totalUsers }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'inquiries',
      title: 'Inquiries & Leads',
      description: 'View and respond to customer inquiries',
      icon: EnvelopeIcon,
      href: '/admin/inquiries',
      color: 'from-purple-500 to-purple-600',
      stats: [
        { label: 'New', value: stats.newInquiries },
        { label: 'This Week', value: stats.newInquiries }
      ],
      allowedRoles: ['admin', 'editor', 'viewer']
    },
    {
      id: 'blog',
      title: 'Blog Posts',
      description: 'Create and manage blog content',
      icon: NewspaperIcon,
      href: '/admin/blog',
      color: 'from-green-500 to-green-600',
      stats: [
        { label: 'Published', value: stats.blogPosts },
        { label: 'Drafts', value: 0 }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'portfolio',
      title: 'Portfolio',
      description: 'Showcase your best work',
      icon: PhotoIcon,
      href: '/admin/portfolio',
      color: 'from-pink-500 to-pink-600',
      stats: [
        { label: 'Projects', value: stats.portfolioItems },
        { label: 'Featured', value: 0 }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'invoices',
      title: 'Invoices & Quotes',
      description: 'Manage billing and quotes',
      icon: CurrencyDollarIcon,
      href: '/admin/invoices',
      color: 'from-yellow-500 to-yellow-600',
      stats: [
        { label: 'Pending', value: stats.pendingInvoices },
        { label: 'Total', value: stats.totalInvoices }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'contracts',
      title: 'Contracts & Legal',
      description: 'Manage contracts and agreements',
      icon: ClipboardDocumentListIcon,
      href: '/admin/contracts',
      color: 'from-indigo-500 to-indigo-600',
      stats: [
        { label: 'Active', value: stats.activeContracts },
        { label: 'Total', value: stats.activeContracts }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'announcements',
      title: 'Announcements',
      description: 'Send updates to customers',
      icon: MegaphoneIcon,
      href: '/admin/announcements',
      color: 'from-orange-500 to-orange-600',
      stats: [
        { label: 'Active', value: stats.activeAnnouncements },
        { label: 'Total', value: stats.activeAnnouncements }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'newsletter',
      title: 'Newsletter',
      description: 'Manage email subscribers',
      icon: EnvelopeIcon,
      href: '/admin/newsletter',
      color: 'from-teal-500 to-teal-600',
      stats: [
        { label: 'Subscribers', value: stats.newsletterSubscribers },
        { label: 'Active', value: stats.newsletterSubscribers }
      ],
      allowedRoles: ['admin', 'editor']
    },
    {
      id: 'chat-history',
      title: 'Chat History',
      description: 'View AI chatbot conversations',
      icon: ChatBubbleLeftRightIcon,
      href: '/admin/chat-history',
      color: 'from-cyan-500 to-cyan-600',
      stats: [
        { label: 'Total Chats', value: stats.chatConversations },
        { label: 'All Time', value: stats.chatConversations }
      ],
      allowedRoles: ['admin', 'viewer']
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Configure system settings',
      icon: CogIcon,
      href: '/admin/settings',
      color: 'from-gray-500 to-gray-600',
      allowedRoles: ['admin']
    }
  ]

  // Filter sections based on user role
  const accessibleSections = sections.filter(section =>
    section.allowedRoles.includes(userRole)
  )

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back, {session?.user?.name || 'Admin'}!
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Role: <span className="font-semibold capitalize">{userRole}</span>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow hover:shadow-md transition-shadow">
                <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
              </div>
              <UserGroupIcon className="h-12 w-12 text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">New Inquiries</p>
                <p className="text-3xl font-bold mt-2">{stats.newInquiries}</p>
              </div>
              <EnvelopeIcon className="h-12 w-12 text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Blog Posts</p>
                <p className="text-3xl font-bold mt-2">{stats.blogPosts}</p>
              </div>
              <NewspaperIcon className="h-12 w-12 text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Portfolio Items</p>
                <p className="text-3xl font-bold mt-2">{stats.portfolioItems}</p>
              </div>
              <PhotoIcon className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Role-Based Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Your Dashboard Sections
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accessibleSections.map((section) => {
              const Icon = section.icon
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${section.color} bg-opacity-10`}>
                        <Icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
                      </div>
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                        {section.allowedRoles.join(', ')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {section.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {section.description}
                    </p>
                    
                    {section.stats && (
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        {section.stats.map((stat, idx) => (
                          <div key={idx}>
                            <p className="text-xs text-gray-500 dark:text-gray-500">{stat.label}</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Analytics Overview
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Content Statistics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Content Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blog Posts</span>
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{stats.blogPosts}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.blogPosts / 50) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio Items</span>
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{stats.portfolioItems}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.portfolioItems / 30) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Active Announcements</span>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{stats.activeAnnouncements}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.activeAnnouncements / 20) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Newsletter Subscribers</span>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400">{stats.newsletterSubscribers}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((stats.newsletterSubscribers / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Metrics */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Business Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-700">
                  <div className="flex items-center justify-between mb-2">
                    <CurrencyDollarIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Invoices</span>
                  </div>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-300">{stats.totalInvoices}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">{stats.pendingInvoices} pending</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border-2 border-green-200 dark:border-green-700">
                  <div className="flex items-center justify-between mb-2">
                    <ClipboardDocumentListIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">Contracts</span>
                  </div>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-300">{stats.activeContracts}</p>
                  <p className="text-xs text-green-700 dark:text-green-400 mt-1">Active</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border-2 border-purple-200 dark:border-purple-700">
                  <div className="flex items-center justify-between mb-2">
                    <EnvelopeIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Inquiries</span>
                  </div>
                  <p className="text-3xl font-bold text-purple-900 dark:text-purple-300">{stats.newInquiries}</p>
                  <p className="text-xs text-purple-700 dark:text-purple-400 mt-1">New</p>
                </div>
                
                <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 rounded-lg p-4 border-2 border-cyan-200 dark:border-cyan-700">
                  <div className="flex items-center justify-between mb-2">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs font-medium text-cyan-600 dark:text-cyan-400">Chats</span>
                  </div>
                  <p className="text-3xl font-bold text-cyan-900 dark:text-cyan-300">{stats.chatConversations}</p>
                  <p className="text-xs text-cyan-700 dark:text-cyan-400 mt-1">Total</p>
                </div>
              </div>
            </div>
          </div>

          {/* Google Analytics - Enhanced */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-6 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-600 rounded-lg mr-3">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Google Analytics</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Last 30 Days Performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                <ArrowTrendingUpIcon className="h-5 w-5" />
                <span className="text-sm font-semibold">Live Data</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Page Views Card */}
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-blue-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{analyticsData.pageViews.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <span className="font-semibold">+12.5%</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              </div>

              {/* Users Card */}
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-green-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Unique Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{analyticsData.users.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <span className="font-semibold">+8.3%</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              </div>

              {/* Sessions Card */}
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-purple-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Sessions</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{analyticsData.sessions.toLocaleString()}</p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <span className="font-semibold">+15.7%</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              </div>

              {/* Bounce Rate Card */}
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-orange-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <svg className="h-6 w-6 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Bounce Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{analyticsData.bounceRate}%</p>
                <div className="flex items-center text-xs text-red-600 dark:text-red-400">
                  <span className="font-semibold">-3.2%</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">improvement</span>
                </div>
              </div>

              {/* Avg Duration Card */}
              <div className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-l-4 border-cyan-500">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg">
                    <svg className="h-6 w-6 text-cyan-600 dark:text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1">Avg. Duration</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{Math.floor(analyticsData.avgSessionDuration / 60)}m {Math.round(analyticsData.avgSessionDuration % 60)}s</p>
                <div className="flex items-center text-xs text-green-600 dark:text-green-400">
                  <span className="font-semibold">+22s</span>
                  <span className="ml-1 text-gray-500 dark:text-gray-400">vs last month</span>
                </div>
              </div>
            </div>

            {/* Mini Trend Line */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Traffic Trend</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">This Month</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-gray-600 dark:text-gray-400">Last Month</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 h-16 flex items-end space-x-1">
                {[40, 45, 38, 50, 48, 55, 52, 60, 58, 65, 70, 68, 75, 72, 80, 78, 85, 82, 88, 90, 92, 95, 93, 98, 96, 100, 97, 102, 105, 108].map((height, i) => (
                  <div key={i} className="flex-1 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t opacity-80 hover:opacity-100 transition-opacity" style={{ height: `${height}%` }}></div>
                ))}
              </div>
            </div>
          </div>

          {/* Lead Generation Funnel - Enhanced */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-6 mb-6 border border-purple-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg mr-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sales Funnel</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Conversion Pipeline</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalLeads > 0 ? Math.round((stats.activeContracts / stats.totalLeads) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Conversion Rate</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Stage 1: Total Leads */}
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Leads</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">All captured leads</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalLeads}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">100%</p>
                  </div>
                </div>
                <div className="relative h-14 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-500 rounded-xl shadow-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">100%</span>
                  </div>
                </div>
              </div>
              
              {/* Stage 2: New Inquiries */}
              <div className="relative pl-6">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mr-3">
                      <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">New Inquiries</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Contacted prospects</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.newInquiries}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stats.totalLeads > 0 ? Math.round((stats.newInquiries / stats.totalLeads) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div 
                  className="relative h-12 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 rounded-xl shadow-md overflow-hidden transition-all duration-500"
                  style={{ width: stats.totalLeads > 0 ? `${(stats.newInquiries / stats.totalLeads) * 100}%` : '0%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {stats.totalLeads > 0 ? Math.round((stats.newInquiries / stats.totalLeads) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Stage 3: Active Contracts */}
              <div className="relative pl-12">
                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-green-500"></div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mr-3">
                      <span className="text-green-600 dark:text-green-400 font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">Closed Deals</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Active contracts</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeContracts}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {stats.totalLeads > 0 ? Math.round((stats.activeContracts / stats.totalLeads) * 100) : 0}%
                    </p>
                  </div>
                </div>
                <div 
                  className="relative h-10 bg-gradient-to-r from-green-500 via-green-600 to-green-500 rounded-xl shadow overflow-hidden transition-all duration-500"
                  style={{ width: stats.totalLeads > 0 ? `${(stats.activeContracts / stats.totalLeads) * 100}%` : '0%' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {stats.totalLeads > 0 ? Math.round((stats.activeContracts / stats.totalLeads) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversion Insights */}
            <div className="mt-6 pt-6 border-t border-purple-200 dark:border-gray-700">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Lead Quality</p>
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      {[1,2,3,4,5].map((star) => (
                        <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Avg. Close Time</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">14 days</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Success Rate</p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    {stats.totalLeads > 0 ? Math.round((stats.activeContracts / stats.totalLeads) * 100) : 0}%
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">System Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.totalUsers / 100)}`} className="text-blue-600 dark:text-blue-400" />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{stats.totalUsers}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Users</p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.blogPosts / 50)}`} className="text-green-600 dark:text-green-400" />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{stats.blogPosts}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Blog Posts</p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.portfolioItems / 30)}`} className="text-purple-600 dark:text-purple-400" />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{stats.portfolioItems}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Portfolio</p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.totalInvoices / 50)}`} className="text-yellow-600 dark:text-yellow-400" />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{stats.totalInvoices}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Invoices</p>
              </div>
              
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-3">
                  <svg className="transform -rotate-90 w-20 h-20">
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200 dark:text-gray-700" />
                    <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={`${2 * Math.PI * 36}`} strokeDashoffset={`${2 * Math.PI * 36 * (1 - stats.activeContracts / 20)}`} className="text-cyan-600 dark:text-cyan-400" />
                  </svg>
                  <span className="absolute text-sm font-bold text-gray-900 dark:text-white">{stats.activeContracts}</span>
                </div>
                <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Contracts</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {userRole === 'admin' || userRole === 'editor' ? (
              <>
                <Link
                  href="/admin/blog"
                  className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <NewspaperIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <span className="text-sm font-medium text-blue-900 dark:text-blue-300">New Post</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center justify-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <UserGroupIcon className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
                  <span className="text-sm font-medium text-purple-900 dark:text-purple-300">Add User</span>
                </Link>
                <Link
                  href="/admin/invoices/new"
                  className="flex items-center justify-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <span className="text-sm font-medium text-green-900 dark:text-green-300">New Invoice</span>
                </Link>
                <Link
                  href="/admin/announcements"
                  className="flex items-center justify-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <MegaphoneIcon className="h-5 w-5 text-orange-600 dark:text-orange-400 mr-2" />
                  <span className="text-sm font-medium text-orange-900 dark:text-orange-300">Announce</span>
                </Link>
              </>
            ) : (
              <div className="col-span-4 text-center py-8 text-gray-500 dark:text-gray-400">
                Limited access - contact admin for more permissions
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
