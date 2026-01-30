import { db } from "@db/client";
import { authMiddleware } from "@middlewares/auth.middleware";
import { Hono } from "hono";
import { ProblemDocument } from "http-problem-details";
import { listAvailableRepos } from "src/infra/services/github-integration.service";
import type { Variables } from "src/types";

const app = new Hono<{ Bindings: Cloudflare.Env; Variables: Variables }>();

app.use(authMiddleware);

app.get("/repos", async (c) => {
  const userId = c.get("user").id;
  const userName = c.get("user").name;

  const isReposRetrieved = await listAvailableRepos(
    db(c.env),
    userId,
    userName,
  );

  if (!isReposRetrieved.isSuccess) {
    const problem = new ProblemDocument({
      title: "Error",
      detail: isReposRetrieved.message,
      status: isReposRetrieved.status,
      instance: c.req.path,
    });
    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: isReposRetrieved.status,
    });
  }
  return c.json(isReposRetrieved.data);
});

export default app;
