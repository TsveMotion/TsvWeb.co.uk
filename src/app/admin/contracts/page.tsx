'use client';

import React, { useState, useEffect } from 'react';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface Contract {
  _id?: string;
  title: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  amount: number;
  currency: string;
  contractType: string;
  status: string;
  createdAt?: string;
}

export default function ContractsAdmin() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    userId: '',
    clientName: '',
    clientEmail: '',
    amount: 0,
    currency: 'USD',
    contractType: 'web-development'
  });

  // Load data
  useEffect(() => {
    loadContracts();
    loadUsers();
  }, []);

  const loadContracts = async () => {
    try {
      const response = await fetch('/api/admin/contracts');
      if (response.ok) {
        const data = await response.json();
        setContracts(data.contracts || []);
      }
    } catch (error) {
      console.error('Error loading contracts:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        console.log('Users loaded:', data.users); // DEBUG
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const openModal = () => {
    setFormData({
      title: '',
      userId: '',
      clientName: '',
      clientEmail: '',
      amount: 0,
      currency: 'USD',
      contractType: 'web-development'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // DEBUG: Log what we're sending
    console.log('Form data being sent:', formData);
    console.log('userId specifically:', formData.userId);
    
    try {
      const response = await fetch('/api/admin/contracts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        loadContracts();
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || 'Failed to create contract'));
      }
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Error creating contract');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Contracts & Legal</h1>
        <button
          onClick={openModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Contract
        </button>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contract
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contracts.map((contract) => (
              <tr key={contract._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{contract.title}</div>
                  <div className="text-sm text-gray-500">{contract.contractType}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{contract.clientName}</div>
                  <div className="text-sm text-gray-500">{contract.clientEmail}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${contract.amount} {contract.currency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {contract.status || 'Draft'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {contracts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500">No contracts found.</div>
            <button
              onClick={openModal}
              className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Create your first contract
            </button>
          </div>
        )}
      </div>

      {/* SUPER SIMPLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Contract</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Select Client */}
              <div>
                <label className="block text-sm font-medium mb-2">Select Client *</label>
                <select
                  required
                  value={formData.userId}
                  onChange={(e) => {
                    console.log('Dropdown changed to:', e.target.value); // DEBUG
                    const selectedUser = users.find(user => user._id === e.target.value);
                    console.log('Selected user found:', selectedUser); // DEBUG
                    if (selectedUser) {
                      setFormData({
                        ...formData,
                        userId: e.target.value,
                        clientName: selectedUser.name,
                        clientEmail: selectedUser.email,
                        title: `${selectedUser.name} - Service Agreement`
                      });
                    } else {
                      console.log('No user found for ID:', e.target.value); // DEBUG
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">
                    {users.length === 0 ? 'Loading clients...' : 'Choose a client...'}
                  </option>
                  {users.length > 0 ? (
                    users.map(user => (
                      <option key={user._id || user.email} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))
                  ) : (
                    <option disabled>No clients found</option>
                  )}
                </select>
              </div>

              {/* 2. Title (auto-filled, editable) */}
              {formData.userId && (
                <div>
                  <label className="block text-sm font-medium mb-2">Contract Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              {/* 3. Amount */}
              {formData.userId && (
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (USD) *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="1000.00"
                  />
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!formData.userId || !formData.title || !formData.amount}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create Contract
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
