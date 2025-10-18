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
  sentAt?: string;
  signedAt?: string;
  signedBy?: string;
  signatureDetails?: {
    signerName?: string;
    signedAt?: string;
    ip?: string;
    userAgent?: string;
  };
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
  const [viewDetailsContract, setViewDetailsContract] = useState<Contract | null>(null);

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

  const removeAgreementPdf = async (agreement: Agreement) => {
    if (!agreement?._id) return;
    if (!confirm('Remove the PDF from this agreement?')) return;
    try {
      const res = await fetch(`/api/admin/agreements/${agreement._id}/upload`, { method: 'DELETE' });
      if (res.ok) {
        await loadAgreements();
        alert('PDF removed');
      } else {
        const err = await res.json().catch(() => ({} as any));
        alert('Remove failed: ' + (err.error || res.statusText));
      }
    } catch (e) {
      alert('Remove failed');
    }
  };

  const deleteAgreement = async (agreement: Agreement) => {
    if (!agreement?._id) return;
    if (!confirm('Delete this agreement? This cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/agreements/${agreement._id}`, { method: 'DELETE' });
      if (res.ok) {
        await loadAgreements();
        alert('Agreement deleted');
      } else {
        const err = await res.json().catch(() => ({} as any));
        alert('Delete failed: ' + (err.error || res.statusText));
      }
    } catch (e) {
      alert('Delete failed');
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
      currency: 'GBP',
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
        const data = await response.json();
        
        // Update the selected contract immediately with the new file
        const updatedContract = {
          ...selectedContract,
          files: data.contract?.files || [...(selectedContract.files || []), data.file]
        };
        setSelectedContract(updatedContract);
        
        // Also update in the contracts list
        setContracts(contracts.map(c => 
          c._id === selectedContract._id ? updatedContract : c
        ));
        
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
        const data = await res.json();
        
        // Update the selected agreement immediately
        if (selectedAgreement && selectedAgreement._id === agreement._id) {
          setSelectedAgreement({
            ...selectedAgreement,
            pdfPath: data.agreement?.pdfPath || data.pdfPath
          });
        }
        
        // Update in agreements list
        setAgreements(agreements.map(a => 
          a._id === agreement._id 
            ? { ...a, pdfPath: data.agreement?.pdfPath || data.pdfPath }
            : a
        ));
        
        alert('Agreement PDF uploaded successfully!');
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

  // Removed Generate PDF feature per request

  const sendForSignature = async (contract: Contract) => {
    if (!contract) return;

    try {
      // Derive latest uploaded file as the agreement PDF, if available
      const latestFile = (contract.files || []).slice().sort((a: any, b: any) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime())[0];
      const pdfPath = latestFile ? latestFile.path : undefined;

      if (!pdfPath) {
        alert('Please upload a contract file before sending for signature.');
        return;
      }

      // 1) Create agreement from contract details
      const createRes = await fetch('/api/admin/agreements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: contract.title,
          description: `Contract for ${contract.contractType.replace('_', ' ')}`,
          userId: contract.userId,
          clientName: contract.clientName,
          clientEmail: contract.clientEmail,
          clientCompany: '',
          companyName: 'TsvWeb',
          createdBy: 'admin',
          pdfPath,
        }),
      });

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({} as any));
        alert('Failed to create agreement: ' + (err.error || createRes.statusText));
        return;
      }
      const { agreement } = await createRes.json();

      // 2) Send agreement email with signing link
      const sendRes = await fetch(`/api/admin/agreements/${agreement._id}/send`, { method: 'POST' });
      if (!sendRes.ok) {
        const err = await sendRes.json().catch(() => ({} as any));
        alert('Failed to send agreement: ' + (err.error || sendRes.statusText));
        return;
      }
      const sendData = await sendRes.json();
      
      // 3) Update contract status to 'sent'
      await fetch(`/api/admin/contracts/${contract._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'sent', sentAt: new Date().toISOString() }),
      });
      
      await loadContracts();
      const successMsg = `✓ Agreement sent successfully!\n\nSigning link: ${sendData.signUrl}\n\nThe link has been copied to your clipboard and emailed to ${contract.clientEmail}.`;
      alert(successMsg);
      try { navigator.clipboard?.writeText(sendData.signUrl); } catch {}
    } catch (error) {
      console.error('Error sending via agreement:', error);
      alert('Error sending via agreement');
    }
  };

  const handleStatusChange = async (contractId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/contracts/${contractId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: newStatus,
          ...(newStatus === 'signed' && { signedAt: new Date().toISOString() })
        }),
      });

      if (response.ok) {
        // Update local state
        setContracts(contracts.map(c => 
          c._id === contractId 
            ? { ...c, status: newStatus, ...(newStatus === 'signed' && !c.signedAt && { signedAt: new Date().toISOString() }) }
            : c
        ));
      } else {
        alert('Failed to update contract status');
      }
    } catch (error) {
      console.error('Error updating contract status:', error);
      alert('Error updating contract status');
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
        body: JSON.stringify({ ...formData, currency: 'GBP' }),
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h1 className="text-3xl font-bold">Contracts & Legal</h1>
                </div>
                <p className="text-emerald-100 text-lg">
                  Manage contracts, send for e-signatures, and track status
                </p>
              </div>
              <button
                onClick={openModal}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-lg transition-all border border-white/30 font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Create New Contract
              </button>
            </div>
          </div>
        </div>

      {/* Contracts Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Contract
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Timeline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {contracts.map((contract) => (
                <tr key={contract._id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{contract.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 capitalize">{contract.contractType.replace('_', ' ')}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{contract.clientName}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{contract.clientEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-gray-900 dark:text-white">
                      {contract.currency === 'GBP' ? '£' : contract.currency === 'USD' ? '$' : ''}{contract.amount.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{contract.currency}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={contract.status || 'draft'}
                      onChange={(e) => handleStatusChange(contract._id!, e.target.value as any)}
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
                        contract.status === 'signed' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 ring-1 ring-green-600/20' :
                        contract.status === 'sent' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 ring-1 ring-blue-600/20' :
                        contract.status === 'draft' ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 ring-1 ring-gray-600/20' :
                        contract.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 ring-1 ring-red-600/20' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="signed">Signed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    {contract.status === 'signed' && contract.signedBy && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/></svg>
                        {contract.signedBy}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        {contract.sentAt ? (
                          <span className="font-medium text-gray-900 dark:text-gray-200">{new Date(contract.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        ) : (
                          <span className="text-gray-400 dark:text-gray-500">Not sent</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                        <svg className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {contract.status === 'signed' && contract.signedAt ? (
                          <span className="font-medium text-green-700 dark:text-green-400">{new Date(contract.signedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        ) : contract.status === 'sent' ? (
                          <span className="text-blue-600">Awaiting signature</span>
                        ) : (
                          <span className="text-gray-400">Not sent</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {contract.status === 'signed' && (
                        <button
                          onClick={() => setViewDetailsContract(contract)}
                          className="inline-flex items-center px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors text-xs font-medium"
                          title="View signature details"
                        >
                          View
                        </button>
                      )}
                      <button
                        onClick={() => editContract(contract)}
                        className="inline-flex items-center px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors text-xs font-medium"
                        title="Edit contract"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => manageFiles(contract)}
                        className="inline-flex items-center px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-md hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors text-xs font-medium"
                        title="Manage files"
                      >
                        Files
                      </button>
                      <button
                        onClick={() => deleteContract(contract._id!)}
                        className="inline-flex items-center px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors text-xs font-medium"
                        title="Delete contract"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {contracts.length === 0 && (
          <div className="text-center py-16 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-emerald-200 dark:border-gray-700">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-full inline-block mb-4 shadow-lg">
              <svg className="h-16 w-16 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No contracts yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by creating your first contract</p>
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create First Contract
            </button>
          </div>
        )}
      </div>

      {/* Agreements section intentionally hidden per request */}

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
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{isEditMode ? 'Edit Contract' : 'Create New Contract'}</h2>
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
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Manage Files - {selectedContract.title}</h2>
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            {/* File Upload Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Upload New File</h3>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-900">
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
                    uploadingFile ? 'bg-gray-400 dark:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {uploadingFile ? 'Uploading...' : 'Choose File'}
                </label>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Supported formats: PDF, DOC, DOCX, TXT, PNG, JPG, JPEG
                </p>
              </div>
            </div>

            {/* Existing Files Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Existing Files</h3>
              {selectedContract.files && selectedContract.files.length > 0 ? (
                <div className="space-y-2">
                  {selectedContract.files.map((file: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center space-x-3">
                        <div className="text-blue-600 dark:text-blue-400">
                          📄
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{file.originalName}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => window.open(`/api/admin/contracts/${selectedContract._id}/files/${file.filename}`, '_blank')}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
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
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No files uploaded yet.
                </div>
              )}
            </div>

            {/* E-Signature Section */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Contract Actions</h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => sendForSignature(selectedContract)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Send for E-Signature
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsFileModalOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Signature Details Modal */}
      {viewDetailsContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5 rounded-t-xl">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Signature Details</h2>
                      <p className="text-purple-100 text-sm mt-0.5">{viewDetailsContract.title}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setViewDetailsContract(null)} className="text-white/80 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Contract Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Contract Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Client</p>
                    <p className="text-sm font-semibold text-gray-900">{viewDetailsContract.clientName}</p>
                    <p className="text-xs text-gray-600">{viewDetailsContract.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Amount</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {viewDetailsContract.currency === 'GBP' ? '£' : '$'}{viewDetailsContract.amount.toLocaleString()} {viewDetailsContract.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Type</p>
                    <p className="text-sm font-semibold text-gray-900 capitalize">{viewDetailsContract.contractType.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Status</p>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 ring-1 ring-green-600/20">
                      ✓ Signed
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature Details */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Electronic Signature
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Signed By</p>
                      <p className="text-base font-bold text-gray-900">{viewDetailsContract.signedBy || 'Unknown'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date & Time</p>
                      <p className="text-base font-bold text-gray-900">
                        {viewDetailsContract.signedAt 
                          ? new Date(viewDetailsContract.signedAt).toLocaleString('en-GB', { 
                              day: 'numeric', 
                              month: 'long', 
                              year: 'numeric', 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZoneName: 'short'
                            })
                          : 'Not available'}
                      </p>
                    </div>
                  </div>

                  {viewDetailsContract.signatureDetails?.ip && (
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">IP Address</p>
                        <p className="text-base font-mono font-semibold text-gray-900">{viewDetailsContract.signatureDetails.ip}</p>
                      </div>
                    </div>
                  )}

                  {viewDetailsContract.signatureDetails?.userAgent && (
                    <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Device / Browser</p>
                        <p className="text-sm text-gray-700 break-all">{viewDetailsContract.signatureDetails.userAgent}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Timeline
                </h3>
                <div className="space-y-3">
                  {viewDetailsContract.createdAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Created:</span> {new Date(viewDetailsContract.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {viewDetailsContract.sentAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Sent for signature:</span> {new Date(viewDetailsContract.sentAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                  {viewDetailsContract.signedAt && (
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Signed:</span> {new Date(viewDetailsContract.signedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">This signature is legally binding and has been recorded for verification purposes.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    const content = `
SIGNATURE VERIFICATION REPORT
============================

Contract: ${viewDetailsContract.title}
Type: ${viewDetailsContract.contractType.replace('_', ' ')}
Amount: ${viewDetailsContract.currency === 'GBP' ? '£' : '$'}${viewDetailsContract.amount} ${viewDetailsContract.currency}

CLIENT INFORMATION
------------------
Name: ${viewDetailsContract.clientName}
Email: ${viewDetailsContract.clientEmail}

SIGNATURE DETAILS
-----------------
Signed By: ${viewDetailsContract.signedBy || 'Unknown'}
Date & Time: ${viewDetailsContract.signedAt ? new Date(viewDetailsContract.signedAt).toLocaleString('en-GB', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric', 
  hour: '2-digit', 
  minute: '2-digit',
  timeZoneName: 'short'
}) : 'Not available'}
IP Address: ${viewDetailsContract.signatureDetails?.ip || 'Not recorded'}
Device/Browser: ${viewDetailsContract.signatureDetails?.userAgent || 'Not recorded'}

TIMELINE
--------
Created: ${viewDetailsContract.createdAt ? new Date(viewDetailsContract.createdAt).toLocaleDateString('en-GB') : 'Unknown'}
Sent: ${viewDetailsContract.sentAt ? new Date(viewDetailsContract.sentAt).toLocaleDateString('en-GB') : 'Not sent'}
Signed: ${viewDetailsContract.signedAt ? new Date(viewDetailsContract.signedAt).toLocaleDateString('en-GB') : 'Not signed'}

This is an electronically generated verification report.
Generated on: ${new Date().toLocaleString('en-GB')}
                    `;
                    const blob = new Blob([content], { type: 'text/plain' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `signature-verification-${viewDetailsContract._id}.txt`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Report
                </button>
                <button
                  onClick={() => setViewDetailsContract(null)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
