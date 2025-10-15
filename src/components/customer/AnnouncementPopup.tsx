"use client"

import { useState, useEffect } from 'react'

interface Announcement {
  _id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'urgent'
  publishedAt: string
  isRead: boolean
}

export default function AnnouncementPopup() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showPopup, setShowPopup] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUnreadAnnouncements()
  }, [])

  const fetchUnreadAnnouncements = async () => {
    try {
      const response = await fetch('/api/customer/announcements?unreadOnly=true')
      const data = await response.json()

      if (data.success && data.announcements.length > 0) {
        const unread = data.announcements.filter((a: Announcement) => !a.isRead)
        setAnnouncements(unread)
        if (unread.length > 0) {
          setShowPopup(true)
        }
      }
    } catch (error) {
      console.error('Error fetching announcements:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (announcementId: string) => {
    try {
      await fetch('/api/customer/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ announcementId })
      })
    } catch (error) {
      console.error('Error marking announcement as read:', error)
    }
  }

  const handleNext = () => {
    if (currentIndex < announcements.length - 1) {
      markAsRead(announcements[currentIndex]._id)
      setCurrentIndex(currentIndex + 1)
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleClose = () => {
    // Mark current announcement as read
    if (announcements[currentIndex]) {
      markAsRead(announcements[currentIndex]._id)
    }
    setShowPopup(false)
  }

  if (loading || !showPopup || announcements.length === 0) {
    return null
  }

  const currentAnnouncement = announcements[currentIndex]

  const typeStyles = {
    info: {
      bg: 'from-blue-500 to-indigo-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    success: {
      bg: 'from-green-500 to-emerald-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    warning: {
      bg: 'from-yellow-500 to-orange-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    },
    urgent: {
      bg: 'from-red-500 to-rose-600',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  }

  const style = typeStyles[currentAnnouncement.type]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${style.bg} p-6 text-white relative`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 rounded-full p-3">
                {style.icon}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-90">
                    {currentAnnouncement.type}
                  </span>
                  {announcements.length > 1 && (
                    <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded-full">
                      {currentIndex + 1} of {announcements.length}
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold">{currentAnnouncement.title}</h2>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed whitespace-pre-wrap">
              {currentAnnouncement.content}
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(currentAnnouncement.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                From TsvWeb Team
              </div>
            </div>
          </div>
        </div>

        {/* Footer with navigation */}
        <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-gray-300 dark:border-gray-600"
          >
            ← Previous
          </button>

          <div className="flex gap-2">
            {announcements.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex
                    ? 'bg-blue-600'
                    : index < currentIndex
                    ? 'bg-gray-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors ${
              currentIndex === announcements.length - 1
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {currentIndex === announcements.length - 1 ? 'Got it! ✓' : 'Next →'}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
