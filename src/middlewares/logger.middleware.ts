import { Prisma } from "@prisma/client";
import { createMiddleware } from "hono/factory";

export class Logger {
  static query = (massage: Prisma.QueryEvent) => {
    return createMiddleware(async (c, next) => {
        await next()
        console.info(`[QUERY : ${massage}] - [${new Date()}]`);
    })
  };

  static info = (massage: Prisma.LogEvent) => {
    return createMiddleware(async (c, next) => {
        await next()
        console.info(`[INFO : ${massage}] - [${new Date()}]`);
    })
  };

  static warn = (massage: Prisma.LogEvent) => {
    return createMiddleware(async (c, next) => {
        await next()
        console.warn(`[WARN : ${massage}] - [${new Date()}]`);
    })
  };

  static error = (massage: Prisma.LogEvent) => {
    return createMiddleware(async (c, next) => {
        await next()
        console.error(`[ERROR : ${massage}] - [${new Date()}]`);
    })
  };
}
