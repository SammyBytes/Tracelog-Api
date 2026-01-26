import { eq } from "drizzle-orm";
import type { DatabaseOrTransaction, NewAccount } from "@db/types";
import { accounts } from "@db/schema";

export const create = async (db: DatabaseOrTransaction, data: NewAccount) => {
  var result = await db
    .insert(accounts)
    .values(data)
    .onConflictDoNothing()
    .returning();

  return result.length > 0 ? result[0] : null;
};

export const retrieveByApiKeyHash = async (
  db: DatabaseOrTransaction,
  apiKeyHash: string,
) => {
  const result = await db
    .select()
    .from(accounts)
    .where(eq(accounts.apiKeyHash, apiKeyHash))
    .limit(1)
    .execute();

  return result.length > 0 ? result[0] : null;
};
