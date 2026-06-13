import { config } from "dotenv";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const PROJECT = "heart2heart-family";
const ENV_FILE = ".env.family";

config({ path: ENV_FILE });

if (!fs.existsSync(path.join(process.cwd(), ENV_FILE))) {
  console.error(`Cria o ficheiro ${ENV_FILE} a partir de .env.family.example`);
  process.exit(1);
}

const required = [
  "DATABASE_URL",
  "DIRECT_URL",
  "JWT_SECRET",
  "MAE_USERNAME",
  "MAE_PASSWORD",
  "MAE_NAME",
  "FILHO_USERNAME",
  "FILHO_PASSWORD",
  "FILHO_NAME",
];

for (const key of required) {
  if (!process.env[key]) {
    console.error(`Falta ${key} em ${ENV_FILE}`);
    process.exit(1);
  }
}

function run(command: string) {
  execSync(command, { stdio: "inherit", shell: true });
}

console.log("1/4 — Ligar ao projeto Vercel heart2heart-family...");
run(`npx vercel link --yes --project ${PROJECT}`);

console.log("2/4 — Base de dados...");
run("npx tsx scripts/setup-family.ts");

console.log("3/4 — Variáveis na Vercel...");
for (const key of required) {
  const value = process.env[key]!.replace(/"/g, '\\"');
  run(
    `npx vercel env add ${key} production --value "${value}" --force --yes`
  );
}

console.log("4/4 — Deploy...");
run("npx vercel deploy --prod --yes");

console.log("\nPronto! URL: https://heart2heart-family.vercel.app");
console.log("A restaurar ligação ao projeto heart2heart...");
run("npx vercel link --yes --project heart2heart");
