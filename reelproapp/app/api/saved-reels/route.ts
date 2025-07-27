import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Define proper types
interface UserDocument {
  _id: mongoose.Types.ObjectId;
  savedReels?: mongoose.Types.ObjectId[];
  save(): Promise<void>;
}

interface PopulatedReel {
  _id: mongoose.Types.ObjectId;
  videoUrl: string;
  thumbnailUrl?: string;
  caption?: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  user: {
    _id: mongoose.Types.ObjectId;
    name: string;
    image?: string;
  };
  isPrivate: boolean;
  createdAt: Date;
}

interface PopulatedUserDocument extends Omit<UserDocument, 'savedReels'> {
  savedReels?: PopulatedReel[];
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reelId } = await request.json();
    if (!reelId) {
      return NextResponse.json({ error: "No reelId provided" }, { status: 400 });
    }

    // Validate reelId format
    if (!mongoose.Types.ObjectId.isValid(reelId)) {
      return NextResponse.json({ error: "Invalid reelId format" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user._id) as UserDocument | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Initialize savedReels array if it doesn't exist
    if (!user.savedReels) {
      user.savedReels = [];
    }

    // Type-safe checking for saved reels
    const alreadySaved = user.savedReels.some((id: mongoose.Types.ObjectId) => 
      id.toString() === reelId
    );

    if (alreadySaved) {
      // Remove from saved reels - type-safe filtering
      user.savedReels = user.savedReels.filter((id: mongoose.Types.ObjectId) => 
        id.toString() !== reelId
      );
    } else {
      // Add to saved reels
      const reelObjectId = new mongoose.Types.ObjectId(reelId);
      user.savedReels.push(reelObjectId);
    }

    await user.save();
    return NextResponse.json({ 
      saved: !alreadySaved,
      totalSaved: user.savedReels.length 
    });
  } catch (err) {
    console.error("SAVE REEL API ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user._id).populate({
      path: "savedReels",
      select: "videoUrl thumbnailUrl caption likes comments user isPrivate createdAt",
      populate: { 
        path: "user", 
        select: "name image" 
      }
    }) as PopulatedUserDocument | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      savedReels: user.savedReels || [],
      totalSaved: user.savedReels?.length || 0 
    });
  } catch (err) {
    console.error("GET SAVED REELS ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}

// Optional: Add DELETE method to remove specific saved reel
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reelId = searchParams.get('reelId');
    
    if (!reelId) {
      return NextResponse.json({ error: "No reelId provided" }, { status: 400 });
    }

    if (!mongoose.Types.ObjectId.isValid(reelId)) {
      return NextResponse.json({ error: "Invalid reelId format" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user._id) as UserDocument | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Remove from saved reels
    if (user.savedReels) {
      user.savedReels = user.savedReels.filter((id: mongoose.Types.ObjectId) => 
        id.toString() !== reelId
      );
      await user.save();
    }

    return NextResponse.json({ 
      success: true,
      totalSaved: user.savedReels?.length || 0 
    });
  } catch (err) {
    console.error("DELETE SAVED REEL ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}