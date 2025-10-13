'use client'

import { useState } from 'react'
import PageSEO from '@/components/seo/page-seo'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'
import { 
  MagnifyingGlassIcon as Search, 
  WrenchScrewdriverIcon as Wrench, 
  SwatchIcon as Palette, 
  CodeBracketIcon as Code, 
  UsersIcon as Users, 
  BoltIcon as Zap, 
  TrophyIcon as Award, 
  CheckCircleIcon as CheckCircle 
} from '@heroicons/react/24/outline'

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(0)

  // Enhanced Services data with pricing and detailed features
  const services = [
    {
      id: 'wordpress-web-design',
      title: 'WordPress Web Design Birmingham',
      shortDesc: 'Affordable WordPress websites for Birmingham businesses',
      description: 'Transform your Birmingham business with affordable WordPress web design services. Our WordPress developer creates custom WordPress websites that captivate your local audience and drive conversions, focusing on your brand identity and Birmingham market needs.',
      price: 'From £30/month',
      duration: '2-4 weeks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      ),
      features: [
        'Custom UI/UX Design',
        'Mobile-First Responsive Design',
        'Brand Identity Integration',
        'User Journey Optimization',
        'Conversion Rate Optimization',
        'Interactive Prototypes',
        'Design System Creation',
        'Accessibility Compliance'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision'],
      deliverables: ['Design Mockups', 'Interactive Prototypes', 'Style Guide', 'Asset Library'],
      cta: 'Start Your Design',
    },
    {
      id: 'wordpress-developer',
      title: 'WordPress Developer Birmingham',
      shortDesc: 'Professional WordPress development services',
      description: 'Expert WordPress developer providing powerful, fast, and secure WordPress websites for Birmingham businesses. From simple WordPress sites to complex custom WordPress applications, we deliver professional solutions.',
      price: 'From £50/month',
      duration: '4-8 weeks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      features: [
        'Custom WordPress Development',
        'WordPress Theme Customization',
        'WordPress Plugin Development',
        'WooCommerce Integration',
        'WordPress Performance Optimization',
        'WordPress Security Implementation',
        'SEO-Friendly WordPress Design',
        'WordPress Maintenance & Support'
      ],
      technologies: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL'],
      deliverables: ['Source Code', 'Documentation', 'Deployment', 'Training'],
      cta: 'Build Your Website',
    },
    {
      id: 'ecommerce',
      title: 'E-commerce Solutions',
      shortDesc: 'Complete online store solutions',
      description: 'Launch your online store with our comprehensive e-commerce solutions. From product catalogs to payment processing, we handle everything to get you selling online quickly and securely.',
      price: 'From £75/month',
      duration: '6-10 weeks',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      features: [
        'Custom E-commerce Platform',
        'Product Catalog Management',
        'Secure Payment Processing',
        'Inventory Management',
        'Order Management System',
        'Customer Account Portal',
        'Multi-currency Support',
        'Analytics & Reporting'
      ],
      technologies: ['Shopify', 'WooCommerce', 'Stripe', 'PayPal', 'Mailchimp'],
      deliverables: ['Online Store', 'Admin Dashboard', 'Payment Setup', 'Training'],
      cta: 'Launch Your Store',
    },
    {
      id: 'seo-marketing',
      title: 'SEO & Digital Marketing',
      shortDesc: 'Drive traffic and increase visibility',
      description: 'Boost your online presence with our comprehensive SEO and digital marketing services. We help you rank higher, drive more traffic, and convert visitors into customers.',
      price: 'From £80/month',
      duration: 'Ongoing',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      features: [
        'Technical SEO Audit',
        'Keyword Research & Strategy',
        'On-page Optimization',
        'Content Marketing',
        'Local Birmingham SEO optimization',
        'Google My Business setup',
        'Keyword research and targeting',
        'Technical SEO implementation',
        'Content optimization',
        'Performance monitoring',
      ],
      cta: 'Boost Your Rankings'
    },
    {
      id: 'maintenance',
      title: 'WordPress Maintenance Birmingham',
      description: 'Ongoing WordPress maintenance and support services for Birmingham businesses to keep websites secure and updated.',
      price: 'From £30/month',
      duration: 'Ongoing',
      cta: 'Secure Your Site',
      icon: <Wrench className="w-12 h-12 text-royal-blue" />,
      features: [
        'Regular WordPress updates',
        'Security monitoring and patches',
        'Daily automated backups',
        'Performance optimization',
        'Birmingham-based support team',
        '24/7 uptime monitoring',
      ]
    },
    {
      id: 'branding',
      title: 'Web Design & Branding Birmingham',
      description: 'Complete brand identity and WordPress website packages for new Birmingham businesses.',
      price: 'From £60/month',
      duration: '3-5 weeks',
      cta: 'Build Your Brand',
      icon: <Palette className="w-12 h-12 text-royal-blue" />,
      features: [
        'Logo design and brand identity',
        'Custom WordPress website',
        'Brand guidelines development',
        'Marketing material design',
        'Birmingham market research',
        'Social media branding',
      ]
    },
    {
      id: 'development',
      title: 'Custom WordPress Development Birmingham',
      description: 'Advanced WordPress development services including custom plugins and complex functionality for Birmingham businesses.',
      price: 'From £90/month',
      duration: '4-8 weeks',
      cta: 'Get Custom Solution',
      icon: <Code className="w-12 h-12 text-royal-blue" />,
      features: [
        'Custom plugin development',
        'API integrations',
        'Database optimization',
        'Complex functionality implementation',
        'Birmingham business logic',
        'Third-party integrations',
      ]
    }
  ]

  const processSteps = [
    {
      step: '01',
      title: 'Discovery & Planning',
      description: 'We start by understanding your Birmingham business goals, target audience, and project requirements.',
      icon: <Users className="w-8 h-8" />
    },
    {
      step: '02',
      title: 'Design & Development',
      description: 'Our team creates custom WordPress solutions tailored to your brand and Birmingham market needs.',
      icon: <Code className="w-8 h-8" />
    },
    {
      step: '03',
      title: 'Testing & Launch',
      description: 'Comprehensive testing ensures your website performs perfectly before going live to Birmingham customers.',
      icon: <Zap className="w-8 h-8" />
    },
    {
      step: '04',
      title: 'Support & Growth',
      description: 'Ongoing support and optimization to help your Birmingham business grow and succeed online.',
      icon: <Award className="w-8 h-8" />
    }
  ]

  return (
    <main>
      <PageSEO
        title="WordPress Web Design Services Birmingham | From £30/Month"
        description="Professional WordPress web design and development services for Birmingham businesses. Custom websites, e-commerce, SEO, and maintenance from £30/month."
        structuredData={{
          type: 'Service',
          data: {
            '@type': 'Service',
            name: 'WordPress Web Design Services Birmingham',
            provider: {
              '@type': 'LocalBusiness',
              name: 'TsvWeb',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Birmingham',
                addressCountry: 'UK'
              }
            },
            serviceType: 'WordPress Web Design',
            areaServed: 'Birmingham, UK',
            hasOfferCatalog: {
              '@type': 'OfferCatalog',
              name: 'WordPress Services',
              itemListElement: services.map(service => ({
                '@type': 'Offer',
                itemOffered: {
                  '@type': 'Service',
                  name: service.title,
                  description: service.description
                }
              }))
            }
          }
        }}
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-blue-50 py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              <span className="text-royal-blue">WordPress Web Design Birmingham</span> Services
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Professional WordPress developer services for Birmingham businesses from £30/month. 
              Custom websites, e-commerce solutions, SEO optimization, and ongoing maintenance.
            </p>
            <Link href="/contact" className="btn-primary">
              Get Free Quote
            </Link>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-royal-blue">WordPress Services</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Comprehensive WordPress solutions designed specifically for Birmingham businesses, 
              from startups to established enterprises.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100">
                <div className="mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                
                <div className="mb-6">
                  <div className="text-2xl font-bold text-royal-blue mb-2">{service.price}</div>
                  <div className="text-sm text-gray-500">Timeline: {service.duration}</div>
                </div>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link 
                  href={`/contact?service=${service.id}`} 
                  className="btn-primary w-full text-center"
                >
                  {service.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our <span className="text-royal-blue">Process</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We follow a proven methodology to deliver exceptional WordPress websites 
              that drive results for Birmingham businesses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-royal-blue to-transparent transform translate-x-4"></div>
                )}
                
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:border-royal-blue/20 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-royal-blue to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-4">
                    {step.step}
                  </div>
                  <div className="text-royal-blue mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-royal-blue">
        <div className="container-custom">
          <div className="text-center text-white max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Birmingham Business Online?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join hundreds of satisfied Birmingham businesses who trust TsvWeb for their WordPress needs. 
              Get started today with our affordable monthly plans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="btn-secondary bg-white text-royal-blue hover:bg-gray-100"
              >
                Start Your Project
              </Link>
              <Link
                href="/portfolio"
                className="btn-outline border-white text-white hover:bg-white hover:text-royal-blue"
              >
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
