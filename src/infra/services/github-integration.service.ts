import { retrieveById as getOAuthAccount } from "@modules/account/oAuth/oAuthAccount.repository";
import {
  projectRequestSchema,
  type ProjectRequest,
} from "@modules/project/dtos/proyectRequest.dto";
import { upsertProject } from "@modules/project/projects.repository";
import type { ZodError } from "zod";

export const listAvailableRepos = async (db: any, userId: string) => {
  const oauth = await getOAuthAccount(db, userId);
  if (!oauth?.accessToken) throw new Error("GitHub not connected");

  const response = await fetch(
    "https://api.github.com/user/repos?per_page=100&sort=updated",
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${oauth.accessToken}`,
        "X-GitHub-Api-Version": "2022-11-28",
      },
    },
  );

  if (!response.ok) throw new Error("Failed to fetch GitHub repositories");

  const raw = (await response.json()) as any[];

  return raw.map((r) => ({
    id: String(r.id),
    name: r.name,
    githubRepo: r.full_name,
    url: r.html_url,
    owner: r.owner.login,
  }));
};
/**
 * s
 * @param db 
 * @param userId 
 * @param repoData 
 * @returns 
 */
export const connectSelectedRepo = async (
  db: any,
  userId: string,
  repoData: ProjectRequest,
) => {
  const validated = await projectRequestSchema.parseAsync(repoData);

  return await upsertProject(db, {
    id: validated.id,
    name: validated.name,
    accountId: userId,
    githubRepo: validated.githubRepo,
  });
};
