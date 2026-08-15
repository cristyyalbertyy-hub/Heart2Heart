import "dotenv/config";
import { execSync } from "node:child_process";

console.log("A atualizar o esquema da base de dados...");
execSync("npx prisma db push --accept-data-loss", { stdio: "inherit" });
console.log("Base de dados pronta para o same-room.");
