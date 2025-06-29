import UserModel from "@/models/usermodel";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbconnect";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
    await dbConnect();

    try{
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;
        if (!token) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, username: string };

        const data = await UserModel.findOne({ _id: decoded.userId });
        if (!data) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User information retrieved successfully', data }, { status: 200 });

    } catch (error) {
        console.error("Error in GET /api/getInformation:", error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}