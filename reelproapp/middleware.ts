import {withAuth} from "next-auth/middleware"
import { NextResponse} from "next/server"

export default withAuth(
    function middleware(){
        return NextResponse.next();
    },
    {
        callbacks:{
            authorized:({token,req})=>{
                const {pathname}= req.nextUrl;

                if(
                    pathname.startsWith("/api/auth")||
                    pathname === "/login" ||
                    pathname === "/signup"||
                    pathname.startsWith("/feed")
                ){
                    return true;
                }

                if(pathname==="/"|| pathname.startsWith("/api/videos")){
                    return true;
                }
                return !!token
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