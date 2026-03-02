import { Schema, InferEnv, ValidationError } from "./types.js";

export function defineEnv<S extends Schema>(schema: S): InferEnv<S> {
  const result: any = {};
  const errors: ValidationError[] = [];

  // Gather all environment variables for conditional checks
  const allVars = { ...process.env } as Record<string, string>;

  for (const [key, validator] of Object.entries(schema)) {
    const value = allVars[key];
    const validationResult = validator.validate(key, value, allVars);

    if (typeof validationResult === "object" && "message" in validationResult) {
      errors.push(validationResult);
    } else {
      result[key] = validationResult;
    }
  }

  if (errors.length > 0) {
    console.error("\x1b[31m%s\x1b[0m", "Venvy Validation Failed:");
    errors.forEach((err) => {
      console.error(
        `  - ${err.key}: ${err.message} (received: ${err.received ?? "undefined"})`,
      );
    });
    process.exit(1);
  }

  return result as InferEnv<S>;
}
