import { projects } from "@db/schema";
import type { DatabaseOrTransaction } from "@db/types";
/**
 * Create a new project in the database
 * @param db LibSQLDatabase instance
 * @param data Project data to insert
 * @returns Newly created project
 */
export const upsertProject = async (
  db: DatabaseOrTransaction,
  data: typeof projects.$inferInsert,
) => {
  return await db
    .insert(projects)
    .values(data)
    .onConflictDoUpdate({
      target: projects.id,
      set: {
        name: data.name,
        url: data.url,
      },
    })
    .returning();
};
