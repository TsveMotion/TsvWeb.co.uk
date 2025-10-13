import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { authenticateUser } from '@/lib/auth';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await authenticateUser(credentials.email, credentials.password);
        
        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          };
        }
        
        return null;
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // For Google OAuth, check if user exists in database or is authorized
      if (account?.provider === 'google' && user.email) {
        try {
          await connectToDatabase();
          
          // Check if user exists with this Google ID or email
          let dbUser = await User.findOne({
            $or: [
              { googleId: account.providerAccountId },
              { email: user.email.toLowerCase() }
            ]
          });
          
          if (dbUser) {
            // Update Google ID if not set
            if (!dbUser.googleId) {
              dbUser.googleId = account.providerAccountId;
              dbUser.googleEmail = user.email;
              await dbUser.save();
            }
            return true;
          }
          
          // If no user found, check authorized emails list
          const authorizedEmails = [
            'kristiyan@tsvweb.com',
            // Add more authorized admin emails here
          ];
          
          if (authorizedEmails.some(email => email.toLowerCase() === user.email?.toLowerCase())) {
            return true;
          }
          
          // Reject unauthorized emails
          return false;
        } catch (error) {
          console.error('Error in Google sign-in:', error);
          return false;
        }
      }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = (user as any).role || 'admin';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
