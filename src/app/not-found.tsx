"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'
import { ArrowLeftIcon, EnvelopeIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
  const [email, setEmail] = useState('')
  const [isSubscribing, setIsSubscribing] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState('')
  const router = useRouter()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubscribing(true)
    
    try {
      // You can implement your newsletter API endpoint here
      // For now, we'll simulate a successful subscription
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSubscriptionStatus('success')
      setEmail('')
    } catch (error) {
      setSubscriptionStatus('error')
    } finally {
      setIsSubscribing(false)
    }
  }

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push('/')
    }
  }

  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="Page Not Found - TsvWeb"
        description="The page you're looking for doesn't exist. Return to TsvWeb for professional web design services in Birmingham."
        canonical="https://tsvweb.com/404"
      />
      <Navbar />
      
      {/* 404 Hero Section */}
      <section className="flex-1 flex items-center justify-center py-16 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 opacity-90"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 dark:opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-blue/30 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 dark:opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-blue/30 to-transparent"></div>
          </div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Column - 404 Content */}
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <ExclamationTriangleIcon className="h-16 w-16 text-royal-blue" />
                </div>
                
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-6">
                  Page Not Found
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                  Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button
                    onClick={handleGoBack}
                    className="btn-secondary inline-flex items-center gap-2"
                  >
                    <ArrowLeftIcon className="h-5 w-5" />
                    Go Back
                  </button>
                  
                  <Link 
                    href="/"
                    className="btn-primary inline-flex items-center justify-center"
                  >
                    Back to Home
                  </Link>
                </div>

                {/* Quick Links */}
                <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Looking for something specific? Try these pages:
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <Link 
                      href="/services" 
                      className="text-royal-blue hover:text-royal-blue/80 text-sm underline decoration-1 underline-offset-2"
                    >
                      Services
                    </Link>
                    <Link 
                      href="/portfolio" 
                      className="text-royal-blue hover:text-royal-blue/80 text-sm underline decoration-1 underline-offset-2"
                    >
                      Portfolio
                    </Link>
                    <Link 
                      href="/blog" 
                      className="text-royal-blue hover:text-royal-blue/80 text-sm underline decoration-1 underline-offset-2"
                    >
                      Blog
                    </Link>
                    <Link 
                      href="/contact" 
                      className="text-royal-blue hover:text-royal-blue/80 text-sm underline decoration-1 underline-offset-2"
                    >
                      Contact
                    </Link>
                  </div>
                </div>
              </div>

              {/* Right Column - Newsletter Signup */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
                <div className="text-center mb-6">
                  <EnvelopeIcon className="h-12 w-12 text-royal-blue mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Stay Connected
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Don't miss out! Subscribe to our newsletter for web design tips, industry insights, and exclusive offers.
                  </p>
                </div>

                {subscriptionStatus === 'success' ? (
                  <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="text-green-600 dark:text-green-400 mb-2">✓</div>
                    <p className="text-green-800 dark:text-green-200 font-medium">
                      Thank you for subscribing!
                    </p>
                    <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                      You'll receive our latest updates and insights.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="sr-only">
                        Email address
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-royal-blue text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isSubscribing}
                      className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubscribing ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Subscribing...
                        </div>
                      ) : (
                        'Subscribe to Newsletter'
                      )}
                    </button>
                    
                    {subscriptionStatus === 'error' && (
                      <p className="text-red-600 dark:text-red-400 text-sm text-center">
                        Something went wrong. Please try again.
                      </p>
                    )}
                  </form>
                )}

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    We respect your privacy. Unsubscribe at any time.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
