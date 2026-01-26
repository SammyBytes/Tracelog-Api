import type { SelectAccount } from "@db/types";

export type Bindings = {
  TURSO_DATABASE_URL: string;
  TURSO_DATABASE_AUTH_TOKEN: string;
  NODE_ENV: "development" | "production";
};

export type Variables = {
  account: SelectAccount;
};
