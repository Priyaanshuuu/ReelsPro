import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { dbConnect } from "./db";
import User from "../models/User.model";

// Extend the User type to include _id
declare module "next-auth" {
  interface User {
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
          throw new Error("Missing email or password");
        }

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            throw new Error("No user found with this email");
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);

          if (!isValid) {
            throw new Error("Invalid password");
          }

          return {
            id: user._id.toString(), // Required by NextAuth User type
            _id: user._id.toString(), // Custom property for your use
            email: user.email,
          };
        } catch (error) {
          console.error("Auth Error", error);
          throw error;
        }
      },
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

callbacks: {
  async jwt({token,user}){
    await dbConnect();
     if (user) {
    // For OAuth, find or create the user in your DB and get the MongoDB _id
    let dbUser = await User.findOne({ email: user.email });
    if (!dbUser) {
      dbUser = await User.create({ email: user.email });
    }
    token._id = dbUser._id.toString();
  }
  return token;
  },
  async session({session, token}){
    console.log("Token in session callback", token);
    
    if(session.user && token._id){
      session.user._id = token._id;
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
