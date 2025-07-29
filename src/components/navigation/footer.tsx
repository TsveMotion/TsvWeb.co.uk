"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useState, useEffect, FormEvent } from 'react'

export default function Footer() {
  const [mounted, setMounted] = useState(false)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  
  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // Handle theme toggle
  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  // Handle email subscription
  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault()
    // In a real application, you would send this to your API
    console.log('Subscribing email:', email)
    setSubscribed(true)
    setEmail('')
    // Reset subscription status after 3 seconds
    setTimeout(() => {
      setSubscribed(false)
    }, 3000)
  }

  const footerLinks = [
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Services', href: '/services' },
        { name: 'Portfolio', href: '/portfolio' },
        { name: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Services',
      links: [
        { name: 'Web Design', href: '/services/web-design' },
        { name: 'Web Development', href: '/services/web-development' },
        { name: 'E-commerce', href: '/services/ecommerce' },
        { name: 'SEO', href: '/services/seo' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy-policy' },
        { name: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  ]

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Company Info - Left Side */}
          <div className="lg:col-span-3">
            <Link href="/" className="inline-block mb-4">
              <Image 
                src="/TsvWeb_Logo.png" 
                alt="TsvWeb Logo" 
                width={150} 
                height={50} 
                className="h-8 w-auto" 
                priority
              />
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Professional web design and development services for businesses of all sizes.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Footer Links - Middle */}
          <div className="lg:col-span-6 grid grid-cols-3 gap-8">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  {column.title}
                </h3>
                <ul className="mt-3 space-y-1">
                  {column.links.map((link) => (
                    <li key={link.name}>
                      <Link 
                        href={link.href} 
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter and Theme Toggle - Right Side */}
          <div className="lg:col-span-3">
            {/* Newsletter Signup */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700 dark:text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Subscribe to Our Newsletter
                </h3>
              </div>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                <div className="relative">
                  <label htmlFor="email-address" className="sr-only">Email address</label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full appearance-none rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Subscribe
                </button>
              </form>
              {subscribed && (
                <div className="mt-1 text-xs text-green-600 dark:text-green-400 font-medium">
                  Thank you for subscribing!
                </div>
              )}
            </div>

            {/* Theme Toggle and Copyright */}
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Light</span>
                <div 
                  className="relative mx-2 inline-flex h-5 w-9 items-center rounded-full bg-gray-200 transition-colors duration-300 ease-in-out dark:bg-gray-700 cursor-pointer"
                  onClick={toggleTheme}
                  role="switch"
                  aria-checked={mounted && resolvedTheme === 'dark'}
                >
                  <span 
                    className={`${mounted && resolvedTheme === 'dark' ? 'translate-x-5 bg-blue-600' : 'translate-x-1 bg-white'} inline-block h-3 w-3 transform rounded-full shadow-sm transition-transform duration-300 ease-in-out`}
                  />
                </div>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Dark</span>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date().getFullYear()} TsvWeb. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
