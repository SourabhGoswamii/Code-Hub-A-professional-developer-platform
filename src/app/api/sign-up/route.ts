import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import UserModel from "@/models/usermodel";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, username, email, password, profilePicture } =
      await request.json();

    const existingUser = await UserModel.findOne({ username });
    if (existingUser) {
      if (!existingUser.isverified) {
        await UserModel.deleteOne({ username });
      } else {
        return NextResponse.json(
          { error: "Username Already Exists", success: false },
          { status: 400 }
        );
      }
    }

    const existingEmail = await UserModel.findOne({ email });
    if (existingEmail) {
      if (!existingEmail.isverified) {
        await UserModel.deleteOne({ email });
      } else {
        return NextResponse.json(
          { error: "Email Already Exists", success: false },
          { status: 400 }
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);
    const code = Math.floor(100000 + Math.random() * 900000);
    const newUser = new UserModel({
      name,
      username,
      email,
      code,
      codeExpires: expiryDate,
      password: hashedPassword,
      profilePicture,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User Registered Successfully", success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { error: "Error In Registering The User", success: false },
      { status: 500 }
    );
  }
}
