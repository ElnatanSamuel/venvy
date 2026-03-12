import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../../utils/env.js";

export async function initCommand() {
  const schemaPath = join(process.cwd(), "venvy.schema.ts");
  if (existsSync(schemaPath)) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Error: venvy.schema.ts already exists.",
    );
    process.exit(1);
  }

  const envData = loadEnvFiles(undefined, { ignoreProcessEnv: true });
  const keys = Object.keys(envData).filter(
    (k) =>
      !k.startsWith("npm_") &&
      !k.startsWith("NODE_") &&
      !k.startsWith("SHELL") &&
      !k.startsWith("PATH"),
  );

  if (keys.length === 0) {
    console.log(
      "\x1b[33m%s\x1b[0m",
      "No environment variables found to initialize from. Creating a blank schema.",
    );
  }

  let schemaContent =
    'import { string, number, boolean, url, enumeration } from "venvy";\n\n';
  schemaContent += "export const env = {\n";

  for (const key of keys) {
    const value = envData[key];
    let validator = "string()";

    if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
      validator = "boolean()";
    } else if (!isNaN(Number(value)) && value.trim() !== "") {
      validator = "number()";
    } else if (value.startsWith("http://") || value.startsWith("https://")) {
      validator = "url()";
    }

    schemaContent += `  ${key}: ${validator}.required(),\n`;
  }

  schemaContent += "};\n";

  writeFileSync(schemaPath, schemaContent);
  console.log(
    "\x1b[32m%s\x1b[0m",
    "Successfully initialized venvy.schema.ts! 🚀",
  );
  console.log("Next steps:");
  console.log("1. Review your schema and add descriptions or default values.");
  console.log("2. Run 'npx venvy validate' to check your environments.");
}
