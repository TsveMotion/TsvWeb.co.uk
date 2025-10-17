'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import Link from 'next/link';
import {
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  UserIcon,
  ClockIcon,
  GlobeAltIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface PageVisit {
  path: string;
  title: string;
  timeSpent: number;
  timestamp: string;
}

interface ChatHistory {
  _id: string;
  ipAddress: string;
  userAgent: string;
  messages: ChatMessage[];
  pagesVisited: PageVisit[];
  firstVisit: string;
  lastVisit: string;
}

export default function ChatHistoryPage() {
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedChat, setSelectedChat] = useState<ChatHistory | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalChats, setTotalChats] = useState(0);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeTab, setActiveTab] = useState<'messages' | 'pages'>('messages');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentPage = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1;
    const searchQuery = searchParams.get('search') || '';
    
    setPage(currentPage);
    setSearch(searchQuery);
    setSearchInput(searchQuery);
    
    fetchChatHistories(currentPage, searchQuery);
  }, [searchParams]);

  const fetchChatHistories = async (pageNum: number, searchQuery: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/chat-history?page=${pageNum}&limit=10${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ''}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat histories');
      }
      
      const data = await response.json();
      setChatHistories(data.data);
      setTotalPages(data.pagination.pages);
      setTotalChats(data.pagination.totalItems || 0);
    } catch (err) {
      setError('Failed to load chat histories');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChatDetails = async (id: string) => {
    try {
      const response = await fetch('/api/admin/chat-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch chat details');
      }
      
      const data = await response.json();
      setSelectedChat(data.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load chat details');
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set('page', '1');
    if (searchInput) {
      params.set('search', searchInput);
    }
    router.push(`/admin/chat-history?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/chat-history?${params.toString()}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds} seconds`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`;
  };

  // Calculate stats
  const totalMessages = selectedChat?.messages.length || 0;
  const totalPagesVisited = selectedChat?.pagesVisited.length || 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <ChatBubbleLeftRightIcon className="h-10 w-10" />
                  <h1 className="text-3xl font-bold">Chat History</h1>
                </div>
                <p className="text-cyan-100 text-lg">
                  View and analyze customer AI chatbot conversations
                </p>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold">{totalChats}</div>
                <div className="text-cyan-100">Total Conversations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {selectedChat && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Messages</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalMessages}</p>
                </div>
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-cyan-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pages Visited</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{totalPagesVisited}</p>
                </div>
                <DocumentTextIcon className="h-12 w-12 text-blue-500" />
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">IP Address</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white mt-2">{selectedChat.ipAddress}</p>
                </div>
                <GlobeAltIcon className="h-12 w-12 text-purple-500" />
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by IP address or message content..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Search
            </button>
          </form>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-cyan-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading chat histories...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat History List */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-4">
                  <h2 className="font-semibold text-white flex items-center">
                    <UserIcon className="h-5 w-5 mr-2" />
                    Customer Sessions
                  </h2>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                  {chatHistories.length === 0 ? (
                    <div className="p-8 text-center">
                      <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-500 dark:text-gray-400">No chat histories found</p>
                    </div>
                  ) : (
                    chatHistories.map((chat: ChatHistory) => (
                      <div 
                        key={chat._id} 
                        className={`p-4 cursor-pointer transition-all ${
                          selectedChat?._id === chat._id 
                            ? 'bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30 border-l-4 border-cyan-500' 
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => fetchChatDetails(chat._id)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <GlobeAltIcon className="h-5 w-5 text-cyan-500" />
                            <span className="font-medium text-gray-900 dark:text-white">{chat.ipAddress}</span>
                          </div>
                          <span className="text-xs bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 px-2 py-1 rounded-full">
                            {chat.messages.length} msgs
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-2">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatDate(chat.lastVisit)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Page <span className="font-semibold text-gray-900 dark:text-white">{page}</span> of <span className="font-semibold text-gray-900 dark:text-white">{totalPages}</span>
                      </span>
                      <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Chat Details */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
                {selectedChat ? (
                  <div>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-6 text-white">
                      <h2 className="font-bold text-xl mb-4">Chat Details</h2>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-cyan-100 mb-1">IP Address</p>
                          <p className="font-semibold">{selectedChat.ipAddress}</p>
                        </div>
                        <div>
                          <p className="text-cyan-100 mb-1">First Visit</p>
                          <p className="font-semibold">{formatDate(selectedChat.firstVisit)}</p>
                        </div>
                        <div>
                          <p className="text-cyan-100 mb-1">Last Visit</p>
                          <p className="font-semibold">{formatDate(selectedChat.lastVisit)}</p>
                        </div>
                        <div>
                          <p className="text-cyan-100 mb-1">User Agent</p>
                          <p className="font-semibold text-xs truncate">{selectedChat.userAgent}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tabs */}
                    <div className="border-b border-gray-200 dark:border-gray-700">
                      <div className="flex">
                        <button
                          onClick={() => setActiveTab('messages')}
                          className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                            activeTab === 'messages'
                              ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <ChatBubbleLeftRightIcon className="h-5 w-5 inline-block mr-2" />
                          Chat Messages ({selectedChat.messages.length})
                        </button>
                        <button
                          onClick={() => setActiveTab('pages')}
                          className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                            activeTab === 'pages'
                              ? 'text-cyan-600 dark:text-cyan-400 border-b-2 border-cyan-600 dark:border-cyan-400 bg-cyan-50 dark:bg-cyan-900/20'
                              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <DocumentTextIcon className="h-5 w-5 inline-block mr-2" />
                          Page Visits ({selectedChat.pagesVisited.length})
                        </button>
                      </div>
                    </div>
                    
                    {/* Messages Tab */}
                    {activeTab === 'messages' && (
                      <div className="p-6 max-h-[600px] overflow-y-auto">
                        <div className="space-y-4">
                          {selectedChat.messages.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                              <ChatBubbleLeftRightIcon className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                              <p>No messages found</p>
                            </div>
                          ) : (
                            selectedChat.messages.map((message: ChatMessage, index: number) => (
                              <div 
                                key={index} 
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                              >
                                <div 
                                  className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                                    message.role === 'user' 
                                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white' 
                                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                                  }`}
                                >
                                  <div className={`text-xs font-semibold mb-2 ${
                                    message.role === 'user' ? 'text-cyan-100' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {message.role === 'user' ? '👤 Customer' : '🤖 TSV AI'}
                                  </div>
                                  <div className="text-sm leading-relaxed">{message.content}</div>
                                  <div className={`text-xs mt-2 ${
                                    message.role === 'user' ? 'text-cyan-100' : 'text-gray-500 dark:text-gray-400'
                                  }`}>
                                    {formatDate(message.timestamp)}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Pages Tab */}
                    {activeTab === 'pages' && (
                      <div className="p-6">
                        <div className="overflow-x-auto">
                          {selectedChat.pagesVisited.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                              <DocumentTextIcon className="h-16 w-16 mb-4 text-gray-300 dark:text-gray-600" />
                              <p>No page visits recorded</p>
                            </div>
                          ) : (
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                              <thead className="bg-gray-50 dark:bg-gray-750">
                                <tr>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Page</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Time Spent</th>
                                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Timestamp</th>
                                </tr>
                              </thead>
                              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {selectedChat.pagesVisited.map((visit: PageVisit, index: number) => (
                                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                    <td className="px-6 py-4">
                                      <div className="font-medium text-gray-900 dark:text-white">{visit.title}</div>
                                      <div className="text-sm text-gray-500 dark:text-gray-400">{visit.path}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                                      {formatDuration(visit.timeSpent)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                      {formatDate(visit.timestamp)}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-gray-500 dark:text-gray-400">
                    <ChatBubbleLeftRightIcon className="h-24 w-24 mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-lg font-medium">Select a chat session to view details</p>
                    <p className="text-sm">Choose from the list on the left</p>
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
