import { db } from "@db/client";
import { Hono } from "hono";
import type { Variables } from "src/types";
import { updateApiKey } from "../account.repository";
import { generateTracelogKey } from "../utils/crypto.utils";
import { authMiddleware } from "@middlewares/auth.middleware";

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
  const newKey = generateTracelogKey();

  try {
    const database = db(c.env);

    await updateApiKey(database, user.id, newKey);

    return c.json({
      message: "API Key generated successfully",
      apiKey: newKey,
    });
  } catch (error) {
    return c.json({ error: "Failed to generate key" }, 500);
  }
});

export default app;
