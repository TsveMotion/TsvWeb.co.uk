'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import PageSEO from '@/components/seo/page-seo';

interface ServiceOption {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  oneOffPrice: number;
  icon: string;
}

const serviceOptions: ServiceOption[] = [
  {
    id: 'wordpress-website',
    name: 'WordPress Website & Hosting',
    description: 'WordPress website with modern design, hosting included',
    monthlyPrice: 30,
    oneOffPrice: 295,
    icon: '🌐',
  },
  {
    id: 'wordpress-ecommerce',
    name: 'WordPress E-commerce',
    description: 'WooCommerce store with payment gateway and shop setup',
    monthlyPrice: 50,
    oneOffPrice: 395,
    icon: '🛒',
  },
  {
    id: 'wordpress-booking',
    name: 'WordPress Booking Site',
    description: 'Booking website for barbers, salons, or service businesses',
    monthlyPrice: 45,
    oneOffPrice: 0,
    icon: '📅',
  },
  {
    id: 'wordpress-portfolio',
    name: 'WordPress Portfolio',
    description: 'Portfolio website with beautiful galleries and SEO',
    monthlyPrice: 35,
    oneOffPrice: 0,
    icon: '🎨',
  },
  {
    id: 'seo',
    name: 'SEO Optimisation',
    description: 'Full on-page optimisation, speed, tags, and ranking improvements',
    monthlyPrice: 0,
    oneOffPrice: 100,
    icon: '📈',
  },
  {
    id: 'logo-design',
    name: 'Logo Design',
    description: 'Professional logo with 3 concept options and revisions',
    monthlyPrice: 0,
    oneOffPrice: 50,
    icon: '🎯',
  },
  {
    id: 'branding-pack',
    name: 'Business Cards & Branding Pack',
    description: 'Matching business card, letterhead, and social media kit',
    monthlyPrice: 0,
    oneOffPrice: 75,
    icon: '💼',
  },
  {
    id: 'google-ads',
    name: 'Google & Meta Ads Management',
    description: 'Monthly ad campaign setup and management',
    monthlyPrice: 150,
    oneOffPrice: 0,
    icon: '📱',
  },
];

export default function QuotePage() {
  const { slug } = useParams();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    website: '',
    industry: '',
    selectedServices: [] as string[],
    additionalRequirements: '',
  });
  
  const [estimatedCost, setEstimatedCost] = useState({
    monthly: 0,
    oneOff: 0,
  });

  // Calculate costs when services change
  useEffect(() => {
    const monthly = formData.selectedServices.reduce((total, serviceId) => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return total + (service?.monthlyPrice || 0);
    }, 0);

    const oneOff = formData.selectedServices.reduce((total, serviceId) => {
      const service = serviceOptions.find(s => s.id === serviceId);
      return total + (service?.oneOffPrice || 0);
    }, 0);

    setEstimatedCost({ monthly, oneOff });
  }, [formData.selectedServices]);

  const handleServiceToggle = (serviceId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedServices: prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter(id => id !== serviceId)
        : [...prev.selectedServices, serviceId],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/get-quote/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          services: formData.selectedServices,
          estimatedCost,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setStep(3); // Success step
      } else {
        alert('Failed to submit quote. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <PageSEO 
        title="Get Your Custom Quote - TsvWeb"
        description="Get a personalized quote for your web design and development project in Birmingham"
        canonical={`https://tsvweb.com/quote/${slug}`}
      />
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 md:py-32 flex-grow">
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Business Info</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full transition-all duration-500 ${step >= 2 ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'}`}></div>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Select Services</span>
            </div>
            <div className="flex-1 h-1 mx-4 bg-gray-200">
              <div className={`h-full transition-all duration-500 ${step >= 3 ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'}`}></div>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 font-medium hidden sm:inline">Get Quote</span>
            </div>
          </div>
        </div>

        {/* Step 1: Business Information */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                  Tell Us About Your Business
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  Help us understand your needs better
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="e.g., Birmingham Plumbing Services"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Current Website (if any)
                  </label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Industry / Business Type *
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                    required
                  >
                    <option value="">Select your industry...</option>
                    <option value="restaurant">Restaurant / Café</option>
                    <option value="trades">Trades (Plumber, Electrician, etc.)</option>
                    <option value="barber">Barber / Hair Salon</option>
                    <option value="retail">Retail / E-commerce</option>
                    <option value="professional">Professional Services</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="construction">Construction / Building</option>
                    <option value="cleaning">Cleaning Services</option>
                    <option value="removals">Removals / Moving</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    if (formData.businessName && formData.industry) {
                      setStep(2);
                    } else {
                      alert('Please fill in all required fields');
                    }
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Continue to Services →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Services */}
        {step === 2 && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
                What Services Do You Need?
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Select all that apply - we'll calculate your custom pricing
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {serviceOptions.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                    formData.selectedServices.includes(service.id)
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg scale-105'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 hover:shadow-md'
                  }`}
                >
                  <div className="text-4xl mb-3">{service.icon}</div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {service.description}
                  </p>
                  <div className="space-y-1">
                    {service.monthlyPrice > 0 && (
                      <p className="text-sm font-semibold text-blue-600">
                        £{service.monthlyPrice}/month
                      </p>
                    )}
                    {service.oneOffPrice > 0 && (
                      <p className="text-sm font-semibold text-green-600">
                        £{service.oneOffPrice} one-off
                      </p>
                    )}
                  </div>
                  {formData.selectedServices.includes(service.id) && (
                    <div className="mt-3 flex items-center text-blue-600 font-semibold">
                      <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Selected
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Additional Requirements */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-100 dark:border-gray-700">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                📝 Any specific requirements or features you need?
              </label>
              <textarea
                value={formData.additionalRequirements}
                onChange={(e) => setFormData({ ...formData, additionalRequirements: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-blue-600 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
                rows={4}
                placeholder="e.g., Online booking system, payment integration, multilingual support..."
              />
            </div>

            {/* Price Summary */}
            {formData.selectedServices.length > 0 && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-white mb-8">
                <h3 className="text-2xl font-bold mb-6 text-center">💰 Your Estimated Investment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-blue-100 mb-2">Monthly Package</p>
                    <p className="text-4xl font-bold">£{estimatedCost.monthly}</p>
                    <p className="text-sm text-blue-100 mt-2">per month</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <p className="text-sm font-medium text-blue-100 mb-2">One-Off Payment</p>
                    <p className="text-4xl font-bold">£{estimatedCost.oneOff}</p>
                    <p className="text-sm text-blue-100 mt-2">setup & development</p>
                  </div>
                </div>
                <p className="text-center text-sm text-blue-100 mt-6">
                  ✨ Final pricing may vary based on your specific requirements
                </p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={formData.selectedServices.length === 0 || loading}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? 'Submitting...' : 'Get My Quote →'}
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Thank You!
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                We've received your quote request and will be in touch within 24 hours with a detailed proposal.
              </p>
              
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3">📧 What's Next?</h3>
                <ul className="text-left space-y-2 text-gray-700 dark:text-gray-300">
                  <li>✅ Check your email for confirmation</li>
                  <li>✅ Our team will review your requirements</li>
                  <li>✅ You'll receive a detailed proposal within 24 hours</li>
                  <li>✅ We'll schedule a free consultation call</li>
                </ul>
              </div>

              <div className="space-y-4">
                <a
                  href="/"
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Back to Homepage
                </a>
                <a
                  href="/portfolio"
                  className="block w-full bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200"
                >
                  View Our Portfolio
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
