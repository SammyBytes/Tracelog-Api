import { db } from "@db/client";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";
import { betterAuthOptions } from "./options";
import * as schema from "@db/schema"; 

export const auth = (env: Cloudflare.Env) =>
  betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db(env), {
      provider: "sqlite",
      schema: {
        accounts: schema.accounts,
        sessions: schema.sessions,
        oauthAccounts: schema.oauthAccounts,
        verifications: schema.verifications,
      },
    }),
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    user: {
      modelName: "accounts",
      additionalFields: {
        type: { type: "string", required: false },
        url: { type: "string", required: false },
      },
    },
    session: {
      modelName: "sessions",
    },
    account: {
      modelName: "oauthAccounts",
    },
    verification: {
      modelName: "verifications",
    },
    socialProviders: {
      github: {
        clientId: env.GITHUB_CLIENT_ID,
        clientSecret: env.GITHUB_CLIENT_SECRET,
      },
    },
  });
