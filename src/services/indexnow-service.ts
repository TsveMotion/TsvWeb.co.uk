/**
 * IndexNow Service
 * Automatically notifies search engines (Bing, Yandex, etc.) when URLs are added, updated, or deleted
 * Documentation: https://www.indexnow.org/documentation
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

interface IndexNowSubmission {
  host: string;
  key: string;
  keyLocation?: string;
  urlList: string[];
}

interface IndexNowResponse {
  success: boolean;
  statusCode?: number;
  message?: string;
  error?: string;
}

class IndexNowService {
  private siteUrl: string;
  private indexNowKey: string;
  private keyFilePath: string;
  
  // Search engines that support IndexNow
  private searchEngines = [
    'https://api.indexnow.org/indexnow', // IndexNow API (shared by Bing, Yandex, etc.)
    // 'https://www.bing.com/indexnow', // Alternative: Direct Bing endpoint
  ];

  constructor() {
    this.siteUrl = process.env.SITE_URL || 'https://tsvweb.com';
    this.indexNowKey = process.env.INDEXNOW_KEY || '';
    this.keyFilePath = path.join(process.cwd(), 'public', `${this.indexNowKey}.txt`);
    
    // Generate key if not exists
    if (!this.indexNowKey) {
      this.indexNowKey = this.generateKey();
      console.warn('⚠️ INDEXNOW_KEY not set in environment. Generated key:', this.indexNowKey);
      console.warn('Add this to your .env.local file: INDEXNOW_KEY=' + this.indexNowKey);
    }
    
    // Ensure key file exists in public directory
    this.ensureKeyFile();
  }

  /**
   * Generate a random IndexNow key (8-128 hexadecimal characters)
   */
  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex'); // 64 characters
  }

  /**
   * Ensure the key file exists in the public directory
   * This file is required for search engines to verify ownership
   */
  private ensureKeyFile(): void {
    try {
      const publicDir = path.join(process.cwd(), 'public');
      
      // Create public directory if it doesn't exist
      if (!fs.existsSync(publicDir)) {
        fs.mkdirSync(publicDir, { recursive: true });
      }

      // Create key file if it doesn't exist
      if (!fs.existsSync(this.keyFilePath)) {
        fs.writeFileSync(this.keyFilePath, this.indexNowKey, 'utf-8');
        console.log('✅ IndexNow key file created:', this.keyFilePath);
      }
    } catch (error) {
      console.error('❌ Error creating IndexNow key file:', error);
    }
  }

  /**
   * Get the IndexNow key
   */
  public getKey(): string {
    return this.indexNowKey;
  }

  /**
   * Submit a single URL to search engines
   */
  public async submitUrl(url: string): Promise<IndexNowResponse> {
    return this.submitUrls([url]);
  }

  /**
   * Submit multiple URLs to search engines (up to 10,000 per request)
   */
  public async submitUrls(urls: string[]): Promise<IndexNowResponse> {
    if (!this.indexNowKey) {
      return {
        success: false,
        error: 'IndexNow key not configured',
      };
    }

    if (urls.length === 0) {
      return {
        success: false,
        error: 'No URLs provided',
      };
    }

    // Limit to 10,000 URLs per request (IndexNow limit)
    const urlsToSubmit = urls.slice(0, 10000);

    // Ensure all URLs are absolute
    const absoluteUrls = urlsToSubmit.map(url => {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
      }
      return `${this.siteUrl}${url.startsWith('/') ? '' : '/'}${url}`;
    });

    const host = new URL(this.siteUrl).hostname;
    
    const payload: IndexNowSubmission = {
      host,
      key: this.indexNowKey,
      urlList: absoluteUrls,
    };

    console.log(`📤 Submitting ${absoluteUrls.length} URL(s) to IndexNow...`);

    try {
      // Submit to all search engines
      const results = await Promise.allSettled(
        this.searchEngines.map(endpoint => this.submitToEngine(endpoint, payload))
      );

      // Check if at least one submission was successful
      const successfulSubmissions = results.filter(
        result => result.status === 'fulfilled' && result.value.success
      );

      if (successfulSubmissions.length > 0) {
        console.log(`✅ Successfully submitted to ${successfulSubmissions.length} search engine(s)`);
        return {
          success: true,
          statusCode: 200,
          message: `Submitted ${absoluteUrls.length} URL(s) to ${successfulSubmissions.length} search engine(s)`,
        };
      } else {
        const errors = results
          .filter(result => result.status === 'rejected')
          .map(result => (result as PromiseRejectedResult).reason);
        
        console.error('❌ All IndexNow submissions failed:', errors);
        return {
          success: false,
          error: 'All submissions failed',
        };
      }
    } catch (error) {
      console.error('❌ Error submitting to IndexNow:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Submit to a specific search engine endpoint
   */
  private async submitToEngine(
    endpoint: string,
    payload: IndexNowSubmission
  ): Promise<IndexNowResponse> {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      const statusCode = response.status;

      // Handle different response codes
      switch (statusCode) {
        case 200:
          return {
            success: true,
            statusCode: 200,
            message: 'URL submitted successfully',
          };
        case 202:
          return {
            success: true,
            statusCode: 202,
            message: 'URL received. IndexNow key validation pending.',
          };
        case 400:
          return {
            success: false,
            statusCode: 400,
            error: 'Bad request - Invalid format',
          };
        case 403:
          return {
            success: false,
            statusCode: 403,
            error: 'Forbidden - Key not valid',
          };
        case 422:
          return {
            success: false,
            statusCode: 422,
            error: 'Unprocessable Entity - URLs do not belong to host or key mismatch',
          };
        case 429:
          return {
            success: false,
            statusCode: 429,
            error: 'Too Many Requests - Potential spam',
          };
        default:
          return {
            success: false,
            statusCode,
            error: `Unexpected status code: ${statusCode}`,
          };
      }
    } catch (error) {
      throw new Error(
        `Failed to submit to ${endpoint}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Submit blog post URL when created or updated
   */
  public async submitBlogPost(slug: string): Promise<IndexNowResponse> {
    const url = `/blog/${slug}`;
    return this.submitUrl(url);
  }

  /**
   * Submit multiple blog post URLs
   */
  public async submitBlogPosts(slugs: string[]): Promise<IndexNowResponse> {
    const urls = slugs.map(slug => `/blog/${slug}`);
    return this.submitUrls(urls);
  }

  /**
   * Submit portfolio item URL
   */
  public async submitPortfolioItem(slug: string): Promise<IndexNowResponse> {
    const url = `/portfolio/${slug}`;
    return this.submitUrl(url);
  }

  /**
   * Submit any page URL
   */
  public async submitPage(path: string): Promise<IndexNowResponse> {
    return this.submitUrl(path);
  }

  /**
   * Batch submit multiple pages
   */
  public async submitPages(paths: string[]): Promise<IndexNowResponse> {
    return this.submitUrls(paths);
  }

  /**
   * Note: Google deprecated sitemap ping in June 2023
   * Google now automatically crawls sitemaps regularly based on lastmod
   * Your sitemap is already configured with next-sitemap and includes lastmod
   * Submit your sitemap to Google Search Console for best results
   */
}

// Export singleton instance
export const indexNowService = new IndexNowService();
