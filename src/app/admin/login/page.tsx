"use client"

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  // Check if there's a redirect destination
  useEffect(() => {
    const fromParam = searchParams.get('from')
    if (fromParam) {
      setError('You need to login to access that page')
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Authenticate with our backend API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        // Check if there's a redirect destination in the URL
        const redirectTo = searchParams.get('from') || '/admin/dashboard'
        
        // Log success and redirect
        console.log('✅ Authentication successful, redirecting to:', redirectTo)
        
        // Use direct window location for more reliable navigation
        // This is more reliable than router.push in some Next.js setups
        window.location.href = redirectTo
      } else {
        setError(data.message || 'Invalid email or password')
      }
    } catch (err) {
      setError('An error occurred during login')
      console.error('Login error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-royal-blue dark:text-white">
                TsvWeb
              </span>
            </Link>
          </div>
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 dark:text-white">
            Admin Login
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:bg-gray-800 px-6 py-12 shadow sm:rounded-lg sm:px-12">
            {error && (
              <div className="mb-6 bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
                {error}
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 dark:bg-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-blue sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 px-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-700 dark:bg-gray-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-royal-blue sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-gray-300 text-royal-blue focus:ring-royal-blue"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <Link href="/admin/forgot-password" className="font-semibold text-royal-blue hover:text-royal-blue-dark">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full justify-center rounded-md bg-royal-blue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-royal-blue-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-royal-blue ${
                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign in'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-10">
              <div className="relative">
                <div className="absolute inset-0 flex items-center"></div>
                <div className="relative flex justify-center text-sm font-medium leading-6">
                  <span className="bg-white dark:bg-gray-800 px-6 text-gray-500 dark:text-gray-400">
                    Demo credentials
                  </span>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Email: admin@tsvweb.com</p>
                <p>Password: admin123</p>
                <p className="mt-2 italic">(For demonstration purposes only)</p>
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400">
            Not an administrator?{' '}
            <Link href="/" className="font-semibold leading-6 text-royal-blue hover:text-royal-blue-dark">
              Return to website
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
