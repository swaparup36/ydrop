import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import {
  getAirdropAmountByMember,
  getAirdropAmountBySubscriber,
} from "@/app/utils/getAirdropAmount";

const client = new PrismaClient();

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({
        success: false,
        message: "session expired",
      });
    }
    if (!session?.accessToken || !session.user?.email) {
      return NextResponse.json({
        success: false,
        message: "user unauthorized",
      });
    }

    const userProfile = await client.user.findFirst({
      where: {
        email: session.user.email,
      },
    });

    if (!userProfile) {
      return NextResponse.json({
        success: false,
        message: "user not found",
      });
    }

    const requiredAirdrop = await client.airdrop.findUnique({
      where: {
        id: body.airdropId,
        isActive: true
      },
    });

    if (!requiredAirdrop) {
      return NextResponse.json({
        success: false,
        message: "airdrop not found",
      });
    }

    // console.log(requiredAirdrop);

    if (
      requiredAirdrop.recipientsLessthanOneYear.includes(userProfile.id) ||
      requiredAirdrop.recipientsGreaterthanOneYear.includes(userProfile.id) ||
      requiredAirdrop.recipientsGreaterthanTwoYears.includes(userProfile.id) ||
      requiredAirdrop.recipientsGreaterthanThreeYears.includes(
        userProfile.id
      ) ||
      requiredAirdrop.recipientsGreaterthanFourYears.includes(userProfile.id) ||
      requiredAirdrop.recipientsGreaterthanFiveYears.includes(userProfile.id)
    ) {
      return NextResponse.json({
        success: false,
        message: "you have already claimed this airdrop",
      });
    }

    let amount = 0;

    if (requiredAirdrop.basedOn === "subscriber") {
      const amountResponse = await getAirdropAmountBySubscriber(
        requiredAirdrop.channelId,
        session.accessToken,
        requiredAirdrop.rewardLessthanOneYear,
        requiredAirdrop.rewardGreaterthanOneYear,
        requiredAirdrop.rewardGreaterthanTwoYears,
        requiredAirdrop.rewardGreaterthanThreeYears,
        requiredAirdrop.rewardGreaterthanFourYears,
        requiredAirdrop.rewardGreaterthanFiveYears,
      );
      // console.log("amountResponse: ", amountResponse);
      if (!amountResponse.success) {
        return NextResponse.json({
          success: false,
          message: amountResponse.message,
        });
      }
      if (!amountResponse.amount) {
        console.log("executing this");
        return NextResponse.json({
          success: false,
          message: 'You are not eligible',
        });
      }
      amount = amountResponse.amount;
    } else {
      const amountResponse = await getAirdropAmountByMember(
        requiredAirdrop.channelId,
        session.accessToken,
        requiredAirdrop.rewardLessthanOneYear,
        requiredAirdrop.rewardGreaterthanOneYear,
        requiredAirdrop.rewardGreaterthanTwoYears,
        requiredAirdrop.rewardGreaterthanThreeYears,
        requiredAirdrop.rewardGreaterthanFourYears,
        requiredAirdrop.rewardGreaterthanFiveYears
      );
      if (!amountResponse.amount) {
        return NextResponse.json({
          success: false,
          message: amountResponse.message,
        });
      }
      amount = amountResponse.amount;
    }

    return NextResponse.json({
      success: true,
      amount: amount,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({
      success: false,
      message: "error occured",
    });
  }
}
