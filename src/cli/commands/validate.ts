import { loadEnvFiles } from "../../utils/env.js";
import { BaseValidator } from "../../core/types.js";
import { loadSchema } from "../../utils/schema-loader.js";
import { ui } from "../../utils/ui.js";

export async function validateCommand(options: { env?: string }) {
  ui.header("Validation");

  let schema;
  try {
    schema = await loadSchema();
  } catch (err) {
    ui.error((err as Error).message);
    process.exit(1);
  }

  const envData = loadEnvFiles(options.env);
  const errors: any[] = [];

  for (const [key, validator] of Object.entries(
    schema as Record<string, BaseValidator<any>>,
  )) {
    const value = envData[key];
    const validationResult = validator.validate(key, value, envData);

    if (typeof validationResult === "object" && "message" in validationResult) {
      errors.push(validationResult);
    }
  }

  if (errors.length > 0) {
    ui.error("Environment check failed!");
    errors.forEach((err) => {
      console.log(
        `  ${ui.dim}-${ui.reset} ${err.key}: ${err.message} (received: ${err.received ?? "undefined"})`,
      );
    });
    console.log("");
    process.exit(1);
  } else {
    ui.success("Environment is sharp! All variables passed validation.");
    console.log("");
  }
}
