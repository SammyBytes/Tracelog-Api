import type { LibSQLDatabase } from "drizzle-orm/libsql";
import type { GitHubSyncInput } from "./sync.dto";
import { upsertProject } from "@modules/project/projects.repository";
import { createAuthor } from "@modules/author/author.repository";
import { createCommit } from "@modules/commit/commit.repository";
import { parseCommit } from "@core/parser";
import { bulkInsertFiles } from "@modules/commit/commitFiles.repository";

export const syncGithubPayload = async (
  db: LibSQLDatabase,
  input: GitHubSyncInput,
) => {
  const { type, module, message } = parseCommit(input.fullMessage);

  return await db.transaction(async (tx) => {

    await createAuthor(tx, {
      id: input.author.id,
      name: input.author.name,
      avatarUrl: input.author.avatarUrl,
    });

    await createCommit(tx, {
      hash: input.hash,
      projectId: input.project.id,
      authorId: input.author.id,
      type,
      module,
      message,
      fullMessage: input.fullMessage,
      prNumber: input.prNumber,
      timestamp: new Date(),
    });

    if (input.files && input.files.length > 0) {
      await bulkInsertFiles(
        tx,
        input.files.map((f) => ({
          commitHash: input.hash,
          path: f.path,
          changeType: f.changeType || "modified",
        })),
      );
    }

    return { success: true, hash: input.hash };
  });
};
