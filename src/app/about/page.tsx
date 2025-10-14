import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'
import Image from 'next/image'

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

  return (
    <>
      <Navbar />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                About Our WordPress Developer <span className="text-royal-blue dark:text-blue-400">Birmingham</span> Team
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                We're a team of passionate WordPress developers and web professionals dedicated to creating exceptional WordPress websites for Birmingham businesses through affordable web design solutions.
              </p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  Our Story
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Founded in 2015, TsvWeb began with a simple mission: to help businesses succeed online through exceptional web design and development services.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  What started as a small team of passionate web enthusiasts has grown into a full-service web agency serving clients across various industries. Our growth has been fueled by our commitment to quality, innovation, and client satisfaction.
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  Today, we continue to evolve and adapt to the ever-changing digital landscape, staying ahead of trends and technologies to provide cutting-edge solutions that help our clients achieve their business goals.
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
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                These core principles guide our work and define our company culture.
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
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                The talented professionals behind our exceptional web solutions.
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
                Ready to Work With Us?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                Let's discuss how we can help your business succeed online with our professional web services.
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
