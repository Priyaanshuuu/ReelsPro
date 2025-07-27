import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";
import Notification from "@/models/Notifications.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Define proper types

interface ReelDocument {
  _id: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
  save(): Promise<void>;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reelId } = await request.json();
    if (!reelId) {
      return NextResponse.json({ error: "No reelId provided" }, { status: 400 });
    }

    await dbConnect();
    const reel = await Reel.findById(reelId) as ReelDocument | null;
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    // Always use MongoDB ObjectId for userId
    const userId = session.user._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId in session" }, { status: 400 });
    }
    const objectId = new mongoose.Types.ObjectId(userId);

    // Type-safe like checking
    const alreadyLiked = reel.likes.some((id: mongoose.Types.ObjectId) => 
      id.toString() === objectId.toString()
    );

    if (alreadyLiked) {
      // Remove like - type-safe filtering
      reel.likes = reel.likes.filter((id: mongoose.Types.ObjectId) => 
        id.toString() !== objectId.toString()
      );
    } else {
      // Add like
      reel.likes.push(objectId);

      // Create notification for the reel creator (if not self)
      if (reel.user.toString() !== userId.toString()) {
        await Notification.create({
          user: reel.user, // recipient (reel creator)
          type: "like",
          reel: reel._id,
          from: userId, // who liked
        });
      }
    }

    await reel.save();
    return NextResponse.json({ 
      likes: reel.likes.length,
      isLiked: !alreadyLiked 
    });
  } catch (err) {
    console.error("LIKE API ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}

// Optional: Add GET method to fetch like status
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reelId = searchParams.get('reelId');
    
    if (!reelId) {
      return NextResponse.json({ error: "No reelId provided" }, { status: 400 });
    }

    await dbConnect();
    const reel = await Reel.findById(reelId) as ReelDocument | null;
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    const userId = session.user._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId in session" }, { status: 400 });
    }
    const objectId = new mongoose.Types.ObjectId(userId);

    const isLiked = reel.likes.some((id: mongoose.Types.ObjectId) => 
      id.toString() === objectId.toString()
    );

    return NextResponse.json({ 
      likes: reel.likes.length,
      isLiked 
    });
  } catch (err) {
    console.error("GET LIKE STATUS ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}