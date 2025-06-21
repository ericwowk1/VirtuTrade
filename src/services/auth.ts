// src/lib/auth.ts
import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/services/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID ?? "",
      clientSecret: process.env.GITHUB_SECRET ?? "",
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    })
  ],
  pages: {
    signIn: '/api/auth/signin',
  },



callbacks: {
    // This adds the userid/name to the session data to use for db queries.
    // Also initializes user money if it's null
    async session({ session, user }) {
      if (user) {
        session.user.id = user.id;
  
      }
      return session;
    }
  },
};