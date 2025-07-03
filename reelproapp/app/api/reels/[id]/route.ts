import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Reel from "@/models/Reel.model";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const reel = await Reel.findById(params.id);
    if (!reel) {
      return NextResponse.json({ error: "Reel not found" }, { status: 404 });
    }
    return NextResponse.json(reel, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reel" }, { status: 500 });
  }
}