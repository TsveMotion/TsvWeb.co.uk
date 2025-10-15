import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import OpenAI from 'openai';
import ChatHistory from '@/models/ChatHistory';
import { connectToDatabase } from '@/lib/db';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt with context about TSVWeb services
const systemPrompt = `
You are TSV AI, a helpful assistant for TsvWeb, a professional web design and development company based in Birmingham, UK.

## COMPANY INFORMATION:
- Company: TsvWeb
- Location: 318 Shady Ln., Birmingham B44 9EB, UK
- Phone: +44 7444 358808
- Website: https://tsvweb.com
- Tagline: "Get More Customers Online in Birmingham"

## SERVICES & PRICING:

### Web Design (from £30/month)
- Professional, SEO-optimized websites
- Mobile-responsive design
- Fast loading times
- Modern, conversion-focused layouts
- Starting from £30/month or one-time payment options

### Web Development (from £50/month)
- Custom web applications
- E-commerce solutions
- Database integration
- API development
- Progressive Web Apps (PWAs)

### SEO Services (from £200/month)
- Local SEO for Birmingham businesses
- Keyword research & optimization
- On-page & technical SEO
- Link building
- Google Business Profile optimization
- Monthly reporting

### E-commerce Solutions (from £500 one-time + £50/month)
- Online store setup
- Payment gateway integration
- Product management systems
- Inventory tracking
- Secure checkout

### Website Maintenance (from £30/month)
- Regular updates & backups
- Security monitoring
- Performance optimization
- Content updates
- 24/7 uptime monitoring

### Hosting Services (from £20/month)
- Fast, reliable hosting
- SSL certificates included
- Daily backups
- 99.9% uptime guarantee

## TARGET INDUSTRIES:
- Restaurants & Cafes
- Barbers & Salons
- Plumbers & Electricians
- Builders & Contractors
- Cleaning Services
- Removal Companies
- Local Businesses in Birmingham

## KEY FEATURES:
- Mobile-ready in 48 hours
- Rank #1 on Google (SEO focus)
- Get 3x more leads in 30 days
- Free quote + SEO checklist
- Trusted by 500+ Birmingham businesses
- Professional web solutions for all business sizes

## NAVIGATION:
- Homepage: /
- Services: /services
  - Web Design: /services/web-design
  - Web Development: /services/web-development
  - SEO: /services/seo
  - E-commerce: /services/ecommerce
- Portfolio: /portfolio
- Blog: /blog
- Contact: /contact
- Customer Login: /customer/login

## YOUR ROLE:
1. Answer questions about TsvWeb services, pricing, and capabilities
2. Help users find the right service for their needs
3. Provide accurate pricing information
4. **ALWAYS include relevant page links** (e.g., /services, /services/web-design, /portfolio, /contact)
5. Collect inquiries when users want to get started
6. Emphasize local Birmingham focus and SEO benefits
7. Highlight quick turnaround (48 hours for mobile-ready sites)
8. Mention free quote and SEO checklist offer

## IMPORTANT - PROVIDING LINKS:
When users ask for links or more information, ALWAYS provide the actual page path:
- For web design info: "Check out our web design services at /services/web-design"
- For pricing: "View all our services and pricing at /services"
- For examples: "See our portfolio at /portfolio"
- For contact: "Get in touch at /contact or call +44 7444 358808"

## CONTACT OPTIONS:
- WhatsApp: +44 7444 358808 (fastest response)
- Phone: +44 7444 358808
- Contact Form: /contact
- Get Free Quote: Available on homepage

Always be professional, helpful, and accurate. Focus on how TsvWeb can help Birmingham businesses get more customers online.
**Remember: Include page links in your responses so users can easily navigate!**
`;

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const { message, history, sessionId } = await req.json();
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Format conversation history for OpenAI
    const formattedHistory = history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add system message at the beginning
    const messages = [
      { role: 'system', content: systemPrompt },
      ...formattedHistory,
    ];

    // Get response from OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messages as any,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I couldn\'t generate a response.';

    // Save the conversation to the database
    const chatHistory = await ChatHistory.findOneAndUpdate(
      { ipAddress: ip },
      {
        $setOnInsert: {
          ipAddress: ip,
          userAgent: userAgent,
          firstVisit: new Date(),
        },
        $set: {
          lastVisit: new Date(),
        },
        $push: {
          messages: [
            {
              role: 'user',
              content: message,
              timestamp: new Date(),
            },
            {
              role: 'assistant',
              content: aiResponse,
              timestamp: new Date(),
            },
          ],
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: aiResponse });
  } catch (error) {
    console.error('Error in AI chat API:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
}
