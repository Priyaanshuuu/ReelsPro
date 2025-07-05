import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";
import mongoose from "mongoose";

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
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    let reels;
    if (userId) {
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return Response.json({ error: "Invalid userId" }, { status: 400 });
      }
      reels = await Reel.find({ user: userId }).populate("user", "name _id").sort({ createdAt: -1 });
    } else {
      reels = await Reel.find({}).populate("user", "name _id").sort({ createdAt: -1 });
    }
    return Response.json(reels);
  } catch (err) {
    console.error("API ERROR:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}