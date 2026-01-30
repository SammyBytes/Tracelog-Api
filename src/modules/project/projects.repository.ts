import { projects } from "@db/schema";
import type { DatabaseOrTransaction } from "@db/types";
import { eq } from "drizzle-orm";
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

export const retrieveByRepoId = async (
  db: DatabaseOrTransaction,
  repoId: string,
) => {
  const result = await db
    .select()
    .from(projects)
    .where(eq(projects.githubRepo, repoId))
    .get();
  return result;
};
