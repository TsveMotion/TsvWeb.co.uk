'use client'

import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'
import Image from 'next/image'
import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function AboutPage() {
  // Team members data
  const team = [
    {
      name: 'Alex Johnson',
      role: 'Founder & WordPress Developer Birmingham',
      bio: 'With over 15 years of experience in WordPress development and digital marketing, Alex founded TsvWeb with a vision to help Birmingham businesses succeed online through affordable WordPress web design and innovative solutions.',
      image: '/images/team/alex.jpg',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Lead Designer',
      bio: 'Maria brings creativity and user-centered design principles to every project. Her background in UX/UI design ensures all TsvWeb sites are both beautiful and functional.',
      image: '/images/team/maria.jpg',
    },
    {
      name: 'David Chen',
      role: 'Senior Developer',
      bio: 'David is an expert in front-end and back-end development with a passion for clean code and cutting-edge technologies. He leads our development team to build robust web solutions.',
      image: '/images/team/david.jpg',
    },
    {
      name: 'Sarah Williams',
      role: 'SEO Specialist',
      bio: 'Sarah has helped numerous businesses improve their online visibility and search rankings. Her data-driven approach to SEO delivers measurable results for our clients.',
      image: '/images/team/sarah.jpg',
    },
  ]

  // Company values
  const values = [
    {
      title: 'Quality',
      description: 'We are committed to delivering high-quality web solutions that exceed client expectations and stand the test of time.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Innovation',
      description: 'We stay at the forefront of web technologies and design trends to provide innovative solutions that give our clients a competitive edge.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      ),
    },
    {
      title: 'Client Focus',
      description: 'We prioritize understanding our clients\' needs and goals to deliver tailored solutions that help them achieve their business objectives.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      ),
    },
    {
      title: 'Integrity',
      description: 'We operate with transparency and honesty in all our client relationships, providing clear communication and realistic expectations.',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      ),
    },
  ]

  // SEO metadata
  const seoData = {
    title: 'About TsvWeb Birmingham | Web Design Team Birmingham | Our Story',
    description: 'Meet the TsvWeb Birmingham team. Award-winning web designers and developers. 8+ years experience. 200+ projects completed. Serving Birmingham businesses. Call 07444 358808.',
    canonical: 'https://tsvweb.com/about',
    keywords: 'about TsvWeb, Birmingham web design team, web designers Birmingham, web developers Birmingham, Birmingham web agency, TsvWeb team',
    openGraph: {
      title: 'About Our WordPress Developer Birmingham Team | TsvWeb',
      description: 'Meet our Birmingham WordPress developer team specializing in affordable WordPress web design and custom WordPress websites for local Birmingham businesses.',
      url: 'https://tsvweb.com/about',
      type: 'website',
      images: [
        {
          url: 'https://tsvweb.com/images/og-about-wordpress-birmingham.jpg',
          width: 1200,
          height: 630,
          alt: 'About TsvWeb WordPress Developer Birmingham Team',
        },
      ],
    },
  }

  // Add structured data for SEO
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About TsvWeb Birmingham",
      "description": "Learn about TsvWeb, Birmingham's trusted web design and development team with 8+ years experience and 200+ completed projects.",
      "url": "https://tsvweb.com/about",
      "mainEntity": {
        "@type": "Organization",
        "name": "TsvWeb",
        "url": "https://tsvweb.com",
        "logo": "https://tsvweb.com/TsvWeb_Logo.png",
        "description": "Professional web design and development services in Birmingham",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "318 Shady Ln.",
          "addressLocality": "Birmingham",
          "addressRegion": "West Midlands",
          "postalCode": "B44 9EB",
          "addressCountry": "GB"
        },
        "telephone": "+447444358808",
        "foundingDate": "2015",
        "numberOfEmployees": "15",
        "slogan": "Get More Customers Online in Birmingham"
      }
    });
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Navbar />
      
      <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        {/* Hero Section - Futuristic Style */}
        <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
          {/* Animated Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
          
          <div className="container-custom relative z-10">
            <motion.div 
              className="max-w-5xl mx-auto text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full text-sm font-semibold text-blue-600 dark:text-blue-400 mb-6">
                🏆 Award-Winning Team Since 2015
              </span>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-6 leading-tight text-gray-900 dark:text-white">
                Meet Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#007BFF] to-[#8B5CF6]">
                  Birmingham Web Design
                </span> Team
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                200+ projects completed. 8+ years experience. <br className="hidden md:block" />
                Affordable web design from <span className="font-bold text-blue-600 dark:text-blue-400">£30/month</span>.
              </p>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 mb-12">
                <motion.div 
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">200+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Projects Done</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">8+</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Years Experience</div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-black text-gray-900 dark:text-white">B'ham</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Based Team</div>
                  </div>
                </motion.div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="bg-gradient-to-r from-[#007BFF] to-[#0056D2] text-white font-black text-lg py-4 px-8 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase">
                  Get Free Quote
                </Link>
                <Link href="/portfolio" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-bold text-lg py-4 px-8 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                  View Our Work
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Story - Birmingham Web Design Since 2015
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2015, TsvWeb began with a simple mission: to help Birmingham businesses succeed online through exceptional, affordable web design and development services starting from just £30/month.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  What started as a small team of passionate web enthusiasts has grown into a full-service web agency serving 200+ clients across Birmingham and the West Midlands. Our growth has been fueled by our commitment to quality, innovation, and delivering websites that get results - 3x more leads in 30 days.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  <strong>Our Services Include:</strong> Web Design, Web Development, SEO Services, E-commerce Solutions, Website Maintenance, and Hosting - all tailored for Birmingham businesses.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Today, we continue to evolve and adapt to the ever-changing digital landscape, staying ahead of trends and technologies to provide cutting-edge solutions. We specialize in mobile-ready websites delivered in 48 hours and SEO optimization to help you rank #1 on Google.
                </p>
              </div>
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
                <div className="text-gray-400 dark:text-gray-500 text-center">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <p>Company Image</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Core Values - What Makes TsvWeb Different
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                These core principles guide our Birmingham web design work and define our company culture. We're committed to delivering exceptional results for every client.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6 flex">
                  <div className="flex-shrink-0 w-12 h-12 bg-royal-blue/10 rounded-full flex items-center justify-center mr-4 text-royal-blue">
                    {value.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Team */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Our Birmingham Web Design Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The talented professionals behind our exceptional web solutions. Expert designers, developers, and SEO specialists dedicated to your success.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <div className="text-gray-400 dark:text-gray-500 text-center">
                      <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p>Team Member Photo</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {member.name}
                    </h3>
                    <p className="text-royal-blue font-medium mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-royal-blue text-white">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {[
                { number: '200+', label: 'Projects Completed' },
                { number: '50+', label: 'Happy Clients' },
                { number: '8', label: 'Years of Experience' },
                { number: '15', label: 'Team Members' },
              ].map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2">{stat.number}</div>
                  <div className="text-royal-blue-light">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Ready to Work With Birmingham's Best Web Design Team?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Let's discuss how we can help your Birmingham business succeed online with our professional web design services from £30/month. Get 3x more leads in 30 days with our SEO-optimized websites.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                <strong>Call us today:</strong> <a href="tel:+447444358808" className="text-royal-blue dark:text-blue-400 hover:underline font-semibold">07444 358808</a> or <a href="https://wa.me/447444358808" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline font-semibold">WhatsApp us</a>
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  href="/services" 
                  className="btn-secondary"
                >
                  Explore Our Services
                </Link>
                <Link 
                  href="/contact" 
                  className="btn-primary"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
