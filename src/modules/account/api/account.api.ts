import { db } from "@db/client";
import { Hono } from "hono";
import type { Variables } from "src/types";
import { authMiddleware } from "@middlewares/auth.middleware";
import { ProblemDocument } from "http-problem-details";
import * as HttpStatusCode from "stoker/http-status-codes";
import type { HTTPException } from "hono/http-exception";

const app = new Hono<{ Bindings: Cloudflare.Env; Variables: Variables }>();

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
export default app;
