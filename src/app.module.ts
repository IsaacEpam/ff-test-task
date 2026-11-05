import {
  MiddlewareConsumer,
  Module,
  type NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FlagsModule } from './flags/flags.module.js';
import { HTTP_ACCESS_LOGGER } from './http-logging/http-access-logger.js';
import { NestHttpAccessLogger } from './http-logging/http-access-logger.nest.js';
import { RequestLoggingMiddleware } from './http-logging/http-access-logger.middleware.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    FlagsModule,
  ],
  providers: [
    RequestLoggingMiddleware,
    {
      provide: HTTP_ACCESS_LOGGER,
      useClass: NestHttpAccessLogger,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(RequestLoggingMiddleware)
      .forRoutes({ path: '{*path}', method: RequestMethod.ALL });
  }
}