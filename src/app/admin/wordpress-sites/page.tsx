'use client';

import { useState, useEffect } from 'react';
import withAdminAuth from '@/components/admin/with-admin-auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

interface WordPressUser {
  id: number;
  email: string;
  username: string;
  display_name: string;
  registered: string;
  role: string;
}

interface WordPressSite {
  _id: string;
  siteUrl: string;
  siteName: string;
  wordpressVersion: string;
  phpVersion: string;
  mysqlVersion: string;
  totalPosts: number;
  totalPages: number;
  totalUsers: number;
  activePlugins: number;
  activeTheme: string;
  themeVersion: string;
  siteHealth: string;
  memoryLimit: string;
  maxUploadSize: string;
  users?: WordPressUser[];
  lastUpdated: string;
  createdAt: string;
  // New fields
  totalComments?: number;
  approvedComments?: number;
  pendingComments?: number;
  spamComments?: number;
  totalCategories?: number;
  totalTags?: number;
  totalMedia?: number;
  draftPosts?: number;
  draftPages?: number;
  serverSoftware?: string;
  uploadMaxFilesize?: string;
  postMaxSize?: string;
  maxExecutionTime?: number;
  diskFreeSpace?: string;
  diskTotalSpace?: string;
  isMultisite?: boolean;
  siteLanguage?: string;
  timezone?: string;
  totalPlugins?: number;
  pluginList?: Array<{
    name: string;
    version: string;
    active: boolean;
    author: string;
  }>;
  themeAuthor?: string;
  siteDescription?: string;
  adminEmail?: string;
  // WooCommerce fields
  hasWooCommerce?: boolean;
  totalProducts?: number;
  publishedProducts?: number;
  draftProducts?: number;
  totalOrders?: number;
  completedOrders?: number;
  processingOrders?: number;
  totalRevenue?: string;
  currency?: string;
  hasStripe?: boolean;
  paymentGateways?: Array<{
    id: string;
    title: string;
    enabled: boolean;
  }>;
  recentOrders30d?: number;
  recentRevenue30d?: string;
  // Customer binding
  customerId?: string;
  customerEmail?: string;
  customerName?: string;
  plan?: string;
  // Payment tracking
  paymentStatus?: string;
  paymentAmount?: string;
  nextPaymentDate?: string;
  paymentMessage?: string;
  // AI Optimizer tracking
  aiOptimizerEnabled?: boolean;
  aiOptimizationsCount?: number;
  aiTokensUsed?: number;
}

function WordPressSitesPage() {
  const [sites, setSites] = useState<WordPressSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSite, setSelectedSite] = useState<WordPressSite | null>(null);
  const [manageSite, setManageSite] = useState<WordPressSite | null>(null);
  const [updateRequest, setUpdateRequest] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [generatedApiKey, setGeneratedApiKey] = useState('');
  const [apiKeySite, setApiKeySite] = useState<{ url: string; name: string } | null>(null);
  const [bindCustomerSite, setBindCustomerSite] = useState<WordPressSite | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [optimizerControlSite, setOptimizerControlSite] = useState<WordPressSite | null>(null);
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);

  // Helper function to decode HTML entities (like &pound; to £)
  const decodeHtmlEntity = (str: string) => {
    if (typeof window === 'undefined') return str;
    const textarea = document.createElement('textarea');
    textarea.innerHTML = str;
    return textarea.value;
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const response = await fetch('/api/admin/wordpress-sites');
      if (response.ok) {
        const data = await response.json();
        setSites(data.sites || []);
      }
    } catch (error) {
      console.error('Error fetching WordPress sites:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const data = await response.json();
        setCustomers(data.customers || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleBindCustomer = async () => {
    if (!bindCustomerSite || !selectedCustomerId) return;

    try {
      const response = await fetch(`/api/admin/wordpress-sites/${bindCustomerSite._id}/bind-customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: selectedCustomerId })
      });

      if (response.ok) {
        setSuccess('Site bound to customer successfully!');
        setBindCustomerSite(null);
        setSelectedCustomerId('');
        fetchSites();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to bind site');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error binding site:', error);
      setError('Failed to bind site to customer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleUnbindCustomer = async (siteId: string) => {
    if (!confirm('Are you sure you want to unbind this site from the customer?')) return;

    try {
      const response = await fetch(`/api/admin/wordpress-sites/${siteId}/bind-customer`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setSuccess('Site unbound from customer successfully!');
        fetchSites();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to unbind site');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error unbinding site:', error);
      setError('Failed to unbind site from customer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleToggleOptimizer = async (siteId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/wordpress-sites/${siteId}/optimizer-control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus })
      });

      if (response.ok) {
        setSuccess(`Optimizer ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
        fetchSites();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to toggle optimizer');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      console.error('Error toggling optimizer:', error);
      setError('Failed to toggle optimizer');
      setTimeout(() => setError(''), 3000);
    }
  };

  const calculateTotalAICost = () => {
    const totalTokens = sites.reduce((sum, site) => sum + (site.aiTokensUsed || 0), 0);
    const totalOptimizations = sites.reduce((sum, site) => sum + (site.aiOptimizationsCount || 0), 0);
    const estimatedCost = (totalTokens / 1000) * 0.045; // GPT-4 average pricing
    return { totalTokens, totalOptimizations, estimatedCost };
  };

  const getHealthColor = (health: string) => {
    if (health.toLowerCase().includes('good')) {
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    } else if (health.toLowerCase().includes('warning')) {
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    } else {
      return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <h1 className="text-3xl font-bold">WordPress Sites Monitor</h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Monitor all your client WordPress websites from one dashboard
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setApiKeySite({ url: '', name: 'New Site' });
                    setShowApiKeyModal(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-green-500/90 hover:bg-green-600 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Generate API Key
                </button>
                <a
                  href="/download/wordpress-plugin"
                  className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30 font-medium"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Plugin
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Sites</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{sites.length}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 919-9" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Healthy Sites</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sites.filter(s => s.siteHealth?.toLowerCase().includes('good')).length}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Posts</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sites.reduce((sum, site) => sum + (site.totalPosts || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {sites.reduce((sum, site) => sum + (site.totalUsers || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* AI Optimizer Stats */}
        <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-lg p-8 text-white mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <div>
                <h2 className="text-2xl font-bold">AI Product Optimizer</h2>
                <p className="text-purple-100">Monitor AI usage and costs across all sites</p>
              </div>
            </div>
            <button
              onClick={() => setShowCostBreakdown(!showCostBreakdown)}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all border border-white/30"
            >
              {showCostBreakdown ? 'Hide Details' : 'Show Details'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <p className="text-sm text-purple-100">Total Optimizations</p>
              </div>
              <p className="text-4xl font-bold">{calculateTotalAICost().totalOptimizations.toLocaleString()}</p>
              <p className="text-xs text-purple-200 mt-1">Products optimized with AI</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-sm text-purple-100">Tokens Used</p>
              </div>
              <p className="text-4xl font-bold">{calculateTotalAICost().totalTokens.toLocaleString()}</p>
              <p className="text-xs text-purple-200 mt-1">OpenAI API tokens consumed</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-purple-100">Estimated Cost</p>
              </div>
              <p className="text-4xl font-bold">${calculateTotalAICost().estimatedCost.toFixed(2)}</p>
              <p className="text-xs text-purple-200 mt-1">Total AI usage cost (USD)</p>
            </div>
          </div>

          {showCostBreakdown && (
            <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
              <h3 className="text-lg font-semibold mb-4">Cost Breakdown by Site</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sites.filter(site => site.aiOptimizationsCount && site.aiOptimizationsCount > 0).map(site => {
                  const siteCost = ((site.aiTokensUsed || 0) / 1000) * 0.045;
                  return (
                    <div key={site._id} className="flex items-center justify-between bg-white/5 rounded-lg p-3">
                      <div className="flex-1">
                        <p className="font-medium">{site.siteName}</p>
                        <p className="text-sm text-purple-200">{site.siteUrl}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${siteCost.toFixed(2)}</p>
                        <p className="text-xs text-purple-200">{site.aiOptimizationsCount} optimizations</p>
                        <p className="text-xs text-purple-200">{(site.aiTokensUsed || 0).toLocaleString()} tokens</p>
                      </div>
                    </div>
                  );
                })}
                {sites.filter(site => site.aiOptimizationsCount && site.aiOptimizationsCount > 0).length === 0 && (
                  <p className="text-center text-purple-200 py-4">No AI optimizations performed yet</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sites Grid */}
        {sites.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <div className="p-6 bg-blue-100 dark:bg-blue-900/20 rounded-full inline-block mb-4">
              <svg className="h-16 w-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No WordPress Sites Connected</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Install the TsvWeb Monitor plugin on your WordPress sites to start monitoring
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  setApiKeySite({ url: '', name: 'New Site' });
                  setShowApiKeyModal(true);
                }}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 shadow-lg transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Generate API Key
              </button>
              <a
                href="/download/wordpress-plugin"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 shadow-lg transition-all"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Plugin
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sites.map((site) => (
              <div
                key={site._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
                onClick={() => setSelectedSite(site)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {site.siteName}
                      </h3>
                      <a
                        href={site.siteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {site.siteUrl}
                      </a>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getHealthColor(site.siteHealth || 'Unknown')}`}>
                      {site.siteHealth || 'Unknown'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">WordPress</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{site.wordpressVersion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">PHP</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{site.phpVersion}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Posts</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{site.totalPosts}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Plugins</p>
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">{site.activePlugins}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span>Theme: {site.activeTheme}</span>
                    <span>Updated {formatDate(site.lastUpdated)}</span>
                  </div>

                  {/* Customer Binding Info */}
                  {site.customerName && (
                    <div className="mt-3 px-3 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <span className="text-sm font-medium text-green-700 dark:text-green-300">
                            Assigned to: {site.customerName}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUnbindCustomer(site._id);
                          }}
                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
                        >
                          Unbind
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Status */}
                  {site.paymentStatus && (
                    <div className={`mt-3 px-3 py-2 rounded-lg border ${
                      site.paymentStatus === 'paid' 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' 
                        : site.paymentStatus === 'overdue'
                        ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className={`w-4 h-4 ${
                            site.paymentStatus === 'paid' 
                              ? 'text-blue-600 dark:text-blue-400' 
                              : site.paymentStatus === 'overdue'
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-yellow-600 dark:text-yellow-400'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <div>
                            <span className={`text-xs font-semibold uppercase ${
                              site.paymentStatus === 'paid' 
                                ? 'text-blue-700 dark:text-blue-300' 
                                : site.paymentStatus === 'overdue'
                                ? 'text-red-700 dark:text-red-300'
                                : 'text-yellow-700 dark:text-yellow-300'
                            }`}>
                              {site.paymentStatus}
                            </span>
                            {site.nextPaymentDate && (
                              <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                Next: {site.nextPaymentDate}
                              </span>
                            )}
                          </div>
                        </div>
                        {site.paymentAmount && (
                          <span className="text-sm font-bold text-gray-900 dark:text-white">
                            £{site.paymentAmount}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Optimizer Status */}
                  {site.hasWooCommerce && (
                    <div className={`mt-3 px-3 py-2 rounded-lg border ${
                      site.aiOptimizerEnabled 
                        ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' 
                        : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                    }`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <svg className={`w-4 h-4 ${
                            site.aiOptimizerEnabled 
                              ? 'text-purple-600 dark:text-purple-400' 
                              : 'text-gray-400 dark:text-gray-500'
                          }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <div>
                            <span className={`text-xs font-semibold ${
                              site.aiOptimizerEnabled 
                                ? 'text-purple-700 dark:text-purple-300' 
                                : 'text-gray-600 dark:text-gray-400'
                            }`}>
                              AI Optimizer: {site.aiOptimizerEnabled ? 'Enabled' : 'Disabled'}
                            </span>
                            {site.aiOptimizationsCount && site.aiOptimizationsCount > 0 && (
                              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {site.aiOptimizationsCount} optimizations • {(site.aiTokensUsed || 0).toLocaleString()} tokens • ${(((site.aiTokensUsed || 0) / 1000) * 0.045).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleOptimizer(site._id, site.aiOptimizerEnabled || false);
                          }}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                            site.aiOptimizerEnabled
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50'
                              : 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50'
                          }`}
                        >
                          {site.aiOptimizerEnabled ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setBindCustomerSite(site);
                        fetchCustomers();
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-xs font-medium"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {site.customerName ? 'Change' : 'Bind'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setManageSite(site);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-xs font-medium"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSite(site);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-xs font-medium"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail Modal */}
        {selectedSite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedSite(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{selectedSite.siteName}</h2>
                    <a href={selectedSite.siteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {selectedSite.siteUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => setSelectedSite(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">WordPress Version</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.wordpressVersion}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">PHP Version</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.phpVersion}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">MySQL Version</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.mysqlVersion}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Memory Limit</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.memoryLimit}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Posts</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.totalPosts}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Pages</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.totalPages}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Users</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.totalUsers}</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Plugins</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.activePlugins}</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Active Theme</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {selectedSite.activeTheme} <span className="text-sm text-gray-500">v{selectedSite.themeVersion}</span>
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Site Health</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getHealthColor(selectedSite.siteHealth)}`}>
                      {selectedSite.siteHealth}
                    </span>
                  </div>

                  {/* NEW: Content Statistics */}
                  {(selectedSite.totalComments || selectedSite.totalCategories || selectedSite.totalTags || selectedSite.totalMedia) && (
                    <div className="col-span-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Content Statistics
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedSite.totalComments !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Comments</p>
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedSite.totalComments}</p>
                            {selectedSite.approvedComments !== undefined && (
                              <p className="text-xs text-green-600 dark:text-green-400">✓ {selectedSite.approvedComments} approved</p>
                            )}
                            {selectedSite.pendingComments !== undefined && selectedSite.pendingComments > 0 && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">⏳ {selectedSite.pendingComments} pending</p>
                            )}
                          </div>
                        )}
                        {selectedSite.totalCategories !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Categories</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{selectedSite.totalCategories}</p>
                          </div>
                        )}
                        {selectedSite.totalTags !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Tags</p>
                            <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{selectedSite.totalTags}</p>
                          </div>
                        )}
                        {selectedSite.totalMedia !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Media Files</p>
                            <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{selectedSite.totalMedia}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* NEW: Server Resources */}
                  {(selectedSite.memoryLimit || selectedSite.diskFreeSpace || selectedSite.serverSoftware) && (
                    <div className="col-span-2 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                        </svg>
                        Server Resources
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedSite.memoryLimit && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Memory Limit</p>
                            <p className="text-lg font-bold text-green-600 dark:text-green-400">{selectedSite.memoryLimit}</p>
                          </div>
                        )}
                        {selectedSite.uploadMaxFilesize && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Max Upload</p>
                            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{selectedSite.uploadMaxFilesize}</p>
                          </div>
                        )}
                        {selectedSite.maxExecutionTime && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Max Execution</p>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{selectedSite.maxExecutionTime}s</p>
                          </div>
                        )}
                        {selectedSite.diskFreeSpace && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Disk Free</p>
                            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{selectedSite.diskFreeSpace}</p>
                          </div>
                        )}
                        {selectedSite.diskTotalSpace && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Disk Total</p>
                            <p className="text-lg font-bold text-teal-600 dark:text-teal-400">{selectedSite.diskTotalSpace}</p>
                          </div>
                        )}
                        {selectedSite.serverSoftware && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg col-span-2 md:col-span-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Server Software</p>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedSite.serverSoftware}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* NEW: WooCommerce & Payments */}
                  {selectedSite.hasWooCommerce && (
                    <div className="col-span-2 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl p-6 border border-cyan-200 dark:border-cyan-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        WooCommerce Store & Payments
                        {selectedSite.hasStripe && (
                          <span className="ml-2 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                            💳 Stripe Active
                          </span>
                        )}
                      </h3>
                      
                      {/* Products & Orders */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {selectedSite.totalProducts !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-cyan-500">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Products</p>
                            <p className="text-3xl font-bold text-cyan-600 dark:text-cyan-400">{selectedSite.totalProducts}</p>
                            {selectedSite.publishedProducts !== undefined && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ {selectedSite.publishedProducts} published</p>
                            )}
                            {selectedSite.draftProducts !== undefined && selectedSite.draftProducts > 0 && (
                              <p className="text-xs text-gray-500 dark:text-gray-400">📝 {selectedSite.draftProducts} drafts</p>
                            )}
                          </div>
                        )}
                        {selectedSite.totalOrders !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-blue-500">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Orders</p>
                            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{selectedSite.totalOrders}</p>
                            {selectedSite.completedOrders !== undefined && (
                              <p className="text-xs text-green-600 dark:text-green-400 mt-1">✓ {selectedSite.completedOrders} completed</p>
                            )}
                            {selectedSite.processingOrders !== undefined && selectedSite.processingOrders > 0 && (
                              <p className="text-xs text-yellow-600 dark:text-yellow-400">⏳ {selectedSite.processingOrders} processing</p>
                            )}
                          </div>
                        )}
                        {selectedSite.totalRevenue && (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg col-span-2 border-l-4 border-emerald-500">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
                            <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                              {selectedSite.currency ? decodeHtmlEntity(selectedSite.currency) : '$'}{selectedSite.totalRevenue}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">All-time sales</p>
                          </div>
                        )}
                      </div>

                      {/* Recent Stats (Last 30 Days) */}
                      {(selectedSite.recentOrders30d !== undefined || selectedSite.recentRevenue30d) && (
                        <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg p-4 mb-4">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">📊 Last 30 Days</p>
                          <div className="grid grid-cols-2 gap-4">
                            {selectedSite.recentOrders30d !== undefined && (
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Orders</p>
                                <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{selectedSite.recentOrders30d}</p>
                              </div>
                            )}
                            {selectedSite.recentRevenue30d && (
                              <div>
                                <p className="text-xs text-gray-600 dark:text-gray-400">Revenue</p>
                                <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                                  {selectedSite.currency ? decodeHtmlEntity(selectedSite.currency) : '$'}{selectedSite.recentRevenue30d}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Payment Gateways */}
                      {selectedSite.paymentGateways && selectedSite.paymentGateways.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">💳 Payment Methods</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedSite.paymentGateways.map((gateway, index) => (
                              <span
                                key={index}
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  gateway.enabled
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                              >
                                {gateway.enabled ? '✓' : '○'} {gateway.title}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* NEW: Plugin List */}
                  {selectedSite.pluginList && selectedSite.pluginList.length > 0 && (
                    <div className="col-span-2 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        Installed Plugins ({selectedSite.pluginList.length})
                      </h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedSite.pluginList.map((plugin: any, index: number) => (
                          <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-900 dark:text-white">{plugin.name}</p>
                                {plugin.active && (
                                  <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                                    Active
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 dark:text-gray-400">Version: {plugin.version}</p>
                              {plugin.author && (
                                <p className="text-xs text-gray-500 dark:text-gray-500">By: {plugin.author}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Users List */}
                  {selectedSite.users && selectedSite.users.length > 0 && (
                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">WordPress Users ({selectedSite.users.length})</h3>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {selectedSite.users.map((user) => (
                          <div key={user.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-semibold text-gray-900 dark:text-white">{user.display_name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">@{user.username}</p>
                                <p className="text-sm text-blue-600 dark:text-blue-400">{user.email}</p>
                              </div>
                              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded text-xs font-medium">
                                {user.role}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                              Registered: {new Date(user.registered).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* AI Optimizer Management */}
                  {selectedSite.hasWooCommerce && (
                    <div className="col-span-2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Product Optimizer
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                          <p className="text-xs text-gray-600 dark:text-gray-400">Status</p>
                          <p className={`text-lg font-bold ${selectedSite.aiOptimizerEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {selectedSite.aiOptimizerEnabled ? '✓ Enabled' : '○ Disabled'}
                          </p>
                        </div>
                        {selectedSite.aiOptimizationsCount !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Optimizations</p>
                            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{selectedSite.aiOptimizationsCount}</p>
                          </div>
                        )}
                        {selectedSite.aiTokensUsed !== undefined && (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400">Tokens Used</p>
                            <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{selectedSite.aiTokensUsed.toLocaleString()}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`${selectedSite.siteUrl}/wp-admin/admin.php?page=tsvweb-product-optimizer`, '_blank')}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                        >
                          Open Optimizer
                        </button>
                        <button
                          onClick={() => {
                            setOptimizerControlSite(selectedSite);
                            setSelectedSite(null);
                          }}
                          className="flex-1 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                        >
                          Control Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Payment Management */}
                  {(selectedSite.paymentStatus || selectedSite.customerId) && (
                    <div className="col-span-2 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Payment & Billing
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {selectedSite.paymentStatus && (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Payment Status</p>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                              selectedSite.paymentStatus === 'paid' 
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                                : selectedSite.paymentStatus === 'overdue'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                            }`}>
                              {selectedSite.paymentStatus.toUpperCase()}
                            </span>
                          </div>
                        )}
                        {selectedSite.paymentAmount && (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount</p>
                            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">£{selectedSite.paymentAmount}</p>
                          </div>
                        )}
                        {selectedSite.nextPaymentDate && (
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg col-span-2">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Next Payment</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedSite.nextPaymentDate}</p>
                          </div>
                        )}
                      </div>

                      {selectedSite.customerId && (
                        <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-4">
                          <p className="text-sm text-green-700 dark:text-green-400">
                            ✓ Linked to customer: <strong>{selectedSite.customerName || selectedSite.customerEmail}</strong>
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => window.open(`${selectedSite.siteUrl}/wp-admin/admin.php?page=tsvweb-control`, '_blank')}
                        className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                      >
                        View Payment Details
                      </button>
                    </div>
                  )}

                  {/* Quick Management Actions */}
                  <div className="col-span-2 bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Quick Actions
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          setManageSite(selectedSite);
                          setSelectedSite(null);
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">Full Manage</span>
                      </button>

                      <button
                        onClick={() => window.open(`${selectedSite.siteUrl}/wp-admin`, '_blank')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-400">WP Admin</span>
                      </button>

                      {selectedSite.hasWooCommerce && (
                        <button
                          onClick={() => window.open(`${selectedSite.siteUrl}/wp-admin/edit.php?post_type=product`, '_blank')}
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:shadow-md transition-all"
                        >
                          <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          <span className="text-sm font-medium text-purple-700 dark:text-purple-400">Products</span>
                        </button>
                      )}

                      <button
                        onClick={() => window.open(`${selectedSite.siteUrl}/wp-admin/plugins.php`, '_blank')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800 rounded-lg hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-orange-600 dark:text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <span className="text-sm font-medium text-orange-700 dark:text-orange-400">Plugins</span>
                      </button>

                      <button
                        onClick={() => window.open(`${selectedSite.siteUrl}/wp-admin/upload.php`, '_blank')}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border border-pink-200 dark:border-pink-800 rounded-lg hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-pink-600 dark:text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium text-pink-700 dark:text-pink-400">Media</span>
                      </button>

                      <button
                        onClick={async () => {
                          setSuccess('Syncing site data...');
                          try {
                            const response = await fetch('/api/admin/wordpress-sites/force-sync', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ siteId: selectedSite._id }),
                            });
                            if (response.ok) {
                              setSuccess('Site synced successfully!');
                              setTimeout(() => {
                                setSuccess('');
                                fetchSites();
                              }, 2000);
                            }
                          } catch (err) {
                            setError('Failed to sync site');
                            setTimeout(() => setError(''), 3000);
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800 rounded-lg hover:shadow-md transition-all"
                      >
                        <svg className="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm font-medium text-teal-700 dark:text-teal-400">Sync Now</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    <p>Last updated: {new Date(selectedSite.lastUpdated).toLocaleString()}</p>
                    <p>First connected: {new Date(selectedSite.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Management Modal */}
        {manageSite && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setManageSite(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Manage {manageSite.siteName}</h2>
                    <a href={manageSite.siteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                      {manageSite.siteUrl}
                    </a>
                  </div>
                  <button
                    onClick={() => setManageSite(null)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {success && (
                  <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={async () => {
                          setSuccess('Forcing sync...');
                          try {
                            const response = await fetch('/api/admin/wordpress-sites/force-sync', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ siteId: manageSite._id }),
                            });
                            if (response.ok) {
                              setSuccess('Sync requested successfully!');
                              setTimeout(() => {
                                setSuccess('');
                                fetchSites();
                              }, 2000);
                            }
                          } catch (err) {
                            setError('Failed to force sync');
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl hover:shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="font-semibold text-green-700 dark:text-green-400">Force Sync</span>
                      </button>

                      <button
                        onClick={() => window.open(`${manageSite.siteUrl}/wp-admin/update-core.php`, '_blank')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl hover:shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <span className="font-semibold text-yellow-700 dark:text-yellow-400">Check Updates</span>
                      </button>

                      <button
                        onClick={() => window.open(`${manageSite.siteUrl}/wp-admin`, '_blank')}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl hover:shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className="font-semibold text-blue-700 dark:text-blue-400">Open WP Admin</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm('Are you sure you want to remove this site from monitoring?')) {
                            try {
                              const response = await fetch(`/api/admin/wordpress-sites/${manageSite._id}`, {
                                method: 'DELETE',
                              });
                              if (response.ok) {
                                setSuccess('Site removed successfully!');
                                setTimeout(() => {
                                  setManageSite(null);
                                  fetchSites();
                                }, 1500);
                              }
                            } catch (err) {
                              setError('Failed to remove site');
                            }
                          }
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl hover:shadow-lg transition-all"
                      >
                        <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        <span className="font-semibold text-red-700 dark:text-red-400">Remove Site</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Optimizer Management */}
                  {manageSite.hasWooCommerce && (
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                      <div className="flex items-center mb-4">
                        <div className="p-3 bg-purple-500 rounded-lg mr-3">
                          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Product Optimizer</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Manage AI-powered product optimization</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                          <p className={`text-xl font-bold ${manageSite.aiOptimizerEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                            {manageSite.aiOptimizerEnabled ? '✓ Enabled' : '○ Disabled'}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Optimizations</p>
                          <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {manageSite.aiOptimizationsCount || 0}
                          </p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Tokens Used</p>
                          <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                            {(manageSite.aiTokensUsed || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {manageSite.aiTokensUsed && manageSite.aiTokensUsed > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-700 dark:text-gray-300">Estimated Cost:</span>
                            <span className="font-bold text-blue-600 dark:text-blue-400">
                              ${((manageSite.aiTokensUsed / 1000) * 0.0025).toFixed(4)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => window.open(`${manageSite.siteUrl}/wp-admin/admin.php?page=tsvweb-product-optimizer`, '_blank')}
                          className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                        >
                          Open Optimizer
                        </button>
                        <button
                          onClick={() => {
                            setOptimizerControlSite(manageSite);
                            setManageSite(null);
                          }}
                          className="px-4 py-3 bg-white dark:bg-gray-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 font-medium rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Create Administrator Section */}
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-green-500 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Create Administrator</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Add a new admin user to WordPress</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="Email address"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        placeholder="Username"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Password (min 8 characters)"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        setError('');
                        setSuccess('');
                        
                        if (!newAdminEmail || !newAdminUsername || !newAdminPassword) {
                          setError('All fields are required');
                          return;
                        }
                        if (newAdminPassword.length < 8) {
                          setError('Password must be at least 8 characters');
                          return;
                        }
                        try {
                          const response = await fetch('/api/admin/wordpress-sites/create-admin', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              siteId: manageSite._id,
                              siteUrl: manageSite.siteUrl,
                              email: newAdminEmail,
                              username: newAdminUsername,
                              password: newAdminPassword,
                            }),
                          });
                          if (response.ok) {
                            setSuccess('Administrator created successfully!');
                            setNewAdminEmail('');
                            setNewAdminUsername('');
                            setNewAdminPassword('');
                            setTimeout(() => setSuccess(''), 3000);
                          } else {
                            setError('Failed to create administrator');
                          }
                        } catch (err) {
                          setError('Error creating administrator');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all mt-3"
                    >
                      Create Administrator
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* API Key Generation Modal */}
        {showApiKeyModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => !generatedApiKey && setShowApiKeyModal(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Generate API Key</h2>
                    <p className="text-gray-600 dark:text-gray-400">Create a secure API key for WordPress plugin</p>
                  </div>
                  {!generatedApiKey && (
                    <button
                      onClick={() => setShowApiKeyModal(false)}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {!generatedApiKey ? (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site URL
                      </label>
                      <input
                        type="url"
                        value={apiKeySite?.url || ''}
                        onChange={(e) => setApiKeySite({ ...apiKeySite!, url: e.target.value })}
                        placeholder="https://example.com"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Site Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={apiKeySite?.name || ''}
                        onChange={(e) => setApiKeySite({ ...apiKeySite!, name: e.target.value })}
                        placeholder="My WordPress Site"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={async () => {
                        if (!apiKeySite?.url) {
                          setError('Site URL is required');
                          return;
                        }
                        try {
                          const response = await fetch('/api/admin/wordpress-sites/generate-api-key', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              siteUrl: apiKeySite.url,
                              siteName: apiKeySite.name || apiKeySite.url,
                            }),
                          });
                          const data = await response.json();
                          if (response.ok) {
                            setGeneratedApiKey(data.apiKey);
                          } else {
                            setError(data.error || 'Failed to generate API key');
                          }
                        } catch (err) {
                          setError('Error generating API key');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                    >
                      Generate API Key
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
                      <div className="flex">
                        <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          <strong>Important:</strong> Save this API key now. You won't be able to see it again!
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg mb-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Your API Key
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={generatedApiKey}
                          readOnly
                          className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 dark:text-white font-mono text-sm"
                        />
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(generatedApiKey);
                            setSuccess('API key copied to clipboard!');
                            setTimeout(() => setSuccess(''), 2000);
                          }}
                          className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Next Steps:</h3>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700 dark:text-gray-300">
                        <li>Copy the API key above</li>
                        <li>Install TsvWeb Monitor plugin on your WordPress site</li>
                        <li>Go to Settings → TsvWeb Monitor</li>
                        <li>Paste the API key and save</li>
                        <li>Click "Send Stats Now" to test</li>
                      </ol>
                    </div>

                    <button
                      onClick={() => {
                        setShowApiKeyModal(false);
                        setGeneratedApiKey('');
                        setApiKeySite(null);
                      }}
                      className="w-full px-6 py-3 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 transition-all"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {/* Bind Customer Modal */}
      {bindCustomerSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setBindCustomerSite(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bind to Customer</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Assign {bindCustomerSite.siteName} to a customer
                </p>
              </div>
              <button
                onClick={() => setBindCustomerSite(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Customer
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select a customer --</option>
                  {customers.map((customer) => (
                    <option key={customer._id} value={customer._id}>
                      {customer.name || customer.username} ({customer.email})
                    </option>
                  ))}
                </select>
              </div>

              {bindCustomerSite.customerName && (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>Currently assigned to:</strong> {bindCustomerSite.customerName}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setBindCustomerSite(null);
                    setSelectedCustomerId('');
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBindCustomer}
                  disabled={!selectedCustomerId}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Bind Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Optimizer Control Modal */}
      {optimizerControlSite && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={() => setOptimizerControlSite(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">AI Optimizer Control</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Manage AI product optimizer for {optimizerControlSite.siteName}
                  </p>
                </div>
                <button
                  onClick={() => setOptimizerControlSite(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {success && (
                <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
                  {success}
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                {/* Current Status */}
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Current Status</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Status</p>
                      <p className={`text-2xl font-bold ${optimizerControlSite.aiOptimizerEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                        {optimizerControlSite.aiOptimizerEnabled ? '✓ Enabled' : '○ Disabled'}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Optimizations</p>
                      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {optimizerControlSite.aiOptimizationsCount || 0}
                      </p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Tokens Used</p>
                      <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {(optimizerControlSite.aiTokensUsed || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cost Breakdown */}
                {optimizerControlSite.aiTokensUsed && optimizerControlSite.aiTokensUsed > 0 && (
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Usage & Cost</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Total Tokens:</span>
                        <span className="font-bold text-gray-900 dark:text-white">{optimizerControlSite.aiTokensUsed.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Estimated Cost (GPT-4o):</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          ${((optimizerControlSite.aiTokensUsed / 1000) * 0.0025).toFixed(4)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300">Avg. per Optimization:</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {optimizerControlSite.aiOptimizationsCount 
                            ? Math.round(optimizerControlSite.aiTokensUsed / optimizerControlSite.aiOptimizationsCount).toLocaleString()
                            : 0} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/50 dark:to-slate-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => window.open(`${optimizerControlSite.siteUrl}/wp-admin/admin.php?page=tsvweb-product-optimizer`, '_blank')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open Optimizer
                    </button>
                    <button
                      onClick={() => window.open(`${optimizerControlSite.siteUrl}/wp-admin/edit.php?post_type=product`, '_blank')}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      View Products
                    </button>
                  </div>
                </div>

                {/* Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-semibold mb-1">About AI Optimizer</p>
                      <p>The AI Product Optimizer uses OpenAI's GPT-4o to automatically enhance product titles, descriptions, and SEO metadata. Enable/disable controls are managed directly in the WordPress admin panel.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setOptimizerControlSite(null)}
                    className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      window.open(`${optimizerControlSite.siteUrl}/wp-admin/admin.php?page=tsvweb-product-optimizer`, '_blank');
                      setOptimizerControlSite(null);
                    }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all"
                  >
                    Manage in WordPress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default withAdminAuth(WordPressSitesPage);
