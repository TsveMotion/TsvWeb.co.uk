import { BlogGenerationRequest, BlogGenerationResponse } from '@/types/blog';
import OpenAI from 'openai';

// Helper function to get OpenAI client (server-side only)
const getOpenAIClient = () => {
  if (typeof window !== 'undefined') {
    throw new Error('OpenAI client can only be used server-side');
  }
  
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY environment variable is required');
  }
  
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

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

// Helper function to generate SEO-optimized keywords
const generateSeoKeywords = (topic: string, tags: string[]): string => {
  // Current date for freshness
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  
  // Industry-specific keywords
  const industryKeywords = [
    'web design', 'website development', 'digital marketing', 'SEO',
    'user experience', 'conversion optimization', 'online business',
    'mobile responsive', 'performance optimization', 'digital strategy'
  ];
  
  // Location-based keywords (Birmingham focus)
  const locationKeywords = [
    'Birmingham', 'West Midlands', 'UK', 'local business', 'Birmingham business'
  ];
  
  // Time-based keywords
  const timeKeywords = [
    `${year}`, `${month} ${year}`, 'latest trends', 'current best practices'
  ];
  
  // Combine all keywords
  const allKeywords = [
    topic,
    ...tags,
    ...industryKeywords.slice(0, 3), // Limit industry keywords
    ...locationKeywords.slice(0, 2), // Limit location keywords
    ...timeKeywords.slice(0, 2) // Limit time keywords
  ];
  
  return Array.from(new Set(allKeywords)).join(', ');
};

// Helper function to generate an SEO-optimized title
const generateSeoTitle = (topic: string): string => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  
  // Generate different title patterns
  const patterns = [
    `${topic}: Complete Guide for ${year}`,
    `${topic} - Best Practices & Strategies ${year}`,
    `Ultimate ${topic} Guide: ${year} Edition`,
    `${topic}: Essential Tips for Success in ${year}`,
    `Master ${topic}: Comprehensive ${year} Guide`
  ];
  
  return patterns[Math.floor(Math.random() * patterns.length)];
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
      const keyPoints = enhancedRequest.keyPoints || [];
      
      // Determine content specifications based on length
      let wordCount: number;
      let sectionCount: number;
      switch (length) {
        case 'short':
          wordCount = 800;
          sectionCount = 4;
          break;
        case 'medium':
          wordCount = 1200;
          sectionCount = 6;
          break;
        case 'long':
          wordCount = 2000;
          sectionCount = 8;
          break;
        default:
          wordCount = 1200;
          sectionCount = 6;
      }
      
      // Current date for timely content
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.toLocaleString('default', { month: 'long' });
      
      // Create comprehensive prompt for OpenAI
      const systemPrompt = `You are an expert content writer specializing in web design, development, and digital marketing. Create comprehensive, SEO-optimized blog content that is engaging, informative, and actionable. Focus on providing real value to readers with specific examples, actionable tips, and current industry insights.`;
      
      const userPrompt = `Write a comprehensive blog post about "${topic}" with the following specifications:

**Content Requirements:**
- Target word count: ${wordCount} words
- Number of main sections: ${sectionCount}
- Tone: ${tone}
- Target audience: ${targetAudience}
- Output format: ${enhancedRequest.outputFormat}
- Current date: ${month} ${year}

**Key Points to Cover:**${keyPoints.length > 0 ? '\n- ' + keyPoints.join('\n- ') : '\n- Create relevant key points based on the topic'}

**Structure Requirements:**
1. SEO-optimized title (include ${year} for freshness)
2. Engaging introduction with hook and value proposition
3. ${sectionCount} main sections with descriptive H2 headings
4. Each section should have 2-3 paragraphs with specific examples
5. Actionable conclusion with clear next steps
6. Include current year (${year}) references throughout for freshness
7. Add statistics or data points where relevant

**Content Style:**
- Use short paragraphs (2-4 sentences max)
- Include specific examples and actionable tips
- Reference current trends and best practices
- Write in an engaging, ${tone} tone
- Optimize for ${targetAudience}
- Include calls-to-action within content
- Use transition words and phrases for flow

**${enhancedRequest.outputFormat === 'html' ? 'HTML' : 'Markdown'} Formatting:**${enhancedRequest.outputFormat === 'html' ? `
- Use proper HTML5 semantic structure
- Include Tailwind CSS classes for styling:
  - Article wrapper: <article class="max-w-4xl mx-auto">
  - Headers: <h1 class="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
  - Subheaders: <h2 class="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-white">
  - Paragraphs: <p class="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed">
  - Sections: <section class="mb-8">
  - Lists: <ul class="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300">
- Structure as: <article><header><h1>Title</h1><div class="text-sm text-gray-500 mb-6">Published: [date]</div></header><section>content sections</section></article>
- Add id attributes to headings for table of contents linking` : `
- Use proper Markdown formatting
- Structure with # for title, ## for sections
- Include meta information (Published: date, Last Updated: date)
- Use bullet points and numbered lists where appropriate`}

**SEO Optimization:**
- Include the main keyword "${topic}" naturally throughout
- Use semantic keywords and related terms
- Create compelling headings that include keywords
- Write meta-friendly content that answers user intent

Generate only the blog content without any additional commentary, explanations, or meta text. Start directly with the ${enhancedRequest.outputFormat === 'html' ? 'HTML' : 'Markdown'} content.`;

      // Generate the main blog content using OpenAI
      const openai = getOpenAIClient();
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const generatedContent = completion.choices[0]?.message?.content;
      if (!generatedContent) {
        throw new Error('No content generated from OpenAI');
      }

      // Extract title from generated content
      let title: string;
      if (enhancedRequest.outputFormat === 'html') {
        const titleMatch = generatedContent.match(/<h1[^>]*>([^<]+)<\/h1>/);
        title = titleMatch ? titleMatch[1].trim() : generateSeoTitle(topic);
      } else {
        const titleMatch = generatedContent.match(/^# (.+)$/m);
        title = titleMatch ? titleMatch[1].trim() : generateSeoTitle(topic);
      }

      // Generate additional metadata using OpenAI
      const metadataPrompt = `Based on the blog post topic "${topic}" targeting "${targetAudience}", generate SEO metadata:

1. 5-8 relevant SEO tags (focus on web design, development, SEO, digital marketing themes)
2. A compelling 150-character excerpt/summary that encourages clicks
3. SEO meta description (155 characters max, include year ${year})
4. SEO keywords (10-15 keywords comma-separated, include location "Birmingham" and year "${year}")

Format as JSON:
{
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "excerpt": "excerpt text under 150 chars",
  "seoDescription": "meta description under 155 chars",
  "seoKeywords": "keyword1, keyword2, keyword3, ..."
}`;

      const metadataCompletion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are an SEO expert. Generate only valid JSON responses without any additional text.' },
          { role: 'user', content: metadataPrompt }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      let metadata;
      try {
        const metadataText = metadataCompletion.choices[0]?.message?.content || '{}';
        // Clean the response to ensure it's valid JSON
        const cleanedMetadata = metadataText.replace(/```json\n?|\n?```/g, '').trim();
        metadata = JSON.parse(cleanedMetadata);
      } catch (error) {
        console.error('Error parsing metadata JSON:', error);
        // Fallback metadata
        metadata = {
          tags: [topic.toLowerCase(), 'web design', 'digital marketing', `${year} trends`, 'Birmingham'],
          excerpt: `Discover the latest strategies and best practices for ${topic} in ${month} ${year}. Expert insights for ${targetAudience}.`,
          seoDescription: `Learn everything about ${topic} with our comprehensive ${year} guide. Practical tips and strategies for ${targetAudience}.`,
          seoKeywords: generateSeoKeywords(topic, [topic.toLowerCase()])
        };
      }

      // Add custom sections if specified
      let finalContent = generatedContent;
      if (enhancedRequest.customSpecs && enhancedRequest.outputFormat === 'html') {
        let customSections = '';
        
        // Add Table of Contents
        if (enhancedRequest.customSpecs.includeTableOfContents) {
          const headingMatches = Array.from(generatedContent.matchAll(/<h2[^>]*[^>]*>([^<]+)<\/h2>/g));
          if (headingMatches.length > 0) {
            const tocItems = headingMatches.map((match, index) => 
              `<li><a href="#section-${index + 1}" class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">${match[1]}</a></li>`
            ).join('\n    ');
            customSections += `<nav class="table-of-contents bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-8">\n  <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Table of Contents</h3>\n  <ul class="space-y-2">\n    ${tocItems}\n  </ul>\n</nav>\n\n`;
          }
        }
        
        // Add Call to Action
        if (enhancedRequest.customSpecs.includeCallToAction) {
          customSections += `<div class="call-to-action bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mt-8">\n  <h3 class="text-xl font-bold mb-3">Ready to Implement ${topic}?</h3>\n  <p class="mb-4">Get expert help with your ${topic} strategy and see real results for your business.</p>\n  <a href="/contact" class="inline-block bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Get Started Today</a>\n</div>\n\n`;
        }
        
        // Add Author Bio
        if (enhancedRequest.customSpecs.includeAuthorBio) {
          customSections += `<div class="author-bio bg-gray-100 dark:bg-gray-700 p-6 rounded-lg mt-8">\n  <h3 class="text-lg font-semibold mb-3 text-gray-900 dark:text-white">About the Author</h3>\n  <p class="text-gray-700 dark:text-gray-300">Our team of web design and development experts at TsvWeb specializes in ${topic} and helping Birmingham businesses achieve their digital goals. With years of experience in the industry, we stay current with the latest trends and best practices to deliver exceptional results.</p>\n</div>\n\n`;
        }
        
        // Insert custom sections before the closing article tag
        if (customSections) {
          finalContent = finalContent.replace('</article>', `${customSections}</article>`);
        }
      }
      
      // Generate image URL if requested
      let imageUrl: string | undefined;
      if (enhancedRequest.generateImage) {
        const timestamp = Date.now();
        imageUrl = `/images/blog/generated-${topic.replace(/\s+/g, '-')}-${timestamp}.jpg`;
      }
      
      return {
        title: title,
        content: finalContent,
        excerpt: metadata.excerpt,
        tags: metadata.tags,
        imageUrl,
        seoTitle: `${title} | TsvWeb`,
        seoDescription: metadata.seoDescription,
        seoKeywords: metadata.seoKeywords
      };
    } catch (error) {
      console.error('Error generating blog content with OpenAI:', error);
      throw new Error(`Failed to generate blog content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },

  // Generate blog image using image generation API
  generateBlogImage: async (prompt: string): Promise<string> => {
    try {
      // For now, return a placeholder. In production, you could integrate with:
      // - OpenAI DALL-E
      // - Midjourney API
      // - Stable Diffusion
      // - Unsplash API for stock photos
      
      const timestamp = Date.now();
      const cleanPrompt = prompt.replace(/[^a-zA-Z0-9\s-]/g, '').replace(/\s+/g, '-');
      return `/images/blog/generated-${cleanPrompt}-${timestamp}.jpg`;
    } catch (error) {
      console.error('Error generating blog image:', error);
      throw new Error('Failed to generate blog image');
    }
  }
};
