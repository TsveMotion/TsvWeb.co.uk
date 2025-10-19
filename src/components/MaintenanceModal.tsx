"use client"

import { useState, useEffect } from 'react'
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface MaintenanceModeData {
  isEnabled: boolean
  message?: string
  scope?: 'tsvweb' | 'all'
  scheduledEnd?: string
}

export default function MaintenanceModal() {
  const [maintenanceMode, setMaintenanceMode] = useState<MaintenanceModeData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    checkMaintenanceMode()
    // Check every 30 seconds for updates
    const interval = setInterval(checkMaintenanceMode, 30000)
    return () => clearInterval(interval)
  }, [])

  const checkMaintenanceMode = async () => {
    try {
      const response = await fetch('/api/public/maintenance')
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.data) {
          setMaintenanceMode(data.data)
          // Reset dismissed state if maintenance mode changes
          if (data.data.isEnabled) {
            setIsDismissed(false)
          }
        }
      }
    } catch (error) {
      console.error('Error checking maintenance mode:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Don't show anything while loading or if dismissed
  if (isLoading || isDismissed || !maintenanceMode || !maintenanceMode.isEnabled) {
    return null
  }

  const handleDismiss = () => {
    setIsDismissed(true)
  }

  // Format the message with line breaks
  const formattedMessage = maintenanceMode.message || '⚠️ SERVICES MAY BE DOWN\nWEBSITES ARE ALL UNDER MAINTENANCE'

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]" />
      
      {/* Modal */}
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-auto overflow-hidden border-4 border-red-500 animate-pulse-border">
          {/* Close Button (Optional - can be removed for truly blocking modal) */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 p-2 rounded-full bg-red-100 dark:bg-red-900/50 hover:bg-red-200 dark:hover:bg-red-900 transition-colors z-10"
            aria-label="Dismiss"
          >
            <XMarkIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </button>

          {/* Header with Warning Icon */}
          <div className="bg-gradient-to-r from-red-600 to-orange-600 p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 animate-bounce">
                <ExclamationTriangleIcon className="h-20 w-20 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-black text-white mb-2">
              MAINTENANCE MODE
            </h2>
            <p className="text-white/90 text-lg font-semibold">
              System Maintenance in Progress
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Main Message */}
            <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-xl p-6 mb-6">
              <div className="text-center">
                {formattedMessage.split('\n').map((line, index) => (
                  <p key={index} className="text-2xl font-black text-red-800 dark:text-red-300 mb-2">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            {/* Additional Information */}
            <div className="space-y-4 text-center">
              <p className="text-gray-700 dark:text-gray-300 text-lg">
                We are currently performing scheduled maintenance to improve our services.
              </p>
              
              {maintenanceMode.scheduledEnd && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-lg p-4">
                  <p className="text-blue-800 dark:text-blue-300 font-semibold">
                    Expected completion: {new Date(maintenanceMode.scheduledEnd).toLocaleString()}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  We apologize for any inconvenience. Please check back shortly.
                </p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                  For urgent matters, please contact us at:{' '}
                  <a href="tel:+4407444358808" className="text-red-600 dark:text-red-400 font-bold hover:underline">
                    07444 358808
                  </a>
                </p>
              </div>
            </div>

            {/* Dismiss Button */}
            <div className="mt-8 text-center">
              <button
                onClick={handleDismiss}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold text-lg rounded-lg hover:from-red-700 hover:to-orange-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                I Understand - Close This Message
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 dark:bg-gray-900 p-4 text-center border-t-2 border-gray-200 dark:border-gray-700">
            <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
              TsvWeb - Professional Web Services
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% {
            border-color: rgb(239, 68, 68);
          }
          50% {
            border-color: rgb(251, 146, 60);
          }
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </>
  )
}
