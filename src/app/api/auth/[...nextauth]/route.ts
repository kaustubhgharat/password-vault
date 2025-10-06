import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import { User, IUser } from "@/lib/models/User";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();

        if (!credentials) {
          return null;
        }
        
        const user: IUser | null = await User.findOne({ email: credentials.email });

        if (user && await bcrypt.compare(credentials.password, user.passwordHash)) {
          // This object is passed to the `jwt` callback
          return { 
            id: user._id.toString(),
            email: user.email,
            encryptionSalt: user.encryptionSalt
          };
        } else {
          // Returning null triggers the error flow in the signIn function
          return null;
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.encryptionSalt = user.encryptionSalt;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.encryptionSalt = token.encryptionSalt;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

