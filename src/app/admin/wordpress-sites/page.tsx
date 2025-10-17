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
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
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

                  <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setManageSite(site);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Manage Site
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSite(site);
                      }}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Details
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
                  {/* Request Update Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-blue-500 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Request Update</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Send update request to WordPress site</p>
                      </div>
                    </div>
                    <textarea
                      value={updateRequest}
                      onChange={(e) => setUpdateRequest(e.target.value)}
                      placeholder="e.g., Please update WordPress to latest version, update all plugins, check for security issues..."
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white mb-3"
                      rows={4}
                    />
                    <button
                      onClick={async () => {
                        if (!updateRequest.trim()) {
                          setError('Please enter an update request');
                          return;
                        }
                        try {
                          const response = await fetch('/api/admin/wordpress-sites/request-update', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              siteId: manageSite._id,
                              siteUrl: manageSite.siteUrl,
                              request: updateRequest,
                            }),
                          });
                          if (response.ok) {
                            setSuccess('Update request sent successfully!');
                            setUpdateRequest('');
                            setTimeout(() => setSuccess(''), 3000);
                          } else {
                            setError('Failed to send update request');
                          }
                        } catch (err) {
                          setError('Error sending update request');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
                    >
                      Send Update Request
                    </button>
                  </div>

                  {/* Change Admin Password Section */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center mb-4">
                      <div className="p-3 bg-purple-500 rounded-lg mr-3">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Change Admin Password</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Update WordPress admin password remotely</p>
                      </div>
                    </div>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new admin password"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white mb-3"
                    />
                    <button
                      onClick={async () => {
                        if (!newPassword || newPassword.length < 8) {
                          setError('Password must be at least 8 characters');
                          return;
                        }
                        try {
                          const response = await fetch('/api/admin/wordpress-sites/change-password', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              siteId: manageSite._id,
                              siteUrl: manageSite.siteUrl,
                              newPassword: newPassword,
                            }),
                          });
                          if (response.ok) {
                            setSuccess('Password change request sent successfully!');
                            setNewPassword('');
                            setTimeout(() => setSuccess(''), 3000);
                          } else {
                            setError('Failed to send password change request');
                          }
                        } catch (err) {
                          setError('Error sending password change request');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                      Change Password
                    </button>
                  </div>

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
                        <p className="text-sm text-gray-600 dark:text-gray-400">Create a new admin user remotely</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <input
                        type="email"
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="Admin email address"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="text"
                        value={newAdminUsername}
                        onChange={(e) => setNewAdminUsername(e.target.value)}
                        placeholder="Admin username"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                      <input
                        type="password"
                        value={newAdminPassword}
                        onChange={(e) => setNewAdminPassword(e.target.value)}
                        placeholder="Admin password (min 8 characters)"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>
                    <button
                      onClick={async () => {
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

                  {/* Quick Actions */}
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/admin/wordpress-sites/trigger-sync', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ siteId: manageSite._id, siteUrl: manageSite.siteUrl }),
                            });
                            if (response.ok) {
                              setSuccess('Sync request sent!');
                              setTimeout(() => {
                                setSuccess('');
                                fetchSites();
                              }, 2000);
                            }
                          } catch (err) {
                            setError('Failed to trigger sync');
                          }
                        }}
                        className="px-4 py-3 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors font-medium"
                      >
                        🔄 Force Sync
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const response = await fetch('/api/admin/wordpress-sites/check-updates', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ siteId: manageSite._id, siteUrl: manageSite.siteUrl }),
                            });
                            if (response.ok) {
                              setSuccess('Update check requested!');
                              setTimeout(() => setSuccess(''), 2000);
                            }
                          } catch (err) {
                            setError('Failed to check updates');
                          }
                        }}
                        className="px-4 py-3 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/50 transition-colors font-medium"
                      >
                        ⚡ Check Updates
                      </button>
                      <button
                        onClick={() => {
                          window.open(`${manageSite.siteUrl}/wp-admin`, '_blank');
                        }}
                        className="px-4 py-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors font-medium"
                      >
                        🔗 Open WP Admin
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
                        className="px-4 py-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors font-medium"
                      >
                        🗑️ Remove Site
                      </button>
                    </div>
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
      </div>
    </div>
  );
}

export default withAdminAuth(WordPressSitesPage);
