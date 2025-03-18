import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";

const client = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
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
        const existingUserProfile = await client.user.findFirst({
            where: {
                email: session.user.email
            }
        });

        if (!existingUserProfile) {
            return NextResponse.json({
                success: false,
                message: 'user does not exist'
            });
        }

        const creator = await client.user.findFirst({
            where: {
                id: body.creatorId
            }
        });

        if (!creator) {
            return NextResponse.json({
                success: false,
                message: 'creator does not exist'
            }); 
        }

        let followings = existingUserProfile.followings;
        
        if (followings.includes(body.creatorId)) {
            followings = followings.filter((creatorId) => creatorId !== body.creatorId)
        } else {
            followings.push(body.creatorId);
        }

        const updatedUser = await client.user.update({
            where: {
                email: session.user.email
            },
            data: {
                followings: followings
            }
        });

        let followers = creator.followers;
        if (followers.includes(existingUserProfile.id)) {
            followers = followers.filter((followerId) => followerId !== existingUserProfile.id)
        } else {
            followers.push(existingUserProfile.id);
        }

        const updatedCreator = await client.user.update({
            where: {
                id: creator.id
            },
            data: {
                followers: followers
            }
        });

        return NextResponse.json({
            success: true,
            updatedUser: updatedUser,
            updatedCreator: updatedCreator
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}