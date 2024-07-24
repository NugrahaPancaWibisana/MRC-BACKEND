import { PrismaClient } from "@prisma/client";
import { Logger } from "../middlewares/logger.middleware";

export const DB = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

DB.$on("query", (e) => {
  Logger.query(e);
});

DB.$on("error", (e) => {
  Logger.error(e);
});

DB.$on("info", (e) => {
  Logger.info(e);
});

DB.$on("warn", (e) => {
  Logger.warn(e);
});

