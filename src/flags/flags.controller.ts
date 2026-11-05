import {
  Body,
  Get,
  Param,
  Patch,
  Post,
  Controller
} from '@nestjs/common';

import type { UpdateFlagDto, CreateFlagDto, FlagDto } from './flags.dto.js';
import { FlagsService } from './flags.service.js';

@Controller('flags')
export class FlagsController {
  constructor(private readonly flagsService: FlagsService) {}

  @Get()
  getFlags(): Promise<FlagDto[]> {
    return this.flagsService.findAll();
  }

  @Get(':id')
  getFlagById(@Param('id') id: string): Promise<FlagDto> {
    return this.flagsService.findById(id);
  }

  @Patch(':id')
  updateFlag(
    @Param('id') id: string,
    @Body() body: UpdateFlagDto,
  ): Promise<FlagDto> {
    return this.flagsService.update(id, body);
  }

  @Post()
  createFlag(
    @Body() body: CreateFlagDto,
  ): Promise<FlagDto> {
    return this.flagsService.create(body);
  }
}