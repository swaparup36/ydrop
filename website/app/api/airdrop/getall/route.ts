import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const client = new PrismaClient();

export async function GET (req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;

    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    const search = searchParams.get('search') || '';

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

        const allAirdrops = await client.airdrop.findMany({
            where: {
                isActive: true,
                OR: search ? [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } }
                ] : undefined
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        const aidrops = allAirdrops.filter((airdrop) => {
            return airdrop.creatorId !== userprofile.id
        })

        return NextResponse.json({
            success: true,
            allAirdrops: aidrops
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}