import {withAuth} from "next-auth/middleware"
import { NextResponse} from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
          if (pathname.startsWith("/api/")) {
          return true;
        }

        // Yahan apne sabhi public routes add karo
        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/login" ||
          pathname === "/signup" ||
          pathname.startsWith("/feed") ||
          pathname === "/" ||
          pathname.startsWith("/api/videos") ||
          pathname.startsWith("/upload") ||
          pathname.startsWith("/activity") ||
          pathname.startsWith("/profile")
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
    matcher: [
        // matcher means 
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",

    ]
}