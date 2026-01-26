import type { Context, Next } from "hono";
import { retrieveByApiKeyHash } from "@modules/account/account.repository";
import { db } from "@db/client";

const headerValidationKey = "X-Tracelog-Validation-Key";

export const validationKeyMiddleware = async (c: Context, next: Next) => {
  console.debug("Validating request...");

  const validationKey = c.req.header(headerValidationKey);
  if (!validationKey) {
    return c.json({ error: "Missing validation key" }, 400);
  }

  const account = await retrieveByApiKeyHash(db(c.env), validationKey);
  if (!account) {
    return c.json({ error: "Invalid validation key" }, 400);
  }

  console.debug("Validation key validated!");
  c.set("account", account);
  return next();
};
