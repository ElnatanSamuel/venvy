import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { loadEnvFiles } from "../../utils/env.js";
import { scanCodebase } from "../../utils/scanner.js";
import { ui } from "../../utils/ui.js";

export async function initCommand() {
  ui.header("Initialization");

  const schemaPath = join(process.cwd(), "venvy.schema.ts");
  if (existsSync(schemaPath)) {
    ui.error("venvy.schema.ts already exists.");
    process.exit(1);
  }

  // 1. Scan .env files
  const envData = loadEnvFiles(undefined, { ignoreProcessEnv: true });
  const envKeys = Object.keys(envData).filter(
    (k) =>
      !k.startsWith("npm_") &&
      !k.startsWith("NODE_") &&
      !k.startsWith("SHELL") &&
      !k.startsWith("PATH"),
  );

  // 2. Scan codebase
  ui.success("Scanning codebase for process.env usage...");
  const codeKeys = Array.from(scanCodebase(process.cwd()));

  // 3. Merge keys
  const allKeys = Array.from(new Set([...envKeys, ...codeKeys])).sort();

  if (allKeys.length === 0) {
    ui.warn(
      "No environment variables found in .env or codebase. Creating a blank schema.",
    );
  } else {
    ui.success(`Found ${allKeys.length} unique variables.`);
  }

  let schemaContent =
    'import { string, number, boolean, url, enumeration } from "venvy";\n\n';
  schemaContent += "export const env = {\n";

  for (const key of allKeys) {
    const value = envData[key] || "";
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

  ui.box(
    `1. Review your schema and add descriptions or default values.\n2. Run 'npx venvy validate' to check your environments.`,
    "NEXT STEPS",
  );

  ui.success(`Successfully initialized venvy.schema.ts`);
}
