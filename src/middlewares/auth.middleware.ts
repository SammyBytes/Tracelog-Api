import type { Context, Next } from "hono";
import { auth as getAuth } from "src/libs/better-auth";

export const authMiddleware = async (c: Context, next: Next) => {
  const auth = getAuth(c.env);

  const session = await auth.api.getSession({
    headers: c.req.raw.headers,
  });

  if (!session) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  c.set("user", session.user);
  c.set("session", session.session);

  await next();
};
