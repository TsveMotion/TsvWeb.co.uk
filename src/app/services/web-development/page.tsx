import Navbar from '@/components/navigation/navbar'
import Footer from '@/components/navigation/footer'
import Link from 'next/link'
import ContactForm from './ContactForm'
import HeroSection from './HeroSection'
import FeaturesSection from './FeaturesSection'
import PricingSection from './PricingSection'
import ProjectTypesSection from './ProjectTypesSection'

export default function WebDevelopmentPage() {
  const technologies = [
    { name: "React", icon: "⚛️", color: "from-cyan-500 to-blue-500" },
    { name: "Next.js", icon: "▲", color: "from-gray-700 to-black" },
    { name: "Node.js", icon: "🟢", color: "from-green-600 to-green-800" },
    { name: "TypeScript", icon: "📘", color: "from-blue-600 to-blue-800" },
    { name: "MongoDB", icon: "🍃", color: "from-green-500 to-green-700" },
    { name: "Tailwind", icon: "🎨", color: "from-cyan-400 to-blue-500" }
  ]

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast Performance",
      description: "Optimized code and modern frameworks for blazing-fast load times"
    },
    {
      icon: "🔒",
      title: "Enterprise Security",
      description: "Bank-level security with SSL, encryption, and regular security audits"
    },
    {
      icon: "📱",
      title: "Fully Responsive",
      description: "Perfect experience on desktop, tablet, and mobile devices"
    },
    {
      icon: "🚀",
      title: "Scalable Architecture",
      description: "Built to grow with your business from startup to enterprise"
    },
    {
      icon: "🔧",
      title: "Custom Solutions",
      description: "Tailored features and integrations specific to your business needs"
    },
    {
      icon: "📊",
      title: "Analytics Integration",
      description: "Track user behavior, conversions, and business metrics in real-time"
    }
  ]

  const packages = [
    {
      name: "Business Website",
      price: "£30",
      period: "/month",
      setup: "£0 setup fee",
      description: "Perfect for small businesses",
      features: [
        "5-Page Professional Website",
        "Mobile-Responsive Design",
        "Contact Forms",
        "Google Maps Integration",
        "SEO Optimization",
        "SSL Certificate",
        "Free Hosting",
        "Email Support"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Custom Development",
      price: "£2000",
      period: " + £150/month",
      setup: "One-time build fee",
      description: "Most popular for growing businesses",
      features: [
        "Custom Design & Features",
        "Advanced Functionality",
        "Database Integration",
        "User Authentication",
        "Admin Dashboard",
        "API Integrations",
        "Payment Processing",
        "Priority Support",
        "Free Revisions",
        "Lifetime Updates"
      ],
      cta: "Start Building",
      popular: true
    },
    {
      name: "Enterprise Solution",
      price: "Custom",
      period: "pricing",
      setup: "Full-scale solution",
      description: "For complex applications",
      features: [
        "Everything in Custom",
        "Multi-User Systems",
        "Advanced Security",
        "Cloud Infrastructure",
        "Microservices Architecture",
        "Real-time Features",
        "Third-party Integrations",
        "Dedicated Dev Team",
        "24/7 Support",
        "SLA Guarantee"
      ],
      cta: "Contact Us",
      popular: false
    }
  ]

  const projectTypes = [
    {
      title: "Web Applications",
      description: "Custom web apps with complex functionality and user management",
      examples: "CRM systems, booking platforms, dashboards"
    },
    {
      title: "E-commerce Platforms",
      description: "Full-featured online stores with inventory and payment systems",
      examples: "Product catalogs, shopping carts, order management"
    },
    {
      title: "Business Websites",
      description: "Professional corporate websites with modern design",
      examples: "Company sites, portfolios, landing pages"
    },
    {
      title: "API Development",
      description: "RESTful APIs and backend services for mobile apps",
      examples: "Mobile backends, integrations, webhooks"
    }
  ]

  return (
    <main className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar />

      <HeroSection technologies={technologies} />

      <ProjectTypesSection projectTypes={projectTypes} />

      <FeaturesSection features={features} />

      <PricingSection packages={packages} />

      <ContactForm />

      {/* Back to Services */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 border-t-4 border-indigo-600">
        <div className="container-custom text-center">
          <Link 
            href="/services"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-pink-600 font-bold text-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            View All Services
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  )
}
