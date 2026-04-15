import { PrismaClient } from "../generated/prisma/client";

declare global {
  // allow global `var` reuse in dev
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"], // optional: remove in production
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}