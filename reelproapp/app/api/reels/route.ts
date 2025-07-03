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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }
    await dbConnect();
    const reels = await Reel.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(reels, { status: 200 });
  } catch (error) {
    return NextResponse.json(
        { 
            error: "Failed to fetch reels" 
        },
         { 
            status: 500 
        },
       //console.log(error)
    );
  }
}