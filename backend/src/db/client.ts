//DOCU: This file is used to create a single instance of the PrismaClient.
// During development, we want to avoid creating a new instance of the PrismaClient for every request (hot reloading)
// This is why we use the globalThis object to store the instance of the PrismaClient
// In production, it does not do hotreloading so we are sure that only one instance of the PrismaClient is used.

import { PrismaClient } from "../../generated/prisma/client.js"

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

