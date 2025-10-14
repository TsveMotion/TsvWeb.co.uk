'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminLayout from '@/components/admin/admin-layout';
import Link from 'next/link';

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
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
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

  return (
      <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Customer Chat History</h1>
        
        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6 flex">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by IP or message content..."
            className="border border-gray-300 dark:border-gray-600 rounded-l px-4 py-2 w-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          >
            Search
          </button>
        </form>
        
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 dark:text-red-400 text-center my-8">{error}</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat History List */}
            <div className="lg:col-span-1 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="bg-gray-100 p-4 border-b">
                <h2 className="font-semibold text-gray-900 dark:text-white">Customer Sessions</h2>
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {chatHistories.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">No chat histories found</div>
                ) : (
                  chatHistories.map((chat) => (
                    <div 
                      key={chat._id} 
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat?._id === chat._id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      onClick={() => fetchChatDetails(chat._id)}
                    >
                      <div className="font-medium text-gray-900 dark:text-white">IP: {chat.ipAddress}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Last visit: {formatDate(chat.lastVisit)}
                      </div>
                      <div className="text-sm text-gray-500">
                        Messages: {chat.messages.length}
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center p-4 border-t">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1">
                      Page {page} of {totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className="px-3 py-1 border rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chat Details */}
            <div className="lg:col-span-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              {selectedChat ? (
                <div>
                  {/* Header */}
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Chat Details</h2>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      IP: {selectedChat.ipAddress}
                    </div>
                    <div className="text-sm text-gray-600">
                      First visit: {formatDate(selectedChat.firstVisit)}
                    </div>
                    <div className="text-sm text-gray-600">
                      Last visit: {formatDate(selectedChat.lastVisit)}
                    </div>
                    <div className="text-sm text-gray-600">
                      User Agent: {selectedChat.userAgent}
                    </div>
                  </div>
                  
                  {/* Tabs */}
                  <div className="border-b">
                    <ul className="flex">
                      <li className="mr-1">
                        <a href="#messages" className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold border-l border-t border-r rounded-t">
                          Chat Messages
                        </a>
                      </li>
                      <li className="mr-1">
                        <a href="#pages" className="bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold">
                          Page Visits
                        </a>
                      </li>
                    </ul>
                  </div>
                  
                  {/* Messages Tab */}
                  <div id="messages" className="p-4 max-h-[500px] overflow-y-auto bg-white dark:bg-gray-800">
                    <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">Chat Messages</h3>
                    <div className="space-y-4">
                      {selectedChat.messages.length === 0 ? (
                        <div className="flex justify-center items-center h-64 text-gray-500 dark:text-gray-400">No messages found</div>
                      ) : (
                        selectedChat.messages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`p-3 rounded-lg max-w-[80%] ${
                              message.role === 'user' 
                                ? 'bg-blue-100 dark:bg-blue-900/30 ml-auto' 
                                : 'bg-gray-100 dark:bg-gray-700'
                            }`}
                          >
                            <div className="text-sm font-medium mb-1 text-gray-900 dark:text-white">
                              {message.role === 'user' ? 'Customer' : 'TSV AI'}
                            </div>
                            <div className="text-gray-800 dark:text-gray-200">{message.content}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {formatDate(message.timestamp)}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Pages Tab */}
                  <div id="pages" className="hidden p-4">
                    <h3 className="font-semibold mb-4">Page Visits</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                          <tr>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Spent</th>
                            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedChat.pagesVisited.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">No page visits recorded</td>
                            </tr>
                          ) : (
                            selectedChat.pagesVisited.map((visit, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium">{visit.title}</div>
                                  <div className="text-sm text-gray-500">{visit.path}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {formatDuration(visit.timeSpent)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {formatDate(visit.timestamp)}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  Select a chat session to view details
                </div>
              )}
            </div>
          </div>
        )}
      </div>
  );
}
