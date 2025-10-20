"use client"

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import { Download, CheckCircle, Code, Settings, Zap, Shield, Book, ExternalLink, Copy, Check } from 'lucide-react'

export default function WordPressPluginDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Setup",
      description: "One-click installation with automatic configuration"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Connection",
      description: "Encrypted API communication with your TsvWeb account"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Easy Management",
      description: "Manage your website directly from your WordPress dashboard"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Developer Friendly",
      description: "Clean code with hooks and filters for customization"
    }
  ]

  const installationSteps = [
    {
      step: 1,
      title: "Download the Plugin",
      description: "Download the TsvWeb WordPress Plugin from your customer dashboard or the download page.",
      code: null
    },
    {
      step: 2,
      title: "Upload to WordPress",
      description: "Go to WordPress Admin → Plugins → Add New → Upload Plugin. Select the downloaded .zip file.",
      code: null
    },
    {
      step: 3,
      title: "Activate the Plugin",
      description: "After upload, click 'Activate Plugin' to enable TsvWeb integration.",
      code: null
    },
    {
      step: 4,
      title: "Connect Your Account",
      description: "Navigate to TsvWeb → Settings and enter your API key from your TsvWeb customer dashboard.",
      code: "API Key: Your unique key from dashboard"
    }
  ]

  const shortcodes = [
    {
      name: "Contact Form",
      shortcode: "[tsvweb_contact_form]",
      description: "Display a contact form connected to your TsvWeb account",
      attributes: [
        { name: "title", description: "Form title", default: "Contact Us" },
        { name: "button_text", description: "Submit button text", default: "Send Message" }
      ],
      preview: "contact"
    },
    {
      name: "Service List",
      shortcode: "[tsvweb_services]",
      description: "Display your services from TsvWeb",
      attributes: [
        { name: "limit", description: "Number of services to show", default: "6" },
        { name: "columns", description: "Grid columns (1-4)", default: "3" }
      ],
      preview: "services"
    },
    {
      name: "Portfolio Grid",
      shortcode: "[tsvweb_portfolio]",
      description: "Show your portfolio items",
      attributes: [
        { name: "limit", description: "Number of items", default: "9" },
        { name: "category", description: "Filter by category", default: "all" }
      ],
      preview: "portfolio"
    },
    {
      name: "Made by TsvWeb Badge",
      shortcode: "[tsvweb_made_by]",
      description: "Show a professional 'Made by TsvWeb' badge with logo - perfect for footer",
      attributes: [
        { name: "style", description: "Badge style: light, dark, minimal", default: "dark" },
        { name: "size", description: "Badge size: small, medium, large", default: "medium" }
      ],
      preview: "badge"
    }
  ]

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/wordpress/verify",
      description: "Verify API key and connection",
      response: "{ success: true, site: {...} }"
    },
    {
      method: "POST",
      endpoint: "/api/wordpress/contact",
      description: "Submit contact form data",
      response: "{ success: true, message: 'Sent' }"
    },
    {
      method: "GET",
      endpoint: "/api/wordpress/services",
      description: "Fetch services list",
      response: "{ success: true, services: [...] }"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container-custom relative z-10">
          <motion.div 
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold mb-6">
              <Book className="w-4 h-4" />
              Plugin Documentation
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
              TsvWeb WordPress Plugin
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Documentation
              </span>
            </h1>
            
            <p className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete guide to installing, configuring, and using the TsvWeb WordPress Plugin. 
              Connect your WordPress site to your TsvWeb account seamlessly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/download/wordpress-plugin"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg px-8 py-4 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all"
              >
                <Download className="w-5 h-5" />
                Download Plugin
              </Link>
              <a
                href="#installation"
                className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-bold text-lg px-8 py-4 rounded-lg hover:shadow-lg transition-all"
              >
                <Book className="w-5 h-5" />
                Read Docs
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Plugin <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Features</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Everything you need to integrate TsvWeb with WordPress</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 p-6 rounded-xl border-2 border-transparent hover:border-blue-500 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section id="installation" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Installation <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Guide</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Get up and running in 4 simple steps</p>
          </motion.div>

          <div className="space-y-6">
            {installationSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 md:p-8 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-black text-xl">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{step.description}</p>
                    {step.code && (
                      <div className="relative bg-gray-900 dark:bg-black rounded-lg p-4 font-mono text-sm text-green-400">
                        <code>{step.code}</code>
                        <button
                          onClick={() => copyToClipboard(step.code!, `step-${index}`)}
                          className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors"
                        >
                          {copiedCode === `step-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Shortcodes Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom max-w-6xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              Available <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Shortcodes</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">Use these shortcodes in your posts and pages</p>
          </motion.div>

          <div className="space-y-6">
            {shortcodes.map((shortcode, index) => (
              <motion.div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 md:p-8 border-2 border-blue-200 dark:border-gray-600"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{shortcode.name}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{shortcode.description}</p>
                  </div>
                  <div className="relative">
                    <div className="bg-gray-900 dark:bg-black rounded-lg px-4 py-2 font-mono text-sm text-green-400 whitespace-nowrap">
                      {shortcode.shortcode}
                    </div>
                    <button
                      onClick={() => copyToClipboard(shortcode.shortcode, `shortcode-${index}`)}
                      className="absolute -top-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors shadow-lg"
                    >
                      {copiedCode === `shortcode-${index}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {shortcode.attributes.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-blue-200 dark:border-gray-600">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3">Attributes:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {shortcode.attributes.map((attr, attrIndex) => (
                        <div key={attrIndex} className="bg-white dark:bg-gray-900 rounded-lg p-3">
                          <code className="text-blue-600 dark:text-blue-400 font-mono text-sm">{attr.name}</code>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{attr.description}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Default: <code>{attr.default}</code></p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Shortcode Preview */}
                {shortcode.preview && (
                  <div className="mt-6 pt-6 border-t border-blue-200 dark:border-gray-600">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span className="text-2xl">👁️</span> Live Preview:
                    </h4>
                    
                    {shortcode.preview === 'contact' && (
                      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700">
                        <h3 className="text-xl font-bold text-center text-blue-600 dark:text-blue-400 mb-4">Contact Us</h3>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-semibold mb-1">Name *</label>
                            <input type="text" placeholder="John Smith" className="w-full p-2 border rounded text-sm" disabled />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">Email *</label>
                            <input type="email" placeholder="john@example.com" className="w-full p-2 border rounded text-sm" disabled />
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">Message *</label>
                            <textarea rows={3} placeholder="Your message..." className="w-full p-2 border rounded text-sm" disabled></textarea>
                          </div>
                          <button className="w-full bg-blue-600 text-white py-2 rounded font-semibold" disabled>Send Message</button>
                        </div>
                      </div>
                    )}

                    {shortcode.preview === 'services' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Web Design 🎨', 'Development 💻', 'SEO 📈'].map((service, i) => (
                          <div key={i} className="bg-white dark:bg-gray-900 p-4 rounded-lg border-2 border-gray-200 dark:border-gray-700 text-center">
                            <div className="text-3xl mb-2">{service.split(' ')[1]}</div>
                            <h4 className="font-bold text-blue-600 dark:text-blue-400">{service.split(' ')[0]}</h4>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Professional service description</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {shortcode.preview === 'portfolio' && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['E-commerce', 'Restaurant', 'Business'].map((item, i) => (
                          <div key={i} className="bg-white dark:bg-gray-900 rounded-lg border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="h-24 bg-gradient-to-br from-blue-400 to-purple-400"></div>
                            <div className="p-3">
                              <h4 className="font-bold text-blue-600 dark:text-blue-400 text-sm">{item} Website</h4>
                              <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">{item}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {shortcode.preview === 'badge' && (
                      <div className="space-y-4">
                        {/* Dark Style */}
                        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="text-white font-semibold">Made with ❤️ by</span>
                            <div className="bg-white px-4 py-2 rounded">
                              <span className="font-black text-blue-600">TsvWeb</span>
                            </div>
                          </div>
                          <p className="text-white text-xs mt-2 opacity-90">Professional Web Design & Development in Birmingham</p>
                        </div>

                        {/* Light Style */}
                        <div className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="text-gray-800 font-semibold">Made with ❤️ by</span>
                            <div className="bg-white px-4 py-2 rounded shadow">
                              <span className="font-black text-blue-600">TsvWeb</span>
                            </div>
                          </div>
                          <p className="text-gray-700 text-xs mt-2">Professional Web Design & Development in Birmingham</p>
                        </div>

                        {/* Minimal Style */}
                        <div className="bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 p-6 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-3 flex-wrap">
                            <span className="text-gray-800 dark:text-gray-200 font-semibold">Made with ❤️ by</span>
                            <span className="font-black text-blue-600 text-xl">TsvWeb</span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-xs mt-2">Professional Web Design & Development in Birmingham</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4">
              API <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Reference</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">For developers: Available API endpoints</p>
          </motion.div>

          <div className="space-y-4">
            {apiEndpoints.map((endpoint, index) => (
              <motion.div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                    endpoint.method === 'GET' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {endpoint.method}
                  </span>
                  <code className="text-gray-900 dark:text-white font-mono text-sm md:text-base">{endpoint.endpoint}</code>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3">{endpoint.description}</p>
                <div className="bg-gray-900 dark:bg-black rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Response:</p>
                  <code className="text-green-400 text-sm">{endpoint.response}</code>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container-custom max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Need Help?
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Our support team is here to help you get the most out of the TsvWeb WordPress Plugin
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-lg px-8 py-4 rounded-lg hover:bg-gray-100 transition-all"
              >
                Contact Support
              </Link>
              <Link
                href="/customer/dashboard"
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white border-2 border-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-white/20 transition-all"
              >
                Customer Dashboard
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
