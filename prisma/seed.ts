import "dotenv/config";
import bcrypt from "bcryptjs";
import { createPrismaClient } from "../src/lib/prisma";

const prisma = createPrismaClient();

async function main() {
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
    const password = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { username: user.username },
      update: { password, displayName: user.displayName },
      create: {
        username: user.username,
        password,
        displayName: user.displayName,
      },
    });
  }

  console.log("Utilizadores criados com sucesso.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
