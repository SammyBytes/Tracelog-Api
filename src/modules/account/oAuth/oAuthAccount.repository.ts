import { eq } from "drizzle-orm";
import type { DatabaseOrTransaction, NewAccount } from "@db/types";
import { accounts, oauthAccounts } from "@db/schema";
import type { ResultSet } from "@libsql/client";

export const retrieveById = async (
  db: DatabaseOrTransaction,
  accountId: string,
) => {
  return await db
    .select()
    .from(oauthAccounts)
    .where(eq(oauthAccounts.userId, accountId))
    .get();
};
