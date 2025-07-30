'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

type EnquiryData = {
  name?: string;
  email?: string;
  phone?: string;
  message: string;
};

export default function TsvAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m TSV AI. How can I help you today? Feel free to ask about our services or how we can help your business.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryData, setEnquiryData] = useState<EnquiryData>({ message: '' });
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Track page visits and time spent
  useEffect(() => {
    let startTime = Date.now();
    
    // Record page visit when component mounts
    const recordPageVisit = async () => {
      try {
        const title = document.title;
        await fetch('/api/ai/track-visit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            title,
            sessionId
          }),
        });
      } catch (error) {
        console.error('Failed to record page visit:', error);
      }
    };

    // Generate or retrieve session ID
    const getOrCreateSessionId = async () => {
      const storedSessionId = localStorage.getItem('tsvai_session_id');
      if (storedSessionId) {
        setSessionId(storedSessionId);
        return storedSessionId;
      } else {
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        localStorage.setItem('tsvai_session_id', newSessionId);
        setSessionId(newSessionId);
        return newSessionId;
      }
    };

    const initSession = async () => {
      const id = await getOrCreateSessionId();
      if (id) {
        recordPageVisit();
      }
    };

    initSession();

    // Record time spent when user leaves the page
    return () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
      if (timeSpent > 1 && sessionId) { // Only record if more than 1 second was spent
        fetch('/api/ai/track-time', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: pathname,
            timeSpent,
            sessionId
          }),
        }).catch(error => {
          console.error('Failed to record time spent:', error);
        });
      }
    };
  }, [pathname, sessionId]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load chat history from local storage
  useEffect(() => {
    const savedMessages = localStorage.getItem('tsvai_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        if (Array.isArray(parsedMessages) && parsedMessages.length > 0) {
          setMessages(parsedMessages);
        }
      } catch (error) {
        console.error('Failed to parse saved messages:', error);
      }
    }
  }, []);

  // Save messages to local storage
  useEffect(() => {
    if (messages.length > 1) { // Don't save if it's just the initial greeting
      localStorage.setItem('tsvai_messages', JSON.stringify(messages));
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input,
          history: messages,
          sessionId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessage = (content: string) => {
    // Replace service links with actual links
    const serviceRegex = /\/services/gi;
    const whatsappRegex = /\+44\s?07444\s?358\s?808/g;
    const portfolioRegex = /\/portfolio/gi;
    const contactRegex = /\/contact/gi;
    const enquiryRegex = /(send|submit)\s+(an?|your)\s+enqu?ir(y|ies)/gi;
    
    let formattedContent = content.replace(serviceRegex, '<a href="/services" class="text-blue-500 hover:underline">/services</a>');
    formattedContent = formattedContent.replace(whatsappRegex, '<a href="https://wa.me/447444358808" target="_blank" class="text-green-500 hover:underline">+44 07444 358 808</a>');
    formattedContent = formattedContent.replace(portfolioRegex, '<a href="/portfolio" class="text-blue-500 hover:underline">/portfolio</a>');
    formattedContent = formattedContent.replace(contactRegex, '<a href="/contact" class="text-blue-500 hover:underline">/contact</a>');
    formattedContent = formattedContent.replace(enquiryRegex, '<button class="text-blue-500 hover:underline enquiry-button">send an enquiry</button>');
    
    return (
      <div 
        dangerouslySetInnerHTML={{ __html: formattedContent }} 
        onClick={(e) => {
          // Handle enquiry button clicks
          if ((e.target as HTMLElement).classList.contains('enquiry-button')) {
            setShowEnquiryForm(true);
          }
        }}
      />
    );
  };
  
  const handleNavigate = (path: string) => {
    router.push(path);
    setIsOpen(false);
  };
  
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnquirySubmitting(true);
    
    try {
      const response = await fetch('/api/contact/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...enquiryData,
          source: 'AI Assistant'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit enquiry');
      }
      
      // Add confirmation message to chat
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `Thank you for your enquiry! We've received your message and will get back to you soon. If you need immediate assistance, you can contact us directly via WhatsApp at +44 07444 358 808.` 
      }]);
      
      // Reset form
      setShowEnquiryForm(false);
      setEnquiryData({ message: '' });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, there was an error submitting your enquiry. Please try again later or contact us directly via WhatsApp at +44 07444 358 808.' 
      }]);
    } finally {
      setEnquirySubmitting(false);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all z-50"
        aria-label="Open chat with TSV AI"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs font-bold mt-1">TSV AI</span>
          </div>
        )}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col z-50 border border-gray-200">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold">TSV AI Assistant</h3>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-gray-200">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Quick Navigation Buttons */}
          <div className="bg-gray-50 p-2 flex space-x-2 overflow-x-auto">
            <button 
              onClick={() => handleNavigate('/services')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 whitespace-nowrap"
            >
              Services
            </button>
            <button 
              onClick={() => handleNavigate('/portfolio')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 whitespace-nowrap"
            >
              Portfolio
            </button>
            <button 
              onClick={() => handleNavigate('/contact')}
              className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-full hover:bg-gray-100 whitespace-nowrap"
            >
              Contact Us
            </button>
            <button 
              onClick={() => window.open('https://wa.me/447444358808', '_blank')}
              className="px-3 py-1 text-sm bg-green-50 border border-green-300 text-green-700 rounded-full hover:bg-green-100 whitespace-nowrap"
            >
              WhatsApp
            </button>
          </div>
          
          {/* Messages or Enquiry Form */}
          {showEnquiryForm ? (
            <div className="flex-1 overflow-y-auto p-4">
              <h3 className="font-medium text-lg mb-4">Send us an enquiry</h3>
              <form onSubmit={handleSubmitEnquiry} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={enquiryData.name || ''}
                    onChange={(e) => setEnquiryData({...enquiryData, name: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    value={enquiryData.email || ''}
                    onChange={(e) => setEnquiryData({...enquiryData, email: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone (optional)</label>
                  <input
                    type="tel"
                    id="phone"
                    value={enquiryData.phone || ''}
                    onChange={(e) => setEnquiryData({...enquiryData, phone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea
                    id="message"
                    value={enquiryData.message}
                    onChange={(e) => setEnquiryData({...enquiryData, message: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={4}
                    placeholder="How can we help you?"
                    required
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    disabled={enquirySubmitting}
                    className="bg-blue-600 text-white rounded-md px-4 py-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300 flex-1"
                  >
                    {enquirySubmitting ? 'Sending...' : 'Send Enquiry'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEnquiryForm(false)}
                    className="border border-gray-300 rounded-md px-4 py-2 hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div 
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    {formatMessage(message.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
          
          {/* Input area - only show when not displaying enquiry form */}
          {!showEnquiryForm && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
              <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                <Link href="/terms-of-service" className="hover:underline">Terms of Service</Link>
                <button 
                  onClick={() => setShowEnquiryForm(true)}
                  className="text-blue-500 hover:underline"
                >
                  Send Enquiry
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
