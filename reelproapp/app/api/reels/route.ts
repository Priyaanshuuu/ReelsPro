import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";

export async function POST(request:NextRequest) {
    try {
        const {videoUrl, thumbnailUrl,caption,tags,userId,} = await request.json();
        await dbConnect();
        const reel = await Reel.create({
            videoUrl,
            thumbnailUrl,
            caption,
            tags,
            user: userId
        });
         return NextResponse.json(
            reel,
            {
                status:201
            })
    } catch (error) {
        return NextResponse.json({
            error: "Failed to save reel",
            console: console.log(error)
        },

   { status: 500 });
    }
    
}