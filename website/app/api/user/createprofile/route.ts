import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

export async function POST(req: NextRequest){
    const body = await req.json();
    try {
        const existingUserProfile = await client.user.findFirst({
            where: {
                email: body.email
            }
        });

        if (existingUserProfile) {
            return NextResponse.json({
                success: false,
                message: 'user with this email already exists'
            });
        }

        const newUser = await client.user.create({
            data: {
                email: body.email,
                name: body.name,
                image: body.image
            }
        });

        return NextResponse.json({
            success: true,
            newUser: newUser
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}