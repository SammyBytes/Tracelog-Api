import { commitFiles, commits } from "@db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Create a new commit file in the database
 * @param db LibSQLDatabase instance
 * @param data Commit file data to insert
 * @returns Newly created commit file
 */
export const createCommitFile = async (
  db: LibSQLDatabase,
  data: typeof commitFiles.$inferInsert,
) => {
  return await db.insert(commitFiles).values(data).onConflictDoNothing();
};
