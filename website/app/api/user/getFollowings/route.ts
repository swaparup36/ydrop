import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const client = new PrismaClient();

export async function GET(){
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
        const user = await client.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: 'user does not exist'
            });
        }

        const followings = user.followings;
        
        return NextResponse.json({
            success: true,
            followings: followings
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}