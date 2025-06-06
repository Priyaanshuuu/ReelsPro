import { NextResponse } from "next/server";
import ImageKit from "imagekit"

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
})

export async function GET(){
    try {
        const authenticationParameters = imagekit.getAuthenticationParameters();
        return NextResponse.json(authenticationParameters);
    } catch (error) {
        console.log("Error in ImageKit authentication:", error);
        return NextResponse.json({
            error: "Authentication failed"
        },
    {
        status:500,
    })
    }
}