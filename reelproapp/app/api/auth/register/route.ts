import { NextRequest,NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User.model"

export async function POST(request: NextRequest){
    try {
        const {name,username,email,password} = await request.json();

        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            );
        }

        await dbConnect();
        
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });
        if(existingUser){
            return NextResponse.json(
                {error: "User already exists"},
                {status: 400}
            );
        }

        await User.create({
            name,
            username,
            email,
            password,
        })

        return NextResponse.json(
            {message: "User Registered Sucessfully"},
            {status: 201}
        );
    } catch (error) {
        console.log("Register Error",error);
        
        return NextResponse.json(
            {error:"Failed to register user"},
            {status: 500}
        );
    }
}