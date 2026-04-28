import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./src/db/index";
import { jwt } from "better-auth/plugins";
import * as schema from "./src/db/schema";
import { env } from "./env";

export const auth = betterAuth({
  plugins: [jwt()],
  database: drizzleAdapter(db, {
    provider: "sqlite",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
      jwks: schema.jwks
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [env.FRONTEND_URL],
});
