import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class JsonLoggerService extends ConsoleLogger {
  log(message: unknown, context?: string): void {
    this.write('log', message, context);
  }

  error(message: unknown, stackOrContext?: string, context?: string): void {
    this.write('error', message, context ?? stackOrContext, stackOrContext);
  }

  warn(message: unknown, context?: string): void {
    this.write('warn', message, context);
  }

  debug(message: unknown, context?: string): void {
    this.write('debug', message, context);
  }

  verbose(message: unknown, context?: string): void {
    this.write('verbose', message, context);
  }

  private write(
    level: LogLevel,
    message: unknown,
    context?: string,
    stack?: string,
  ): void {
    const payload = {
      timestamp: new Date().toISOString(),
      level,
      service: 'qr-access-service',
      context,
      message: this.normalize(message),
      stack: level === 'error' ? stack : undefined,
    };

    const serialized = JSON.stringify(payload);

    if (level === 'error') {
      process.stderr.write(`${serialized}\n`);
      return;
    }

    process.stdout.write(`${serialized}\n`);
  }

  private normalize(message: unknown): unknown {
    if (message instanceof Error) {
      return {
        name: message.name,
        message: message.message,
      };
    }

    return message;
  }
}
