import pino from "pino";
import pinoHttp from "pino-http";
import fs from "fs";

const logFilePath = "./logs/app.log";

if (!fs.existsSync("./logs")) {
  fs.mkdirSync("./logs");
}

const logStream = pino.destination(logFilePath);

const logger = pino(
  {
    level:
      process.env.NODE_ENV === "test"
        ? "silent"
        : process.env.LOG_LEVEL || "info",
    formatters: {
      level(label) {
        return { level: label };
      },
    },
  },
  logStream
);

if (process.env.NODE_ENV !== "test") {
  logger.info(`Logging to file at ${logFilePath}`);
}

export const httpLogger = pinoHttp({ logger });

export default logger;
