import {
  Inject,
  Injectable,
  type NestMiddleware,
} from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

import {
  HTTP_ACCESS_LOGGER,
  type HttpAccessLogger,
} from './http-access-logger.js';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  constructor(
    @Inject(HTTP_ACCESS_LOGGER)
    private readonly logger: HttpAccessLogger,
  ) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const start = process.hrtime.bigint();

    res.once('finish', () => {
      const durationMs =
        Number(process.hrtime.bigint() - start) / 1_000_000;

      this.logger.write({
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        durationMs,
      });
    });

    next();
  }
}