export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  featuredImage: string;
  author: string;
  date: string;
  readTime: string;
  status: 'Published' | 'Draft' | 'Scheduled';
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface BlogGenerationRequest {
  topic: string;
  tone?: 'professional' | 'conversational' | 'technical' | 'friendly';
  targetAudience?: string;
  keyPoints?: string[];
  desiredLength?: 'short' | 'medium' | 'long';

}

export interface BlogGenerationResponse {
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  imageUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}
