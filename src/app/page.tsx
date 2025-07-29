"use client"

import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="Professional Web Design & Development Services"
        description="TsvWeb offers professional web design and development services that drive results. Get a custom, SEO-optimized website for your business."
        structuredData={{
          type: 'Organization',
          data: {
            name: 'TsvWeb',
            url: 'https://tsvweb.com',
            logo: 'https://tsvweb.com/images/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+1-555-123-4567',
              contactType: 'customer service',
              areaServed: 'US',
              availableLanguage: ['English', 'French', 'Spanish', 'German']
            },
            sameAs: [
              'https://facebook.com/tsvweb',
              'https://twitter.com/tsvweb',
              'https://linkedin.com/company/tsvweb',
              'https://instagram.com/tsvweb'
            ]
          }
        }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="heading-1 text-gray-900 dark:text-white mb-6">
                <span className="text-royal-blue">Professional Web Design</span> for Your Business
              </h1>
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
                We create stunning, SEO-optimized websites that drive results. Our team of experts will help your business stand out online with custom web solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact" className="btn-primary text-center">
                  Get Started
                </Link>
                <Link href="/portfolio" className="btn-secondary text-center">
                  View Our Work
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-96 lg:h-[500px]">
              {/* This would be replaced with an actual AI-generated image */}
              <div className="absolute inset-0 bg-gradient-to-r from-royal-blue to-royal-blue-light rounded-lg flex items-center justify-center text-white text-lg font-medium">
                AI-Generated Hero Image Will Go Here
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Our Services</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              We offer a comprehensive range of web design and development services to help your business succeed online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Web Design',
                description: 'Custom website designs that reflect your brand and engage your audience.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Web Development',
                description: 'Robust, scalable websites and web applications built with the latest technologies.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
              },
              {
                title: 'E-commerce',
                description: 'Online stores that provide seamless shopping experiences and drive sales.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                ),
              },
              {
                title: 'SEO Optimization',
                description: 'Improve your search engine rankings and drive more organic traffic to your website.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                ),
              },
              {
                title: 'Responsive Design',
                description: 'Websites that look and function perfectly on all devices, from desktops to smartphones.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: 'Website Maintenance',
                description: 'Keep your website secure, up-to-date, and performing at its best with our maintenance services.',
                icon: (
                  <svg className="w-10 h-10 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ),
              },
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <div className="mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{service.title}</h3>
                <p className="text-gray-700 dark:text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/services" className="btn-primary">
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Portfolio Preview */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Our Recent Work</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Take a look at some of our recent projects and see how we've helped businesses like yours succeed online.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
                {/* This would be replaced with actual portfolio images */}
                <div className="aspect-w-16 aspect-h-9 bg-gradient-to-br from-royal-blue-light to-royal-blue">
                  <div className="flex items-center justify-center text-white text-lg font-medium h-full">
                    Portfolio Item {item}
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">Project Title {item}</h3>
                  <p className="text-gray-200 mb-4">Brief description of the project and the results achieved.</p>
                  <Link href={`/portfolio/project-${item}`} className="text-white font-medium hover:text-royal-blue-light transition-colors">
                    View Project →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/portfolio" className="btn-primary">
              View All Projects
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Don't just take our word for it. Here's what our clients have to say about working with us.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Jane Smith',
                company: 'Tech Solutions Inc.',
                quote: 'TsvWeb transformed our online presence. Their team was professional, creative, and delivered a website that exceeded our expectations.',
              },
              {
                name: 'John Doe',
                company: 'Local Retail Shop',
                quote: 'Our e-commerce sales increased by 200% after TsvWeb redesigned our website. Their SEO expertise and user-friendly design made all the difference.',
              },
              {
                name: 'Sarah Johnson',
                company: 'Marketing Agency',
                quote: 'Working with TsvWeb was a pleasure from start to finish. They understood our vision and created a website that perfectly represents our brand.',
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 rounded-full bg-royal-blue flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 italic">&ldquo;{testimonial.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-royal-blue">
        <div className="container-custom">
          <div className="text-center">
            <h2 className="heading-2 text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss your project and find out how we can help your business succeed online.
            </p>
            <Link href="/contact" className="bg-white text-royal-blue font-semibold py-3 px-8 rounded-md hover:bg-gray-100 transition-colors duration-300">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Preview */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-gray-900 dark:text-white mb-4">Latest from Our Blog</h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto">
              Stay up to date with the latest web design trends, tips, and insights.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: '10 Web Design Trends to Watch in 2025',
                excerpt: 'Explore the latest web design trends that are shaping the digital landscape in 2025.',
                date: 'July 25, 2025',
              },
              {
                title: 'Why SEO is Essential for Your Business Website',
                excerpt: 'Learn why search engine optimization is crucial for your business website and how it can drive growth.',
                date: 'July 20, 2025',
              },
              {
                title: 'The Importance of Mobile-Friendly Websites',
                excerpt: 'Discover why having a mobile-friendly website is no longer optional in today\'s digital world.',
                date: 'July 15, 2025',
              },
            ].map((post, index) => (
              <div key={index} className="bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
                {/* This would be replaced with actual blog post images */}
                <div className="h-48 bg-gradient-to-br from-royal-blue-light to-royal-blue">
                  <div className="flex items-center justify-center text-white text-lg font-medium h-full">
                    Blog Image {index + 1}
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{post.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.excerpt}</p>
                  <Link href={`/blog/post-${index + 1}`} className="text-royal-blue font-medium hover:text-royal-blue-dark transition-colors">
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link href="/blog" className="btn-primary">
              View All Posts
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
