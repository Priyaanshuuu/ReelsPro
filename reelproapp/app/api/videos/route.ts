import { NextRequest,NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Video, {IVideo} from "@/models/Video.model";

export async function GET(){
    try {
        await dbConnect();
        const videos = await Video.find({}).sort({ createdAt: -1 }); //lean

        if(!videos || videos.length===0){
            return NextResponse.json([], {status: 200});
        }
        return NextResponse.json(videos, {status: 200});
    } catch (error) {
        console.error("Error fetching videos:", error);
        return NextResponse.json(
            {
                error: "Failed to fetch videos"
            },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest){
    try {
        const session = await getServerSession(authOptions);

        if(!session){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        await dbConnect();
        const body: IVideo = await request.json();

        if(
            !body.title ||
            !body.description ||
            !body.videoUrl ||
            !body.thumbnailUrl
        ){
            return NextResponse.json(
                {error: "All fields are required"},
                {status: 400}
            );
        }
        const videoData = {
            ...body,
            controls: body.controls?? true,
        transformations:{
            height: 1920,
            width: 1080,
            quality: body.transformations?.quality ?? 100,
        }
        }
        const newVideo = await Video.create({videoData});
        return NextResponse.json(newVideo)
    } catch (error) {
        console.error("Error creating video:",error);
        return NextResponse.json({
            error: "Failed to create video"
        }, 
        {status: 500}
    )
        
    }
}