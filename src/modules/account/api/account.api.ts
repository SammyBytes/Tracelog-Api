import { db } from "@db/client";
import { Hono } from "hono";
import type { Variables } from "src/types";
import { updateApiKey } from "../account.repository";
import { generateTracelogKey } from "../utils/crypto.utils";
import { authMiddleware } from "@middlewares/auth.middleware";
import { updateApiKeyUsecase } from "../usecases/updateApiKey.usecase";
import { ProblemDocument } from "http-problem-details";
import * as HttpStatusCode from "stoker/http-status-codes";
import type { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: CloudflareBindings; Variables: Variables }>();

app.get("/test", async (c) => {
  if (c.env.NODE_ENV === "production") {
    return c.notFound();
  }

  const { retrievePlaygroundHtml } = await import(
    "../../../libs/better-auth/playground"
  );
  return c.html(retrievePlaygroundHtml());
});

app.get("/me", authMiddleware, (c) => {
  const user = c.get("user");
  return c.json(user);
});

app.post("/generate-api-key", authMiddleware, async (c) => {
  const user = c.get("user");

  const database = db(c.env);

  var result = await updateApiKeyUsecase(database, user.id);
  if (result.isErr()) {
    const error = result.error as HTTPException;
    const problem = new ProblemDocument({
      title: "Error generating API Key",
      detail: error.message,
      status: error.status,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: error.status,
    });
  }

  return c.json({
    message: "API Key generated successfully",
    apiKey: result.value,
  });
});

export default app;
