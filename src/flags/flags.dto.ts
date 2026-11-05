import { FlagEntity } from "./flags.entity.js";

export type FlagDto = {
  id: string;
  name: string;
  value: boolean;
}

export type CreateFlagDto = {
  name: string;
  type: string;
  value: boolean;
}

export type UpdateFlagDto = Partial<
  Omit<FlagEntity, 'id' | 'createdAt' | 'updatedAt'>
>;