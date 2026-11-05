import { Injectable, NotFoundException } from '@nestjs/common';

import { FlagsRepo } from './flags.repo.js';
import { FlagDto, CreateFlagDto, UpdateFlagDto } from './flags.dto.js';
import { FlagEntity } from './flags.entity.js';

@Injectable()
export class FlagsService {
  constructor(private readonly flagsRepo: FlagsRepo) {}

  async findAll(): Promise<FlagDto[]> {
    const flags = await this.flagsRepo.findAll();

    return flags.map(flag => this.toDto(flag));
  }

  async findById(id: string): Promise<FlagDto> {
    const flag = await this.flagsRepo.findById(id);

    if (!flag) {
      throw new NotFoundException(
        `Flag '${id}' not found`,
      );
    }

    return this.toDto(flag);
  }

  async create(
    createFlagDto: CreateFlagDto,
  ): Promise<FlagDto> {
    const flag = await this.flagsRepo.create(createFlagDto);

    return this.toDto(flag);
  }

  async update(
    id: string,
    updateFlagDto: UpdateFlagDto
  ): Promise<FlagDto> {
    const existing = await this.flagsRepo.findById(id);

    if (!existing) {
      throw new NotFoundException(
        `Flag '${id}' not found`,
      );
    }

    const updated = await this.flagsRepo.update(id, updateFlagDto);

    return this.toDto(updated);
  }

  private toDto(entity: FlagEntity): FlagDto {
    return {
      id: entity.id,
      name: entity.name,
      value: entity.value,
    };
  }
}