import { Hono } from "hono";
import routes from "./routes";
import { auth } from "./libs/better-auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();


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
