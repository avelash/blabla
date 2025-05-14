import { datadogLogs } from "@datadog/browser-logs";
// Pull from global window config (from env.js)
const ENV = window.appConfig?.ENV;
const SERVER = window.appConfig?.FRONTEND_NAME;
//TODO: get token from secret
const DATADOG_CLIENT_TOKEN = "pub7e79aef67986941493cb437955533ec5";

// Only initialize if token exists
function logToDatadog(): boolean {
  const isDev = import.meta.env.DEV;
  return !isDev 
}
if (datadogClientTokenExists() && logToDatadog()) {
  datadogLogs.init({
    clientToken: DATADOG_CLIENT_TOKEN, 
    site: "datadoghq.com", // 'datadoghq.eu' if you're in Europe
    forwardErrorsToLogs: true,
    sessionSampleRate: 100,
    env: ENV,
  });

  // Set global context after init
  datadogLogs.setGlobalContext({
    env: ENV,
    server: SERVER,
  });
}

//to change
function datadogClientTokenExists() {
  return true;
}

class Log {
  static info(...message: string[]) {
    const logMessage = message.join(",");
    if (!datadogClientTokenExists()) {
      console.log(logMessage);
      return;
    }
    datadogLogs.logger.info(logMessage, {});
  }

  static warn(...message: string[]) {
    const logMessage = message.join(",");
    if (!datadogClientTokenExists()) {
      console.warn(logMessage);
      return;
    }
    datadogLogs.logger.warn(logMessage, {});
  }

  static error(e?: Error, ...message: string[]) {
    const logMessage = message.join(",");
    if (!datadogClientTokenExists()) {
      console.error(logMessage, e);
      return;
    }
    datadogLogs.logger.error(logMessage, {
      error: e,
    });
  }
}

export default Log;
