"use client"

import { motion } from 'framer-motion'

interface Package {
  name: string
  price: string
  period: string
  setup: string
  description: string
  features: string[]
  cta: string
  popular: boolean
}

interface PricingSectionProps {
  packages: Package[]
}

export default function PricingSection({ packages }: PricingSectionProps) {
  return (
    <section id="packages" className="py-24 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Packages</span>
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Choose the perfect package for your project
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <motion.div
              key={index}
              className={`relative p-8 rounded-2xl ${
                pkg.popular 
                  ? 'bg-gradient-to-br from-indigo-600 to-pink-600 text-white shadow-2xl scale-105' 
                  : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-black">
                  MOST POPULAR
                </div>
              )}
              
              <h3 className={`text-3xl font-black mb-2 ${pkg.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {pkg.name}
              </h3>
              <p className={`mb-4 ${pkg.popular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                {pkg.description}
              </p>
              
              <div className="mb-2">
                <span className="text-5xl font-black">{pkg.price}</span>
                <span className={`text-xl ${pkg.popular ? 'text-indigo-100' : 'text-gray-600 dark:text-gray-400'}`}>
                  {pkg.period}
                </span>
              </div>
              <p className={`mb-8 text-sm ${pkg.popular ? 'text-indigo-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {pkg.setup}
              </p>

              <ul className="space-y-4 mb-8">
                {pkg.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <svg className={`w-6 h-6 flex-shrink-0 ${pkg.popular ? 'text-yellow-300' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className={pkg.popular ? 'text-white' : 'text-gray-700 dark:text-gray-300'}>{feature}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`block w-full text-center font-black text-lg px-8 py-4 rounded-lg transition-all duration-300 ${
                  pkg.popular
                    ? 'bg-white text-indigo-600 hover:bg-gray-100'
                    : 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white hover:shadow-xl'
                }`}
              >
                {pkg.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
