import "dotenv/config";
import { deleteAllRooms, deleteInactiveRooms } from "../src/lib/cleanup";
import { prisma } from "../src/lib/prisma";

async function main() {
  const wipeAll = process.argv.includes("--all");
  const result = wipeAll
    ? await deleteAllRooms()
    : await deleteInactiveRooms();

  console.log(
    wipeAll
      ? `Removed ${result.deleted} chat(s), including codes, PINs and members.`
      : `Removed ${result.deleted} inactive chat(s) older than 7 days.`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
