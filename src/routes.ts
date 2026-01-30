import { Hono } from "hono";
import syncApi from "@modules/sync/sync.api";
import projectApi from "@modules/project/api/project.api";
import accountApi from "@modules/account/api/account.api";
import { auth as getAuth } from "./libs/better-auth";

const app = new Hono<{ Bindings: Cloudflare.Env }>();

app.on(["POST", "GET"], "/auth/*", (c) => {
  const auth = getAuth(c.env);
  return auth.handler(c.req.raw);
});

// Routes
app.route("/webhooks/github", syncApi);
app.route("/accounts", accountApi);
app.route("/projects", projectApi);

export default app;
