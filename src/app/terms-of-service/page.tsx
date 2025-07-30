import React from 'react';

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-4">
          Welcome to TSVWeb. These Terms of Service govern your use of our website and services, including our AI assistant feature.
          By using our website or services, you agree to these terms. Please read them carefully.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Use of AI Assistant</h2>
        <p className="mb-4">
          Our website features an AI assistant designed to help you navigate our services and provide information.
          The AI assistant may collect and store your conversations and interactions to improve our services and assist you better.
        </p>
        <p className="mb-4">
          By using the AI assistant, you acknowledge and consent to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">The collection and storage of your conversation history</li>
          <li className="mb-2">The tracking of your website usage patterns</li>
          <li className="mb-2">The use of this data to improve our services and your experience</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Privacy and Data Collection</h2>
        <p className="mb-4">
          We respect your privacy and are committed to protecting your personal data. When you use our AI assistant:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">We collect your IP address for identification purposes</li>
          <li className="mb-2">We store the content of your conversations with the AI</li>
          <li className="mb-2">We track which pages you visit and how long you spend on them</li>
          <li className="mb-2">We may use cookies to enhance your experience</li>
        </ul>
        <p className="mb-4">
          This information is used to improve our services, provide better assistance, and analyze user behavior.
          We do not sell your personal data to third parties.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Inquiries and Contact Information</h2>
        <p className="mb-4">
          When you submit an inquiry through our AI assistant or provide contact information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">You consent to being contacted by TSVWeb regarding your inquiry</li>
          <li className="mb-2">Your contact information will be stored in our secure database</li>
          <li className="mb-2">We may use this information to follow up on your inquiry or provide relevant services</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Limitations of AI Assistant</h2>
        <p className="mb-4">
          While our AI assistant strives to provide accurate and helpful information:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">It may not always provide complete or up-to-date information</li>
          <li className="mb-2">It should not be relied upon for critical business decisions</li>
          <li className="mb-2">For important matters, please contact our team directly</li>
        </ul>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
        <p className="mb-4">
          We may update these Terms of Service from time to time. We will notify you of any changes by posting the new Terms on this page.
          Your continued use of our website and services after such modifications will constitute your acknowledgment of the modified Terms.
        </p>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
        </p>
        <p className="mb-4">
          Email: info@tsvweb.com<br />
          WhatsApp: +44 07444 358 808
        </p>
      </section>
      
      <div className="border-t pt-6 text-sm text-gray-600">
        <p>Last updated: July 30, 2025</p>
      </div>
    </div>
  );
}
