import { pino } from "pino";
import { LoggerConfig } from "../config/logger.js";

class Logger {
  private static instance: Logger;
  private logger: pino.Logger;
  private constructor() {

    this.logger = pino(LoggerConfig);
  }

  //DOCU: Used to check if the logger is already initialized (Singleton pattern)
  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.logger.info(context, message);
  }

  public error(message: string, context?: Record<string, unknown>): void {
    this.logger.error(context, message);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.logger.warn(context, message);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.logger.debug(context, message);
  }
}

export const logger = Logger.getInstance();
export default logger;


