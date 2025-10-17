"use client"

import { useState } from 'react'
import withAdminAuth from '@/components/admin/with-admin-auth'
import {
  RocketLaunchIcon,
  UserGroupIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'
import PresentationView from '@/components/admin/lead-generation/PresentationView'
import CRMView from '@/components/admin/lead-generation/CRMView'

function LeadGenerationPage() {
  const [activeTab, setActiveTab] = useState<'presentation' | 'crm'>('crm')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Gradient */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <RocketLaunchIcon className="h-10 w-10" />
                  <h1 className="text-3xl font-bold">Lead Generation</h1>
                </div>
                <p className="text-blue-100 text-lg">
                  Showcase TsvWeb and manage your sales pipeline
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('crm')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'crm'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <UserGroupIcon className="h-5 w-5 mr-2" />
                CRM Dashboard
              </button>
              <button
                onClick={() => setActiveTab('presentation')}
                className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'presentation'
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <PresentationChartLineIcon className="h-5 w-5 mr-2" />
                Client Presentation
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'crm' && <CRMView />}
        {activeTab === 'presentation' && <PresentationView />}
      </div>
    </div>
  )
}

export default withAdminAuth(LeadGenerationPage)
