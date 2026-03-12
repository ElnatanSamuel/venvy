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
    // If it's a TS file, we'll try to use the loader if we're not already being run by one
    if (modulePath.endsWith(".ts")) {
      // In a real production tool, we use ts-node/register or tsx/esm/api
      // but only if we are in a CJS context or need to hook into ESM.
      // The user is seeing a cycle error probably because we are trying to
      // register a loader while a loader is already active.
      try {
        // Only attempt to register if tsx is not already active
        if (!process.env.VENVY_LOADER_ACTIVE) {
          process.env.VENVY_LOADER_ACTIVE = "true";
          // Try a simpler approach: if we are already running via tsx/ts-node,
          // we don't need to do anything.
          // If we are running via raw node, we'll need the user to use -r ts-root/register
          // or we can try to use jiti which is more robust for these cycles.
        }
      } catch (e) {
        // Ignore loader registration errors
      }
    }

    // Using a timestamp to bust cache and avoid some weird ESM reload issues
    const module = await import(
      `${pathToFileURL(modulePath).href}?t=${Date.now()}`
    );
    return module.env || module.default;
  } catch (err) {
    throw new Error(`Failed to load schema: ${(err as Error).message}`);
  }
}
