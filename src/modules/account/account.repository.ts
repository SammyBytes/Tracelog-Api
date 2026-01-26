import { eq } from "drizzle-orm";
import type { DatabaseOrTransaction, NewAccount } from "@db/types";
import { accounts } from "@db/schema";

export const create = async (db: DatabaseOrTransaction, data: NewAccount) => {
  return await db
    .insert(accounts)
    .values(data)
    .onConflictDoNothing()
    .returning();
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
