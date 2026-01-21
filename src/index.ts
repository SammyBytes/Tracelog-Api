import { Hono } from "hono";
import type { Bindings } from "./types";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => {
  return c.json({
    message: "Trace-Log API Online",
  });
});

export default {
  port: 1234,
  fetch: app.fetch,
};
