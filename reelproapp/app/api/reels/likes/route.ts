import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";
import Notification from "@/models/Notification.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

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
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    // Always use MongoDB ObjectId for userId
    const userId = session.user._id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json({ error: "Invalid userId in session" }, { status: 400 });
    }
    const objectId = new mongoose.Types.ObjectId(userId);

    const alreadyLiked = reel.likes.some((id: any) => id.toString() === objectId.toString());

    if (alreadyLiked) {
      reel.likes = reel.likes.filter((id: any) => id.toString() !== objectId.toString());
    } else {
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
    return NextResponse.json({ likes: reel.likes.length });
  } catch (err) {
    console.error("LIKE API ERROR:", err);
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });