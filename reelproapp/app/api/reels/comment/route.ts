import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Notification from "@/models/Notifications.model"; // <-- plural

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { reelId, text } = await request.json();
    if (!reelId || !text) {
      return NextResponse.json({ error: "Missing reelId or text" }, { status: 400 });
    }

    await dbConnect();
    const reel = await Reel.findById(reelId);
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }

    const userId = session.user._id;
    if (!userId) {
      return NextResponse.json({ error: "No userId in session" }, { status: 400 });
    }

    reel.comments.push({
      user: userId,
      text,
      date: new Date(),
    });

    // Create notification for the reel creator (if not self)
    if (reel.user.toString() !== userId.toString()) {
      await Notification.create({
        user: reel.user, // recipient (reel creator)
        type: "comment",
        reel: reel._id,
        from: userId, // who commented
        comment: text, // the comment text
      });
    }

    await reel.save();

    // Optionally, populate user info for the new comment
    await reel.populate("comments.user", "name image");

    return NextResponse.json({ comments: reel.comments });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });
  }
}