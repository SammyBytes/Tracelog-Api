import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

/**
 * Initialize tursoDB and return a Drizzle DB client
 * @param env  Bindings containing Turso DB credentials
 * @returns Drizzle DB client
 */
export const db = (env: Cloudflare.Env) => {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_DATABASE_AUTH_TOKEN,
  });
  return drizzle(client);
};
