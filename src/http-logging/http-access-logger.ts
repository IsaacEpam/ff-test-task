export type HttpAccessLog = {
  method: string;
  path: string;
  statusCode: number;
  durationMs: number;
};

export interface HttpAccessLogger {
  write(entry: HttpAccessLog): void;
}

export const HTTP_ACCESS_LOGGER = Symbol('HTTP_ACCESS_LOGGER');