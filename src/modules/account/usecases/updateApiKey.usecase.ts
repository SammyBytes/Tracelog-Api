import type { DatabaseOrTransaction } from "@db/types";
import { Result, ok, err } from "neverthrow";
import { updateApiKey } from "../account.repository";
import { HTTPException } from "hono/http-exception";
import { NOT_FOUND } from "stoker/http-status-codes";

export const updateApiKeyUsecase = async (
  dbContext: DatabaseOrTransaction,
  accountId: string,
  apiKeyHash: string,
): Promise<Result<undefined, Error>> => {
  try {
    const wasUpdated = await updateApiKey(dbContext, accountId, apiKeyHash);

    if (!wasUpdated) {
      return err(
        new HTTPException(NOT_FOUND, {
          message: "Account not found",
        }),
      );
    }
    console.log("Account updated");

    return ok(undefined);
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
