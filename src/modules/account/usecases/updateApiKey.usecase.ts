import type { DatabaseOrTransaction } from "@db/types";
import { Result, ok, err } from "neverthrow";
import { updateApiKey } from "../account.repository";
import { HTTPException } from "hono/http-exception";
import { NOT_FOUND } from "stoker/http-status-codes";
import { generateTracelogKey, hashApiKey } from "../utils/crypto.utils";

export const updateApiKeyUsecase = async (
  dbContext: DatabaseOrTransaction,
  accountId: string,
): Promise<Result<string, Error>> => {
  try {
    const newKey = generateTracelogKey();
    const salt = crypto.randomUUID();

    const hashedKey = await hashApiKey(newKey, salt);

    const wasUpdated = await updateApiKey(dbContext, accountId, hashedKey, salt);

    if (!wasUpdated) {
      return err(
        new HTTPException(NOT_FOUND, {
          message: "Account not found",
        }),
      );
    }
    console.log("Account updated");

    return ok(newKey);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      return err(
        new HTTPException(500, {
          message: "Internal Server Error",
          cause: error.cause,
        }),
      );
    }
    return err(new HTTPException(500, { message: "Internal Server Error" }));
  }
};
