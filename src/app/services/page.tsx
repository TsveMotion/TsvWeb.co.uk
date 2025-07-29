import PageSEO from '@/components/seo/page-seo'
import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'
import Image from 'next/image'

export default function ServicesPage() {
  // Services data
  const services = [
    {
      id: 'web-design',
      title: 'Web Design',
      description: 'Custom, responsive website designs that reflect your brand identity and engage your audience with intuitive user experiences.',
      icon: '/images/services/web-design.svg',
      features: [
        'Custom UI/UX design',
        'Responsive layouts for all devices',
        'Brand-aligned visual elements',
        'Intuitive navigation',
        'Conversion-focused design',
      ],
      cta: 'Get a custom design',
    },
    {
      id: 'web-development',
      title: 'Web Development',
      description: 'Professional web development services using the latest technologies to create fast, secure, and scalable websites and web applications.',
      icon: '/images/services/web-development.svg',
      features: [
        'Front-end development',
        'Back-end development',
        'CMS integration',
        'E-commerce solutions',
        'API development and integration',
      ],
      cta: 'Build your website',
    },
    {
      id: 'ecommerce',
      title: 'E-commerce',
      description: 'Complete e-commerce solutions to help you sell products online with secure payment processing, inventory management, and customer accounts.',
      icon: '/images/services/ecommerce.svg',
      features: [
        'Product catalog management',
        'Secure payment gateways',
        'Shopping cart functionality',
        'Customer account management',
        'Order processing and tracking',
      ],
      cta: 'Start selling online',
    },
    {
      id: 'seo',
      title: 'SEO',
      description: 'Search engine optimization services to improve your website visibility, increase organic traffic, and achieve higher rankings on search results.',
      icon: '/images/services/seo.svg',
      features: [
        'Keyword research and analysis',
        'On-page optimization',
        'Technical SEO improvements',
        'Content strategy',
        'Performance tracking and reporting',
      ],
      cta: 'Improve your rankings',
    },
    {
      id: 'maintenance',
      title: 'Maintenance',
      description: 'Ongoing website maintenance services to keep your site secure, updated, and performing optimally with regular backups and monitoring.',
      icon: '/images/services/maintenance.svg',
      features: [
        'Regular software updates',
        'Security monitoring',
        'Performance optimization',
        'Backup and recovery',
        'Content updates',
      ],
      cta: 'Maintain your site',
    },
  ]

  // SEO metadata
  const seoData = {
    title: 'Professional Web Services | TsvWeb',
    description: 'Comprehensive web design, development, e-commerce, SEO, and maintenance services for businesses of all sizes. Get a custom solution for your online presence.',
    canonical: 'https://tsvweb.com/services',
    openGraph: {
      title: 'Professional Web Services | TsvWeb',
      description: 'Comprehensive web design, development, e-commerce, SEO, and maintenance services for businesses of all sizes.',
      url: 'https://tsvweb.com/services',
      type: 'website',
      images: [
        {
          url: 'https://tsvweb.com/images/og-services.jpg',
          width: 1200,
          height: 630,
          alt: 'TsvWeb Services',
        },
      ],
    },
  }

  return (
    <>
      <PageSEO {...seoData} />
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Professional Web Services
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                We offer comprehensive web solutions to help your business thrive online.
                From design to development, SEO to maintenance, we've got you covered.
              </p>
              <Link 
                href="/contact" 
                className="btn-primary inline-block"
              >
                Get a Free Consultation
              </Link>
            </div>
          </div>
        </section>

        {/* Services List */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Explore our range of professional web services designed to help your business succeed online.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div 
                  key={service.id} 
                  id={service.id}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="p-6">
                    <div className="w-16 h-16 bg-royal-blue/10 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-8 h-8 text-royal-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      {service.description}
                    </p>
                    <ul className="mb-6 space-y-2">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
                          <svg className="w-4 h-4 text-royal-blue mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link 
                      href={`/contact?service=${service.id}`}
                      className="text-royal-blue hover:text-royal-blue-dark dark:text-royal-blue-light dark:hover:text-royal-blue font-medium flex items-center"
                    >
                      {service.cta}
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Our Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                We follow a proven process to deliver high-quality web solutions that meet your business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Discovery',
                  description: 'We start by understanding your business, goals, target audience, and requirements.',
                },
                {
                  step: '02',
                  title: 'Planning',
                  description: 'We create a detailed plan including sitemap, wireframes, and project timeline.',
                },
                {
                  step: '03',
                  title: 'Development',
                  description: 'Our team designs and develops your website with regular progress updates.',
                },
                {
                  step: '04',
                  title: 'Launch',
                  description: 'After thorough testing, we launch your website and provide ongoing support.',
                },
              ].map((phase, index) => (
                <div key={index} className="relative">
                  <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-6">
                    <div className="text-3xl font-bold text-royal-blue mb-4">
                      {phase.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                      {phase.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {phase.description}
                    </p>
                  </div>
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                      <svg className="w-8 h-8 text-royal-blue" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Clients Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Don't just take our word for it. Here's what our clients have to say about our services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah Johnson',
                  company: 'Tech Innovators',
                  quote: 'TsvWeb transformed our online presence with a beautiful, functional website that perfectly represents our brand. Their team was professional and responsive throughout the entire process.',
                  image: '/images/testimonials/client1.jpg',
                },
                {
                  name: 'Michael Chen',
                  company: 'Global Solutions',
                  quote: 'The e-commerce site TsvWeb built for us has significantly increased our online sales. Their attention to detail and focus on user experience made all the difference.',
                  image: '/images/testimonials/client2.jpg',
                },
                {
                  name: 'Emily Rodriguez',
                  company: 'Creative Studios',
                  quote: 'Working with TsvWeb was a pleasure from start to finish. They took the time to understand our needs and delivered a website that exceeded our expectations.',
                  image: '/images/testimonials/client3.jpg',
                },
              ].map((testimonial, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                      <div className="w-full h-full bg-gray-300 dark:bg-gray-600"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 italic">
                    "{testimonial.quote}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-royal-blue">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-royal-blue-light mb-8">
                Contact us today for a free consultation and let's discuss how we can help your business succeed online.
              </p>
              <Link 
                href="/contact" 
                className="bg-white text-royal-blue hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition-colors duration-300"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  )
}
