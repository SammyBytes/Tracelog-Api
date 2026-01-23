import { Hono } from "hono";
import syncApi from "@modules/sync/sync.api";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

// Routes
app.route("/webhooks/github", syncApi);

export default app;
