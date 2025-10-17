"use client"

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import {
  HomeIcon,
  NewspaperIcon,
  PhotoIcon,
  EnvelopeIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  MegaphoneIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon,
  DocumentTextIcon,
  UserPlusIcon,
  SparklesIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

interface AdminLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: number
  allowedRoles?: string[]
}

interface NavSection {
  title: string
  items: NavItem[]
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { data: session, status } = useSession()
  const { theme, setTheme } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userRole, setUserRole] = useState<string>('admin')
  const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'content', 'business', 'communication', 'system'])
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (session?.user) {
      const role = (session.user as any).role || 'admin'
      setUserRole(role)
    }
  }, [session])

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  // Navigation sections
  const navigationSections: NavSection[] = [
    {
      title: 'Overview',
      items: [
        { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon }
      ]
    },
    {
      title: 'Content Management',
      items: [
        { name: 'Blog Posts', href: '/admin/blog', icon: NewspaperIcon, allowedRoles: ['admin', 'editor'] },
        { name: 'Portfolio', href: '/admin/portfolio', icon: PhotoIcon, allowedRoles: ['admin', 'editor'] },
        { name: 'Announcements', href: '/admin/announcements', icon: MegaphoneIcon, allowedRoles: ['admin', 'editor'] }
      ]
    },
    {
      title: 'Business',
      items: [
        { name: 'Lead Generation', href: '/admin/lead-generation', icon: RocketLaunchIcon, allowedRoles: ['admin', 'editor'] },
        { name: 'Inquiries', href: '/admin/inquiries', icon: EnvelopeIcon },
        { name: 'Invoices & Quotes', href: '/admin/invoices', icon: CurrencyDollarIcon, allowedRoles: ['admin', 'editor'] },
        { name: 'Contracts', href: '/admin/contracts', icon: ClipboardDocumentListIcon, allowedRoles: ['admin', 'editor'] }
      ]
    },
    {
      title: 'Communication',
      items: [
        { name: 'Newsletter', href: '/admin/newsletter', icon: EnvelopeIcon, allowedRoles: ['admin', 'editor'] },
        { name: 'Chat History', href: '/admin/chat-history', icon: ChatBubbleLeftRightIcon, allowedRoles: ['admin', 'viewer'] }
      ]
    },
    {
      title: 'System',
      items: [
        { name: 'Users', href: '/admin/users', icon: UserGroupIcon, allowedRoles: ['admin', 'editor'] },
        { name: 'Settings', href: '/admin/settings', icon: CogIcon, allowedRoles: ['admin'] }
      ]
    }
  ]

  // Quick actions
  const quickActions = [
    { name: 'New Post', href: '/admin/blog', icon: DocumentTextIcon, color: 'from-blue-500 to-blue-600', roles: ['admin', 'editor'] },
    { name: 'New Invoice', href: '/admin/invoices/new', icon: CurrencyDollarIcon, color: 'from-green-500 to-green-600', roles: ['admin', 'editor'] },
    { name: 'Add User', href: '/admin/users', icon: UserPlusIcon, color: 'from-purple-500 to-purple-600', roles: ['admin', 'editor'] },
    { name: 'Announce', href: '/admin/announcements', icon: MegaphoneIcon, color: 'from-orange-500 to-orange-600', roles: ['admin', 'editor'] }
  ]

  // Filter navigation based on role
  const filterNavByRole = (items: NavItem[]) => {
    return items.filter(item => 
      !item.allowedRoles || item.allowedRoles.includes(userRole)
    )
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    router.push('/admin/login')
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-y-auto border-r border-gray-200 dark:border-gray-700 shadow-lg">
          {/* Logo */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">TsvWeb Admin</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Management Portal</p>
            </div>
            <SparklesIcon className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>

          {/* Quick Actions */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.filter(action => action.roles.includes(userRole)).map((action) => {
                const Icon = action.icon
                return (
                  <Link
                    key={action.name}
                    href={action.href}
                    className={`flex flex-col items-center justify-center p-3 rounded-lg bg-gradient-to-br ${action.color} text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200`}
                  >
                    <Icon className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">{action.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-1">
            {navigationSections.map((section) => {
              const filteredItems = filterNavByRole(section.items)
              if (filteredItems.length === 0) return null
              
              const sectionKey = section.title.toLowerCase().replace(/\s+/g, '-')
              const isExpanded = expandedSections.includes(sectionKey)

              return (
                <div key={section.title} className="mb-4">
                  <button
                    onClick={() => toggleSection(sectionKey)}
                    className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider hover:text-gray-900 dark:hover:text-gray-300 transition-colors"
                  >
                    <span>{section.title}</span>
                    {isExpanded ? (
                      <ChevronDownIcon className="h-4 w-4" />
                    ) : (
                      <ChevronRightIcon className="h-4 w-4" />
                    )}
                  </button>
                  
                  {isExpanded && (
                    <div className="mt-1 space-y-1">
                      {filteredItems.map((item) => {
                        const Icon = item.icon
                        const isActive = pathname === item.href
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                              isActive
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                            }`}
                          >
                            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </nav>

          {/* User Info */}
          <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {session?.user?.name?.charAt(0) || 'A'}
                </div>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{session?.user?.name || 'Admin'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-gradient-to-b dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-y-auto shadow-xl">
            {/* Mobile sidebar content (same as desktop) */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">TsvWeb Admin</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Management Portal</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            {/* Rest of sidebar content */}
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top Navigation */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="lg:hidden -m-2.5 p-2.5 text-gray-700 dark:text-gray-300"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          {/* Breadcrumb */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-2 text-sm">
              <HomeIcon className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400">/</span>
              <span className="font-medium text-gray-900 dark:text-white capitalize">
                {pathname.split('/').pop()?.replace(/-/g, ' ') || 'Dashboard'}
              </span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-x-4 lg:gap-x-6">
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              aria-label="Toggle theme"
            >
              {mounted && theme === 'dark' ? (
                <SunIcon className="h-6 w-6" />
              ) : (
                <MoonIcon className="h-6 w-6" />
              )}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  )
}
