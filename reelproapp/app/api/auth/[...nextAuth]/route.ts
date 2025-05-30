import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth/next";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

// this file is used to handle authentication requests in a Next.js application.
// It exports a handler that processes GET and POST requests for authentication using NextAuth.js.
