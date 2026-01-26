import { Hono } from "hono";
import syncApi from "@modules/sync/sync.api";
import accountApi from "@modules/account/api/account.api";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// Routes
app.route("/webhooks/github", syncApi);
app.route("/accounts", accountApi);

export default app;
