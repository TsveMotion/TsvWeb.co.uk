"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function LoginTest() {
  const [email, setEmail] = useState('admin@tsvweb.com')
  const [password, setPassword] = useState('admin123')
  const [response, setResponse] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      setResponse(data)
      
      if (response.ok && data.success) {
        console.log('Login successful, redirecting in 3 seconds...')
        
        // Wait 3 seconds then redirect
        setTimeout(() => {
          window.location.href = '/admin/dashboard'
        }, 3000)
      } else {
        setError(data.message || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An error occurred during login')
    } finally {
      setIsLoading(false)
    }
  }
  
  const handleManualRedirect = () => {
    window.location.href = '/admin/dashboard'
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-2xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Login Test Page</h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-8">
          <div className="grid grid-cols-1 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Logging in...' : 'Test Login'}
            </button>
            
            <button
              onClick={handleManualRedirect}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
            >
              Manual Redirect to Dashboard
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {response && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">API Response</h2>
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded overflow-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8">
          <Link href="/admin/login" className="text-blue-600 hover:underline">
            Back to Regular Login
          </Link>
        </div>
      </div>
    </div>
  )
}
