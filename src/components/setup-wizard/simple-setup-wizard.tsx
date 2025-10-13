"use client"

import { useState } from 'react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface WizardData {
  name: string
  email: string
  phone: string
  company: string
  projectType: string
  budget: string
  timeline: string
  goals: string[]
  additionalInfo: string
}

interface SimpleSetupWizardProps {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  { id: 'welcome', title: 'Welcome' },
  { id: 'services', title: 'Our Services' },
  { id: 'project', title: 'Your Project' },
  { id: 'contact', title: 'Contact Info' },
  { id: 'booking', title: 'Book a Call' },
  { id: 'success', title: 'Thank You!' }
]

const PROJECT_TYPES = [
  { id: 'new-website', label: 'New Website' },
  { id: 'redesign', label: 'Website Redesign' },
  { id: 'ecommerce', label: 'E-commerce Store' },
  { id: 'seo', label: 'SEO Optimization' },
  { id: 'marketing', label: 'Digital Marketing' }
]

const BUDGET_RANGES = [
  { id: '30-month', label: '£30/month' },
  { id: '50-month', label: '£50/month' },
  { id: '75-month', label: '£75/month' },
  { id: '100-month', label: '£100/month' },
  { id: 'discuss', label: 'Let\'s Discuss' }
]

const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'ASAP' },
  { id: '1-month', label: '1 Month' },
  { id: '2-3-months', label: '2-3 Months' },
  { id: '3-plus-months', label: '3+ Months' }
]

export default function SimpleSetupWizard({ isOpen, onClose }: SimpleSetupWizardProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [wizardData, setWizardData] = useState<WizardData>({
    name: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    timeline: '',
    goals: [],
    additionalInfo: ''
  })

  const updateData = (field: keyof WizardData, value: string | string[]) => {
    setWizardData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch('/api/wizard-submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wizardData)
      })
      
      if (response.ok) {
        nextStep()
      } else {
        throw new Error('Submission failed')
      }
    } catch (error) {
      console.error('Error submitting wizard:', error)
      alert('There was an error submitting your information. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (STEPS[currentStep].id) {
      case 'project':
        return wizardData.projectType && wizardData.budget && wizardData.timeline
      case 'contact':
        return wizardData.name && wizardData.email
      default:
        return true
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-2 sm:p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl my-4 max-h-[95vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                {STEPS[currentStep].title}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-6 overflow-y-auto flex-1">
            {STEPS[currentStep].id === 'welcome' && (
              <div className="text-center space-y-4 sm:space-y-6 py-4 sm:py-6">
                <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-full flex items-center justify-center shadow-xl">
                  <span className="text-2xl sm:text-3xl font-bold text-white">TSV</span>
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white px-2">
                    Get Your Website in <span className="text-[#007BFF]">3-5 Days</span>
                  </h3>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-4">
                    Join <span className="font-semibold text-[#007BFF]">500+ Birmingham businesses</span> who trust TsvWeb. 
                    Professional websites from <span className="font-semibold">£30/month</span> with zero upfront costs.
                  </p>
                </div>

                {/* Trust Indicators */}
                <div className="flex flex-wrap justify-center gap-3 sm:gap-6 pt-2 px-2">
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">No Upfront Costs</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Fast Delivery</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">24/7 Support</span>
                  </div>
                </div>

                {/* Social Proof */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 sm:p-6 max-w-2xl mx-auto">
                  <div className="flex items-center justify-center space-x-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 italic">
                    "TsvWeb delivered our restaurant website in 4 days. Online orders increased by 40% in the first month!"
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
                    — Sarah M., Restaurant Owner, Birmingham
                  </p>
                </div>
              </div>
            )}
            
            {STEPS[currentStep].id === 'services' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
                    What We'll Deliver For You
                  </h3>
                  <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 px-4">
                    Everything you need to succeed online, all in one package
                  </p>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 max-w-4xl mx-auto">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-[#007BFF]/20">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                          Professional Website
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                          Mobile-responsive, fast-loading, and conversion-optimized.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-[#007BFF]/20">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                          SEO Optimization
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                          Rank higher on Google. Get found by customers.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-[#007BFF]/20">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                          Mobile-First Design
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                          Looks perfect on every device.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-4 border-2 border-[#007BFF]/20">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-[#007BFF] rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1">
                          Ongoing Support
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                          24/7 support, free updates, and hosting included.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limited Time Offer */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-4 max-w-2xl mx-auto text-center">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-bold text-orange-600 dark:text-orange-400">LIMITED OFFER</span>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-medium">
                    Book this week and get <span className="text-orange-600 dark:text-orange-400 font-bold">FREE logo design</span> (worth £50)!
                  </p>
                </div>
              </div>
            )}
            
            {STEPS[currentStep].id === 'project' && (
              <div className="space-y-4 sm:space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 px-2">
                    Let's Find Your Perfect Solution
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4">
                    Tell us what you need and we'll create a custom plan for you
                  </p>
                </div>

                <div>
                  <label className="block text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    What type of project do you need? *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2 sm:gap-3">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => updateData('projectType', type.id)}
                        className={`text-left p-3 sm:p-4 rounded-lg border-2 transition-colors ${
                          wizardData.projectType === type.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm sm:text-base text-gray-900 dark:text-white">{type.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What's your budget range? *
                  </label>
                  <div className="space-y-2">
                    {BUDGET_RANGES.map((budget) => (
                      <button
                        key={budget.id}
                        onClick={() => updateData('budget', budget.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${
                          wizardData.budget === budget.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{budget.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What's your timeline? *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {TIMELINE_OPTIONS.map((timeline) => (
                      <button
                        key={timeline.id}
                        onClick={() => updateData('timeline', timeline.id)}
                        className={`text-left p-3 rounded-lg border transition-colors ${
                          wizardData.timeline === timeline.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{timeline.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {STEPS[currentStep].id === 'contact' && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Almost There! 🎉
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400">
                    Enter your details to get your <span className="font-semibold text-[#007BFF]">FREE consultation</span> and custom quote
                  </p>
                  
                  {/* Trust Badge */}
                  <div className="inline-flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      Your information is 100% secure
                    </span>
                  </div>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={wizardData.name}
                      onChange={(e) => updateData('name', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={wizardData.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      placeholder="john@example.com"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={wizardData.company}
                      onChange={(e) => updateData('company', e.target.value)}
                      placeholder="Your Company"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {STEPS[currentStep].id === 'booking' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Almost Done!
                  </h3>
                </div>

                <div className="max-w-2xl mx-auto">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Project Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Name:</span> {wizardData.name}</div>
                      <div><span className="font-medium">Email:</span> {wizardData.email}</div>
                      <div><span className="font-medium">Project Type:</span> {PROJECT_TYPES.find(t => t.id === wizardData.projectType)?.label}</div>
                      <div><span className="font-medium">Budget:</span> {BUDGET_RANGES.find(b => b.id === wizardData.budget)?.label}</div>
                      <div><span className="font-medium">Timeline:</span> {TIMELINE_OPTIONS.find(t => t.id === wizardData.timeline)?.label}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Additional Information (Optional)
                    </label>
                    <textarea
                      value={wizardData.additionalInfo}
                      onChange={(e) => updateData('additionalInfo', e.target.value)}
                      placeholder="Tell us more about your project..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent dark:bg-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {STEPS[currentStep].id === 'success' && (
              <div className="text-center space-y-8 py-8">
                <div className="mx-auto w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                  <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-4xl font-bold text-gray-900 dark:text-white">
                    🎉 You're All Set!
                  </h3>
                  <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    <span className="font-semibold text-[#007BFF]">Congratulations!</span> We've received your request and our team is already reviewing it.
                  </p>
                </div>

                {/* What Happens Next */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 max-w-2xl mx-auto text-left">
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
                    What Happens Next?
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007BFF] rounded-full flex items-center justify-center text-white font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">We'll call you within 24 hours</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Our team will reach out to discuss your project in detail</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007BFF] rounded-full flex items-center justify-center text-white font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Get your custom quote</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Transparent pricing tailored to your needs</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#007BFF] rounded-full flex items-center justify-center text-white font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">Your website goes live in 3-5 days</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Fast turnaround, professional results</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgency Element */}
                <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-xl p-6 max-w-2xl mx-auto">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    ⚡ <span className="font-bold">Limited slots available!</span> We only take on 10 new projects per month to ensure quality. 
                    You're currently <span className="text-orange-600 dark:text-orange-400 font-bold">spot #3</span> in the queue.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <a
                    href="/portfolio"
                    className="px-8 py-4 bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-semibold rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-center"
                  >
                    Explore Our Portfolio
                  </a>
                  <a
                    href="tel:+4407444358808"
                    className="px-8 py-4 bg-white border-2 border-[#007BFF] text-[#007BFF] font-semibold rounded-full hover:bg-[#007BFF] hover:text-white transition-all duration-300 text-center"
                  >
                    Call Us Now
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {STEPS[currentStep].id !== 'success' && (
            <div className="flex items-center justify-between p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {STEPS.length}
              </div>

              {STEPS[currentStep].id === 'booking' ? (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                    !isStepValid() || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span className="hidden sm:inline">Get My FREE Quote 🚀</span>
                      <span className="sm:hidden">Get Quote 🚀</span>
                      <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center space-x-1 sm:space-x-2 px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
                    !isStepValid()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white hover:shadow-lg transform hover:scale-105'
                  }`}
                >
                  <span>Continue</span>
                  <ChevronRightIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
