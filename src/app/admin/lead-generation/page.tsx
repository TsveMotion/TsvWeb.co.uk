"use client"

import withAdminAuth from '@/components/admin/with-admin-auth'
import { RocketLaunchIcon } from '@heroicons/react/24/outline'
import CRMView from '@/components/admin/lead-generation/CRMView'

function LeadGenerationPage() {
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
                  Manage your sales pipeline and track leads
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CRM Content */}
        <CRMView />
      </div>
    </div>
  )
}

export default withAdminAuth(LeadGenerationPage)
