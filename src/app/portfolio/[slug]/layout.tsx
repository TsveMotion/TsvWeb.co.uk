import { Metadata } from 'next'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params
  
  try {
    // Fetch portfolio item data for metadata
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://tsvweb.com'}/api/portfolio/${slug}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const result = await response.json()
      if (result.success && result.data) {
        const item = result.data
        
        return {
          title: `${item.title} - Portfolio | TsvWeb`,
          description: item.description?.substring(0, 160) || `${item.title} - ${item.projectType} project by TsvWeb`,
          alternates: {
            canonical: `https://tsvweb.com/portfolio/${slug}`,
          },
          openGraph: {
            title: `${item.title} - Portfolio`,
            description: item.description?.substring(0, 160) || `${item.title} - ${item.projectType} project`,
            url: `https://tsvweb.com/portfolio/${slug}`,
            siteName: 'TsvWeb',
            type: 'website',
            images: item.thumbnailImage ? [
              {
                url: item.thumbnailImage,
                width: 1200,
                height: 630,
                alt: item.title,
              }
            ] : [],
          },
          twitter: {
            card: 'summary_large_image',
            title: `${item.title} - Portfolio`,
            description: item.description?.substring(0, 160) || `${item.title} - ${item.projectType} project`,
            images: item.thumbnailImage ? [item.thumbnailImage] : [],
          },
          keywords: [
            item.projectType,
            ...(item.technologies || []),
            'web design Birmingham',
            'web development',
            'portfolio'
          ].join(', '),
        }
      }
    }
  } catch (error) {
    console.error('Error generating portfolio metadata:', error)
  }
  
  // Fallback metadata
  return {
    title: 'Portfolio Project | TsvWeb',
    description: 'View our professional web design and development project.',
    alternates: {
      canonical: `https://tsvweb.com/portfolio/${slug}`,
    },
  }
}

export default function PortfolioItemLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
