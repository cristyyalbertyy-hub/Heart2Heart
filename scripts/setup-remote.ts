import "dotenv/config";
import bcrypt from "bcryptjs";
import { execSync } from "node:child_process";
import { createPrismaClient } from "../src/lib/prisma";

const prisma = createPrismaClient();

async function seedUsers() {
  const users = [
    {
      username: process.env.MAE_USERNAME ?? "mae",
      password: process.env.MAE_PASSWORD ?? "mae123",
      displayName: process.env.MAE_NAME ?? "Mãe",
    },
    {
      username: process.env.FILHO_USERNAME ?? "filho",
      password: process.env.FILHO_PASSWORD ?? "filho123",
      displayName: process.env.FILHO_NAME ?? "Filho",
    },
  ];

  for (const user of users) {
    const username = user.username.trim().toLowerCase();
    const password = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { username },
      update: { password, displayName: user.displayName },
      create: {
        username,
        password,
        displayName: user.displayName,
      },
    });
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Define DATABASE_URL no .env antes de correr este script.");
  }

  console.log("A criar tabelas na base de dados...");
  execSync("npx prisma db push", { stdio: "inherit" });

  console.log("A criar contas da mãe e do filho...");
  await seedUsers();

  console.log("Base de dados remota pronta!");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
