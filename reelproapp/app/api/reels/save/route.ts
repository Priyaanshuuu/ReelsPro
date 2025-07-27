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

// Optional: Add GET method to check save status
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

    if (!mongoose.Types.ObjectId.isValid(reelId)) {
      return NextResponse.json({ error: "Invalid reelId format" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findById(session.user._id) as UserDocument | null;
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if reel is saved
    const isSaved = user.savedReels?.some((id: mongoose.Types.ObjectId) => 
      id.toString() === reelId
    ) || false;

    return NextResponse.json({ 
      saved: isSaved,
      totalSaved: user.savedReels?.length || 0 
    });
  } catch (err) {
    console.error("GET SAVE STATUS ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}

// Optional: Add DELETE method for unsaving
export async function DELETE(request: NextRequest) {
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
      saved: false,
      totalSaved: user.savedReels?.length || 0 
    });
  } catch (err) {
    console.error("DELETE SAVE ERROR:", err);
    return NextResponse.json({ 
      error: "Server error", 
      details: err instanceof Error ? err.message : String(err) 
    }, { status: 500 });
  }
}