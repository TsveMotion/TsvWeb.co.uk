"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  name: string
  email: string
  phone: string
  company: string
  subject: string
  message: string
  projectType: string
  budget: string
  timeframe: string
  newsletter: boolean
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  
  const { 
    register, 
    handleSubmit, 
    reset,
    formState: { errors } 
  } = useForm<FormData>()
  
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setError('')
    
    try {
      // Send data to the API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          subject: data.subject || 'Website Inquiry',
          message: data.message,
          phone: data.phone || '',
          // Include additional fields if needed
          company: data.company || '',
          projectType: data.projectType || '',
          budget: data.budget || '',
          timeframe: data.timeframe || '',
          newsletter: data.newsletter || false
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Something went wrong')
      }
      
      setIsSubmitted(true)
      reset()
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.')
      console.error('Form submission error:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-900">
        <svg className="w-12 h-12 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-2">Thank You!</h3>
        <p className="text-gray-700 dark:text-gray-300 text-center mb-6">
          Your message has been sent successfully. We'll get back to you as soon as possible.
        </p>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="w-full btn-primary"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-md border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.name ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder="Your name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
              errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
            }`}
            placeholder="your.email@example.com"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              }
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Your phone number"
            {...register('phone')}
          />
        </div>

        {/* Company */}
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Company
          </label>
          <input
            id="company"
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            placeholder="Your company name"
            {...register('company')}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          type="text"
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.subject ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
          placeholder="What is your inquiry about?"
          {...register('subject', { required: 'Subject is required' })}
        />
        {errors.subject && (
          <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
        )}
      </div>

      {/* Project Type */}
      <div>
        <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project Type
        </label>
        <select
          id="projectType"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          {...register('projectType')}
        >
          <option value="">Select project type</option>
          <option value="website-design">Website Design</option>
          <option value="website-redesign">Website Redesign</option>
          <option value="e-commerce">E-commerce Website</option>
          <option value="web-application">Web Application</option>
          <option value="seo">SEO Services</option>
          <option value="maintenance">Website Maintenance</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Budget */}
      <div>
        <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Budget Range
        </label>
        <select
          id="budget"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          {...register('budget')}
        >
          <option value="">Select budget range</option>
          <option value="less-than-1000">Less than $1,000</option>
          <option value="1000-5000">$1,000 - $5,000</option>
          <option value="5000-10000">$5,000 - $10,000</option>
          <option value="10000-20000">$10,000 - $20,000</option>
          <option value="more-than-20000">More than $20,000</option>
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      {/* Timeframe */}
      <div>
        <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Project Timeframe
        </label>
        <select
          id="timeframe"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          {...register('timeframe')}
        >
          <option value="">Select timeframe</option>
          <option value="asap">As soon as possible</option>
          <option value="1-month">Within 1 month</option>
          <option value="1-3-months">1-3 months</option>
          <option value="3-6-months">3-6 months</option>
          <option value="not-sure">Not sure yet</option>
        </select>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          rows={5}
          className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-royal-blue focus:border-royal-blue dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
            errors.message ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
          }`}
          placeholder="Tell us about your project or inquiry..."
          {...register('message', { required: 'Message is required' })}
        ></textarea>
        {errors.message && (
          <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            id="newsletter"
            type="checkbox"
            className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-royal-blue dark:bg-gray-800 dark:border-gray-700"
            {...register('newsletter')}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="newsletter" className="text-gray-700 dark:text-gray-300">
            Subscribe to our newsletter for web design tips and industry insights
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full btn-primary ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </span>
          ) : (
            'Send Message'
          )}
        </button>
      </div>
    </form>
  )
}
