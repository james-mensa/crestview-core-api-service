import { createLogger, format, transports, Logger } from 'winston';

const customFormat = format.combine(
  format.colorize({ all: true }), // Colorize all levels
  format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss' // Customize timestamp format
  }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    // Customize the output format
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `${timestamp} [${level}]: ${message} ${metaString}`.trim();
  })
);

export class LoggerService {
  private logger: Logger;

  constructor(service: string, context = "DB_SERVICE") {
    this.logger = createLogger({
      format: customFormat,
      transports: [
        new transports.Console(), 
        new transports.File({
          filename: "logs/error.log", 
          level: "error",
          format: format.combine(
            format.timestamp(),
            format.json() 
          ),
        }),
      ],
    }).child({ service, context });
  }

  info(message: string, meta?: Record<string, any>) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: Record<string, any>) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.logger.warn(message, meta);
  }

  debug(message: string, meta?: Record<string, any>) {
    this.logger.debug(message, meta);
  }
}
