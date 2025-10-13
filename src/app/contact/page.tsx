"use client"

import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import ContactForm from '@/components/forms/contact-form'
import PageSEO from '@/components/seo/page-seo'
import Link from 'next/link'

export default function Contact() {
  return (
    <main className="min-h-screen flex flex-col">
      <PageSEO 
        title="Contact WordPress Developer Birmingham | Affordable WordPress Web Design Quote"
        description="Contact our Birmingham WordPress developer for affordable WordPress web design services. Get a free quote for custom WordPress websites and small business web design in Birmingham."
        canonical="https://tsvweb.com/contact"
      />
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-white to-blue-50 dark:from-gray-900 dark:to-gray-800 opacity-90"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 dark:opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-blue/30 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 opacity-10 dark:opacity-5">
            <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-royal-blue/30 to-transparent"></div>
          </div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 bg-royal-blue/10 dark:bg-royal-blue/20 text-royal-blue dark:text-royal-blue-light rounded-full text-sm font-medium mb-6">Let's Connect</span>
            <h1 className="heading-1 text-gray-900 dark:text-white mb-6">
              Contact Our <span className="text-royal-blue">WordPress Developer Birmingham</span>
            </h1>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Ready for affordable WordPress web design in Birmingham? Contact our WordPress developer today for a free quote on custom WordPress websites, small business web design, and SEO-friendly WordPress development services.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                className="btn-primary" 
                onClick={() => {
                  document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Send Message
              </button>
              <button 
                className="btn-outline" 
                onClick={() => {
                  document.getElementById('contact-info')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Contact Info
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section id="contact-info" className="section-padding bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="heading-2 text-gray-900 dark:text-white mb-8">Get In Touch</h2>
              
              <div className="space-y-6">
                <div className="group bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-royal-blue/30 dark:hover:border-royal-blue/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center group-hover:bg-royal-blue/20 dark:group-hover:bg-royal-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Phone</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">+44 7444 358808</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Monday-Friday, 9am-5pm</p>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-royal-blue/30 dark:hover:border-royal-blue/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center group-hover:bg-royal-blue/20 dark:group-hover:bg-royal-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Email</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Kristiyan@Tsvweb.com</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">We'll respond within 24 hours</p>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-royal-blue/30 dark:hover:border-royal-blue/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center group-hover:bg-royal-blue/20 dark:group-hover:bg-royal-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Office</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">318 Shady Ln.</p>
                      <p className="text-gray-700 dark:text-gray-300">Birmingham B44 9EB, United Kingdom</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">By appointment only</p>
                    </div>
                  </div>
                </div>
                
                <div className="group bg-gray-50 dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-royal-blue/30 dark:hover:border-royal-blue/30 transition-all duration-300 hover:shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center group-hover:bg-royal-blue/20 dark:group-hover:bg-royal-blue/30 transition-colors duration-300">
                      <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Business Hours</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">Monday-Friday: 9am-5pm</p>
                      <p className="text-gray-700 dark:text-gray-300">Saturday-Sunday: Closed</p>
                    </div>
                  </div>
                </div>
                
                <a href="https://wa.me/447444358808" target="_blank" rel="noopener noreferrer" className="group bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 transition-all duration-300 hover:shadow-lg block">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-800/30 rounded-lg flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-700/40 transition-colors duration-300">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787"/>
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">WhatsApp</h3>
                      <p className="text-gray-700 dark:text-gray-300 font-medium">+44 7444 358808</p>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Click to start a conversation</p>
                    </div>
                  </div>
                </a>
              </div>
              
              <div className="mt-10">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Follow Us</h3>
                <div className="flex space-x-3">
                  <a href="#" className="group w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-royal-blue dark:hover:bg-royal-blue transition-all duration-300 hover:scale-110">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-royal-blue dark:hover:bg-royal-blue transition-all duration-300 hover:scale-110">
                    <span className="sr-only">Instagram</span>
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-royal-blue dark:hover:bg-royal-blue transition-all duration-300 hover:scale-110">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="group w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-royal-blue dark:hover:bg-royal-blue transition-all duration-300 hover:scale-110">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div id="contact-form">
              <div className="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg">
                <h2 className="heading-2 text-gray-900 dark:text-white mb-8 text-center">Send Us a Message</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center mb-8">Ready to start your project? Fill out the form below and we'll get back to you within 24 hours. You can also reach us directly on WhatsApp!</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative">
        {/* Google Maps Embed */}
        <div className="h-96 w-full relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.8234567890123!2d-1.9076241!3d52.5496567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x43df824b5ae3d111%3A0xbd1b155528ae71e9!2sTsvWeb!5e0!3m2!1sen!2suk!4v1690000000000!5m2!1sen!2suk"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="grayscale hover:grayscale-0 transition-all duration-500"
          ></iframe>
          
          {/* Overlay Card */}
          <div className="absolute top-6 left-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 max-w-sm">
            <div className="flex items-start">
              <div className="w-12 h-12 bg-royal-blue/10 dark:bg-royal-blue/20 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-royal-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">TsvWeb Office</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">318 Shady Ln.</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Birmingham B44 9EB, UK</p>
                <a 
                  href="https://www.google.com/maps/place/TsvWeb/@52.5496567,-1.9076241,17z/data=!3m1!4b1!4m6!3m5!1s0x43df824b5ae3d111:0xbd1b155528ae71e9!8m2!3d52.5496567!4d-1.9050492!16s%2Fg%2F11yf7c1z3w?hl=en&entry=ttu&g_ep=EgoyMDI1MDcyMy4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm font-medium text-royal-blue hover:text-royal-blue-dark transition-colors duration-300"
                >
                  <span>Get Directions</span>
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-royal-blue relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/20 to-transparent"></div>
        </div>
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-2 text-white mb-6">Ready to Start Your Project?</h2>
            <p className="text-lg text-blue-100 mb-8">
              Don't wait any longer. Contact us today and let's discuss how we can help transform your business with a stunning website that converts visitors into customers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/services" className="bg-white text-royal-blue font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition-all duration-300 hover:scale-105">
                View Our Services
              </Link>
              <Link href="/portfolio" className="border-2 border-white text-white font-semibold py-3 px-8 rounded-lg hover:bg-white hover:text-royal-blue transition-all duration-300 hover:scale-105">
                See Our Work
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
