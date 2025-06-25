import UserModel from "@/models/usermodel";
import dbConnect from "@/lib/dbconnect";
import { NextResponse } from "next/server";
import InformationModel from "@/models/informationmodel";

export async function POST(request: Request) {
    await dbConnect();

    try {

        const {username ,userId, role, about, technologies, location, socialLinks, projects,} = await request.json();
        if (!username || !userId || !role || !about || !technologies || !location) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername });
        console.log("user", user);
        if (!user) {
            return NextResponse.json(
                { success: false, message: "User not found user" },
                { status: 404 }
            );
        }
        if (!user.isverified) {
            return NextResponse.json(
                { success: false, message: "User email not verified" },
                { status: 400 }
            );
        }
        if (await InformationModel.findOne({ userId })) {
            return NextResponse.json(
                { success: false, message: "Information already exists for this user" },
                { status: 400 }
            );
        }
        
        const information = new InformationModel({
            userId: user._id,
            username,
            role,
            about,
            technologies,
            location,
            socialLinks,
            projects
        });
        await information.save();


        return NextResponse.json(
            { success: true, message: "Information verified successfully", data: information },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error in information verification:", error);
        return NextResponse.json(
            { success: false, message: "Error in information verification" },
            { status: 500 }
        );
    }
}