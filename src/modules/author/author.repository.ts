import { authors } from "@db/schema";
import type { DatabaseOrTransaction } from "@db/types";
/**
 * Create a new author in the database
 * @param db LibSQLDatabase instance
 * @param data Author data to insert
 * @returns Newly created author
 */
export const createAuthor = async (
  db: DatabaseOrTransaction,
  data: typeof authors.$inferInsert,
) => {
  return await db.insert(authors).values(data).onConflictDoNothing();
};
