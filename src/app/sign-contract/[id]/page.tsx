'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';

interface Contract {
  _id: string;
  title: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  amount: number;
  currency: string;
  contractType: string;
  status: string;
  createdAt: string;
}

export default function SignContract() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [contract, setContract] = useState<Contract | null>(null);
  const [loading, setLoading] = useState(true);
  const [signing, setSigning] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');

  const contractId = params.id as string;
  const token = searchParams.get('token');

  useEffect(() => {
    loadContract();
  }, [contractId, token]);

  const loadContract = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/sign?token=${token}`);
      if (response.ok) {
        const data = await response.json();
        setContract(data.contract);
        setSigned(data.contract.status === 'signed');
      } else {
        setError('Contract not found or invalid signature link');
      }
    } catch (error) {
      console.error('Error loading contract:', error);
      setError('Error loading contract');
    } finally {
      setLoading(false);
    }
  };

  const handleSign = async () => {
    if (!signature.trim()) {
      alert('Please enter your full name to sign the contract');
      return;
    }

    setSigning(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          signature: signature,
          signedAt: new Date().toISOString()
        }),
      });

      if (response.ok) {
        setSigned(true);
        setContract(prev => prev ? { ...prev, status: 'signed' } : null);
      } else {
        alert('Error signing contract');
      }
    } catch (error) {
      console.error('Error signing contract:', error);
      alert('Error signing contract');
    } finally {
      setSigning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Contract Not Found</h1>
          <p className="text-gray-600">The contract you're looking for doesn't exist or the link has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Service Agreement</h1>
            <p className="text-gray-600">Contract Signature Required</p>
            {signed && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                ✅ This contract has been signed successfully!
              </div>
            )}
          </div>
        </div>

        {/* Contract Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Contract Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Contract Title</label>
              <p className="text-gray-900">{contract.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Client Name</label>
              <p className="text-gray-900">{contract.clientName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Service Type</label>
              <p className="text-gray-900 capitalize">{contract.contractType.replace('_', ' ')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <p className="text-gray-900">{contract.amount} {contract.currency}</p>
            </div>
          </div>
        </div>

        {/* Contract Terms */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
          <div className="prose max-w-none">
            <ol className="list-decimal list-inside space-y-2">
              <li><strong>Service Fee:</strong> {contract.amount} {contract.currency}</li>
              <li><strong>Payment Terms:</strong> 50% upfront, 50% upon completion</li>
              <li><strong>Timeline:</strong> As agreed upon in project specifications</li>
              <li><strong>Intellectual Property:</strong> Client owns all deliverables upon full payment</li>
              <li><strong>Warranty:</strong> 30-day bug-fix warranty included</li>
              <li><strong>Cancellation:</strong> Either party may cancel with 7 days written notice</li>
            </ol>
          </div>
        </div>

        {/* Signature Section */}
        {!signed ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Electronic Signature</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name (This will serve as your electronic signature)
                </label>
                <input
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  By signing this contract electronically, you agree to the terms and conditions outlined above. 
                  Your electronic signature has the same legal effect as a handwritten signature.
                </p>
              </div>
              <button
                onClick={handleSign}
                disabled={signing || !signature.trim()}
                className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signing ? 'Signing Contract...' : 'Sign Contract'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center">
              <div className="text-6xl text-green-500 mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Contract Signed Successfully!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for signing the contract. You will receive a copy via email shortly.
              </p>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-600">
                  <strong>Signed by:</strong> {contract.clientName}<br />
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
