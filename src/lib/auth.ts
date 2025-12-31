import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './db'

// Build providers array dynamically based on available credentials
const providers: NextAuthOptions['providers'] = []

// Add Google OAuth if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: 'select_account',  // Always show account picker
        },
      },
    })
  )
}

// Add a demo/dev credentials provider for testing (remove in production)
if (process.env.NODE_ENV === 'development') {
  providers.push(
    CredentialsProvider({
      name: 'Demo Account',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'demo@example.com' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null
        
        // Find or create user for demo purposes
        let user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0],
              verificationTier: 'BASIC',
            },
          })
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    })
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  providers,
  
  session: {
    strategy: 'jwt',
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  callbacks: {
    // Prevent linking different OAuth accounts to same user
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && profile?.email) {
        // Check if a user already exists with this email
        const existingUser = await prisma.user.findUnique({
          where: { email: profile.email },
        })
        
        // If user exists but has different ID, this is a different person
        // Allow sign in - PrismaAdapter will handle it correctly
        if (existingUser && existingUser.id !== user.id) {
          // This shouldn't happen with proper setup, but log it
          console.log(`OAuth sign-in for existing user: ${profile.email}`)
        }
      }
      return true
    },
    
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
        
        // Always fetch fresh user data from database
        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { 
              name: true, 
              email: true, 
              image: true,
              verificationTier: true 
            },
          })
          
          if (user) {
            session.user.name = user.name
            session.user.email = user.email || session.user.email
            session.user.image = user.image
            session.user.verificationTier = user.verificationTier
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
      return session
    },
    
    async jwt({ token, user, account }) {
      // When user signs in, update token with new user info
      if (user) {
        token.id = user.id
        token.sub = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      
      // If this is a new sign-in with OAuth, ensure we have the latest user ID
      if (account) {
        token.accessToken = account.access_token
      }
      
      return token
    },
  },
  
  events: {
    async createUser({ user }) {
      console.log(`New user created: ${user.email}`)
    },
  },
  
  debug: process.env.NODE_ENV === 'development',
}

// Extend next-auth types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      verificationTier?: string
    }
  }
}
