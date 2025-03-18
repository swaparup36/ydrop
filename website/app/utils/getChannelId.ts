import axios from "axios";

export default async function getChannelId (access_token: string) {
  try {
    const response = await axios.get("https://www.googleapis.com/youtube/v3/channels", {
      headers: {
        Authorization: `Bearer ${access_token}`,
        Accept: "application/json",
      },
      params: {
        part: "id",
        mine: true,
      },
    });

    if (response.data.items.length > 0) {
      return { success: true, channelId: response.data.items[0].id };
    } else {
      return { success: false, message: "Channel not found" };
    }
  } catch (error) {
    console.error("Error fetching channel ID: ", error);
    return { success: false, message: "Internal Server Error" };
  }
}
