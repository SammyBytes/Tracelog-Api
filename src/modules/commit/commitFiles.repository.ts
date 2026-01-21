import { commitFiles } from "@db/schema";
import type { DatabaseOrTransaction } from "@db/types";

/**
 * Create a new commit file in the database
 * @param db Database or transaction instance
 * @param data Commit file data to insert
 * @returns Newly created commit file
 */
export const bulkInsertFiles = async (
  db: DatabaseOrTransaction,
  data: (typeof commitFiles.$inferInsert)[],
) => {
  return await db.insert(commitFiles).values(data).onConflictDoNothing();
};
