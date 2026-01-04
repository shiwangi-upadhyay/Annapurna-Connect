// src/lib/db.ts
import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  // We pass a config object here to satisfy the "non-empty options" requirement
  // and to help us debug query issues if they arise.
  return new PrismaClient({
    log: ['warn', 'error'],
  });
};

declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;