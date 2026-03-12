import { readFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

/**
 * Scans the codebase for environment variable usage
 */
export function scanCodebase(dir: string): Set<string> {
  const envVars = new Set<string>();
  const ignoreDirs = ["node_modules", ".git", "dist", "build", ".next"];
  const extensions = [".ts", ".js", ".tsx", ".jsx", ".vue", ".svelte"];

  function walk(currentDir: string) {
    const files = readdirSync(currentDir);

    for (const file of files) {
      if (ignoreDirs.includes(file)) continue;

      const path = join(currentDir, file);
      const stat = statSync(path);

      if (stat.isDirectory()) {
        walk(path);
      } else if (extensions.includes(extname(file))) {
        try {
          const content = readFileSync(path, "utf-8");
          // Regex to find process.env.VAR_NAME or process.env['VAR_NAME'] or process.env["VAR_NAME"]
          const matches = content.matchAll(
            /process\.env(?:\.([a-zA-Z_][a-zA-Z0-9_]*)|\[['"]([a-zA-Z_][a-zA-Z0-9_]*)['"]\])/g,
          );

          for (const match of matches) {
            const varName = match[1] || match[2];
            if (
              varName &&
              !varName.startsWith("npm_") &&
              !varName.startsWith("NODE_")
            ) {
              envVars.add(varName);
            }
          }
        } catch (e) {
          // Ignore read errors
        }
      }
    }
  }

  walk(dir);
  return envVars;
}
