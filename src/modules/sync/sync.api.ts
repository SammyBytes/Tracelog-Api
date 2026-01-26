import { db } from "@db/client";
import { Hono } from "hono";
import type { Bindings, Variables } from "src/types";
import { GitHubSyncSchema } from "./sync.dto";
import { syncGithubPayload } from "./sync.service";
import { validationKeyMiddleware } from "./api/middlewares/validationKey.middleware";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.use(validationKeyMiddleware);

app.post("/sync", async (c) => {
  const database = db(c.env);
  const payload = await c.req.json();
  if (!payload) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const account = c.get("account");

  const { url, createdAt, ...accountWithoutKey } = account;
  const fullPayload = {
    ...payload,
    account: accountWithoutKey,
  };

  console.debug("Received payload:", fullPayload);

  // Validate payload
  const data = GitHubSyncSchema.parse(fullPayload);

  console.debug("Parsed payload:", data);
  try {
    const result = await syncGithubPayload(database, data);
    return c.json(result);
  } catch (error) {
    console.error("Error syncing GitHub payload:", error);
    return c.json({ error: "Failed to sync GitHub payload" }, 500);
  }
});

export default app;
