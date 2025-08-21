import { PrismaClient } from "@prisma/client";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
export const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 20 * 24 * 60 * 60,
    },
  },
  user: {
    additionalFields: {
      firstName: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      lastName: {
        type: "string",
        required: true,
        defaultValue: "",
        input: true,
      },
      walletAddress: {
        type: "string",
        required: false,
        defaultValue: "",
        input: true,
      },
    },
  },
  plugins: [admin()],
});
