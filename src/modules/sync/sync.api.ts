import { db } from "@db/client";
import { Hono } from "hono";
import type { Bindings } from "src/types";
import { GitHubSyncSchema } from "./sync.dto";
import { syncGithubPayload } from "./sync.service";

const app = new Hono<{ Bindings: Bindings }>();

app.post("/sync", async (c) => {
  const database = db(c.env);
  const payload = await c.req.json();
  if (!payload) {
    return c.json({ error: "Invalid payload" }, 400);
  }
  console.debug("Received payload:", payload);
  // Validate payload
  const data = GitHubSyncSchema.parse(payload);

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
