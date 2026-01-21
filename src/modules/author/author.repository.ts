import { authors } from "@db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
/**
 * Create a new author in the database
 * @param db LibSQLDatabase instance
 * @param data Author data to insert
 * @returns Newly created author
 */
export const createAuthor = async (
  db: LibSQLDatabase,
  data: typeof authors.$inferInsert,
) => {
  return await db.insert(authors).values(data).onConflictDoNothing();
};
