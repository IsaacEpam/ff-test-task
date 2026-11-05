import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';

import { FlagsController } from './flags.controller.js';
import { FLAGS_DB, FlagsRepo } from './flags.repo.js';
import { FlagsService } from './flags.service.js';

@Module({
  controllers: [FlagsController],
  providers: [
    {
      provide: FLAGS_DB,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.getOrThrow<string>('DATABASE_URL');
        return drizzle(url);
      },
    },
    FlagsRepo,
    FlagsService,
  ],
})
export class FlagsModule {}