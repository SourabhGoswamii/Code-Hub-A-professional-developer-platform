import dbConnect from "@/lib/dbconnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import UserModel from "@/models/usermodel";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const {
      username,
      email,
      password,
      name,
      bio,
      avatarUrl,
      location,
      website,
    } = await request.json();

    console.log("Received data:", {
      username,
      email,
      password,
      name,
      bio,
      avatarUrl,
      location,
      website,
    });

    const value = !username || !email || !password;
    console.log("Vaslidation check:", value);
    if (value) {
      return NextResponse.json(
        { error: "Username, email, and password are required." },
        { status: 400 }
      );
    }else{

    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [{ username }, { email }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username or email already exists." },
        { status: 409 }
      );
    }
    const hashedpassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      username,
      email,
      password: hashedpassword,
      name: name,
      bio: bio,
      avatarUrl: avatarUrl,
      location: location.toString(),
      website: website,
    });

    await newUser.save();
    return NextResponse.json(
      { message: "User created successfully." },
      { status: 201 }
    );}
  } catch (error) {
    console.error("Error in sign-up:", error);
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json({ error: "Validation error." }, { status: 410 });
    }
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
