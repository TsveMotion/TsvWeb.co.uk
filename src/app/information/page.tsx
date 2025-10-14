"use client"

import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'
import { informationPages } from '@/data/information-pages'

export default function InformationHub() {
  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 dark:text-white mb-6">
              Web Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#0056D2]">Information Hub</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
              Everything you need to know about web development, design, SEO, and digital marketing for your Birmingham business
            </p>
          </motion.div>
        </div>
      </section>

      {/* Information Cards Grid */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                Browse Our <span className="text-[#007BFF]">Guides</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Click any topic to learn more
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {informationPages.map((page, index) => (
                <Link
                  key={index}
                  href={`/information/${page.slug}`}
                  className="group"
                >
                  <motion.div
                    className="bg-blue-50 dark:bg-gray-800 p-8 rounded-lg border-2 border-transparent hover:border-[#007BFF] hover:shadow-xl transition-all duration-300 h-full"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">
                      {page.icon}
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3 group-hover:text-[#007BFF] transition-colors">
                      {page.title}
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {page.description}
                    </p>
                    <div className="flex items-center gap-2 text-[#007BFF] font-bold">
                      Learn More
                      <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Read Our Guides Section */}
      <section className="py-16 bg-blue-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <motion.div 
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
                Why Read Our <span className="text-[#007BFF]">Guides?</span>
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Birmingham-Focused',
                  description: 'All our guides are tailored for Birmingham and West Midlands businesses'
                },
                {
                  icon: '💡',
                  title: 'Practical Advice',
                  description: 'Real-world tips and strategies that actually work for local businesses'
                },
                {
                  icon: '📈',
                  title: 'Results-Driven',
                  description: 'Learn techniques that help you get more customers and grow your business'
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  className="bg-white dark:bg-gray-900 p-8 rounded-lg border-2 border-[#007BFF] text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="text-6xl mb-4">{benefit.icon}</div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {benefit.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-[#007BFF] to-[#0056D2]">
        <div className="container-custom">
          <motion.div 
            className="max-w-3xl mx-auto text-center text-white"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black mb-6">
              Need Professional Help?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let our experts handle your web development, design, and SEO needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="inline-block bg-white text-[#007BFF] font-black text-xl px-12 py-5 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase"
              >
                Get Free Quote
              </Link>
              <a
                href="tel:+4407444358808"
                className="inline-block bg-white/10 backdrop-blur-sm text-white font-black text-xl px-12 py-5 rounded-lg hover:bg-white/20 transition-all duration-300 uppercase border-2 border-white"
              >
                Call: 07444 358808
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
