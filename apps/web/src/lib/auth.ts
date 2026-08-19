import { env } from "cloudflare:workers";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { apiKey, username } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "@/db";

export const auth = betterAuth({
  baseURL: env.SITE_URL,
  trustedOrigins: [env.SITE_URL],
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  user: {
    additionalFields: {
      locale: {
        type: "string",
        required: false,
        defaultValue: "en",
        input: true,
      },
    },
  },
  advanced: {
    useSecureCookies: true,
  },
  plugins: [
    username(),
    apiKey({
      enableMetadata: true,
      rateLimit: {
        enabled: false,
      },
    }),
    tanstackStartCookies(),
  ],
});
