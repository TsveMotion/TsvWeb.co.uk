"use client";

import { useState, useEffect } from 'react';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';
import PageSEO from '@/components/seo/page-seo';
import { Mail, CheckCircle, ArrowRight, Sparkles, Zap, TrendingUp, Users, Gift, Clock, Star } from 'lucide-react';

interface Newsletter {
  _id: string;
  subject: string;
  content: string;
  sentAt: string;
  recipientCount: number;
  status: string;
}

export default function MarketingPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch recent newsletters
  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch('/api/newsletter?limit=6&status=sent');
        const data = await response.json();
        
        if (data.success && data.data) {
          setNewsletters(data.data);
        }
      } catch (err) {
        console.error('Error fetching newsletters:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsletters();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
      } else {
        setError(data.message || 'Failed to subscribe');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const extractPreview = (content: string) => {
    // Remove HTML tags and get first 150 characters
    const text = content.replace(/<[^>]*>/g, '');
    return text.length > 150 ? text.substring(0, 150) + '...' : text;
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900"></div>
          <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              
              {/* Left Side - Value Prop */}
              <div className="text-white">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-semibold mb-6">
                  <Sparkles className="w-4 h-4" />
                  Join 500+ Subscribers
                </div>
                
                <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Get Web Design Tips &{' '}
                  <span className="text-yellow-300">Exclusive Offers</span>
                </h1>
                
                <p className="text-xl text-blue-100 mb-8">
                  Subscribe to our newsletter and receive expert insights, industry trends, 
                  and special discounts delivered to your inbox weekly.
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mb-8">
                  <div>
                    <div className="text-3xl font-bold mb-1">500+</div>
                    <div className="text-sm text-blue-200">Subscribers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">50+</div>
                    <div className="text-sm text-blue-200">Newsletters</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold mb-1">5★</div>
                    <div className="text-sm text-blue-200">Rated</div>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">Weekly web design tips & tutorials</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">Exclusive subscriber-only discounts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">Early access to new services</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                    <span className="text-blue-100">Real success stories from Birmingham businesses</span>
                  </div>
                </div>
              </div>

              {/* Right Side - Subscribe Form */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-10 border border-gray-200 dark:border-gray-700">
                {success ? (
                  <div className="text-center py-8">
                    <div className="inline-block p-4 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
                      <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      You're Subscribed! 🎉
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Check your email for a confirmation message and your first newsletter.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
                    >
                      Subscribe another email
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="text-center mb-6">
                      <div className="inline-block p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mb-4">
                        <Mail className="w-8 h-8 text-white" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Subscribe to Our Newsletter
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Get weekly insights delivered to your inbox
                      </p>
                    </div>

                    <form onSubmit={handleSubscribe} className="space-y-5">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Subscribing...
                          </>
                        ) : (
                          <>
                            Subscribe Now
                            <ArrowRight className="w-5 h-5" />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        No spam. Unsubscribe anytime. We respect your privacy.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What You'll Get Section */}
        <div className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What You'll Get
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Premium content delivered straight to your inbox
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Weekly Tips
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Expert web design and SEO tips to grow your online presence
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Exclusive Offers
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Special discounts and early access to new services
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Case Studies
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Real success stories from Birmingham businesses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Newsletters */}
        <div className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Recent Newsletters
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                See what our subscribers are reading
              </p>
            </div>
            
            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading newsletters...</p>
              </div>
            ) : newsletters.length === 0 ? (
              <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
                <Mail className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">No newsletters sent yet. Subscribe to be the first to know!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsletters.map((newsletter) => (
                  <div key={newsletter._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden border border-gray-200 dark:border-gray-700">
                    <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
                      <Mail className="w-16 h-16 text-white opacity-80 relative z-10" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(newsletter.sentAt)}
                        </p>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {newsletter.subject}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                        {extractPreview(newsletter.content)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Users className="w-4 h-4" />
                          <span>{newsletter.recipientCount || 0} readers</span>
                        </div>
                        <button className="text-blue-600 dark:text-blue-400 font-semibold text-sm hover:underline flex items-center gap-1">
                          Read More
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 dark:from-black dark:to-gray-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <Star className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Grow Your Business?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Get a free quote and see how we can help transform your online presence. 
              Join 500+ Birmingham businesses who trust TsvWeb.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/request-quote"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold px-8 py-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Get Free Quote
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg hover:bg-white/20 transition-all border border-white/20"
              >
                View Services
              </a>
            </div>
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
