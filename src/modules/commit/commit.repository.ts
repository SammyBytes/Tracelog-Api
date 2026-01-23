import { commits } from "@db/schema";
import type { DatabaseOrTransaction } from "@db/types";

/**
 * Create a new commit in the database
 * @param db LibSQLDatabase instance
 * @param data Commit data to insert
 * @returns Newly created commit
 */
export const createCommit = async (
  db: DatabaseOrTransaction,
  data: typeof commits.$inferInsert,
) => {
  return await db.insert(commits).values(data).onConflictDoNothing();
};
