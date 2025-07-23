import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Notification from "@/models/Notifications.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const notifications = await Notification.find({ user: session.user._id })
      .sort({ createdAt: -1 })
      .populate("from", "name image")
      .populate("reel", "caption thumbnailUrl");
    return NextResponse.json({ notifications });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });
  }
}