import { db } from "@db/client";
import { Hono } from "hono";
import type { Bindings, Variables } from "src/types";
import { AccountRequestSchema } from "../accountRequest.dto";
import { create } from "../account.repository";
import { generateTracelogKey } from "../utils/crypto.utils";
import { validator } from "hono/validator";
import z from "zod";
import type { NewAccount } from "@db/types";

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

app.post(
  "/",
  validator("json", (value, c) => {
    const parsed = AccountRequestSchema.safeParse(value);
    if (!parsed.success) {
      return c.json({ error: z.formatError(parsed.error) }, 400);
    }
    return parsed.data;
  }),
  async (c) => {
    const data = c.req.valid("json");

    console.debug("Received payload:", data);

    const apiKey = generateTracelogKey();

    const accountToInsert: NewAccount = {
      ...data,
      apiKeyHash: apiKey,
    };

    try {
      const database = db(c.env);
      const result = await create(database, accountToInsert);
      return c.json(
        {
          account: result,
          apiKey: apiKey,
        },
        201,
      );
    } catch (error) {
      console.error("Error creating account:", error);
      return c.json({ error: "Failed to create account" }, 500);
    }
  },
);

export default app;
