// app/api/reels/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";

export async function POST(request: NextRequest) {
    try {
        const { videoUrl, thumbnailUrl, caption, tags, userId } = await request.json();
        
        if (!videoUrl || !caption || !userId) {
            return NextResponse.json(
                { error: "Video URL, caption, and user ID are required" },
                { status: 400 }
            );
        }

        await dbConnect();
        
        const reel = await Reel.create({
            user: userId, // ✅ Model mein 'user' field hai, 'userId' nahi
            videoUrl,
            thumbnailUrl,
            caption,
            tags: tags || [],
            // likes, comments, shares arrays hain model mein, numbers nahi
        });

        return NextResponse.json({
            success: true,
            message: "Reel created successfully",
            reel
        }, { status: 201 });
        
    } catch (error) {
        console.error("POST Error:", error);
        return NextResponse.json({
            error: "Failed to save reel"
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        
        let reels;
        if (userId) {
            // Model mein 'user' field hai
            reels = await Reel.find({ user: userId })
                .populate('user', 'name email image')
                .sort({ createdAt: -1 });
        } else {
            reels = await Reel.find({})
                .populate('user', 'name email image')
                .sort({ createdAt: -1 });
        }

        console.log("Fetched reels count:", reels.length);

        return NextResponse.json({
            success: true,
            reels: reels || []
        });
        
    } catch (error) {
        console.error("GET Error:", error);
        return NextResponse.json({
            error: "Failed to fetch reels"
        }, { status: 500 });
    }
}