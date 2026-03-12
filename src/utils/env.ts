import { readFileSync, existsSync } from "fs";
import { join } from "path";

export function parseEnvFile(filePath: string): Record<string, string> {
  if (!existsSync(filePath)) {
    return {};
  }

  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");
  const env: Record<string, string> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const [key, ...valueParts] = trimmed.split("=");
    if (key) {
      let value = valueParts.join("=").trim();
      // Remove quotes if present
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      env[key.trim()] = value;
    }
  }

  return env;
}

export function loadEnvFiles(
  envName?: string,
  options: { ignoreProcessEnv?: boolean } = {},
): Record<string, string> {
  const baseEnv = parseEnvFile(join(process.cwd(), ".env"));
  const localEnv = parseEnvFile(join(process.cwd(), ".env.local"));

  let specificEnv = {};
  if (envName) {
    specificEnv = parseEnvFile(join(process.cwd(), `.env.${envName}`));
  }

  return {
    ...baseEnv,
    ...specificEnv,
    ...localEnv,
    ...(options.ignoreProcessEnv
      ? {}
      : (process.env as Record<string, string>)),
  };
}
