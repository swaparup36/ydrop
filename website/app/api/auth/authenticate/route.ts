import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function GET () {
    try {
        const session = await auth();
        if(!session) {
            return NextResponse.json({
                success: false,
                message: 'session expired'
            });
        }
        if(!session?.accessToken || !session.user?.email) {
            return NextResponse.json({
                success: false,
                message: 'user unauthorized'
            });
        }

        return NextResponse.json({
            success: true,
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}