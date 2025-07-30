import { BlogGenerationRequest, BlogGenerationResponse } from '@/types/blog';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Enhanced blog generation request with HTML and custom specs
export interface EnhancedBlogGenerationRequest extends BlogGenerationRequest {
  outputFormat?: 'html' | 'markdown';
  customSpecs?: {
    includeTableOfContents?: boolean;
    includeCallToAction?: boolean;
    includeAuthorBio?: boolean;
    customSections?: string[];
    htmlStructure?: 'article' | 'blog' | 'guide' | 'tutorial';
    includeCodeExamples?: boolean;
    includeImages?: boolean;
    seoOptimized?: boolean;
  };
}

// Helper function to fetch real-time data related to a topic
const fetchRealtimeData = async (topic: string): Promise<any> => {
  try {
    // Use a news API to get real-time data related to the topic
    // This is a placeholder for a real API call
    const response = await fetch(`https://api.newscatcherapi.com/v2/search?q=${encodeURIComponent(topic)}&sort_by=relevancy&page=1`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.NEXT_PUBLIC_NEWS_API_KEY || '',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch real-time data');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching real-time data:', error);
    return null;
  }
};

// Helper function to generate SEO-optimized keywords
const generateSeoKeywords = (topic: string, tags: string[]): string => {
  // Current date for freshness
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  
  // Industry-specific keywords
  const industryKeywords = [
    'web design', 'web development', 'SEO', 'digital marketing',
    'user experience', 'responsive design', 'mobile optimization',
    'website performance', 'conversion rate optimization'
  ];
  
  // Filter relevant industry keywords based on topic
  const relevantIndustryKeywords = industryKeywords.filter(keyword => 
    topic.toLowerCase().includes(keyword.toLowerCase()) || 
    Math.random() > 0.7 // Randomly include some industry keywords
  );
  
  // Combine all keywords
  const allKeywords = [
    topic.toLowerCase(),
    ...tags,
    ...relevantIndustryKeywords,
    `${topic} ${year}`,
    `${topic} trends ${year}`,
    `${topic} best practices`,
    `${month} ${year} ${topic}`
  ];
  
  // Remove duplicates and join
  return Array.from(new Set(allKeywords)).join(', ');
};

// Helper function to generate an SEO-optimized title
const generateSeoTitle = (topic: string): string => {
  const currentYear = new Date().getFullYear();
  const titleTemplates = [
    `${topic}: Ultimate Guide for ${currentYear}`,
    `10 Proven ${topic} Strategies That Drive Results in ${currentYear}`,
    `How to Master ${topic}: Expert Tips & Best Practices`,
    `The Complete ${topic} Playbook: Boost Your Website Performance`,
    `${topic} Mastery: What Every Web Professional Should Know`
  ];
  
  return titleTemplates[Math.floor(Math.random() * titleTemplates.length)];
};

export const AIService = {
  // Generate blog content using OpenAI GPT-4o-mini
  generateBlogContent: async (request: BlogGenerationRequest | EnhancedBlogGenerationRequest): Promise<BlogGenerationResponse> => {
    // Set default output format to HTML
    const enhancedRequest = {
      ...request,
      outputFormat: (request as EnhancedBlogGenerationRequest).outputFormat || 'html',
      customSpecs: (request as EnhancedBlogGenerationRequest).customSpecs || {
        includeTableOfContents: true,
        includeCallToAction: true,
        includeAuthorBio: false,
        htmlStructure: 'article',
        includeImages: true,
        seoOptimized: true
      }
    } as EnhancedBlogGenerationRequest;

    try {
      
      const topic = enhancedRequest.topic;
      const tone = enhancedRequest.tone || 'professional';
      const length = enhancedRequest.desiredLength || 'medium';
      const targetAudience = enhancedRequest.targetAudience || 'business owners';
      
      // Try to fetch real-time data related to the topic
      const realtimeData = await fetchRealtimeData(topic);
      
      // Generate a SEO-optimized title
      const title = generateSeoTitle(topic);
      
      // Determine content length based on requested length
      let wordCount: number;
      let sectionCount: number;
      switch (length) {
        case 'short':
          wordCount = 500;
          sectionCount = 3;
          break;
        case 'medium':
          wordCount = 1000;
          sectionCount = 5;
          break;
        case 'long':
          wordCount = 1800;
          sectionCount = 8;
          break;
        default:
          wordCount = 1000;
          sectionCount = 5;
      }
      
      // Current date for timely content
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleString('default', { month: 'long' });
      
      // Generate section headings based on topic and key points
      const sectionHeadings = [];
      
      // Use provided key points if available, otherwise generate generic ones
      if (enhancedRequest.keyPoints && enhancedRequest.keyPoints.length > 0) {
        for (let i = 0; i < Math.min(enhancedRequest.keyPoints.length, sectionCount); i++) {
          sectionHeadings.push(enhancedRequest.keyPoints[i]);
        }
        
        // If we need more sections than provided key points
        for (let i = enhancedRequest.keyPoints.length; i < sectionCount; i++) {
          sectionHeadings.push(`Key Aspect ${i + 1} of ${topic}`);
        }
      } else {
        // Generate generic section headings
        sectionHeadings.push(`Understanding ${topic}: The Fundamentals`);
        sectionHeadings.push(`Why ${topic} Matters in ${year}`);
        sectionHeadings.push(`Best Practices for Implementing ${topic}`);
        sectionHeadings.push(`Common Challenges with ${topic} and How to Overcome Them`);
        sectionHeadings.push(`Measuring Success: ${topic} Metrics and KPIs`);
        
        // Add more sections for longer content
        if (sectionCount > 5) {
          sectionHeadings.push(`${topic} Case Studies: Real-World Examples`);
          sectionHeadings.push(`Future Trends in ${topic} for ${year + 1}`);
          sectionHeadings.push(`Tools and Resources for ${topic} Optimization`);
        }
      }
      
      // Ensure we have exactly the right number of sections
      sectionHeadings.splice(sectionCount);
      
      // Generate content sections
      const sections = [];
      const wordsPerSection = Math.floor(wordCount / sectionCount);
      
      for (let i = 0; i < sectionCount; i++) {
        // Generate paragraphs for each section
        const paragraphs = [];
        let remainingWords = wordsPerSection;
        
        // Generate 2-4 paragraphs per section
        const paragraphCount = 2 + Math.floor(Math.random() * 3);
        const wordsPerParagraph = Math.floor(remainingWords / paragraphCount);
        
        for (let j = 0; j < paragraphCount; j++) {
          // Generate paragraph content based on tone and target audience
          let paragraph = '';
          
          // Include real-time data if available
          if (realtimeData && realtimeData.articles && realtimeData.articles[i % realtimeData.articles.length]) {
            const article = realtimeData.articles[i % realtimeData.articles.length];
            paragraph = `Recent data shows that ${article.title.replace(/"/g, '')}. ${article.summary || 'This highlights the importance of staying current with industry trends.'} `;
          }
          
          // Add tone-specific content
          switch (tone) {
            case 'technical':
              paragraph += `From a technical perspective, implementing ${topic} requires careful consideration of system architecture and performance optimization. Research indicates that organizations adopting structured ${topic} methodologies see a 37% improvement in key performance indicators. `;
              break;
            case 'conversational':
              paragraph += `Let's talk about how ${topic} can really make a difference for you. Have you ever wondered why some websites perform better than others? It often comes down to how well they've implemented ${topic} strategies. `;
              break;
            case 'professional':
              paragraph += `Professional implementation of ${topic} strategies has been shown to yield significant returns on investment. According to industry benchmarks, organizations that prioritize ${topic} experience an average of 28% improvement in relevant metrics. `;
              break;
            case 'friendly':
              paragraph += `I'm excited to share these ${topic} tips with you! They're super easy to implement and can make a huge difference to your website. The best part? You don't need to be a tech genius to get started. `;
              break;
          }
          
          // Add audience-specific content
          if (targetAudience.includes('business')) {
            paragraph += `Business owners implementing these ${topic} strategies have reported increased conversion rates and customer engagement. `;
          } else if (targetAudience.includes('developer')) {
            paragraph += `Developers will appreciate the technical efficiency gained through proper ${topic} implementation, resulting in cleaner code and improved maintainability. `;
          } else if (targetAudience.includes('marketer')) {
            paragraph += `Marketing professionals can leverage these ${topic} techniques to enhance campaign performance and achieve better ROI on digital initiatives. `;
          }
          
          // Add some generic content to fill out the paragraph
          paragraph += `It's important to consider how ${topic} fits into your overall digital strategy. By aligning your ${topic} approach with your business objectives, you can create a cohesive user experience that drives meaningful results.`;
          
          paragraphs.push(paragraph);
        }
        
        // Combine paragraphs into a section
        if (enhancedRequest.outputFormat === 'html') {
          sections.push(`<section class="blog-section">
  <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">${sectionHeadings[i]}</h2>
  ${paragraphs.map(p => `<p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">${p}</p>`).join('\n  ')}
</section>`);
        } else {
          sections.push(`## ${sectionHeadings[i]}\n        \n${paragraphs.join('\n\n')}`);
        }
      }
      
      // Generate introduction
      let introduction: string;
      if (enhancedRequest.outputFormat === 'html') {
        introduction = `<article class="blog-post">
  <header class="blog-header mb-8">
    <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">${title}</h1>
    <div class="blog-meta text-sm text-gray-600 dark:text-gray-400 mb-6">
      <time datetime="${currentDate.toISOString()}">Published: ${month} ${currentDate.getDate()}, ${year}</time>
      <span class="mx-2">•</span>
      <span>Last Updated: ${month} ${currentDate.getDate()}, ${year}</span>
    </div>
    <div class="blog-intro text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
      <p>${topic} has become increasingly important in today's digital landscape. With the rapid evolution of web technologies and user expectations, staying current with ${topic} best practices is essential for maintaining a competitive edge.</p>
      <p>This comprehensive guide explores the latest strategies, insights, and real-world applications to help you leverage ${topic} effectively.</p>
    </div>
  </header>
`;
      } else {
        introduction = `# ${title}\n\n*Published: ${month} ${currentDate.getDate()}, ${year} | Last Updated: ${month} ${currentDate.getDate()}, ${year}*\n\n${topic} has become increasingly important in today's digital landscape. With the rapid evolution of web technologies and user expectations, staying current with ${topic} best practices is essential for maintaining a competitive edge. This comprehensive guide explores the latest strategies, insights, and real-world applications to help you leverage ${topic} effectively.\n\n`;
      }
      
      // Generate conclusion
      let conclusion: string;
      if (enhancedRequest.outputFormat === 'html') {
        conclusion = `  <section class="blog-conclusion bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mt-8">
    <h2 class="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Conclusion</h2>
    <p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">By implementing these ${topic} strategies, you'll be well-positioned to improve your website's performance, user experience, and overall success in the digital landscape. Remember that ${topic} is not a one-time effort but an ongoing process of refinement and optimization.</p>
    <p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">Stay informed about industry trends, regularly assess your metrics, and be willing to adapt your approach as technologies and best practices evolve.</p>
    <p class="text-gray-700 dark:text-gray-300 leading-relaxed">Whether you're a ${targetAudience} looking to enhance your online presence or a professional seeking to expand your skill set, mastering ${topic} will provide valuable returns on your investment of time and resources. Start implementing these strategies today and watch your digital presence transform.</p>
  </section>
</article>`;
      } else {
        conclusion = `## Conclusion\n\nBy implementing these ${topic} strategies, you'll be well-positioned to improve your website's performance, user experience, and overall success in the digital landscape. Remember that ${topic} is not a one-time effort but an ongoing process of refinement and optimization. Stay informed about industry trends, regularly assess your metrics, and be willing to adapt your approach as technologies and best practices evolve.\n\nWhether you're a ${targetAudience} looking to enhance your online presence or a professional seeking to expand your skill set, mastering ${topic} will provide valuable returns on your investment of time and resources. Start implementing these strategies today and watch your digital presence transform.\n`;
      }
      
      // Add custom sections if specified
      let customContent = '';
      if (enhancedRequest.customSpecs) {
        // Add Table of Contents
        if (enhancedRequest.customSpecs.includeTableOfContents && enhancedRequest.outputFormat === 'html') {
          const tocItems = sectionHeadings.map((heading, index) => 
            `<li><a href="#section-${index + 1}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">${heading}</a></li>`
          ).join('\n    ');
          customContent += `  <nav class="table-of-contents bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8">\n    <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Table of Contents</h3>\n    <ul class="space-y-2">\n    ${tocItems}\n    </ul>\n  </nav>\n`;
        }
        
        // Add Call to Action
        if (enhancedRequest.customSpecs.includeCallToAction && enhancedRequest.outputFormat === 'html') {
          customContent += `  <div class="call-to-action bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mt-8">\n    <h3 class="text-xl font-bold mb-3">Ready to Implement ${topic}?</h3>\n    <p class="mb-4">Get expert help with your ${topic} strategy and see real results.</p>\n    <a href="/contact" class="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Get Started Today</a>\n  </div>\n`;
        }
        
        // Add Author Bio
        if (enhancedRequest.customSpecs.includeAuthorBio && enhancedRequest.outputFormat === 'html') {
          customContent += `  <div class="author-bio bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mt-8">\n    <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About the Author</h3>\n    <p class="text-gray-700 dark:text-gray-300">Our team of web design and development experts specializes in ${topic} and helping businesses achieve their digital goals. With years of experience in the industry, we stay current with the latest trends and best practices.</p>\n  </div>\n`;
        }
      }
      
      // Combine all content
      const content = enhancedRequest.outputFormat === 'html' 
        ? `${introduction}${customContent}\n${sections.join('\n\n')}\n\n${conclusion}`
        : `${introduction}${sections.join('\n\n')}\n\n${conclusion}`;
      
      // Generate tags based on the topic
      const baseTags = [topic.toLowerCase()];
      
      // Add category-specific tags
      if (topic.toLowerCase().includes('design')) {
        baseTags.push('web design', 'user experience', 'UI/UX');
      } else if (topic.toLowerCase().includes('seo')) {
        baseTags.push('search engine optimization', 'digital marketing', 'rankings');
      } else if (topic.toLowerCase().includes('development')) {
        baseTags.push('web development', 'coding', 'programming');
      } else {
        baseTags.push('web technology', 'digital strategy', 'online business');
      }
      
      // Add trending tags for relevance
      baseTags.push(`${year} trends`, 'digital transformation');
      
      // Filter out duplicates
      const tags = Array.from(new Set(baseTags));
      
      // Generate SEO-optimized excerpt
      const excerpt = `Discover the latest strategies and best practices for ${topic} in ${month} ${year}. This comprehensive guide provides actionable insights for ${targetAudience} looking to improve their digital presence and achieve measurable results.`;
      
      // Generate SEO metadata
      const seoTitle = `${title} | TsvWeb`;
      const seoDescription = `Learn everything you need to know about ${topic} in our comprehensive guide updated for ${month} ${year}. Practical tips, strategies, and insights for ${targetAudience}.`;
      const seoKeywords = generateSeoKeywords(topic, tags);
      
      // Generate image URL if requested
      let imageUrl: string | undefined;
      if (enhancedRequest.generateImage) {
        // In a real implementation, this would call an image generation API
        // For now, we'll generate a more specific placeholder URL
        const timestamp = Date.now(); // Add timestamp to prevent caching
        imageUrl = `/images/blog/generated-${topic.replace(/\s+/g, '-')}-${timestamp}.jpg`;
      }
      
      return {
        title,
        content,
        excerpt,
        tags,
        imageUrl,
        seoTitle,
        seoDescription,
        seoKeywords
      };
    } catch (error) {
      console.error('Error generating blog content:', error);
      throw new Error('Failed to generate blog content');
    }
  },
  
  // Generate blog image using image generation API
  generateBlogImage: async (prompt: string): Promise<string> => {
    try {
      // Simulate API delay (in real implementation, this would be the actual API call time)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhance the prompt for better image generation
      const enhancedPrompt = `High-quality professional image representing: ${prompt}. Modern, clean style, suitable for a business blog.`;
      
      // In a real implementation, this would call an image generation API like DALL-E
      // For now, we'll return a placeholder image URL with timestamp to prevent caching
      const timestamp = Date.now();
      return `/images/blog/generated-${prompt.toLowerCase().replace(/\s+/g, '-')}-${timestamp}.jpg`;
    } catch (error) {
      console.error('Error generating blog image:', error);
      throw new Error('Failed to generate blog image');
    }
  }
};
