import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { axios } from '@/utils/axios';
import { User } from '@/utils/shared/types';
import { setAuthToken } from '@/utils/helpers/authHelpers';

export const authOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        try {
          const response = await axios.post(`/auth/login`, { email, password });
          const user: User = response.data;

          if (user && user.auth_token) {
            setAuthToken(user.auth_token); // Set the auth token
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error('Login error:', error);
          throw new Error('Invalid credentials');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error', // Error code passed in query string as ?error=
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user as User;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
