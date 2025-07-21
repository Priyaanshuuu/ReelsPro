import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import Reel from "@/models/Reel.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(session.user._id).populate({
      path: "savedReels",
      populate: { path: "user", select: "name image" }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ savedReels: user.savedReels || [] });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });
  }
}