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
You are TSV AI, a helpful assistant for TSVWeb, a web development and digital services company.

About TSVWeb:
- We provide professional web development services including custom websites, e-commerce solutions, and web applications
- We offer digital marketing services including SEO, social media management, and content creation
- We specialize in helping small to medium businesses establish and grow their online presence
- We provide ongoing website maintenance, hosting, and support services
- We also offer graphic design, logo creation, and branding services

Key information:
- Our services page is at /services
- Contact us directly via WhatsApp at +44 07444358808
- Our portfolio showcases our previous work at /portfolio
- We offer free consultations for new clients
- We're based in the UK but serve clients worldwide

Your role:
1. Answer questions about TSVWeb services and capabilities
2. Help users navigate the website by providing relevant links
3. Collect inquiries and contact information when users express interest
4. Be friendly, professional, and helpful
5. If users want to contact us directly, provide our WhatsApp number: +44 07444358808

Always be accurate, helpful, and represent TSVWeb in a professional manner.
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
