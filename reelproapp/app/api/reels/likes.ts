import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
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

  const userId = session.user._id || session.user.id;
  const alreadyLiked = reel.likes.some((id: any) => id.toString() === userId);

  if (alreadyLiked) {
    reel.likes = reel.likes.filter((id: any) => id.toString() !== userId);
  } else {
    reel.likes.push(userId);
  }

  await reel.save();
  return NextResponse.json({ likes: reel.likes.length });
}