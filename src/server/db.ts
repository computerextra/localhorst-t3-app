import { PrismaClient } from "@prisma/client";
import { PrismaClient as SageClient } from "prisma/generated/Sage";
import { PrismaClient as CmsClient } from "prisma/generated/CMS";

import { env } from "@/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const createSageClient = () =>
  new SageClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const createCmsClient = () =>
  new CmsClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

const globalForSage = globalThis as unknown as {
  prisma: ReturnType<typeof createSageClient> | undefined;
};

const globalForCms = globalThis as unknown as {
  prisma: ReturnType<typeof createCmsClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();
export const sage = globalForSage.prisma ?? createSageClient();
export const cms = globalForCms.prisma ?? createCmsClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForSage.prisma = sage;
  globalForCms.prisma = cms;
}
