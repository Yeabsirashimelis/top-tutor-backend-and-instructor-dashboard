import connectDB from "@/lib/db";
import User from "@/models/userModel";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyPassword } from "@/lib/bycrypt-hash-and-verify";

export const authOptions = {
  providers: [
    // Credentials Provider for email/password login
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await verifyPassword({
          password: credentials.password,
          hash: user.password,
        });

        if (!isPasswordValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
    // Google Provider (only if credentials are provided)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            authorization: {
              params: {
                prompt: "consent",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    // Invoked on successful sign-in
    async signIn(params: any) {
      const profile = params.profile;
      // 1. Connect to the database
      await connectDB();

      // 2. Check if the user exists
      let user = await User.findOne({ email: profile.email });

      // 3. If the user doesn't exist, create a new one
      if (!user) {
        // Truncate the name to a max length and use the first part of the name
        const firstName = profile.name.split(" ")[0].slice(0, 20);

        // Create the user in the database first to generate an _id
        user = await User.create({
          email: profile.email,
          name: profile.name,
          profilePicture: profile.picture,
          role: "INSTRUCTOR",
        });

        // 4. Generate username by appending the user ID to the first name
        const username = `${firstName}${user._id}`;

        // 5. Update the user with the newly generated username
        user.username = username;
        await user.save();
      }

      // 6. Allow sign-in
      return true;
    },

    // Modify the session object
    async session({ session, token }: { session: any; token: any }) {
      await connectDB();
      
      // 1. Get the user from the database
      const user = await User.findOne({ email: session.user.email });

      if (user) {
        // 2. Assign the user ID and profile completion status to the session
        session.user.id = user._id.toString();
        session.user.username = user.username;
        session.user.isProfileComplete =
          !!user.bio && !!user.interestedIn && !!user.phoneNumber;
      }

      // 3. Return the session
      return session;
    },

    // Handle JWT token
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
};
