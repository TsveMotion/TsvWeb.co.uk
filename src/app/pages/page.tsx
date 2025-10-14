"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'

export default function AllPagesPage() {
  const pageCategories = [
    {
      category: "Main Pages",
      icon: "🏠",
      pages: [
        { name: "Home", url: "/", description: "TsvWeb homepage" },
        { name: "Services", url: "/services", description: "Our web design services" },
        { name: "Portfolio", url: "/portfolio", description: "Our work showcase" },
        { name: "About", url: "/about", description: "About TsvWeb" },
        { name: "Contact", url: "/contact", description: "Get in touch" },
        { name: "Blog", url: "/blog", description: "Web design insights" }
      ]
    },
    {
      category: "Industry Landing Pages",
      icon: "🏢",
      pages: [
        { name: "Restaurants", url: "/restaurants", description: "Restaurant website design Birmingham" },
        { name: "Barbers", url: "/barbers", description: "Barber website design Birmingham" },
        { name: "E-commerce", url: "/ecommerce", description: "E-commerce website design Birmingham" }
      ]
    },
    {
      category: "Trade Services",
      icon: "🔧",
      pages: [
        { name: "Plumbers", url: "/plumbers", description: "Plumber website design Birmingham" },
        { name: "Electricians", url: "/electricians", description: "Electrician website design Birmingham" },
        { name: "Builders", url: "/builders", description: "Builder website design Birmingham" },
        { name: "Cleaning", url: "/cleaning", description: "Cleaning business website Birmingham" },
        { name: "Removals", url: "/removals", description: "Removals website design Birmingham" }
      ]
    },
    {
      category: "Legal & Admin",
      icon: "📄",
      pages: [
        { name: "Privacy Policy", url: "/privacy-policy", description: "Our privacy policy" },
        { name: "Terms of Service", url: "/terms-of-service", description: "Terms and conditions" },
        { name: "Admin Login", url: "/admin/login", description: "Admin dashboard access" },
        { name: "Customer Login", url: "/customer/login", description: "Customer portal access" }
      ]
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <PageSEO 
        title="All Pages | TsvWeb Site Directory"
        description="Complete directory of all TsvWeb pages including industry landing pages, trade services, and more."
        canonical="https://tsvweb.com/pages"
      />
      <Navbar />
      
      <div className="container-custom py-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6">
              All <span className="text-[#007BFF]">Pages</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Complete directory of all TsvWeb pages. Click any page to navigate.
            </p>
          </motion.div>

          {/* Page Categories */}
          <div className="space-y-12">
            {pageCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              >
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-4xl">{category.icon}</span>
                  <h2 className="text-3xl font-black text-gray-900">{category.category}</h2>
                  <div className="flex-1 h-1 bg-gradient-to-r from-[#007BFF] to-transparent ml-4"></div>
                </div>

                {/* Pages Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.pages.map((page, pageIndex) => (
                    <Link
                      key={pageIndex}
                      href={page.url}
                      className="group"
                    >
                      <div className="bg-blue-50 border-2 border-transparent hover:border-[#007BFF] p-6 rounded-lg transition-all duration-300 hover:shadow-lg h-full">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-black text-gray-900 group-hover:text-[#007BFF] transition-colors">
                            {page.name}
                          </h3>
                          <svg 
                            className="w-5 h-5 text-[#007BFF] transform group-hover:translate-x-1 transition-transform" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{page.description}</p>
                        <p className="text-[#007BFF] text-sm font-mono">{page.url}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats */}
          <motion.div 
            className="mt-16 bg-gradient-to-br from-[#007BFF] to-[#0056D2] rounded-lg p-8 text-white text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <div className="text-4xl font-black mb-2">
                  {pageCategories.reduce((acc, cat) => acc + cat.pages.length, 0)}
                </div>
                <div className="text-blue-100">Total Pages</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">
                  {pageCategories.find(c => c.category === "Industry Landing Pages")?.pages.length || 0}
                </div>
                <div className="text-blue-100">Industry Pages</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">
                  {pageCategories.find(c => c.category === "Trade Services")?.pages.length || 0}
                </div>
                <div className="text-blue-100">Trade Services</div>
              </div>
              <div>
                <div className="text-4xl font-black mb-2">
                  {pageCategories.find(c => c.category === "Main Pages")?.pages.length || 0}
                </div>
                <div className="text-blue-100">Main Pages</div>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <p className="text-gray-600 mb-6">Need help navigating?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/contact" 
                className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-bold px-8 py-3 rounded-lg hover:shadow-lg transition-all"
              >
                Contact Us
              </Link>
              <Link 
                href="/services" 
                className="bg-white border-2 border-[#007BFF] text-[#007BFF] font-bold px-8 py-3 rounded-lg hover:bg-[#007BFF] hover:text-white transition-all"
              >
                View Services
              </Link>
              <Link 
                href="/" 
                className="bg-gray-100 text-gray-700 font-bold px-8 py-3 rounded-lg hover:bg-gray-200 transition-all"
              >
                Back to Home
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
