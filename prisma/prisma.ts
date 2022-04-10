import { PrismaClient } from '@prisma/client';
import { HashPassword } from 'prisma/middlewares';

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['query'],
  });

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// attaching middleware
prisma.$use(HashPassword);
