"use client"

import { motion } from 'framer-motion'

interface Technology {
  name: string
  icon: string
  color: string
}

interface HeroSectionProps {
  technologies: Technology[]
}

export default function HeroSection({ technologies }: HeroSectionProps) {
  return (
    <section className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container-custom relative z-10">
        <motion.div 
          className="max-w-5xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-full text-sm font-bold"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            💻 Modern Web Development
          </motion.div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-tight text-gray-900 dark:text-white">
            Build Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Digital Future</span><br />
            With Expert Developers
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Custom web development using cutting-edge technology. <br className="hidden md:block" />
            Fast, secure, and built to scale. Birmingham's trusted developers.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a
              href="#packages"
              className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 text-white font-black text-xl px-12 py-6 rounded-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
            >
              View Packages
            </a>
            <a
              href="#contact"
              className="inline-block bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 font-black text-xl px-12 py-6 rounded-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 uppercase tracking-wider"
            >
              Get Free Quote
            </a>
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={index}
                className={`px-6 py-3 bg-gradient-to-r ${tech.color} text-white rounded-full font-bold flex items-center gap-2`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <span>{tech.icon}</span>
                <span>{tech.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
