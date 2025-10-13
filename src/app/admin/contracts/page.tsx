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

interface Agreement {
  _id?: string;
  title: string;
  description?: string;
  token: string;
  status: 'draft' | 'sent' | 'signed' | 'cancelled' | 'expired';
  userId?: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  companyName?: string;
  companySignerName?: string;
  pdfPath?: string;
  sentAt?: string;
  clientSignedAt?: string;
  companySignedAt?: string;
  views?: number;
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
    currency: 'GBP',
    contractType: 'web_development'
  });

  // Agreements state
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [agreementsLoading, setAgreementsLoading] = useState(true);
  const [isAgreementModalOpen, setIsAgreementModalOpen] = useState(false);
  const [agreementForm, setAgreementForm] = useState({
    title: '',
    description: '',
    userId: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    companyName: 'TsvWeb',
    companySignerName: '',
  });
  const [selectedAgreement, setSelectedAgreement] = useState<Agreement | null>(null);
  const [agreementUploading, setAgreementUploading] = useState(false);
  const [bindOpenFor, setBindOpenFor] = useState<Agreement | null>(null);
  const [bindUserId, setBindUserId] = useState<string>('');

  // Load data
  useEffect(() => {
    loadContracts();
    loadUsers();
    loadAgreements();
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

  const createAgreement = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...agreementForm,
          createdBy: users?.[0]?.email || 'admin',
        }),
      });
      if (res.ok) {
        setIsAgreementModalOpen(false);
        setAgreementForm({
          title: '', description: '', userId: '', clientName: '', clientEmail: '', clientCompany: '', companyName: 'TsvWeb', companySignerName: ''
        });
        await loadAgreements();
      } else {
        const err = await res.json().catch(() => ({} as any));
        alert('Failed to create agreement: ' + (err.error || res.statusText));
      }
    } catch (e) {
      console.error('Create agreement error', e);
      alert('Failed to create agreement');
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

  const loadAgreements = async () => {
    try {
      const res = await fetch('/api/admin/agreements');
      if (res.ok) {
        const data = await res.json();
        setAgreements(data.items || []);
      }
    } catch (e) {
      console.error('Error loading agreements:', e);
    } finally {
      setAgreementsLoading(false);
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

  const openAgreementModal = () => {
    setAgreementForm({
      title: '',
      description: '',
      userId: '',
      clientName: '',
      clientEmail: '',
      clientCompany: '',
      companyName: 'TsvWeb',
      companySignerName: '',
    });
    setIsAgreementModalOpen(true);
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

  const manageAgreement = (agreement: Agreement) => {
    setSelectedAgreement(agreement);
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

  const handleAgreementFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, agreement: Agreement) => {
    const file = event.target.files?.[0];
    if (!file || !agreement) return;

    setAgreementUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch(`/api/admin/agreements/${agreement._id}/upload`, { method: 'POST', body: fd });
      if (res.ok) {
        await loadAgreements();
        alert('Agreement PDF uploaded');
      } else {
        const err = await res.json().catch(() => ({} as any));
        alert('Upload failed: ' + (err.error || res.statusText));
      }
    } catch (e) {
      console.error('Agreement upload error', e);
      alert('Upload failed');
    } finally {
      setAgreementUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  const sendAgreement = async (agreement: Agreement) => {
    try {
      const res = await fetch(`/api/admin/agreements/${agreement._id}/send`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        await loadAgreements();
        navigator.clipboard?.writeText(data.signUrl).catch(() => {});
        alert(`Agreement sent. Link copied to clipboard.\n${data.signUrl}`);
      } else {
        const err = await res.json().catch(() => ({} as any));
        alert('Send failed: ' + (err.error || res.statusText));
      }
    } catch (e) {
      console.error('Send agreement error', e);
      alert('Failed to send');
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
                  {(contract.currency === 'GBP' ? '£' : contract.currency === 'USD' ? '$' : '')}{contract.amount} {contract.currency}
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

      {/* Agreements Section */}
      <div className="mt-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Agreements</h2>
          <button
            onClick={openAgreementModal}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            New Agreement
          </button>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Views</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agreements.map((ag) => (
                <tr key={ag._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{ag.title}</div>
                    <div className="text-xs text-gray-500">{ag.token}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{ag.clientName}</div>
                    <div className="text-sm text-gray-500">{ag.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ag.status === 'signed' ? 'bg-green-100 text-green-800' : ag.status === 'sent' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                      {ag.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{ag.views ?? 0}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {ag.pdfPath ? (
                      <>
                        <button onClick={() => sendAgreement(ag)} className="text-purple-600 hover:text-purple-800">Send</button>
                        <button onClick={() => window.open(`/agreements/${ag.token}`, '_blank')} className="text-blue-600 hover:text-blue-800">View</button>
                        {!ag.clientSignedAt && !ag.userId && (
                          <button onClick={() => { setBindOpenFor(ag); setBindUserId(''); }} className="text-gray-700 hover:text-gray-900">Bind</button>
                        )}
                      </>
                    ) : (
                      <>
                        <input id={`ag-upload-${ag._id}`} type="file" accept="application/pdf" className="hidden" onChange={(e) => handleAgreementFileUpload(e, ag)} />
                        <label htmlFor={`ag-upload-${ag._id}`} className="text-green-600 hover:text-green-800 cursor-pointer">Upload PDF</label>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!agreementsLoading && agreements.length === 0 && (
            <div className="text-center py-8 text-gray-500">No agreements yet.</div>
          )}
        </div>
      </div>

      {/* Agreement Create Modal */}
      {isAgreementModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Create New Agreement</h2>
              <button onClick={() => setIsAgreementModalOpen(false)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <form onSubmit={createAgreement} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Select User (optional)</label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={agreementForm.userId}
                  onChange={(e) => {
                    const uid = e.target.value;
                    const u = users.find(us => us.id === uid);
                    setAgreementForm({
                      ...agreementForm,
                      userId: uid,
                      clientName: u ? u.name : agreementForm.clientName,
                      clientEmail: u ? u.email : agreementForm.clientEmail,
                    });
                  }}
                >
                  <option value="">Choose a user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title *</label>
                <input className="w-full px-3 py-2 border rounded-md" value={agreementForm.title} onChange={(e) => setAgreementForm({ ...agreementForm, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea className="w-full px-3 py-2 border rounded-md" value={agreementForm.description} onChange={(e) => setAgreementForm({ ...agreementForm, description: e.target.value })} rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Client Name *</label>
                  <input className="w-full px-3 py-2 border rounded-md" value={agreementForm.clientName} onChange={(e) => setAgreementForm({ ...agreementForm, clientName: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Client Email *</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-md" value={agreementForm.clientEmail} onChange={(e) => setAgreementForm({ ...agreementForm, clientEmail: e.target.value })} required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Client Company</label>
                <input className="w-full px-3 py-2 border rounded-md" value={agreementForm.clientCompany} onChange={(e) => setAgreementForm({ ...agreementForm, clientCompany: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium mb-1">Company Name</label>
                  <input className="w-full px-3 py-2 border rounded-md" value={agreementForm.companyName} onChange={(e) => setAgreementForm({ ...agreementForm, companyName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Company Signer Name</label>
                  <input className="w-full px-3 py-2 border rounded-md" value={agreementForm.companySignerName} onChange={(e) => setAgreementForm({ ...agreementForm, companySignerName: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsAgreementModalOpen(false)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bind Agreement Modal */}
      {bindOpenFor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Bind Agreement to User</h2>
              <button onClick={() => setBindOpenFor(null)} className="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Choose a user</label>
                <select className="w-full px-3 py-2 border rounded-md" value={bindUserId} onChange={(e) => setBindUserId(e.target.value)}>
                  <option value="">Select user...</option>
                  {users.map(u => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setBindOpenFor(null)} className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md">Cancel</button>
                <button
                  disabled={!bindUserId}
                  onClick={async () => {
                    if (!bindOpenFor) return;
                    try {
                      const res = await fetch(`/api/admin/agreements/${bindOpenFor._id}/bind`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ userId: bindUserId }),
                      });
                      if (res.ok) {
                        setBindOpenFor(null);
                        setBindUserId('');
                        await loadAgreements();
                        alert('Agreement bound to user');
                      } else {
                        const err = await res.json().catch(() => ({} as any));
                        alert('Bind failed: ' + (err.error || res.statusText));
                      }
                    } catch (e) {
                      alert('Bind failed');
                    }
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >Bind</button>
              </div>
            </div>
          </div>
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
                  <label className="block text-sm font-medium mb-2">Amount (GBP) *</label>
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
