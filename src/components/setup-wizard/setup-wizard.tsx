"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { ProjectStep, ContactStep, BookingStep, SuccessStep } from './wizard-steps'

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

interface SetupWizardProps {
  isOpen: boolean
  onClose: () => void
}

const STEPS = [
  { id: 'welcome', title: 'Welcome', subtitle: 'Discover TsvWeb Development' },
  { id: 'services', title: 'Our Services', subtitle: 'What we can do for you' },
  { id: 'project', title: 'Your Project', subtitle: 'Tell us about your needs' },
  { id: 'contact', title: 'Contact Info', subtitle: 'How can we reach you?' },
  { id: 'booking', title: 'Book a Call', subtitle: 'Schedule your consultation' },
  { id: 'success', title: 'Thank You!', subtitle: 'We\'ll be in touch soon' }
]

const PROJECT_TYPES = [
  { id: 'new-website', label: 'New Website', description: 'Build a brand new website from scratch' },
  { id: 'redesign', label: 'Website Redesign', description: 'Modernize your existing website' },
  { id: 'ecommerce', label: 'E-commerce Store', description: 'Online store with payment integration' },
  { id: 'seo', label: 'SEO Optimization', description: 'Improve search engine rankings' },
  { id: 'marketing', label: 'Digital Marketing', description: 'Comprehensive marketing strategy' },
  { id: 'maintenance', label: 'Website Maintenance', description: 'Ongoing support and updates' }
]

const BUDGET_RANGES = [
  { id: '30-month', label: '£30/month', description: 'Basic WordPress websites and maintenance' },
  { id: '50-month', label: '£50/month', description: 'Professional WordPress websites with custom features' },
  { id: '75-month', label: '£75/month', description: 'Complex WordPress websites and e-commerce stores' },
  { id: '100-month', label: '£100/month', description: 'Enterprise WordPress solutions and comprehensive services' },
  { id: 'discuss', label: 'Let\'s Discuss', description: 'I\'d prefer to talk about budget during our call' }
]

const TIMELINE_OPTIONS = [
  { id: 'asap', label: 'ASAP', description: 'I need this completed urgently' },
  { id: '1-month', label: '1 Month', description: 'Within the next month' },
  { id: '2-3-months', label: '2-3 Months', description: 'I have some flexibility' },
  { id: '3-plus-months', label: '3+ Months', description: 'No rush, quality is key' },
  { id: 'flexible', label: 'Flexible', description: 'Timeline is open for discussion' }
]

const GOAL_OPTIONS = [
  'Increase online visibility',
  'Generate more leads',
  'Improve user experience',
  'Boost online sales',
  'Build brand credibility',
  'Modernize current website'
]

export default function SetupWizard({ isOpen, onClose }: SetupWizardProps) {
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
        headers: {
          'Content-Type': 'application/json'
        },
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

  const toggleGoal = (goal: string) => {
    const currentGoals = wizardData.goals
    if (currentGoals.includes(goal)) {
      updateData('goals', currentGoals.filter(g => g !== goal))
    } else {
      updateData('goals', [...currentGoals, goal])
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {STEPS.map((step, index) => (
                  <div
                    key={step.id}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index <= currentStep
                        ? 'bg-royal-blue'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {STEPS[currentStep].title}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {STEPS[currentStep].subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {STEPS[currentStep].id === 'welcome' && (
                  <WelcomeStep />
                )}
                
                {STEPS[currentStep].id === 'services' && (
                  <ServicesStep />
                )}
                
                {STEPS[currentStep].id === 'project' && (
                  <ProjectStep
                    data={wizardData}
                    updateData={updateData}
                    toggleGoal={toggleGoal}
                  />
                )}
                
                {STEPS[currentStep].id === 'contact' && (
                  <ContactStep
                    data={wizardData}
                    updateData={updateData}
                  />
                )}
                
                {STEPS[currentStep].id === 'booking' && (
                  <BookingStep
                    data={wizardData}
                    updateData={updateData}
                  />
                )}
                
                {STEPS[currentStep].id === 'success' && (
                  <SuccessStep onClose={onClose} />
                )}
              </motion.div>
            </AnimatePresence>
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
                      : 'bg-royal-blue text-white hover:bg-blue-700'
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
                      : 'bg-royal-blue text-white hover:bg-blue-700'
                  }`}
                >
                  <span>Next</span>
                  <ChevronRightIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

// Step Components
function WelcomeStep() {
  return (
    <div className="text-center space-y-6">
      <div className="mx-auto w-24 h-24 bg-gradient-to-br from-royal-blue to-blue-600 rounded-full flex items-center justify-center">
        <span className="text-3xl font-bold text-white">TSV</span>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome to TsvWeb Development
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We're a full-service digital agency specializing in creating stunning websites, 
          boosting your online presence, and driving real business results through expert 
          SEO and digital marketing strategies.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-royal-blue rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold">🚀</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">Fast & Modern</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Lightning-fast websites built with the latest technology</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-royal-blue rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold">📈</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">SEO Optimized</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Rank higher on Google and get more organic traffic</p>
        </div>
        
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-royal-blue rounded-lg mx-auto mb-3 flex items-center justify-center">
            <span className="text-white font-bold">💼</span>
          </div>
          <h4 className="font-semibold text-gray-900 dark:text-white">Business Growth</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">Convert visitors into customers with proven strategies</p>
        </div>
      </div>
    </div>
  )
}

function ServicesStep() {
  const services = [
    {
      title: 'Website Development',
      description: 'Custom websites built with modern technology, optimized for speed and conversions.',
      features: ['Responsive Design', 'Fast Loading', 'SEO Ready', 'Mobile Optimized']
    },
    {
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings and get more organic traffic to your website.',
      features: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Local SEO']
    },
    {
      title: 'Digital Marketing',
      description: 'Comprehensive marketing strategies to grow your online presence and drive sales.',
      features: ['Social Media Marketing', 'Content Strategy', 'PPC Advertising', 'Email Marketing']
    },
    {
      title: 'E-commerce Solutions',
      description: 'Complete online stores with payment processing, inventory management, and more.',
      features: ['Payment Integration', 'Inventory Management', 'Order Processing', 'Analytics']
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Our Services
        </h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We offer comprehensive digital solutions to help your business succeed online. 
          From stunning websites to powerful marketing campaigns, we've got you covered.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6"
          >
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {service.title}
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {service.description}
            </p>
            <ul className="space-y-1">
              {service.features.map((feature) => (
                <li key={feature} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <span className="w-2 h-2 bg-royal-blue rounded-full mr-2"></span>
                  {feature}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
