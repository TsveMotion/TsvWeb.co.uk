"use client"

import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import PageSEO from '@/components/seo/page-seo'

export default function TermsOfService() {
  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <PageSEO 
        title="Terms of Service | TsvWeb"
        description="TsvWeb's terms of service. Learn about our policies, AI assistant usage, and service terms."
        canonical="https://tsvweb.com/terms-of-service"
      />
      <Navbar />
      
      <div className="container-custom py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-8">Terms of Service</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-12">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-lg max-w-none">
      
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">1. Introduction</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Welcome to TsvWeb. These Terms of Service govern your use of our website and services, including our AI assistant feature.
                By using our website or services, you agree to these terms. Please read them carefully.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">2. Use of AI Assistant</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Our website features an AI assistant designed to help you navigate our services and provide information.
                The AI assistant may collect and store your conversations and interactions to improve our services and assist you better.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                By using the AI assistant, you acknowledge and consent to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>The collection and storage of your conversation history</li>
                <li>The tracking of your website usage patterns</li>
                <li>The use of this data to improve our services and your experience</li>
              </ul>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">3. Privacy and Data Collection</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We respect your privacy and are committed to protecting your personal data. When you use our AI assistant:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2 mb-4">
                <li>We collect your IP address for identification purposes</li>
                <li>We store the content of your conversations with the AI</li>
                <li>We track which pages you visit and how long you spend on them</li>
                <li>We may use cookies to enhance your experience</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This information is used to improve our services, provide better assistance, and analyze user behavior.
                We do not sell your personal data to third parties.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">4. Inquiries and Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you submit an inquiry through our AI assistant or provide contact information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>You consent to being contacted by TsvWeb regarding your inquiry</li>
                <li>Your contact information will be stored in our secure database</li>
                <li>We may use this information to follow up on your inquiry or provide relevant services</li>
              </ul>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">5. Limitations of AI Assistant</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                While our AI assistant strives to provide accurate and helpful information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
                <li>It may not always provide complete or up-to-date information</li>
                <li>It should not be relied upon for critical business decisions</li>
                <li>For important matters, please contact our team directly</li>
              </ul>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">6. Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page.
                Your continued use of our website and services after such modifications will constitute your acknowledgment of the modified Terms.
              </p>
            </section>
            
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">7. Contact Us</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms, please contact us:
              </p>
              <div className="bg-blue-50 dark:bg-gray-800 p-6 rounded-lg border-l-4 border-[#007BFF]">
                <p className="text-gray-900 dark:text-white font-bold mb-2">TsvWeb</p>
                <p className="text-gray-700 dark:text-gray-300">Email: <a href="mailto:hello@tsvweb.com" className="text-[#007BFF] hover:underline">hello@tsvweb.com</a></p>
                <p className="text-gray-700 dark:text-gray-300">Phone: <a href="tel:+4407444358808" className="text-[#007BFF] hover:underline">07444 358808</a></p>
              </div>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
