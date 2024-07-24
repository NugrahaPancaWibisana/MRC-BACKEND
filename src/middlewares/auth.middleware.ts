import { createMiddleware } from "hono/factory";

export class Auth {
  static authentication = createMiddleware(async (c, next) => {
    await next();
    if (c.req.header("X-API-TOKEN") === null) {
      return c.json({ errors: "Unauthorized" }, 401);
    }
  });
}
