import { PrismaClient } from '@prisma/client';
declare global {
  // eslint-disable-next-line no-var
  var __db: PrismaClient;
}
if (!global.__db) {
  global.__db = new PrismaClient();
}
global.__db.$connect();

export const db = global.__db;
