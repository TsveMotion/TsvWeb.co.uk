"use client";

import { useState, useEffect } from 'react';
import { Mail, Search, RefreshCw, Send, Trash2, X, CheckCircle, Archive, AlertTriangle, Eye } from 'lucide-react';
import { getUrgencyColor } from '@/lib/urgency-detector';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
  createdAt: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  urgency?: 'critical' | 'high' | 'normal';
}

export default function AdminInquiriesNew() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchInquiries = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/inquiries');
      const data = await response.json();
      
      if (response.ok && data.success && data.data) {
        setInquiries(data.data);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this inquiry?')) return;

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInquiries(inquiries.filter(inq => inq._id !== id));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry(null);
        }
      }
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'new' | 'read' | 'replied' | 'archived') => {
    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setInquiries(inquiries.map(inq => 
          inq._id === id ? { ...inq, status: newStatus } : inq
        ));
        if (selectedInquiry?._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSendReply = async () => {
    if (!selectedInquiry || !replyMessage.trim()) return;

    setIsSendingReply(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${selectedInquiry._id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: replyMessage,
          subject: `Re: ${selectedInquiry.subject || 'Your Inquiry'}`
        }),
      });

      if (response.ok) {
        await handleStatusChange(selectedInquiry._id, 'replied');
        setIsReplyModalOpen(false);
        setReplyMessage('');
        alert('Reply sent successfully!');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inquiry.subject?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      inquiry.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || inquiry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-green-100 text-green-800';
      case 'read': return 'bg-blue-100 text-blue-800';
      case 'replied': return 'bg-purple-100 text-purple-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    replied: inquiries.filter(i => i.status === 'replied').length,
    archived: inquiries.filter(i => i.status === 'archived').length,
    urgent: inquiries.filter(i => i.urgency === 'critical' || i.urgency === 'high').length
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-10 h-10" />
                  <h1 className="text-3xl font-bold">Contact Inquiries</h1>
                </div>
                <p className="text-purple-100 text-lg">
                  Manage and respond to customer inquiries
                </p>
              </div>
              <button
                onClick={fetchInquiries}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all disabled:opacity-50 border border-white/30"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{stats.total}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">New</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">{stats.new}</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-blue-400 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Read</p>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">{stats.read}</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Eye className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Replied</p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">{stats.replied}</p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Send className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-gray-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Archived</p>
                <p className="text-3xl font-bold text-gray-600 dark:text-gray-400 mt-2">{stats.archived}</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-900/30 rounded-lg">
                <Archive className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">Urgent</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400 mt-2">{stats.urgent}</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, subject, or message..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>


        {/* Inquiries Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* List */}
          <div className="lg:col-span-1 space-y-3">
            {isLoading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md">
                <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-500" />
                <p className="text-gray-600 dark:text-gray-400 font-medium">Loading inquiries...</p>
              </div>
            ) : filteredInquiries.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center shadow-md">
                <Mail className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No inquiries found</p>
                <p className="text-gray-600 dark:text-gray-400">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredInquiries.map((inquiry) => (
                <div
                  key={inquiry._id}
                  onClick={() => setSelectedInquiry(inquiry)}
                  className={`rounded-xl p-5 cursor-pointer hover:shadow-xl transition-all duration-300 border-2 transform hover:-translate-y-1 ${
                    inquiry.urgency === 'critical' ? 'bg-red-50 dark:bg-red-900/20 border-red-500' :
                    inquiry.urgency === 'high' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500' :
                    'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                  } ${
                    selectedInquiry?._id === inquiry._id ? 'border-purple-500 shadow-lg ring-2 ring-purple-200 dark:ring-purple-800' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{inquiry.name}</h3>
                        {inquiry.urgency && inquiry.urgency !== 'normal' && (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${getUrgencyColor(inquiry.urgency).badge}`}>
                            <AlertTriangle className="w-3 h-3" />
                            {inquiry.urgency === 'critical' ? 'URGENT' : 'HIGH'}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{inquiry.email}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(inquiry.status)}`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-1">{inquiry.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{inquiry.message}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                    {new Date(inquiry.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            {selectedInquiry ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {selectedInquiry.subject || 'No Subject'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        From: <strong>{selectedInquiry.name}</strong> ({selectedInquiry.email})
                      </p>
                      {selectedInquiry.phone && (
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-gray-600 dark:text-gray-400">Phone: {selectedInquiry.phone}</p>
                          <a
                            href={`tel:${selectedInquiry.phone}`}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            Quick Call
                          </a>
                        </div>
                      )}
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInquiry.status)}`}>
                      {selectedInquiry.status}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Message:</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200 flex flex-wrap gap-3">
                  <button
                    onClick={() => {
                      setIsReplyModalOpen(true);
                      handleStatusChange(selectedInquiry._id, 'read');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    <Send className="w-4 h-4" />
                    Reply
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, 'read')}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                    Mark as Read
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange(selectedInquiry._id, 'archived')}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  
                  <button
                    onClick={() => handleDelete(selectedInquiry._id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl h-full flex items-center justify-center p-12 border border-purple-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="p-6 bg-white dark:bg-gray-800 rounded-full inline-block mb-4 shadow-lg">
                    <Mail className="w-20 h-20 text-purple-500" />
                  </div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white mb-2">Select an Inquiry</p>
                  <p className="text-gray-600 dark:text-gray-400">Click on an inquiry from the list to view details and respond</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reply Modal */}
        {isReplyModalOpen && selectedInquiry && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Reply to {selectedInquiry.name}</h3>
                <button
                  onClick={() => setIsReplyModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    To: {selectedInquiry.email}
                  </label>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Reply:
                  </label>
                  <textarea
                    value={replyMessage}
                    onChange={(e) => setReplyMessage(e.target.value)}
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Type your reply here..."
                  />
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyMessage.trim()}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSendingReply ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Reply
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setIsReplyModalOpen(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
