import { BlogPost as BlogPostType } from '@/types/blog';

// Helper function to convert API response to BlogPost type
const convertToClientBlogPost = (dbPost: any): BlogPostType => {
  // Determine status based on publishedAt date and current status
  let status: 'Published' | 'Draft' | 'Scheduled' = 'Draft';
  
  if (dbPost.status === 'published') {
    const publishDate = dbPost.publishedAt ? new Date(dbPost.publishedAt) : null;
    const now = new Date();
    
    if (publishDate && publishDate > now) {
      status = 'Scheduled';
    } else {
      status = 'Published';
    }
  }
  
  return {
    id: dbPost._id || '',
    title: dbPost.title || 'Untitled',
    slug: dbPost.slug || '',
    excerpt: dbPost.excerpt || '',
    content: dbPost.content || '',
    category: dbPost.tags?.[0] || 'Uncategorized', // Using first tag as category for compatibility
    tags: dbPost.tags || [],
    featuredImage: dbPost.coverImage || '',
    author: dbPost.author || 'Admin',
    date: dbPost.publishedAt ? new Date(dbPost.publishedAt).toISOString().split('T')[0] : 
          dbPost.createdAt ? new Date(dbPost.createdAt).toISOString().split('T')[0] : '',
    readTime: calculateReadTime(dbPost.content || ''),
    status: status,
    seoTitle: dbPost.title || 'Untitled', // Using title as SEO title
    seoDescription: dbPost.excerpt || '', // Using excerpt as SEO description
    seoKeywords: (dbPost.tags || []).join(', ') // Using tags as SEO keywords
  };
};

// Helper function to convert BlogPost type to API request body
const convertToApiPost = (clientPost: Partial<BlogPostType> & { publishDate?: string }): any => {
  const apiPost: any = {
    title: clientPost.title,
    slug: clientPost.slug,
    excerpt: clientPost.excerpt,
    content: clientPost.content,
    coverImage: clientPost.featuredImage,
    author: clientPost.author,
    status: clientPost.status === 'Published' || clientPost.status === 'Scheduled' ? 'published' : 'draft',
    tags: clientPost.tags || [],
  };

  // Add publishedAt if publishDate is provided
  if (clientPost.publishDate) {
    apiPost.publishedAt = clientPost.publishDate;
  }

  return apiPost;
};

// Helper function to calculate read time based on content length
const calculateReadTime = (content: string): string => {
  if (!content || content.trim().length === 0) {
    return '1 min read';
  }
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
  const readTimeMinutes = Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  return `${readTimeMinutes} min read`;
};

// Blog service methods
export const BlogService = {
  // Get all blog posts
  async getAllPosts(): Promise<BlogPostType[]> {
    try {
      const response = await fetch('/api/admin/blog', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data.map(convertToClientBlogPost);
    } catch (error) {
      console.error('Error fetching all posts:', error);
      return [];
    }
  },

  // Get published blog posts
  async getPublishedPosts(): Promise<BlogPostType[]> {
    try {
      const response = await fetch('/api/blog?status=published', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.posts.map(convertToClientBlogPost);
    } catch (error) {
      console.error('Error fetching published posts:', error);
      return [];
    }
  },

  // Get blog post by ID
  async getPostById(id: string): Promise<BlogPostType | null> {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data ? convertToClientBlogPost(result.data) : null;
    } catch (error) {
      console.error(`Error fetching post with ID ${id}:`, error);
      return null;
    }
  },

  // Get blog post by slug
  async getPostBySlug(slug: string): Promise<BlogPostType | null> {
    try {
      const response = await fetch(`/api/blog/${slug}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Post not found
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success && result.data ? convertToClientBlogPost(result.data) : null;
    } catch (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      return null;
    }
  },

  // Create new blog post
  async createPost(post: Omit<BlogPostType, 'id'> & { publishDate?: string }): Promise<BlogPostType> {
    try {
      const apiPost = convertToApiPost(post);
      const response = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPost),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return convertToClientBlogPost(result.data);
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update blog post
  async updatePost(id: string, post: Partial<BlogPostType> & { publishDate?: string }): Promise<BlogPostType | null> {
    try {
      const apiPost = convertToApiPost(post);
      
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiPost),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.data ? convertToClientBlogPost(result.data) : null;
    } catch (error) {
      console.error(`Error updating post with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete blog post
  async deletePost(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/admin/blog/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error(`Error deleting post with ID ${id}:`, error);
      return false;
    }
  },

  // Get categories with counts
  async getCategories(): Promise<{ name: string; count: number }[]> {
    try {
      const response = await fetch('/api/blog/categories', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // If the API endpoint doesn't exist yet, return empty array
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.categories || [];
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  // Get tags with counts
  async getTags(): Promise<{ name: string; count: number }[]> {
    try {
      const response = await fetch('/api/blog/tags', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        // If the API endpoint doesn't exist yet, return empty array
        if (response.status === 404) {
          return [];
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const result = await response.json();
      return result.tags || [];
    } catch (error) {
      console.error('Error fetching tags:', error);
      return [];
    }
  },
};
