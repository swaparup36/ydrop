import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const client = new PrismaClient();

export async function POST (req: NextRequest) {
    const body = await req.json();
    try {
        const { airdropId } = body;

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

        const userprofile = await client.user.findFirst({
            where: {
                email: session.user?.email
            }
        });

        if(!userprofile) {
            return NextResponse.json({
                success: false,
                message: 'user not found'
            });
        }

        const airdrop = await client.airdrop.findUnique({
            where: {
                id: airdropId,
                isActive: true
            }
        });

        if (!airdrop) {
            return NextResponse.json({
                success: false,
                message: 'airdrop not found'
            });
        }

        return NextResponse.json({
            success: true,
            airdrop: airdrop
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}