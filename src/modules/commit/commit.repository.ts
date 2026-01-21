import { commits } from "@db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Create a new commit in the database
 * @param db LibSQLDatabase instance
 * @param data Commit data to insert
 * @returns Newly created commit
 */
export const createCommit = async (
  db: LibSQLDatabase,
  data: typeof commits.$inferInsert,
) => {
  return await db.insert(commits).values(data).onConflictDoNothing();
};
