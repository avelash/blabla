import winston from "winston";
import Transport from "datadog-winston";
import { getDatadogApiKey } from "./genericEnvVar";

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new Transport({ apiKey: getDatadogApiKey() }),
  ],
});

function logInfo(message: string) {
  logger.info(message);
}

function logWarn(message: string) {
  logger.warn(message);
}

function logError(message: string, e: Error) {
  logger.error(message, e);
}

export { logInfo, logWarn, logError };
