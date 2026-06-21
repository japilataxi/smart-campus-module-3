import { ConsoleLogger, Injectable } from '@nestjs/common';

@Injectable()
export class StructuredLogger extends ConsoleLogger {
  private write(level: string, message: unknown, context?: string) {
    const payload = {
      level,
      service: process.env.SERVICE_NAME || 'transport-service',
      context,
      message,
      timestamp: new Date().toISOString(),
    };

    process.stdout.write(`${JSON.stringify(payload)}\n`);
  }

  log(message: unknown, context?: string) {
    this.write('info', message, context);
  }

  error(message: unknown, stack?: string, context?: string) {
    this.write('error', { message, stack }, context);
  }

  warn(message: unknown, context?: string) {
    this.write('warn', message, context);
  }

  debug(message: unknown, context?: string) {
    this.write('debug', message, context);
  }

  verbose(message: unknown, context?: string) {
    this.write('verbose', message, context);
  }
}

