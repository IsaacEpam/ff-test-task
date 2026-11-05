import { Test, type TestingModule } from '@nestjs/testing';

import { FlagsController } from './flags.controller.js';
import type {
  CreateFlagDto,
  FlagDto,
  UpdateFlagDto,
} from './flags.dto.js';
import { FlagsService } from './flags.service.js';

describe('FlagsController', () => {
  let controller: FlagsController;

  const flagsService = {
    findAll: vitest.fn(),
    findById: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };

  const flag: FlagDto = {
    id: 'flag-1',
    name: 'new-dashboard',
    value: true,
  };

  beforeEach(async () => {
    vitest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagsController],
      providers: [
        {
          provide: FlagsService,
          useValue: flagsService,
        },
      ],
    }).compile();

    controller = module.get<FlagsController>(FlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFlags', () => {
    it('returns all flags', async () => {
      flagsService.findAll.mockResolvedValue([flag]);

      await expect(controller.getFlags()).resolves.toEqual([flag]);
      expect(flagsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFlagById', () => {
    it('returns the flag with the given ID', async () => {
      flagsService.findById.mockResolvedValue(flag);

      await expect(controller.getFlagById('flag-1')).resolves.toEqual(flag);
      expect(flagsService.findById).toHaveBeenCalledWith('flag-1');
    });
  });

  describe('createFlag', () => {
    it('passes the request body to the service and returns the created flag', async () => {
      const body: CreateFlagDto = {
        name: 'new-dashboard',
        type: 'boolean',
        value: true,
      };
      flagsService.create.mockResolvedValue(flag);

      await expect(controller.createFlag(body)).resolves.toEqual(flag);
      expect(flagsService.create).toHaveBeenCalledWith(body);
    });
  });

  describe('updateFlag', () => {
    it('passes the ID and request body to the service and returns the updated flag', async () => {
      const body: UpdateFlagDto = { value: true };
      flagsService.update.mockResolvedValue(flag);

      await expect(controller.updateFlag('flag-1', body)).resolves.toEqual(flag);
      expect(flagsService.update).toHaveBeenCalledWith('flag-1', body);
    });
  });
});