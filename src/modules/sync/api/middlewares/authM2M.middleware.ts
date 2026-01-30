import type { Context, Next } from "hono";
import { retrieveById } from "@modules/account/account.repository";
import { db } from "@db/client";
import { jwk } from "hono/jwk";
import { verifyWithJwks } from "hono/jwt";
import {
  ProblemDocumentExtension,
  ProblemDocument,
} from "http-problem-details";
import { FORBIDDEN, NOT_FOUND, UNAUTHORIZED } from "stoker/http-status-codes";
import type { JWTPayload } from "better-auth";
import { retrieveByRepoId } from "@modules/project/projects.repository";
import type { Variables } from "src/types";

export const validationKeyMiddleware = async (
  c: Context<{ Bindings: Cloudflare.Env; Variables: Variables }>,
  next: Next,
) => {
  const token = c.req.header("Authorization")?.replace("Bearer ", "");
  console.debug("token", token);

  if (!token) {
    const problem = new ProblemDocument({
      title: "Unauthorized access",
      detail: "Missing authentication headers",
      status: UNAUTHORIZED,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: UNAUTHORIZED,
    });
  }

  let id_payload: JWTPayload;
  try {
    const { GITHUB_JWKS_URL, OIDC_AUDIENCE, OIDC_ISSUER } = c.env;
    console.log("OIDC_ISSUER:", OIDC_ISSUER);
    console.log("OIDC_AUDIENCE:", OIDC_AUDIENCE);
    id_payload = await verifyWithJwks(
      token,
      {
        jwks_uri: GITHUB_JWKS_URL,
        allowedAlgorithms: ["RS256"],
        verification: {
          iss: OIDC_ISSUER,
          aud: OIDC_AUDIENCE,
        },
      },
      {
        cf: { cacheEverything: true, cacheTtl: 3600 },
      },
    );
  } catch (error) {
    const problem = new ProblemDocument({
      title: "Invalid access token",
      detail: "Invalid or expired OIDC token",
      status: UNAUTHORIZED,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: UNAUTHORIZED,
    });
  }

  const repoId = id_payload.repository as string;
  const project = await retrieveByRepoId(db(c.env), repoId);

  if (!project) {
    const problem = new ProblemDocument({
      title: "Repo not registered",
      detail: `Repository ${repoId} not linked to any project`,
      status: FORBIDDEN,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: FORBIDDEN,
    });
  }

  c.set("projectId", project.id);

  await next();
};
