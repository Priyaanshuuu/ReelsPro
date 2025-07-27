import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
    try {
        const { name, email, password } = await request.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { error: "Name, email and password are required" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { error: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        await dbConnect();
        
        // Check if user exists (email lowercase mein search karein)
        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 400 }
            );
        }

        // Password hash karein (manually, pre-save hook ka backup)
        const hashedPassword = await bcrypt.hash(password, 12);

        // User create karein
        const user = await User.create({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
        });

        return NextResponse.json(
            { 
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Register Error:", error);
        
        return NextResponse.json(
            { error: "Failed to register user" },
            { status: 500 }
        );
    }
}