"use client"

import { motion } from 'framer-motion'

interface ProjectType {
  title: string
  description: string
  examples: string
}

interface ProjectTypesSectionProps {
  projectTypes: ProjectType[]
}

export default function ProjectTypesSection({ projectTypes }: ProjectTypesSectionProps) {
  return (
    <section className="py-24 bg-white dark:bg-gray-900">
      <div className="container-custom">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6">
            What We <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">Build</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {projectTypes.map((type, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-2xl border-l-4 border-indigo-600"
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">{type.title}</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{type.description}</p>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
                Examples: {type.examples}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
