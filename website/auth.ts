import axios from "axios";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          scope: "openid email profile https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.channel-memberships.creator",
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      // Call the API route to create the user profile in the database
      const response = await axios.post(`${process.env.DOMAIN_URL}/api/user/createprofile`, { email: user.email, name: user.name, image: user.image });
      console.log(response.data);
      if (!response.status) {
        console.error('Failed to create user profile');
        return false;
      }
      console.log("working")

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token; // Store access token
        token.idToken = account.id_token; // Store ID token (if needed)
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken; // Include access token in session
      return session;
    },
  },
});
