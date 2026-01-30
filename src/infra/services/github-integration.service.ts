import type { DatabaseOrTransaction } from "@db/types";
import { retrieveById as getOAuthAccount } from "@modules/account/oAuth/oAuthAccount.repository";
import {
  projectRequestSchema,
  type ProjectRequest,
} from "@modules/project/dtos/projectRequest.dto";
import { upsertProject } from "@modules/project/projects.repository";
import { NOT_FOUND, OK } from "stoker/http-status-codes";
import type { ZodError } from "zod";

export const listAvailableRepos = async (
  db: DatabaseOrTransaction,
  userId: string,
  userName: string,
) => {
  const oauth = await getOAuthAccount(db, userId);
  if (!oauth?.accessToken) {
    return {
      isSuccess: false,
      message: "GitHub not connected",
      status: NOT_FOUND,
      data: null,
    };
  }

  const query = `
    query {
      viewer {
        repositories(first: 25, orderBy: {field: PUSHED_AT, direction: DESC}) {
          nodes {
            id
            name
            nameWithOwner
            url
          }
        }
      }
    }
  `;

  const cacheKey = `https://tracelog.api/github-repos/${userId}`;
  const cache = caches.default;

  let response = await cache.match(cacheKey);

  if (!response) {
    const query = `query { viewer { repositories(first: 25, orderBy: {field: PUSHED_AT, direction: DESC}) { nodes { id name nameWithOwner url } } } }`;

    const githubResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${oauth.accessToken}`,
        "User-Agent": "TraceLog-App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    if (!githubResponse.ok) {
      return {
        isSuccess: false,
        message: "Failed to fetch GitHub repositories",
        data: null,
      };
    }

    // We need to create a new response and set the TTL. Cache API doesn't support setting TTL on existing responses
    response = new Response(githubResponse.body, githubResponse);
    response.headers.append("Cache-Control", "s-maxage=60");

    // Save to cache (use waitUntil if we're in a middleware, but here it's direct)
    await cache.put(cacheKey, response.clone());
  } else {
    console.log("❄️ Cache Hit!");
  }

  const { data } = (await response.json()) as any;

  return {
    isSuccess: true,
    message: "Successfully retrieved GitHub repositories",
    status: OK,
    data: data.viewer.repositories.nodes.map((r: any) => ({
      id: r.id,
      name: r.name,
      githubRepo: r.nameWithOwner,
      url: r.url,
    })),
  };
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
