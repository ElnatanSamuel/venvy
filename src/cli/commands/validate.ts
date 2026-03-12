import { loadEnvFiles } from "../../utils/env.js";
import { BaseValidator, ValidationError } from "../../core/types.js";
import { loadSchema } from "../../utils/schema-loader.js";

export async function validateCommand(options: { env?: string }) {
  let schema;
  try {
    schema = await loadSchema();
  } catch (err) {
    console.error("\x1b[31m%s\x1b[0m", (err as Error).message);
    process.exit(1);
  }

  const envData = loadEnvFiles(options.env);
  const errors: ValidationError[] = [];

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
    console.error("\x1b[31m%s\x1b[0m", "Validation failed:");
    errors.forEach((err) => {
      console.error(
        `  - ${err.key}: ${err.message} (received: ${err.received ?? "undefined"})`,
      );
    });
    process.exit(1);
  } else {
    console.log("\x1b[32m%s\x1b[0m", "Environment is valid");
  }
}
