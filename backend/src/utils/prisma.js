const { PrismaClient } = require("@prisma/client");

// Reuse a single PrismaClient instance across the app (and across hot
// reloads in development) to avoid exhausting MySQL connections.
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

module.exports = prisma;
