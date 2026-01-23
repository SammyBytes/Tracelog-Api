import { z } from "zod";

export const GitHubSyncSchema = z.object({
  project: z.object({
    id: z.string(),
    name: z.string(),
    url: z.url(),
  }),
  hash: z.string(),
  author: z.object({
    email: z.email(),
    name: z.string(),
    avatarUrl: z.url().optional(),
  }),
  fullMessage: z.string(), // "feat(auth): add login"
  prNumber: z.number().optional(),
  files: z
    .array(
      z.object({
        path: z.string(),
        changeType: z.enum(["added", "modified", "deleted"]).optional(),
      }),
    )
    .optional(),
});

export type GitHubSyncInput = z.infer<typeof GitHubSyncSchema>;
