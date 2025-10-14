"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import SimpleSetupWizard from '@/components/setup-wizard/simple-setup-wizard'

export default function EcommercePage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    businessType: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="E-Commerce Web Design Birmingham | Online Store Websites That Sell"
        description="Professional e-commerce website design in Birmingham. Fast, secure online stores built to convert. Shopify alternatives, custom solutions. Get your free quote today!"
        canonical="https://tsvweb.com/ecommerce"
        keywords="ecommerce web design Birmingham, online store website design Birmingham, shopify alternatives Birmingham, sell online Birmingham, ecommerce website builder Birmingham, online shop design Birmingham, Birmingham ecommerce developers"
        openGraph={{
          title: "E-Commerce Websites That Actually Sell | Birmingham Web Design",
          description: "Lightning-fast e-commerce websites built for Birmingham businesses. SEO-ready, secure checkout, mobile-first design. Start selling online today!",
          url: "https://tsvweb.com/ecommerce",
          type: "website",
          images: [{
            url: "https://tsvweb.com/ecommerce.png",
            width: 1200,
            height: 630,
            alt: "Birmingham E-Commerce Website Design"
          }]
        }}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          "serviceType": "E-Commerce Website Design & Development",
          "provider": {
            "@type": "Organization",
            "name": "TsvWeb",
            "url": "https://tsvweb.com",
            "telephone": "+44-07444-358808",
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Birmingham",
              "addressCountry": "GB"
            }
          },
          "areaServed": {
            "@type": "City",
            "name": "Birmingham"
          },
          "description": "Professional e-commerce website design for Birmingham businesses. Fast, secure online stores with SEO optimization, mobile-first design, and conversion-focused features."
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-white via-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              E-Commerce Websites <br />That <span className="text-[#007BFF]">Actually Sell</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
              Lightning-fast performance. SEO-ready design. Secure checkout. <br className="hidden md:block" />
              We build online stores that turn browsers into buyers.
            </p>
            <button
              onClick={() => setIsWizardOpen(true)}
              className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-bold text-lg px-10 py-5 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              Get Your Free Quote
            </button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Lightning-Fast Performance",
                description: "Your store loads in under 2 seconds. Fast sites = more sales. We optimize every pixel for speed.",
                icon: "⚡"
              },
              {
                title: "SEO-Ready Design",
                description: "Rank higher on Google from day one. Built-in SEO means customers find you before your competitors.",
                icon: "🔍"
              },
              {
                title: "Secure Checkout",
                description: "SSL encryption, PCI compliance, and secure payment gateways. Your customers' data is protected.",
                icon: "🔒"
              },
              {
                title: "Mobile-First Builds",
                description: "80% of shoppers browse on mobile. Your store looks perfect on every device, every time.",
                icon: "📱"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl hover:shadow-xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Stores We've Built
            </h2>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Real Birmingham businesses. Real results.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Fashion Boutique",
                description: "Modern clothing store with 500+ products",
                result: "£50k revenue in first 3 months"
              },
              {
                name: "Health & Beauty",
                description: "Organic skincare e-commerce platform",
                result: "2,000+ monthly visitors"
              },
              {
                name: "Home Decor",
                description: "Furniture & accessories online store",
                result: "300% increase in sales"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="h-64 bg-gradient-to-br from-[#007BFF] to-[#0056D2] flex items-center justify-center">
                  <span className="text-white text-6xl">🛍️</span>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.name}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{item.description}</p>
                  <div className="flex items-center text-green-600 dark:text-green-400 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {item.result}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/portfolio" className="text-[#007BFF] hover:text-[#0056D2] font-semibold text-lg underline">
              View Full Portfolio →
            </a>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Process. Fast Results.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "We Design",
                description: "Tell us about your products and brand. We create a custom store that matches your vision."
              },
              {
                step: "2",
                title: "You Review",
                description: "We show you the design. You give feedback. We refine until it's perfect."
              },
              {
                step: "3",
                title: "We Launch",
                description: "Your store goes live. We handle hosting, security, and support. You start selling."
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                quote: "TsvWeb built our online store in 2 weeks. Sales tripled in the first month. The site is fast, looks amazing, and our customers love it.",
                author: "James Mitchell",
                business: "Mitchell Sports Ltd, Birmingham"
              },
              {
                quote: "Best decision we made. Our old site was slow and clunky. TsvWeb rebuilt it from scratch. Now we're ranking on Google and getting orders daily.",
                author: "Sophie Chen",
                business: "Bloom & Co, Solihull"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-gray-600 dark:text-gray-400">{testimonial.business}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote Form */}
      <section className="py-20 bg-gradient-to-br from-[#007BFF] to-[#0056D2]">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto">
            <motion.div 
              className="text-center text-white mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Your Free Quote</h2>
              <p className="text-xl opacity-90">We reply fast. Usually within 2 hours.</p>
            </motion.div>

            <motion.form 
              onSubmit={handleSubmit}
              className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-2xl shadow-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-[#007BFF] focus:outline-none dark:bg-gray-800 dark:text-white"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Business Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.businessType}
                    onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-[#007BFF] focus:outline-none dark:bg-gray-800 dark:text-white"
                    placeholder="e.g., Fashion, Electronics"
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-[#007BFF] focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Tell Us About Your Project</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg focus:border-[#007BFF] focus:outline-none dark:bg-gray-800 dark:text-white"
                  placeholder="What products will you sell? Any specific features you need?"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-bold text-lg py-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get My Free Quote →
              </button>
              <p className="text-center text-gray-600 dark:text-gray-400 mt-4 text-sm">
                No spam. No sales calls. Just a genuine quote.
              </p>
            </motion.form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom max-w-4xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                question: "How much does an e-commerce website cost in Birmingham?",
                answer: "Our e-commerce websites start from £50/month with no upfront costs, or one-time builds from £495. The exact price depends on features like product count, payment gateways, and custom integrations. We'll give you a transparent quote with no hidden fees."
              },
              {
                question: "How long does it take to build an online store?",
                answer: "Most e-commerce sites are live within 2-4 weeks. Simple stores can be ready in as little as 1 week. We'll give you a clear timeline during your free consultation."
              },
              {
                question: "Do you provide hosting and support?",
                answer: "Yes! All our e-commerce packages include secure hosting, SSL certificates, regular backups, and ongoing support. Your store stays fast, secure, and up-to-date without you lifting a finger."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{faq.question}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a href="/contact" className="text-[#007BFF] hover:text-[#0056D2] font-semibold text-lg underline">
              More Questions? Contact Us →
            </a>
          </div>
        </div>
      </section>

      <Footer />
      
      <SimpleSetupWizard 
        isOpen={isWizardOpen} 
        onClose={() => setIsWizardOpen(false)} 
      />
    </main>
  )
}
