import { eq } from "drizzle-orm";
import type { DatabaseOrTransaction, NewAccount } from "@db/types";
import { accounts } from "@db/schema";
import type { ResultSet } from "@libsql/client";

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

export const retrieveById = async (
  db: DatabaseOrTransaction,
  accountId: string,
) => {
  const result = await db
    .select()
    .from(accounts)
    .where(eq(accounts.id, accountId))
    .limit(1)
    .execute();

  return result.length > 0 ? result[0] : null;
};
