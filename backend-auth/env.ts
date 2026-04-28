import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.url(),
    DATABASE_TOKEN: z.string().optional(),
    BETTER_AUTH_SECRET: z.string().optional(),
    BACKEND_CORE_URL: z.string().default("http://localhost:8080"),
    FRONTEND_URL: z.string().default("http://localhost:3001"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
