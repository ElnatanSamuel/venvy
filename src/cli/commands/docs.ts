import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { loadSchema } from "../../utils/schema-loader.js";

export async function docsCommand() {
  let schema;
  try {
    schema = await loadSchema();
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", (err as Error).message);
    process.exit(1);
  }

  const readmePath = join(process.cwd(), "README.md");

  if (!existsSync(readmePath)) {
    console.error("\x1b[31m%s\x1b[0m", "Error: README.md not found.");
    process.exit(1);
  }

  let table = "\n### Environment Variables\n\n";
  table += "| Variable | Type | Required | Default | Description |\n";
  table += "| :--- | :--- | :--- | :--- | :--- |\n";

  for (const [key, validator] of Object.entries(schema)) {
    const v = validator as any;
    const type = v.constructor.name.replace("Validator", "").toLowerCase();
    const required = v._required ? "Yes" : v._condition ? "Conditional" : "No";
    const defaultValue = v._default !== undefined ? `\`${v._default}\`` : "-";
    const description = v._description || "-";

    table += `| ${key} | ${type} | ${required} | ${defaultValue} | ${description} |\n`;
  }

  let readmeContent = readFileSync(readmePath, "utf-8");
  const markerStart = "<!-- venvy:start -->";
  const markerEnd = "<!-- venvy:end -->";

  if (
    readmeContent.includes(markerStart) &&
    readmeContent.includes(markerEnd)
  ) {
    const startIdx = readmeContent.indexOf(markerStart) + markerStart.length;
    const endIdx = readmeContent.indexOf(markerEnd);
    readmeContent =
      readmeContent.slice(0, startIdx) +
      "\n" +
      table +
      "\n" +
      readmeContent.slice(endIdx);
  } else {
    readmeContent += `\n${markerStart}${table}${markerEnd}\n`;
  }

  writeFileSync(readmePath, readmeContent);
  console.log(
    "\x1b[32m%s\x1b[0m",
    "Successfully updated README.md with environment variable table! 📖",
  );
}
