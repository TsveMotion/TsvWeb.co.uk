"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Announcement {
  _id: string
  title: string
  message: string
  content?: string // Backward compatibility
  type: 'info' | 'warning' | 'success' | 'error'
  displayLocation: Array<'dashboard' | 'header' | 'footer' | 'contact'>
  targetAudience?: string
}

interface AnnouncementBannerProps {
  location: 'header' | 'footer' | 'contact'
}

export default function AnnouncementBanner({ location }: AnnouncementBannerProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dismissed, setDismissed] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnnouncements()
    // Load dismissed announcements from localStorage
    const stored = localStorage.getItem('dismissed_announcements')
    if (stored) {
      setDismissed(JSON.parse(stored))
    }
  }, [])

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/public/announcements')
      const data = await response.json()

      if (data.success && data.announcements) {
        // Filter announcements for this location
        const filtered = data.announcements.filter((a: Announcement) => 
          a.displayLocation.includes(location)
        )
        setAnnouncements(filtered)
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = (id: string) => {
    const newDismissed = [...dismissed, id]
    setDismissed(newDismissed)
    localStorage.setItem('dismissed_announcements', JSON.stringify(newDismissed))
    
    // Move to next announcement if available
    if (currentIndex < announcements.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  // Filter out dismissed announcements
  const visibleAnnouncements = announcements.filter(a => !dismissed.includes(a._id))

  if (loading || visibleAnnouncements.length === 0) {
    return null
  }

  const currentAnnouncement = visibleAnnouncements[currentIndex]

  const typeStyles = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      text: 'text-blue-900 dark:text-blue-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      text: 'text-green-900 dark:text-green-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      text: 'text-yellow-900 dark:text-yellow-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      text: 'text-red-900 dark:text-red-100',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const style = typeStyles[currentAnnouncement.type]

  return (
    <div className={`fixed left-0 right-0 z-[45] ${style.bg} ${style.border} border-b`} style={{ top: '72px' }}>
      <div className="container-custom py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className={style.text}>
              {style.icon}
            </div>
            <div className="flex-1">
              <p className={`${style.text} font-semibold text-sm`}>
                {currentAnnouncement.title}
              </p>
              <p className={`${style.text} text-xs opacity-90`}>
                {currentAnnouncement.message || currentAnnouncement.content}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleDismiss(currentAnnouncement._id)}
            className={`${style.text} hover:opacity-70 transition-opacity p-1`}
            aria-label="Dismiss announcement"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
