import { BaseValidator, ValidationError } from "./types.js";
import { string, number, boolean } from "./validator.js";

/**
 * Note: This is a heavy-weight bridge. In a real package,
 * we would make zod an optional peer dependency.
 */
export function fromZod(zodSchema: any): Record<string, BaseValidator<any>> {
  const schema: Record<string, BaseValidator<any>> = {};

  // This is a simplified mapping. In a real implementation,
  // we would traverse the Zod object recursively.
  const shape = zodSchema._def?.shape?.() || {};

  for (const [key, zodType] of Object.entries(shape)) {
    const typeName = (zodType as any)._def.typeName;
    let validator: BaseValidator<any>;

    switch (typeName) {
      case "ZodString":
        validator = string();
        break;
      case "ZodNumber":
        validator = number();
        break;
      case "ZodBoolean":
        validator = boolean();
        break;
      default:
        validator = string();
    }

    if (!(zodType as any).isOptional()) {
      validator.required();
    }

    const description = (zodType as any).description;
    if (description) {
      validator.description(description);
    }

    schema[key] = validator;
  }

  return schema;
}
