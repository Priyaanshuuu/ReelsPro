import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db";
import User from "../models/User.model";

// Extend NextAuth types
declare module "next-auth" {
  interface User {
    _id?: string;
    name?: string;
    image?: string;
  }
  
  interface Session {
    user: {
      _id?: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await dbConnect();
          
          // Email ko lowercase mein search karein (model mein lowercase: true hai)
          const user = await User.findOne({ 
            email: credentials.email.toLowerCase().trim() 
          });

          console.log("Searching for user:", credentials.email.toLowerCase().trim());
          console.log("User found:", !!user);

          if (!user) {
            throw new Error("No user found with this email. Please register first.");
          }

          if (!user.password) {
            throw new Error("Please use social login or reset your password");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          console.log("Password valid:", isValid);

          if (!isValid) {
            throw new Error("Invalid email or password");
          }

          return {
            id: user._id.toString(),
            _id: user._id.toString(),
            email: user.email,
            name: user.name,
            image: user.image,
          };
        } catch (error) {
          console.error("Auth Error:", error);
          throw error;
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account}) {
      // OAuth providers ke liye user create/find karein
      if (account?.provider === "google" || account?.provider === "github") {
        try {
          await dbConnect();
          
          const existingUser = await User.findOne({ 
            email: user.email?.toLowerCase().trim() 
          });
          
          if (!existingUser) {
            await User.create({
              email: user.email?.toLowerCase().trim(),
              name: user.name,
              image: user.image,
              googleId: account.provider === "google" ? account.providerAccountId : undefined,
            });
          }
          
          return true;
        } catch (error) {
          console.error("SignIn callback error:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // User login karte time _id ko token mein store karein
      if (user) {
        await dbConnect();
        
        let dbUser = await User.findOne({ 
          email: user.email?.toLowerCase().trim() 
        });
        
        if (!dbUser) {
          // OAuth users ke liye fallback
          dbUser = await User.create({
            email: user.email?.toLowerCase().trim(),
            name: user.name,
            image: user.image,
          });
        }
        
        token._id = dbUser._id.toString();
      }
      return token;
    },

    async session({ session, token }) {
      // Session mein _id add karein
      if (session.user && token._id) {
        session.user._id = token._id as string;
      }
      return session;
    },
  },

  pages: {
    signIn: "/signup",
    error: "/signup",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};