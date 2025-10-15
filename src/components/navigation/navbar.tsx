"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import SimpleSetupWizard from '@/components/setup-wizard/simple-setup-wizard'
import AnnouncementBanner from '@/components/announcements/AnnouncementBanner'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Services', href: '/services' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Blog', href: '/blog' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef<number>(0)
  const touchStartY = useRef<number>(0)

  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        closeMobileMenu()
      }
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && mobileMenuOpen) {
        closeMobileMenu()
      }
    }

    window.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscapeKey)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscapeKey)
    }
  }, [mobileMenuOpen])

  // Handle mobile menu animations
  const openMobileMenu = () => {
    setIsAnimating(true)
    setMobileMenuOpen(true)
    document.body.style.overflow = 'hidden' // Prevent background scrolling
  }

  const closeMobileMenu = () => {
    setIsAnimating(true)
    setMobileMenuOpen(false)
    document.body.style.overflow = 'unset'
    setTimeout(() => setIsAnimating(false), 300)
  }

  const toggleMobileMenu = () => {
    if (mobileMenuOpen) {
      closeMobileMenu()
    } else {
      openMobileMenu()
    }
  }

  // Touch gesture handlers for swipe to close
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!mobileMenuOpen) return
    
    const touchEndX = e.changedTouches[0].clientX
    const touchEndY = e.changedTouches[0].clientY
    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current
    
    // Swipe up to close (minimum 100px swipe)
    if (deltaY < -100 && Math.abs(deltaX) < 50) {
      closeMobileMenu()
    }
  }

  const navbarClasses = `fixed w-full z-50 transition-all duration-300 ${
    scrolled 
      ? 'bg-white dark:bg-gray-900 shadow-md py-2' 
      : 'bg-transparent py-4'
  }`

  return (
    <React.Fragment>
      <AnnouncementBanner location="header" />
      <header className={navbarClasses} style={{ top: '52px' }}>
        <nav className="container-custom flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image 
                src="/TsvWeb_Logo.png" 
                alt="TsvWeb Logo" 
                width={150} 
                height={50} 
                className={`h-10 w-auto object-contain transition-all duration-300 ${mounted && theme === 'dark' ? 'brightness-0 invert' : ''}`}
                priority
                style={{ width: 'auto', height: '40px' }}
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-300 ${
                  pathname === item.href
                    ? 'text-royal-blue dark:text-royal-blue-light font-semibold'
                    : 'text-gray-700 hover:text-royal-blue dark:text-gray-200 dark:hover:text-royal-blue-light'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Get Quote Button */}
            <button
              onClick={() => setIsWizardOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white text-sm font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Get Free Quote
            </button>
            
            {/* Customer Login Button */}
            <Link
              href="/customer/login"
              className="inline-flex items-center px-4 py-2 border-2 border-[#007BFF] text-sm font-medium rounded-lg text-[#007BFF] bg-white hover:bg-[#007BFF] hover:text-white dark:bg-gray-800 dark:text-[#007BFF] dark:border-[#007BFF] dark:hover:bg-[#007BFF] dark:hover:text-white transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Login
            </Link>
            
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007BFF]"
              aria-label="Toggle dark mode"
            >
              {mounted && theme === 'dark' ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {/* Enhanced Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-[#007BFF] hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#007BFF] transition-all duration-200 active:scale-95"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close main menu' : 'Open main menu'}
            >
              <div className="relative w-6 h-6">
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-0' : '-translate-y-2'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 translate-y-0' : 'translate-y-2'}`}></span>
              </div>
            </button>
          </div>
        </nav>

      {/* Enhanced Mobile menu with overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop overlay */}
          <div 
            className={`fixed inset-0 bg-black transition-opacity duration-300 ${
              mobileMenuOpen ? 'opacity-50' : 'opacity-0'
            }`}
            onClick={closeMobileMenu}
          />
          
          {/* Mobile menu panel */}
          <div 
            ref={mobileMenuRef}
            className={`fixed top-0 right-0 w-80 max-w-[85vw] h-full bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Mobile menu header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Image 
                  src="/TsvWeb_Logo.png" 
                  alt="TsvWeb Logo" 
                  width={120} 
                  height={40} 
                  className={`h-8 w-auto object-contain transition-all duration-300 ${mounted && theme === 'dark' ? 'brightness-0 invert' : ''}`}
                  priority
                  style={{ width: 'auto', height: '32px' }}
                />
              </div>
              <button
                onClick={closeMobileMenu}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800 transition-colors duration-200"
                aria-label="Close menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Swipe indicator */}
            <div className="flex justify-center py-2">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
            
            {/* Navigation links */}
            <div className="px-4 py-2 space-y-1 overflow-y-auto max-h-[calc(100vh-200px)]">
              {navigation.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                    pathname === item.href
                      ? 'text-royal-blue dark:text-royal-blue-light bg-royal-blue/10 dark:bg-royal-blue-light/10 border-l-4 border-royal-blue dark:border-royal-blue-light'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-royal-blue dark:hover:text-royal-blue-light'
                  }`}
                  onClick={closeMobileMenu}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="flex-1">{item.name}</span>
                  {pathname === item.href && (
                    <svg className="w-5 h-5 text-royal-blue dark:text-royal-blue-light" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </Link>
              ))}
              
              {/* Divider */}
              <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>
              
              {/* Theme Toggle (Mobile) */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              >
                <div className="flex items-center">
                  {mounted && theme === 'dark' ? (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" fillRule="evenodd" clipRule="evenodd"></path>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
                    </svg>
                  )}
                  <span>{mounted && theme === 'dark' ? 'Light' : 'Dark'}</span>
                </div>
                <div className="px-2 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700">
                  {mounted && theme === 'dark' ? 'Light' : 'Dark'}
                </div>
              </button>
              
              {/* Customer Login Button (Mobile) */}
              <Link
                href="/customer/login"
                className="flex items-center justify-center w-full px-4 py-3 mt-4 text-base font-medium text-white bg-royal-blue hover:bg-royal-blue-dark dark:bg-royal-blue-light dark:hover:bg-royal-blue rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                onClick={closeMobileMenu}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Customer Login
              </Link>
              
              {/* Get Quote Button (Mobile) */}
              <button
                onClick={() => {
                  closeMobileMenu()
                  setIsWizardOpen(true)
                }}
                className="flex items-center justify-center w-full px-4 py-3 mt-2 text-base font-bold text-white bg-gradient-to-r from-[#007BFF] to-[#0056D2] rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get Free Quote
              </button>
            </div>
            
            {/* Footer info */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                © 2024 TsvWeb. Professional Web Solutions.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Setup Wizard Modal */}
      <SimpleSetupWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </header>
    </React.Fragment>
  )
}
