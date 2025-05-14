import winston from "winston";
import Transport from "datadog-winston";
import { getDatadogApiKey, getEnv } from "./genericEnvVar";
import os from "os";
import { debug } from "console";

const environment = getEnv();
//const envsToLog = new Set(["test", "stag", "prod"]);

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { env: environment },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    new Transport({
      apiKey: getDatadogApiKey(),
      format: winston.format.json(),
    }),
  ],
});

function sendToDatadog(): boolean {
  return process.env.DEBUG === "false";
}

function logExtraParams() {
  const server = process.env.serverName;
  return { server };
}

function logInfo(...message: string[]) {
  const logMessage = message.join(",");
  if (sendToDatadog()) {
    logger.info(logMessage, {
      ...logExtraParams(),
    });
  } else {
    console.log(logMessage, {
      status: "info",
      ...logExtraParams(),
    });
  }
}

function logWarn(...message: string[]) {
  const logMessage = message.join(",");
  if (sendToDatadog()) {
    logger.warn(logMessage, {
      ...logExtraParams(),
    });
  } else {
    console.log(logMessage, {
      status: "warn",
      ...logExtraParams(),
    });
  }
}

function logError(e: Error, ...message: string[]) {
  const logMessage = message.join(",");
  if (sendToDatadog()) {
    logger.error(logMessage, {
      error: e.message,
      stack: e.stack,
      ...logExtraParams(),
    });
  } else {
    console.log(logMessage, {
      status: "error",
      error: e.message,
      stack: e.stack,
    });
  }
}

export { logInfo, logWarn, logError };
