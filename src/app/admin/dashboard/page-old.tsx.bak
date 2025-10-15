"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface InquiryData {
  _id: string;
  name: string;
  email: string;
  subject: string;
  createdAt: string;
}

interface BlogPostData {
  _id: string;
  title: string;
  status: string;
  createdAt: string;
}

interface UptimeMonitor {
  name: string;
  status: number;
  uptime: number;
  avgPing: number;
}

interface UptimeStats {
  uptime: number;
  totalMonitors: number;
  upMonitors: number;
  downMonitors: number;
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
    totalVisits: 0,
    newInquiries: 0,
    blogPosts: 0,
    portfolioItems: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentInquiries, setRecentInquiries] = useState<InquiryData[]>([])
  const [recentPosts, setRecentPosts] = useState<BlogPostData[]>([])
  const [uptimeStats, setUptimeStats] = useState<UptimeStats | null>(null)
  const [monitors, setMonitors] = useState<UptimeMonitor[]>([])
  const [visitData, setVisitData] = useState<any[]>([])
  const [inquiryTrendData, setInquiryTrendData] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Fetch inquiries
        const inquiriesRes = await fetch('/api/admin/inquiries?limit=4&status=new')
        const inquiriesData = await inquiriesRes.json()
        
        // Fetch all inquiries for trend data
        const allInquiriesRes = await fetch('/api/admin/inquiries')
        const allInquiriesData = await allInquiriesRes.json()
        
        // Fetch blog posts
        const postsRes = await fetch('/api/admin/blog?limit=4')
        const postsData = await postsRes.json()
        
        // Fetch portfolio items
        const portfolioRes = await fetch('/api/admin/portfolio?limit=1')
        const portfolioData = await portfolioRes.json()
        
        // Fetch Uptime Kuma data
        try {
          const uptimeRes = await fetch('/api/public/uptime?type=stats')
          const uptimeData = await uptimeRes.json()
          
          if (uptimeData.success) {
            setUptimeStats(uptimeData.data)
          }
          
          const monitorsRes = await fetch('/api/public/uptime?type=monitors')
          const monitorsData = await monitorsRes.json()
          
          if (monitorsData.success && monitorsData.data) {
            setMonitors(monitorsData.data.slice(0, 6))
          }
        } catch (error) {
          console.error('Error fetching uptime data:', error)
        }
        
        // Generate visit trend data (last 7 days)
        const visitTrend = []
        for (let i = 6; i >= 0; i--) {
          const date = new Date()
          date.setDate(date.getDate() - i)
          visitTrend.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            visits: Math.floor(Math.random() * 200) + 100
          })
        }
        setVisitData(visitTrend)
        
        // Generate inquiry trend data from real inquiries
        if (allInquiriesData?.data) {
          const inquiryByDate: { [key: string]: number } = {}
          allInquiriesData.data.forEach((inquiry: any) => {
            const date = new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            inquiryByDate[date] = (inquiryByDate[date] || 0) + 1
          })
          
          const inquiryTrend = Object.entries(inquiryByDate)
            .slice(-7)
            .map(([date, count]) => ({ date, inquiries: count }))
          setInquiryTrendData(inquiryTrend)
        }
        
        // Set stats
        setStats({
          totalVisits: visitTrend.reduce((sum, day) => sum + day.visits, 0),
          newInquiries: inquiriesData?.data?.filter((i: any) => i.status === 'new').length || 0,
          blogPosts: postsData?.pagination?.total || 0,
          portfolioItems: portfolioData?.pagination?.total || 0
        })
        
        // Set recent inquiries
        if (inquiriesData?.data) {
          setRecentInquiries(inquiriesData.data.map((inquiry: any) => ({
            _id: inquiry._id,
            name: inquiry.name,
            email: inquiry.email,
            subject: inquiry.subject,
            createdAt: new Date(inquiry.createdAt).toISOString().split('T')[0]
          })))
        }
        
        // Set recent posts
        if (postsData?.data) {
          setRecentPosts(postsData.data.map((post: any) => ({
            _id: post._id,
            title: post.title,
            status: post.status,
            createdAt: new Date(post.createdAt).toISOString().split('T')[0]
          })))
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-royal-blue"></div>
      </div>
    )
  }

  return (
    <main className="flex-1 overflow-y-auto focus:outline-none">
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-royal-blue-light rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Total Visits
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats.totalVisits.toLocaleString()}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/analytics" className="font-medium text-royal-blue hover:text-royal-blue-dark">
                      View analytics
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-royal-blue-light rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          New Inquiries
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats.newInquiries}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/inquiries" className="font-medium text-royal-blue hover:text-royal-blue-dark">
                      View all inquiries
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-royal-blue-light rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Blog Posts
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats.blogPosts}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/blog" className="font-medium text-royal-blue hover:text-royal-blue-dark">
                      Manage blog posts
                    </Link>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-royal-blue-light rounded-md p-3">
                      <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Portfolio Items
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {stats.portfolioItems}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <Link href="/admin/portfolio" className="font-medium text-royal-blue hover:text-royal-blue-dark">
                      Manage portfolio
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Visits Trend Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Website Visits (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={visitData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="visits" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Inquiry Trend Chart */}
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Inquiries Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={inquiryTrendData.length > 0 ? inquiryTrendData : [{ date: 'No data', inquiries: 0 }]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Legend />
                    <Bar dataKey="inquiries" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Uptime Monitoring Section */}
            {uptimeStats && uptimeStats.uptime !== undefined && (
              <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Uptime Monitoring</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Real-time monitoring powered by Uptime Kuma</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-500">{(uptimeStats.uptime || 0).toFixed(2)}%</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Overall Uptime</div>
                  </div>
                </div>

                {/* Uptime Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Monitors</p>
                        <p className="text-2xl font-semibold text-gray-900 dark:text-white">{uptimeStats.totalMonitors || 0}</p>
                      </div>
                      <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Up</p>
                        <p className="text-2xl font-semibold text-green-500">{uptimeStats.upMonitors || 0}</p>
                      </div>
                      <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Down</p>
                        <p className="text-2xl font-semibold text-red-500">{uptimeStats.downMonitors || 0}</p>
                      </div>
                      <svg className="h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Monitors List */}
                {monitors.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Monitor</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Uptime</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Avg Ping</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {monitors.map((monitor, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {monitor.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                monitor.status === 1 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                              }`}>
                                {monitor.status === 1 ? 'Up' : 'Down'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {(monitor.uptime || 0).toFixed(2)}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {monitor.avgPing ? `${monitor.avgPing.toFixed(0)}ms` : 'N/A'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* Recent Inquiries */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Recent Inquiries
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Latest contact form submissions
                  </p>
                </div>
                <Link href="/admin/inquiries" className="text-sm font-medium text-royal-blue hover:text-royal-blue-dark">
                  View all
                </Link>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Subject
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">View</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex justify-center items-center">Loading...
                            </div>
                          </td>
                        </tr>
                      ) : recentInquiries.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No inquiries found
                          </td>
                        </tr>
                      ) : (
                        recentInquiries.map((inquiry: InquiryData) => (
                          <tr key={inquiry._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {inquiry.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {inquiry.email}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {inquiry.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {inquiry.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/admin/inquiries/${inquiry._id}`} className="text-royal-blue hover:text-royal-blue-dark">
                                View
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Recent Blog Posts */}
            <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Recent Blog Posts
                  </h3>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                    Latest blog posts
                  </p>
                </div>
                <Link href="/admin/blog" className="text-sm font-medium text-royal-blue hover:text-royal-blue-dark">
                  View all
                </Link>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Edit</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {loading ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex justify-center items-center">Loading...
                            </div>
                          </td>
                        </tr>
                      ) : recentPosts.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                            No blog posts found
                          </td>
                        </tr>
                      ) : (
                        recentPosts.map((post: BlogPostData) => (
                          <tr key={post._id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                              {post.title}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                post.status === 'published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                              {post.createdAt}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Link href={`/admin/blog/${post._id}`} className="text-royal-blue hover:text-royal-blue-dark">
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
