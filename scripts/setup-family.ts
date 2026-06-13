import { config } from "dotenv";
import { execSync } from "node:child_process";
import bcrypt from "bcryptjs";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../src/generated/prisma/client";

config({ path: ".env.family" });

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("Define DATABASE_URL no ficheiro .env.family");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

async function seedUsers(prisma: PrismaClient) {
  const users = [
    {
      username: process.env.MAE_USERNAME ?? "Alex",
      password: process.env.MAE_PASSWORD ?? "Alex2026",
      displayName: process.env.MAE_NAME ?? "Alex",
    },
    {
      username: process.env.FILHO_USERNAME ?? "Kiki",
      password: process.env.FILHO_PASSWORD ?? "kiki2026",
      displayName: process.env.FILHO_NAME ?? "Kiki",
    },
  ];

  for (const user of users) {
    const username = user.username.trim().toLowerCase();
    const password = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { username },
      update: { password, displayName: user.displayName },
      create: { username, password, displayName: user.displayName },
    });
  }
}

async function main() {
  if (!process.env.DATABASE_URL || !process.env.DIRECT_URL) {
    throw new Error(
      "Cria o ficheiro .env.family com DATABASE_URL e DIRECT_URL (2.º projeto Neon)."
    );
  }

  console.log("A criar tabelas na base de dados da instância 2...");
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: process.env.DIRECT_URL },
  });

  const prisma = createPrismaClient();
  console.log("A criar contas Alex e Kiki...");
  await seedUsers(prisma);
  await prisma.$disconnect();

  console.log("Instância 2 — base de dados pronta!");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
