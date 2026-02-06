import pino from 'pino';
import { config } from './config';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    singleLine: false,
    translateTime: 'HH:MM:ss Z',
    ignore: 'pid,hostname',
  },
});

const pinoLogger = pino(
  {
    level: config.logLevel,
  },
  transport
);

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    pinoLogger.info({ context: this.context, ...metadata }, message);
  }

  debug(message: string, metadata?: Record<string, unknown>): void {
    pinoLogger.debug({ context: this.context, ...metadata }, message);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    pinoLogger.warn({ context: this.context, ...metadata }, message);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    pinoLogger.error({ context: this.context, ...metadata }, message);
  }
}
