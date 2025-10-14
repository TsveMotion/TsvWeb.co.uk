import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  
  try {
    // Fetch blog post data for metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tsvweb.com'}/api/blog/${slug}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const post = result.data
        
        return {
          title: `${post.title} | TsvWeb Blog`,
          description: post.excerpt || post.description || post.title,
          alternates: {
            canonical: `https://tsvweb.com/blog/${slug}`,
          },
          openGraph: {
            title: post.title,
            description: post.excerpt || post.description || post.title,
            url: `https://tsvweb.com/blog/${slug}`,
            siteName: 'TsvWeb',
            type: 'article',
            publishedTime: post.createdAt,
            modifiedTime: post.updatedAt,
            authors: [post.author],
            images: post.featuredImage ? [
              {
                url: post.featuredImage,
                width: 1200,
                height: 630,
                alt: post.title,
              }
            ] : [],
            tags: post.tags || [],
          },
          twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt || post.description || post.title,
            images: post.featuredImage ? [post.featuredImage] : [],
          },
          keywords: post.tags?.join(', ') || '',
        }
      }
    }
  } catch (error) {
    console.error('Error generating blog metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: 'Blog Post | TsvWeb',
    description: 'Read our latest web design and development insights.',
    alternates: {
      canonical: `https://tsvweb.com/blog/${slug}`,
    },
  }
}

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
