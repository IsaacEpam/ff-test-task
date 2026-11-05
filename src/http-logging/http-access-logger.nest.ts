import { Injectable, Logger } from '@nestjs/common';
import type {
  HttpAccessLog,
  HttpAccessLogger,
} from './http-access-logger.js';

@Injectable()
export class NestHttpAccessLogger implements HttpAccessLogger {
  private readonly logger = new Logger('HTTP');

  write(entry: HttpAccessLog): void {
    const message =
      `${entry.method} ${entry.path} ${entry.statusCode} ` +
      `${entry.durationMs.toFixed(1)}ms`;

    if (entry.statusCode >= 500) {
      this.logger.error(message);
    } else if (entry.statusCode >= 400) {
      this.logger.warn(message);
    } else {
      this.logger.log(message);
    }
  }
}