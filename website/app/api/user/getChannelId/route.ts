import { NextResponse } from "next/server";
import { auth } from "@/auth";
import getChannelId from "@/app/utils/getChannelId";

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

        console.log("session: ", session);
        console.log("access_token: ", session.accessToken);

        const getChannelIdResponse = await getChannelId(session.accessToken);
        
        console.log("getChannelIdResponse: ", getChannelIdResponse);
        if(!getChannelIdResponse.success){
            return NextResponse.json({
                success: false,
                message: 'channel id not found'
            });
        }

        return NextResponse.json({
            success: true,
            channelId: getChannelIdResponse.channelId
        });
    } catch (error) {
        console.log(error);

        return NextResponse.json({
            success: false,
            message: 'error occured'
        });
    }
}