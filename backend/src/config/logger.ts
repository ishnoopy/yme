import pino from "pino";
import moment from "moment";
import { GeneralConfig } from "./general.js";

const { environment, serviceName, logLevel } = GeneralConfig;

export const LoggerConfig: pino.LoggerOptions = {
  level: logLevel,
  base: {
    environment,
    service: serviceName,
  },
  transport: getTransportConfig(),
}

function getTransportConfig(): pino.TransportMultiOptions {
  const infoLogFileName = `info-${moment().format('YYYY-MM-DD')}`;
  const errorLogFileName = `error-${moment().format('YYYY-MM-DD')}`;
  const combinedLogFileName = `combined-${moment().format('YYYY-MM-DD')}`;
  
  switch (environment) {
    case "development":
      return {
        targets: [
          {
            target: "pino/file",
            options: {
              destination: `./logs/${infoLogFileName}.log`,
              mkdir: true,
            },
            level: "info",
          },
          {
            target: "pino/file",
            options: {
              destination: `./logs/${errorLogFileName}.log`,
              mkdir: true,
            },
            level: "error",
          },
          {
            target: "pino/file",
            options: {
              destination: `./logs/${combinedLogFileName}.log`,
              mkdir: true,
            },
          },
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'",
              messageFormat: `{environment}|{service} - {msg}`,
            },
            level: "debug",
          }
        ]
      };
    
    default:
      return {
        targets: [
          {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss.l'Z'",
              messageFormat: `{environment}|{service} - {msg}`,
            },
            level: "debug",
          }
        ]
      };
  }
}
