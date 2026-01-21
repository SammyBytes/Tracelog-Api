import { projects } from "@db/schema";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
/**
 * Create a new project in the database
 * @param db LibSQLDatabase instance
 * @param data Project data to insert
 * @returns Newly created project
 */
export const createProject = async (
  db: LibSQLDatabase,
  data: typeof projects.$inferInsert,
) => {
  return await db.insert(projects).values(data).returning();
};
