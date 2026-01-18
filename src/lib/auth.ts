import NextAuth, { Session } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"
import bcrypt from "bcryptjs"
import { z } from "zod"

// Extend NextAuth types to include custom 'id' and 'role' on user and JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
    }
  }
  interface User {
    id: string;
    role?: string;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role?: string;
  }
}

// 1. Validation Schema
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (typeof token.role === "string" && session.user) {
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // IF 'user' exists, it means they just logged in.
      // We grab the role directly from the user object passed by authorize()
      if (user && typeof user.role === "string") {
        token.role = user.role;
      }
      // 👆 NO DATABASE CALL HERE. SUPER FAST. 👆
      return token;
    }
  },
  providers: [
    Credentials({
      // === THIS WAS MISSING ===
      // Even with a custom form, NextAuth needs to know what fields exist.
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // ========================
      
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
})