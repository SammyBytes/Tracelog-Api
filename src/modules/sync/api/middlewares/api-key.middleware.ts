import type { Context, Next } from "hono";
import { retrieveById } from "@modules/account/account.repository";
import { db } from "@db/client";
import { verifyApiKey } from "@modules/account/utils/crypto.utils";
import { ProblemDocument } from "http-problem-details";
import { NOT_FOUND } from "stoker/http-status-codes";

const headerApiKey = "X-Tracelog-API-Key";
const headerAccountId = "X-Tracelog-Account-Id";

export const validationKeyMiddleware = async (c: Context, next: Next) => {
  const apiKey = c.req.header(headerApiKey);
  const accountId = c.req.header(headerAccountId);

  if (!apiKey || !accountId) {
    return c.json({ error: "Missing authentication headers" }, 401);
  }

  const account = await retrieveById(db(c.env), accountId);

  if (!account) {
    const problem = new ProblemDocument({
      title: "Account not found",
      detail: "Account not found",
      status: NOT_FOUND,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: NOT_FOUND,
    });
  }

  if (!account.apiKeyHash || !account.apiKeySalt) {
    const problem = new ProblemDocument({
      title: "Api Key not found",
      detail: "No API Key found for this account",
      status: NOT_FOUND,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: NOT_FOUND,
    });
  }

  const isValid = await verifyApiKey(
    apiKey,
    account.apiKeyHash,
    account.apiKeySalt,
  );

  if (!isValid) {
    const problem = new ProblemDocument({
      title: "Invalid API Key",
      detail: "API Key is invalid, please generate a new one",  
      status: NOT_FOUND,
      instance: c.req.path,
    });

    const problemJson = JSON.stringify(problem);
    console.error(problemJson);
    return new Response(problemJson, {
      status: NOT_FOUND,
    });
  }

  c.set("account", account);
  await next();
};
