import { Hono } from "hono";
import type { Bindings } from "./types";
import routes from "./routes";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/api", routes);

app.get("/", (c) => {
  return c.json({
    message: "Trace-Log API Online",
  });
});

export default {
  port: 1234,
  fetch: app.fetch,
};
