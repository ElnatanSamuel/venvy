import { pathToFileURL } from "url";
import { join } from "path";
import { existsSync as fsExists } from "fs";
import { execSync } from "child_process";

export async function loadSchema() {
  const schemaPathTs = join(process.cwd(), "venvy.schema.ts");
  const schemaPathJs = join(process.cwd(), "venvy.schema.js");

  let modulePath: string | undefined;

  if (fsExists(schemaPathTs)) {
    modulePath = schemaPathTs;
  } else if (fsExists(schemaPathJs)) {
    modulePath = schemaPathJs;
  }

  if (!modulePath) {
    throw new Error(
      "venvy.schema.ts or venvy.schema.js not found in current directory.",
    );
  }

  try {
    // If it's a TS file, we might need a loader
    if (modulePath.endsWith(".ts")) {
      // In a real production tool, we might use 'jiti' or 'tsx' internally
      // For this implementation, we'll try to use 'tsx' if available
      // or assume the environment can handle it (e.g. ts-node/register)
      try {
        // This is a bit of a hack for the MVP to support direct .ts loading
        // In a full package, we'd bundle a loader.
        const { register } = await import("tsx/esm/api");
        register();
      } catch (e) {
        // Fallback or ignore if already registered
      }
    }

    const module = await import(pathToFileURL(modulePath).href);
    return module.env || module.default;
  } catch (err) {
    throw new Error(`Failed to load schema: ${(err as Error).message}`);
  }
}
