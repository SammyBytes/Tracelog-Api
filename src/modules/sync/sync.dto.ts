import { z } from "zod";

export const GitHubSyncSchema = z.object({
  project: z.object({
    id: z.string(),
    name: z.string(),
    url: z.url(),
  }),
  hash: z.string(), // Merge hash of the PR
  author: z.object({
    email: z.email(),
    name: z.string(),
    avatarUrl: z.url().optional().or(z.literal("")),
  }),
  fullMessage: z.string().min(5), // "feat(auth): add login"
  prNumber: z.number().positive(),
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
