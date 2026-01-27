import { eq } from "drizzle-orm";
import type { DatabaseOrTransaction, NewAccount } from "@db/types";
import { accounts } from "@db/schema";

export const updateApiKey = async (
  db: DatabaseOrTransaction,
  accountId: string,
  apiKeyHash: string,
) => {
  await db
    .update(accounts)
    .set({ apiKeyHash })
    .where(eq(accounts.id, accountId));
};

export const retrieveByName = async (
  db: DatabaseOrTransaction,
  name: string,
) => {
  const result = await db
    .select()
    .from(accounts)
    .where(eq(accounts.name, name))
    .limit(1)
    .execute();

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
