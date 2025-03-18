import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const client = new PrismaClient();

type featuredObjType = {
    userId: string;
    name: string;
    email: string;
    image: string;
    airdropImages: string[]
}

export async function GET(req: NextRequest){
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
        const existingUser = await client.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if (!existingUser) {
            return NextResponse.json({
                success: false,
                message: 'user does not exist'
            });
        }

        // Get all users from db
        const allUsers = await client.user.findMany({
            where: {
                OR: search ? [
                    { name: { contains: search, mode: 'insensitive' } },
                ] : undefined
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit)
        });

        // Get airdrops from users
        const featuredObjs: featuredObjType[] = [];

        for (const user of allUsers) {
            // Get all airdrops from user
            const airdropsByUser = await client.airdrop.findMany({
                where: {
                    creatorId: user.id
                }
            });
            
            const airdropImages = [];

            if (airdropsByUser.length > 0 &&  user.id !== existingUser.id) {
                for (const airdrop of airdropsByUser) {
                    airdropImages.push(airdrop.coverPicture);
                }

                const featuredObj: featuredObjType = {
                    userId: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    airdropImages: airdropImages
                }

                featuredObjs.push(featuredObj);
            }
        }

        console.log("featuredObjs: ", featuredObjs);
        
        return NextResponse.json({
            success: true,
            featuredObjs: featuredObjs
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}