import { INestApplication, NotFoundException } from '@nestjs/common';
import { Test, type TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { FlagsController } from '../src/flags/flags.controller.js';
import { FlagsService } from '../src/flags/flags.service.js';

describe('Flags HTTP API', () => {
  let app: INestApplication;

  const flagsService = {
    findAll: vitest.fn(),
    findById: vitest.fn(),
    create: vitest.fn(),
    update: vitest.fn(),
  };

  const flag = {
    id: 'flag-1',
    name: 'new-dashboard',
    value: true,
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagsController],
      providers: [
        {
          provide: FlagsService,
          useValue: flagsService,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(() => {
    vitest.resetAllMocks();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /flags', () => {
    it('returns all flags', async () => {
      flagsService.findAll.mockResolvedValue([flag]);

      const response = await request(app.getHttpServer())
        .get('/flags')
        .expect(200);

      expect(response.body).toEqual([flag]);
      expect(flagsService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /flags/:id', () => {
    it('returns a flag', async () => {
      flagsService.findById.mockResolvedValue(flag);

      const response = await request(app.getHttpServer())
        .get('/flags/flag-1')
        .expect(200);

      expect(response.body).toEqual(flag);
      expect(flagsService.findById).toHaveBeenCalledWith('flag-1');
    });

    it('returns 404 when the flag does not exist', async () => {
      flagsService.findById.mockRejectedValue(
        new NotFoundException("Flag 'missing' not found"),
      );

      await request(app.getHttpServer())
        .get('/flags/missing')
        .expect(404);
    });
  });

  describe('POST /flags', () => {
    it('creates a flag', async () => {
      const input = {
        name: 'new-dashboard',
        type: 'boolean',
        value: true,
      };
      flagsService.create.mockResolvedValue(flag);

      const response = await request(app.getHttpServer())
        .post('/flags')
        .send(input)
        .expect(201);

      expect(response.body).toEqual(flag);
      expect(flagsService.create).toHaveBeenCalledWith(input);
    });
  });

  describe('PATCH /flags/:id', () => {
    it('updates a flag', async () => {
      const input = { value: false };
      const updatedFlag = { ...flag, value: false };
      flagsService.update.mockResolvedValue(updatedFlag);

      const response = await request(app.getHttpServer())
        .patch('/flags/flag-1')
        .send(input)
        .expect(200);

      expect(response.body).toEqual(updatedFlag);
      expect(flagsService.update).toHaveBeenCalledWith('flag-1', input);
    });

    it('returns 404 when the flag does not exist', async () => {
      flagsService.update.mockRejectedValue(
        new NotFoundException("Flag 'missing' not found"),
      );

      await request(app.getHttpServer())
        .patch('/flags/missing')
        .send({ value: false })
        .expect(404);
    });
  });
});