import { createLogger, format, transports } from 'winston';

const customFormat = format.printf(
  ({ timestamp, level, context, stack, message, trace }) => {
    return `${timestamp} - [${level.toUpperCase()}] - ${context} - ${
      stack || message
    } ${trace ? trace : ''}`;
  },
);

const options = {
  file: {
    filename: 'logging.log',
    level: 'debug',
  },
  console: {
    level: 'debug',
    handleExceptions: true,
  },
};

const devLogger = {
  format: format.combine(
    format.timestamp(),
    format.colorize({ message: true }),
    format.errors({ stack: true }),
    customFormat,
  ),
  transports: [new transports.Console(options.console)],
};

const prodLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File(options.file),
    new transports.File({
      filename: 'combine.log',
      level: 'info',
    }),
  ],
};

const instanceLogger =
  process.env.NODE_ENV === 'production' ? prodLogger : devLogger;

export const instance = createLogger(instanceLogger);
