import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { authApi } from '../api/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET!,
    }),
    FacebookProvider({
      clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) return false;
      
      try {
        const response = await authApi.socialLogin({
          provider: account.provider,
          providerId: account.providerAccountId,
          email: user.email!,
          name: user.name!,
          image: user.image ?? undefined,
        });

        // Update user object with data from your backend
        user.id = response.data.user.id;
        user.role = response.data.user.role;
        user.name = response.data.user.name;
        
        // Store tokens in account object
        account.access_token = response.data.token;
        account.refresh_token = response.data.refreshToken;

        console.log('Social login API response:', response);
        return true;
        
      } catch (error) {
        console.error('Social login error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          userId: user.id,
          role: user.role,
          name: user.name,
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        refreshToken: token.refreshToken,
        user: {
          ...session.user,
          id: token.userId,
          role: token.role,
          name: token.name,
        },
      };
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};