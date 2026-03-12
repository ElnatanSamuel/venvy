import inquirer from "inquirer";
import { appendFileSync, existsSync, writeFileSync } from "fs";
import { join } from "path";
import { loadSchema } from "../../utils/schema-loader.js";
import { loadEnvFiles } from "../../utils/env.js";
import { BaseValidator } from "../../core/types.js";
import { ui } from "../../utils/ui.js";

export async function syncCommand() {
  ui.header("Sync Environment");

  let schema;
  try {
    schema = await loadSchema();
  } catch (err) {
    ui.error((err as Error).message);
    process.exit(1);
  }

  const envData = loadEnvFiles();
  const missingKeys = Object.entries(
    schema as Record<string, BaseValidator<any>>,
  )
    .filter(([key, validator]) => {
      const isRequired =
        validator._required ||
        (validator._condition && validator._condition(envData));
      return isRequired && (envData[key] === undefined || envData[key] === "");
    })
    .map(([key]) => key);

  if (missingKeys.length === 0) {
    ui.success("Everything is in sync! No missing variables found.");
    console.log("");
    return;
  }

  ui.warn(
    `Found ${missingKeys.length} missing variables. Let's fill them in:\n`,
  );

  const answers = await inquirer.prompt(
    missingKeys.map((key) => {
      const validator = (schema as any)[key];
      return {
        type: "input",
        name: key,
        message: `${key}${validator._description ? ` ${ui.dim}(${validator._description})${ui.dim}` : ""}:`,
        validate: (input: string) => {
          const result = validator.validate(key, input, {
            ...envData,
            [key]: input,
          });
          if (typeof result === "object" && "message" in result) {
            return result.message;
          }
          return true;
        },
      };
    }),
  );

  const envPath = join(process.cwd(), ".env");
  let envContent = "";

  for (const [key, value] of Object.entries(answers)) {
    envContent += `\n${key}=${value}`;
  }

  if (existsSync(envPath)) {
    appendFileSync(envPath, envContent);
  } else {
    writeFileSync(envPath, envContent.trim());
  }

  ui.success("Successfully updated .env");
  console.log("");
}
