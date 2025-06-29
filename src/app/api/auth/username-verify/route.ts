import UserModel from "@/models/usermodel";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";

export async function GET(request: Request) {
    await dbConnect();
    const url = new URL(request.url);
    const username = url.searchParams.get('username');
    console.log("Checking username:", username);
    try {
        
        if (!username) {
            return NextResponse.json({ message: "Username is required" }, { status: 400 });
        }
        
        const user = await UserModel.findOne({ username });

        if (user) {
            return NextResponse.json({ message: "Username is taken" }, { status: 409 });
        }
        
        return NextResponse.json({ message: "Username is unique" }, { status: 200 });

    } catch (error) {
        console.error("Error checking username:", error);
        return NextResponse.json({ message: "Error checking username" }, { status: 500 });
    }
}
