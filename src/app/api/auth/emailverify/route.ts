
import { NextResponse } from 'next/server';
import UserModel  from '@/models/usermodel';
import dbConnect from '@/lib/dbconnect';
import { sendVerificationEmail } from '@/helpers/sendverificationemail';


export async function POST(request: Request) {
    try {
        await dbConnect();
        const {username,code} = await request.json();
        if (!username || !code) {
            return NextResponse.json({ error: "username and code are required." }, { status: 400 });
        }
        // Check if user exists
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        // Check if the code matches
        const isCodeValid = (code === user.code);

        if (user.codeexpires < new Date()) {
            
            const newcode = Math.floor(100000 + Math.random() * 900000).toString();
            user.code = newcode;
            user.codeexpires = new Date(Date.now() + 100 * 60 * 1000); 
            await user.save();
            return NextResponse.json({ message: "Verification code has expired. A new code has been sent to your email." }, { status: 402 });
        }

        if (!isCodeValid) {
            return NextResponse.json({ error: "Invalid verification code. Please try again." }, { status: 401 });
        }

        // Mark email as verified
        user.isVerified = true;
        await user.save();
        return NextResponse.json({ message: "Email verified successfully." }, { status: 200 });

    } catch (error) {
        console.error("Email verification error:", error);
        return NextResponse.json({ error: "An error occurred during email verification." }, { status: 500 });
    }
}


export async function GET(request:Request) {
    await dbConnect();
    const url = new URL(request.url);
    const username = url.searchParams.get('username'); 
    if (!username) {
        return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }
    try {
        
        const user = await UserModel.findOne({ username: username });
        if (!user) {
            return NextResponse.json({ error: "User not found." }, { status: 404 });
        }
        const email = user.email;
        const verifycode = user.code;
        console.log("input",email,username,verifycode);
        sendVerificationEmail(email, username, verifycode);
        return NextResponse.json({ message: "Email Send Successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error fetching user:", error);
        return NextResponse.json({ error: "An error occurred while fetching user." }, { status: 500 });
    }
    }
