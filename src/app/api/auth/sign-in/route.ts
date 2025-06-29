import mongoose from "mongoose";
import { NextResponse } from "next/server";
import  UserModel  from "@/models/usermodel";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import jwt from "jsonwebtoken";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { identityfire, password } = await request.json();
        if (!identityfire || !password) {
            return NextResponse.json({ error: "IdentityFire and password are required." }, { status: 400 });
        }

        // Check if user exists
        const user = await UserModel.findOne({ $or: [{ email: identityfire }, { username: identityfire }] });
        if (!user) {
            return NextResponse.json({ error: "Invalid IdentityFire or password." }, { status: 401 });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Invalid IdentityFire or password." }, { status: 401 });
        }

        const payload = {
            userId: user._id.toString(),
            username: user.username,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '7d' });
        const response = NextResponse.json({ message: "Sign-in successful.", token ,isVerified: user.isVerified }, { status: 200 });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, 
        });
        return response;

    } catch (error) {
        console.error("Error in sign-in:", error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json({ error: "Validation error." }, { status: 400 });
        }
        return NextResponse.json({ error: "Internal server error." }, { status: 500 });
    }
}