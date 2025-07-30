'use client';

import React, { useState, useEffect } from 'react';

interface User {
  id: string;
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
  files?: {
    filename: string;
    originalName: string;
    path: string;
    size: number;
    mimeType: string;
    uploadedAt: Date;
    uploadedBy: string;
  }[];
}

export default function ContractsAdmin() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    userId: '',
    clientName: '',
    clientEmail: '',
    amount: 0,
    currency: 'USD',
    contractType: 'web_development'
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
        console.log('First user structure:', data.users[0]); // DEBUG STRUCTURE
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
      contractType: 'web_development'
    });
    setIsEditMode(false);
    setEditingContract(null);
    setIsModalOpen(true);
  };

  const editContract = (contract: Contract) => {
    setFormData({
      title: contract.title,
      userId: contract.userId,
      clientName: contract.clientName,
      clientEmail: contract.clientEmail,
      amount: contract.amount,
      currency: contract.currency,
      contractType: contract.contractType
    });
    setIsEditMode(true);
    setEditingContract(contract);
    setIsModalOpen(true);
  };

  const manageFiles = (contract: Contract) => {
    setSelectedContract(contract);
    setIsFileModalOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedContract) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`/api/admin/contracts/${selectedContract._id}/upload`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Refresh the contract data to show the new file
        loadContracts();
        alert('File uploaded successfully!');
      } else {
        alert('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploadingFile(false);
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const generatePDFContract = async (contract: Contract) => {
    if (!contract) return;

    try {
      const response = await fetch(`/api/admin/contracts/${contract._id}/generate-pdf`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh the contract data to show the new file
        loadContracts();
        alert('PDF contract generated successfully!');
      } else {
        alert('Error generating PDF contract');
      }
    } catch (error) {
      console.error('Error generating PDF contract:', error);
      alert('Error generating PDF contract');
    }
  };

  const sendForSignature = async (contract: Contract) => {
    if (!contract) return;

    try {
      const response = await fetch(`/api/admin/contracts/${contract._id}/send-signature`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh the contract data to show updated status
        loadContracts();
        alert(`Contract sent for signature successfully!\nSignature URL: ${data.signatureUrl}`);
      } else {
        alert('Error sending contract for signature');
      }
    } catch (error) {
      console.error('Error sending contract for signature:', error);
      alert('Error sending contract for signature');
    }
  };

  const deleteContract = async (contractId: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/contracts/${contractId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadContracts();
      } else {
        alert('Error deleting contract');
      }
    } catch (error) {
      console.error('Error deleting contract:', error);
      alert('Error deleting contract');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // DEBUG: Log what we're sending
    console.log('Form data being sent:', formData);
    console.log('userId specifically:', formData.userId);
    console.log('Edit mode:', isEditMode);
    
    try {
      const url = isEditMode ? `/api/admin/contracts/${editingContract?._id}` : '/api/admin/contracts';
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingContract(null);
        loadContracts();
      } else {
        const errorData = await response.json();
        alert('Error: ' + (errorData.error || `Failed to ${isEditMode ? 'update' : 'create'} contract`));
      }
    } catch (error) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} contract:`, error);
      alert(`Error ${isEditMode ? 'updating' : 'creating'} contract`);
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
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
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => editContract(contract)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => manageFiles(contract)}
                    className="text-green-600 hover:text-green-900"
                  >
                    Files
                  </button>
                  <button
                    onClick={() => deleteContract(contract._id!)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
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
              <h2 className="text-xl font-bold">{isEditMode ? 'Edit Contract' : 'Create New Contract'}</h2>
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
                    const selectedUser = users.find(user => user.id === e.target.value);
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
                    users.map(user => {
                      console.log('Rendering option for user:', user); // DEBUG OPTION RENDERING
                      return (
                        <option key={user.id || user.email} value={user.id}>
                          {user.name} ({user.email})
                        </option>
                      );
                    })
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

              {/* 3. Contract Type */}
              {formData.userId && (
                <div>
                  <label className="block text-sm font-medium mb-2">Contract Type *</label>
                  <select
                    required
                    value={formData.contractType}
                    onChange={(e) => setFormData({ ...formData, contractType: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="web_development">Web Development</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="hosting">Hosting</option>
                    <option value="consultation">Consultation</option>
                    <option value="design">Design</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
              )}

              {/* 4. Amount */}
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
                  {isEditMode ? 'Update Contract' : 'Create Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILE MANAGEMENT MODAL */}
      {isFileModalOpen && selectedContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Manage Files - {selectedContract.title}</h2>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Upload New File</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                />
                <label
                  htmlFor="file-upload"
                  className={`cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                    uploadingFile ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {uploadingFile ? 'Uploading...' : 'Choose File'}
                </label>
                <p className="mt-2 text-sm text-gray-500">
                  Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
                </p>
              </div>
            </div>

            {/* Existing Files Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Existing Files</h3>
              {selectedContract.files && selectedContract.files.length > 0 ? (
                <div className="space-y-2">
                  {selectedContract.files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600">
                          📄
                        </div>
                        <div>
                          <div className="font-medium">{file.originalName}</div>
                          <div className="text-sm text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/api/admin/contracts/${selectedContract._id}/files/${file.filename}`, '_blank')}
                          className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this file?')) {
                              // TODO: Implement file deletion
                              alert('File deletion will be implemented next.');
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No files uploaded yet.
                </div>
              )}
            </div>

            {/* PDF Contract Generation Section */}
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-3">Contract Document</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => generatePDFContract(selectedContract)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Generate PDF Contract
                </button>
                <button
                  onClick={() => sendForSignature(selectedContract)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Send for E-Signature
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
