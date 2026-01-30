import { db } from "@db/client";
import { Hono } from "hono";
import type { Variables } from "src/types";
import { GitHubSyncSchema } from "./sync.dto";
import { syncGithubPayload } from "./sync.service";
import { validationKeyMiddleware } from "./api/middlewares/authM2M.middleware";
import {
  ProblemDocument,
  ProblemDocumentExtension,
} from "http-problem-details";
import { BAD_REQUEST, INTERNAL_SERVER_ERROR } from "stoker/http-status-codes";
import { unknown } from "zod";

const app = new Hono<{ Bindings: Cloudflare.Env; Variables: Variables }>();

app.use(validationKeyMiddleware);

app.post("/sync", async (c) => {
  const database = db(c.env);
  const payload = await c.req.json();
  if (!payload) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  console.debug("Received payload:", payload);

  // Validate payload
  const isParsed = await GitHubSyncSchema.safeParseAsync(payload);

  if (!isParsed.success) {
    const problem = new ProblemDocument({
      title: "Invalid payload",
      detail: "Invalid payload",
      status: BAD_REQUEST,
    });
    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return c.json(problemJson, BAD_REQUEST);
  }

  console.debug("Parsed payload:", isParsed.data);
  try {
    const result = await syncGithubPayload(database, isParsed.data);
    return c.json({
      message: "Sync successful",
      result,
    });
  } catch (error) {
    if (error instanceof Error) {
      const cause: Record<string, Object> = {
        message: error.message,
        stack: error!.stack ?? "",
        cause: error!.cause ?? "",
      };
      const problem = new ProblemDocument(
        {
          title: "Failed to sync GitHub payload",
          detail: "Failed to sync GitHub payload",
          status: INTERNAL_SERVER_ERROR,
          instance: c.req.path,
        },
        new ProblemDocumentExtension(cause),
      );
      const problemJson = JSON.stringify(problem);
      console.error(problemJson);
      return c.json(problemJson, INTERNAL_SERVER_ERROR);
    }
  }
});

export default app;
