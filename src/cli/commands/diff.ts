import { parseEnvFile } from "../../utils/env.js";
import { join } from "path";
import { existsSync, writeFileSync } from "fs";
import inquirer from "inquirer";
import { ui } from "../../utils/ui.js";

export async function diffCommand(env1: string, env2: string) {
  ui.header("Comparison");

  const path1 = join(process.cwd(), `.env.${env1}`);
  const path2 = join(process.cwd(), `.env.${env2}`);

  const checkFile = async (name: string, path: string) => {
    if (!existsSync(path)) {
      ui.warn(`Environment file .env.${name} not found.`);
      const { create } = await inquirer.prompt([
        {
          type: "confirm",
          name: "create",
          message: `Would you like to create .env.${name}?`,
          default: true,
        },
      ]);

      if (create) {
        writeFileSync(path, "# Created by Venvy\n");
        ui.success(`.env.${name} created.`);
      } else {
        ui.error(`Cannot continue without .env.${name}`);
        process.exit(1);
      }
    }
  };

  await checkFile(env1, path1);
  await checkFile(env2, path2);

  const data1 = parseEnvFile(path1);
  const data2 = parseEnvFile(path2);

  const allKeys = Array.from(
    new Set([...Object.keys(data1), ...Object.keys(data2)]),
  ).sort();

  const rows = allKeys
    .map((key) => {
      const val1 = data1[key] || "MISSING";
      const val2 = data2[key] || "MISSING";
      return [key, val1, val2];
    })
    .filter((row) => row[1] !== row[2]);

  if (rows.length === 0) {
    ui.success("All variables match! No differences found.");
  } else {
    ui.table(["VARIABLE", env1.toUpperCase(), env2.toUpperCase()], rows);
  }
  console.log("");
}
