import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';

import type { CreateFlagDto, UpdateFlagDto } from './flags.dto.js';
import type { FlagEntity } from './flags.entity.js';
import { flags } from './flags.model.js';

export const FLAGS_DB = Symbol('FLAGS_DB');

@Injectable()
export class FlagsRepo {
  constructor(
    @Inject(FLAGS_DB)
    private readonly db: NodePgDatabase,
  ) {}

  async findAll(): Promise<FlagEntity[]> {
    return this.db.select().from(flags);
  }

  async findById(id: string): Promise<FlagEntity | undefined> {
    const [flag] = await this.db
      .select()
      .from(flags)
      .where(eq(flags.id, id))
      .limit(1);

    return flag;
  }

  async create(input: CreateFlagDto): Promise<FlagEntity> {
    const [flag] = await this.db
      .insert(flags)
      .values(input)
      .returning();

    return flag;
  }

  async update(id: string, input: UpdateFlagDto): Promise<FlagEntity> {
    const [flag] = await this.db
      .update(flags)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(flags.id, id))
      .returning();

    if (!flag) {
      throw new NotFoundException(`Flag '${id}' not found`);
    }

    return flag;
  }
}