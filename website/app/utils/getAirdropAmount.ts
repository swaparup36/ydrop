import axios from "axios";

export async function getAirdropAmountBySubscriber(
    channelId: string, 
    accessToken: string,
    rewardLessthanOneYear: number,
    rewardGreaterthanOneYear: number,
    rewardGreaterthanTwoYears: number,
    rewardGreaterthanThreeYears: number,
    rewardGreaterthanFourYears: number,
    rewardGreaterthanFiveYears: number
) {
    console.log("accessToken: ", accessToken);
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/subscriptions', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: {
                part: 'snippet',
                forChannelId: channelId,
                mine: true
            }
        });
    
        if (response.data.items.length > 0) {
            const subscriptionDate = response.data.items[0].snippet.publishedAt;
            const subscribedDays = Math.floor((Date.now() - new Date(subscriptionDate).getTime()) / (1000 * 60 * 60 * 24));
            const subscribedYears = subscribedDays/365;
            let rewardAmount = 0;
    
            if(subscribedYears <= 1){
                rewardAmount = rewardLessthanOneYear;
            } else if (subscribedYears > 1 && subscribedYears <= 2) {
                rewardAmount = rewardGreaterthanOneYear;
            } else if (subscribedYears > 2 && subscribedYears <= 3) {
                rewardAmount = rewardGreaterthanTwoYears;
            } else if (subscribedYears > 3 && subscribedYears <= 4) {
                rewardAmount = rewardGreaterthanThreeYears;
            } else if (subscribedYears > 4 && subscribedYears <= 5) {
                rewardAmount = rewardGreaterthanFourYears;
            } else {
                rewardAmount = rewardGreaterthanFiveYears;
            }
    
            return { success: true, subscribed: true, since: subscriptionDate, days: subscribedDays, amount: rewardAmount };
        }
    
        return { success: false, message: "You are not a subscriber" };
    } catch (error) {
        console.log(error);
        return { success: false, message: "Failed to get subscription status" };
    }
}

export async function getAirdropAmountByMember(
    channelId: string, 
    accessToken: string,
    rewardLessthanOneYear: number,
    rewardGreaterthanOneYear: number,
    rewardGreaterthanTwoYears: number,
    rewardGreaterthanThreeYears: number,
    rewardGreaterthanFourYears: number,
    rewardGreaterthanFiveYears: number
){
    console.log("accessToken: ", accessToken);
    try {
        const response = await axios.get(
          "https://www.googleapis.com/youtube/v3/members",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              Accept: "application/json",
            },
            params: {
              part: "snippet",
            },
          }
        );
    
        const members = response.data.items;
        console.log("members: ", members);
        
        // Check if the user is a member of the specified channel
        const memberData = members.find(
            (member) => member.snippet.channelId === channelId
        );
    
        if (memberData) {
            const joinedDate = new Date(memberData.snippet.membershipSince);
            const membershipDays = Math.floor(
                (Date.now() - joinedDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            const membershipYears = membershipDays/365;

            let rewardAmount = 0;

            if(membershipYears <= 1){
                rewardAmount = rewardLessthanOneYear;
            } else if (membershipYears > 1 && membershipYears <= 2) {
                rewardAmount = rewardGreaterthanOneYear;
            } else if (membershipYears > 2 && membershipYears <= 3) {
                rewardAmount = rewardGreaterthanTwoYears;
            } else if (membershipYears > 3 && membershipYears <= 4) {
                rewardAmount = rewardGreaterthanThreeYears;
            } else if (membershipYears > 4 && membershipYears <= 5) {
                rewardAmount = rewardGreaterthanFourYears;
            } else {
                rewardAmount = rewardGreaterthanFiveYears;
            }
    
          return {
            isMember: true,
            membershipDays: membershipDays,
            amount: rewardAmount
          };
        } else {
          return { isMember: false, membershipDays: 0, message: "You are not a member of this channel" };
        }
    } catch (error) {
        console.error("Error fetching membership data:", error);
        return { isMember: false, membershipDays: 0, error: error, message: "can not get eligibility" };
    }
}