"use client"

import { motion } from 'framer-motion'

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
  'Modernize current website',
  'Improve search rankings',
  'Mobile optimization',
  'Speed optimization',
  'Social media integration'
]

interface ProjectStepProps {
  data: WizardData
  updateData: (field: keyof WizardData, value: string | string[]) => void
  toggleGoal: (goal: string) => void
}

export function ProjectStep({ data, updateData, toggleGoal }: ProjectStepProps) {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Tell Us About Your Project
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Help us understand your needs so we can provide the best solution for your business.
        </p>
      </div>

      {/* Project Type */}
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
                data.projectType === type.id
                  ? 'border-royal-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">{type.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{type.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Budget */}
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
                data.budget === budget.id
                  ? 'border-royal-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">{budget.label}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{budget.description}</div>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  data.budget === budget.id ? 'border-royal-blue bg-royal-blue' : 'border-gray-300'
                }`}>
                  {data.budget === budget.id && (
                    <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
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
                data.timeline === timeline.id
                  ? 'border-royal-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="font-medium text-gray-900 dark:text-white">{timeline.label}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">{timeline.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Goals */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          What are your main goals? (Select all that apply)
        </label>
        <div className="grid md:grid-cols-2 gap-2">
          {GOAL_OPTIONS.map((goal) => (
            <button
              key={goal}
              onClick={() => toggleGoal(goal)}
              className={`text-left p-3 rounded-lg border transition-colors ${
                data.goals.includes(goal)
                  ? 'border-royal-blue bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded border mr-3 flex items-center justify-center ${
                  data.goals.includes(goal) ? 'border-royal-blue bg-royal-blue' : 'border-gray-300'
                }`}>
                  {data.goals.includes(goal) && (
                    <span className="text-white text-xs">✓</span>
                  )}
                </div>
                <span className="text-sm text-gray-900 dark:text-white">{goal}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface ContactStepProps {
  data: WizardData
  updateData: (field: keyof WizardData, value: string) => void
}

export function ContactStep({ data, updateData }: ContactStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Contact Information
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Let us know how to reach you so we can discuss your project in detail.
        </p>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Full Name *
          </label>
          <input
            type="text"
            value={data.name}
            onChange={(e) => updateData('name', e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => updateData('email', e.target.value)}
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Phone Number (Optional)
          </label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateData('phone', e.target.value)}
            placeholder="+1 (555) 123-4567"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Company Name (Optional)
          </label>
          <input
            type="text"
            value={data.company}
            onChange={(e) => updateData('company', e.target.value)}
            placeholder="Your Company"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
    </div>
  )
}

interface BookingStepProps {
  data: WizardData
  updateData: (field: keyof WizardData, value: string) => void
}

export function BookingStep({ data, updateData }: BookingStepProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Almost Done!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us anything else about your project and we'll schedule a call to discuss the details.
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Project Summary</h4>
          <div className="space-y-2 text-sm">
            <div><span className="font-medium">Name:</span> {data.name}</div>
            <div><span className="font-medium">Email:</span> {data.email}</div>
            {data.company && <div><span className="font-medium">Company:</span> {data.company}</div>}
            <div><span className="font-medium">Project Type:</span> {PROJECT_TYPES.find(t => t.id === data.projectType)?.label}</div>
            <div><span className="font-medium">Budget:</span> {BUDGET_RANGES.find(b => b.id === data.budget)?.label}</div>
            <div><span className="font-medium">Timeline:</span> {TIMELINE_OPTIONS.find(t => t.id === data.timeline)?.label}</div>
            {data.goals.length > 0 && (
              <div><span className="font-medium">Goals:</span> {data.goals.join(', ')}</div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Additional Information (Optional)
          </label>
          <textarea
            value={data.additionalInfo}
            onChange={(e) => updateData('additionalInfo', e.target.value)}
            placeholder="Tell us more about your project, specific requirements, or any questions you have..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-royal-blue focus:border-transparent dark:bg-gray-800 dark:text-white"
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h5 className="font-medium text-gray-900 dark:text-white mb-2">What happens next?</h5>
          <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
            <li>• We'll review your project details</li>
            <li>• Our team will reach out within 24 hours</li>
            <li>• We'll schedule a free consultation call</li>
            <li>• You'll receive a custom proposal</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

interface SuccessStepProps {
  onClose: () => void
}

export function SuccessStep({ onClose }: SuccessStepProps) {
  return (
    <div className="text-center space-y-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="mx-auto w-24 h-24 bg-green-500 rounded-full flex items-center justify-center"
      >
        <span className="text-4xl">✓</span>
      </motion.div>
      
      <div className="space-y-4">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
          Thank You!
        </h3>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          We've received your project details and we're excited to work with you! 
          Our team will review your information and reach out within 24 hours to schedule your free consultation.
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">What's Next?</h4>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-royal-blue rounded-full flex items-center justify-center text-white text-xs mr-3">1</div>
            <span>Project review by our expert team</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-royal-blue rounded-full flex items-center justify-center text-white text-xs mr-3">2</div>
            <span>Free consultation call within 24 hours</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-royal-blue rounded-full flex items-center justify-center text-white text-xs mr-3">3</div>
            <span>Custom proposal and timeline</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 bg-royal-blue rounded-full flex items-center justify-center text-white text-xs mr-3">4</div>
            <span>Project kickoff and development</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          In the meantime, feel free to check out our portfolio and recent work.
        </p>
        <button
          onClick={onClose}
          className="bg-royal-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Our Work
        </button>
      </div>
    </div>
  )
}
