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
    chatConversations: 0
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
      const [usersRes, inquiriesRes, blogRes, portfolioRes, contractsRes, invoicesRes, announcementsRes, newsletterRes, chatRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/inquiries?status=new&limit=100'),
        fetch('/api/admin/blog'),
        fetch('/api/admin/portfolio'),
        fetch('/api/admin/contracts'),
        fetch('/api/admin/invoices'),
        fetch('/api/admin/announcements'),
        fetch('/api/admin/newsletter?page=1&limit=1000'),
        fetch('/api/admin/chat-history?page=1&limit=1000')
      ])

      const [users, inquiries, blog, portfolio, contracts, invoices, announcements, newsletter, chat] = await Promise.all([
        usersRes.json(),
        inquiriesRes.json(),
        blogRes.json(),
        portfolioRes.json(),
        contractsRes.json(),
        invoicesRes.json(),
        announcementsRes.json(),
        newsletterRes.json(),
        chatRes.json()
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
        chatConversations
      })
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
