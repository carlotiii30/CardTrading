import pino from "pino";
import pinoHttp from "pino-http";
import createPinoElastic from "pino-elasticsearch";

const elasticUrl = process.env.ELASTIC_URL || "http://elasticsearch:9200";

let streamToElastic;
if (process.env.NODE_ENV !== "test") {
  streamToElastic = createPinoElastic({
    index: "app-logs",
    node: elasticUrl,
  });
}

// Configura el logger base
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
  streamToElastic || undefined
);

if (process.env.NODE_ENV !== "test") {
  logger.info(`Logging to Elasticsearch at ${elasticUrl}`);
}

export const httpLogger = pinoHttp({ logger });

export default logger;
