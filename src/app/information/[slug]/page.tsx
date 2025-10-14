"use client"

import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'
import { informationPages } from '@/data/information-pages'

export default function InformationPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const page = informationPages.find(p => p.slug === slug)
  
  if (!page) {
    return (
      <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
            <Link href="/information" className="text-[#007BFF] hover:underline">
              Back to Information Hub
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title={page.seo.title}
        description={page.seo.description}
        canonical={`https://tsvweb.com/information/${slug}`}
        keywords={page.seo.keywords}
        openGraph={{
          title: page.seo.title,
          description: page.seo.description,
          url: `https://tsvweb.com/information/${slug}`,
          type: "article",
          images: [{
            url: "https://tsvweb.com/TsvWeb_Logo.png",
            width: 1200,
            height: 630,
            alt: page.title
          }]
        }}
        structuredData={{
          type: "Article",
          data: {
            "headline": page.title,
            "description": page.seo.description,
            "author": {
              "@type": "Organization",
              "name": "TsvWeb"
            },
            "publisher": {
              "@type": "Organization",
              "name": "TsvWeb",
              "logo": {
                "@type": "ImageObject",
                "url": "https://tsvweb.com/TsvWeb_Logo.png"
              }
            },
            "datePublished": "2025-01-14",
            "dateModified": "2025-01-14"
          }
        }}
      />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="container-custom">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="text-5xl">{page.icon}</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 dark:text-white">
                {page.title}
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
              {page.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {page.sections.map((section, index) => (
              <motion.div
                key={index}
                className="mb-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-6">
                  {section.title}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {section.content.map((paragraph, pIndex) => (
                    <p key={pIndex} className="text-lg text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {section.list && (
                  <ul className="mt-6 space-y-3">
                    {section.list.map((item, lIndex) => (
                      <li key={lIndex} className="flex items-start gap-3">
                        <span className="text-[#007BFF] text-2xl mt-1">✓</span>
                        <span className="text-lg text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits Section */}
      {page.benefits && (
        <section className="py-16 bg-blue-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 text-center">
                Key Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {page.benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-900 p-6 rounded-lg border-2 border-[#007BFF]"
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-bold text-[#007BFF] mb-3">{benefit.title}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Section */}
      {page.faqs && (
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                {page.faqs.map((faq, index) => (
                  <motion.div
                    key={index}
                    className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-[#007BFF]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <h3 className="text-xl font-bold text-[#007BFF] mb-3">{faq.question}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.answer}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

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
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let's discuss how we can help your Birmingham business succeed online
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

      {/* Related Articles */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 text-center">
              Related Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {informationPages
                .filter(p => p.slug !== slug)
                .slice(0, 3)
                .map((relatedPage, index) => (
                  <Link
                    key={index}
                    href={`/information/${relatedPage.slug}`}
                    className="group"
                  >
                    <motion.div
                      className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-2 border-transparent hover:border-[#007BFF] transition-all duration-300 h-full"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="text-4xl mb-4">{relatedPage.icon}</div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#007BFF] transition-colors">
                        {relatedPage.title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 line-clamp-3">
                        {relatedPage.description}
                      </p>
                    </motion.div>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
