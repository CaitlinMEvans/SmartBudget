// server/src/db/testSetup.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function setupTestDb() {
  // Clean database before tests
  await prisma.user.deleteMany({});
}

export async function teardownTestDb() {
  await prisma.$disconnect();
}

export { prisma };