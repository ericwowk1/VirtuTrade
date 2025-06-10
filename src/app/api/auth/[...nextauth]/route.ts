import NextAuth, { DefaultSession, NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/services/prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

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
    async signIn({ user, account, profile }) {
      // Check if user has a money record
      const existingUser = await prisma.user.findUnique({
        where: { id: user.id },
        include: { money: true }
      })
      
      // If no money record exists, create one
      if (!existingUser?.money) {
        const money = await prisma.money.create({
          data: {
            amount: 1000000, // Starting amount
            user: {
              connect: { id: user.id }
            }
          }
        })
      }
      
      return true
    }
  },

};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };