import Link from 'next/link';
import Navbar from '@/components/navigation/navbar';
import Footer from '@/components/navigation/footer';

export default function PortfolioNotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24 md:py-32 flex-grow flex items-center justify-center">
        <div className="text-center max-w-2xl">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Portfolio Project Not Found
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            The portfolio project you're looking for doesn't exist or has been removed. 
            Please check the URL or browse our other projects.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/portfolio"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-royal-blue to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              View All Projects
            </Link>
            
            <Link 
              href="/"
              className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-royal-blue dark:hover:border-royal-blue transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Go to Homepage
            </Link>
          </div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}
