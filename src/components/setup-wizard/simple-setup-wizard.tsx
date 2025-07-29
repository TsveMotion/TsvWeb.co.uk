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
  { id: 'under-1k', label: 'Under £1,000' },
  { id: '1k-2k', label: '£1,000 - £2,000' },
  { id: '2k-3k', label: '£2,000 - £3,000' },
  { id: '3k-5k', label: '£3,000 - £5,000' },
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
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
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
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {STEPS[currentStep].title}
              </h2>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[500px]">
            {STEPS[currentStep].id === 'welcome' && (
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">TSV</span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Welcome to TsvWeb Development
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  We're a full-service digital agency specializing in creating stunning websites, 
                  boosting your online presence, and driving real business results.
                </p>
              </div>
            )}
            
            {STEPS[currentStep].id === 'services' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Services</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We offer comprehensive digital solutions to help your business succeed online.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Website Development
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Custom websites built with modern technology, optimized for speed and conversions.
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      SEO Optimization
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Improve your search engine rankings and get more organic traffic.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {STEPS[currentStep].id === 'project' && (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Tell Us About Your Project
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    What type of project do you need? *
                  </label>
                  <div className="grid md:grid-cols-2 gap-3">
                    {PROJECT_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => updateData('projectType', type.id)}
                        className={`text-left p-4 rounded-lg border-2 transition-colors ${
                          wizardData.projectType === type.id
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">{type.label}</div>
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
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Contact Information
                  </h3>
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
              <div className="text-center space-y-6">
                <div className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl text-white">✓</span>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Thank You!
                  </h3>
                  <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    We've received your project details and we're excited to work with you! 
                    Our team will review your information and reach out within 24 hours.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Explore Our Work
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {STEPS[currentStep].id !== 'success' && (
            <div className="flex items-center justify-between p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  currentStep === 0
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200'
                }`}
              >
                <ChevronLeftIcon className="w-4 h-4" />
                <span>Back</span>
              </button>

              <div className="text-sm text-gray-500 dark:text-gray-400">
                Step {currentStep + 1} of {STEPS.length}
              </div>

              {STEPS[currentStep].id === 'booking' ? (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                    !isStepValid() || isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit</span>
                      <ChevronRightIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className={`flex items-center space-x-2 px-6 py-2 rounded-lg transition-colors ${
                    !isStepValid()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
