import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    await dbConnect();
    const user = await User.findById(session.user._id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const alreadySaved = user.savedReels.some((id: any) => id.toString() === reelId);

    if (alreadySaved) {
      user.savedReels = user.savedReels.filter((id: any) => id.toString() !== reelId);
    } else {
      user.savedReels.push(reelId);
    }

    await user.save();
    return NextResponse.json({ saved: !alreadySaved }); // <-- Always return JSON!
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: String(err) }, { status: 500 });
  }
}