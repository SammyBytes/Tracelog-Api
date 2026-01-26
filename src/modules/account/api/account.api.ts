import { db } from "@db/client";
import { Hono } from "hono";
import type { Bindings, Variables } from "src/types";
import { AccountRequestSchema } from "../accountRequest.dto";
import { create } from "../account.repository";
import { generateTracelogKey } from "../utils/crypto.utils";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.post("/", async (c) => {
  const payload = await c.req.json();
  if (!payload) {
    return c.json({ error: "Invalid payload" }, 400);
  }

  const { data, success, error } =
    await AccountRequestSchema.safeParseAsync(payload);

  if (!success) {
    return c.json({ error: error.message }, 400);
  }

  console.debug("Received payload:", data);

  const fullPayload = {
    ...payload,
    apiKeyHash: generateTracelogKey(),
  };

  try {
    const database = db(c.env);
    const result = await create(database, fullPayload);
    return c.json(result);
  } catch (error) {
    console.error("Error creating account:", error);
    return c.json({ error: "Failed to create account" }, 500);
  }
});

export default app;
