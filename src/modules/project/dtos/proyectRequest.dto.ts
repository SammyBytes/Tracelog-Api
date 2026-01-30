import { github } from "better-auth";
import { z } from "zod";

export const projectRequestSchema = z.object({
  id: z.union([z.string(), z.number()]).transform((v) => String(v)),
  name: z.string().min(1),
  url: z.url().optional(),
  githubRepo: z.string().includes("/"),
});

export type ProjectRequest = z.infer<typeof projectRequestSchema>;
