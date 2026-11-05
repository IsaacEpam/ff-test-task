import { NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';

import type { FlagEntity } from './flags.entity.js';
import { FlagsRepo } from './flags.repo.js';
import { FlagsService } from './flags.service.js';

describe('FlagsService', () => {
  let service: FlagsService;

  const flagsRepo = {
    findAll: vitest.fn(),
    findById: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };

  const flag: FlagEntity = {
    id: 'flag-1',
    name: 'new-dashboard',
    type: 'boolean',
    value: true,
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
  };

  const flagDto = {
    id: 'flag-1',
    name: 'new-dashboard',
    value: true,
  };

  beforeEach(async () => {
    vitest.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        {
          provide: FlagsRepo,
          useValue: flagsRepo,
        },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('returns flags mapped to DTOs', async () => {
      flagsRepo.findAll.mockResolvedValue([flag]);

      await expect(service.findAll()).resolves.toEqual([flagDto]);
      expect(flagsRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('returns an empty array when there are no flags', async () => {
      flagsRepo.findAll.mockResolvedValue([]);

      await expect(service.findAll()).resolves.toEqual([]);
    });
  });

  describe('findById', () => {
    it('returns the flag mapped to a DTO', async () => {
      flagsRepo.findById.mockResolvedValue(flag);

      await expect(service.findById('flag-1')).resolves.toEqual(flagDto);
      expect(flagsRepo.findById).toHaveBeenCalledWith('flag-1');
    });

    it('throws NotFoundException when the flag does not exist', async () => {
      flagsRepo.findById.mockResolvedValue(undefined);

      await expect(service.findById('missing')).rejects.toThrow(
        NotFoundException,
      );
      expect(flagsRepo.findById).toHaveBeenCalledWith('missing');
    });
  });

  describe('create', () => {
    it('passes the input to the repository and returns a DTO', async () => {
      const input = {
        name: 'new-dashboard',
        type: 'boolean',
        value: true,
      };
      flagsRepo.create.mockResolvedValue(flag);

      await expect(service.create(input)).resolves.toEqual(flagDto);
      expect(flagsRepo.create).toHaveBeenCalledWith(input);
    });
  });

  describe('update', () => {
    it('passes the ID and input to the repository and returns a DTO', async () => {
      const input = { value: false };
      const updatedFlag = { ...flag, value: false };

      flagsRepo.findById.mockResolvedValue(flag);
      flagsRepo.update.mockResolvedValue(updatedFlag);

      await expect(service.update('flag-1', input)).resolves.toEqual({
        ...flagDto,
        value: false,
      });
      expect(flagsRepo.findById).toHaveBeenCalledWith('flag-1');
      expect(flagsRepo.update).toHaveBeenCalledWith('flag-1', input);
    });

    it('throws NotFoundException without updating when the flag does not exist', async () => {
      flagsRepo.findById.mockResolvedValue(undefined);

      await expect(
        service.update('missing', { value: false }),
      ).rejects.toThrow(NotFoundException);
      expect(flagsRepo.update).not.toHaveBeenCalled();
    });
  });
});