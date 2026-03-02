# Venvy

Venvy is a professional command-line tool and library designed for strict environment variable governance in Node.js, React, Next.js, and React Native applications. It ensures that your applications always run with a valid, type-safe, and complete set of environment variables.

## Core Purpose

1.  **Strict Validation**: Enforce that all required environment variables are present and match defined types at application startup or during CI/CD.
2.  **Type Safety**: Automatically infer TypeScript types from your environment schema, ensuring that `process.env` access is safe and predictable.
3.  **Cross-Environment Consistency**: Detect missing or extra variables across different environment files (e.g., .env.development vs. .env.production).
4.  **Simplified Onboarding**: Generate .env.example files automatically to help new developers set up their local environments quickly.
5.  **CI/CD Integration**: Exit with non-zero codes when validation fails, allowing you to catch configuration errors before they reach production.

## Features

- **Schema-Based Definition**: Define your environment structure using a fluent API that supports strings, numbers, booleans, enums, and URLs.
- **Advanced Validators**: Built-in support for `email()`, `ip()`, `port()`, and custom `regex()` validation.
- **Conditional Validation**: Use `requiredIf()` to make variables required only under specific conditions.
- **Automatic Documentation**: Generate and inject environment variable tables directly into your README.md.
- **Git Hooks**: Automatically set up pre-commit hooks to prevent invalid configurations from being committed.
- **JIT Schema Loading**: Load `.ts` schema files directly in the CLI without a manual compilation step.
- **Project Scaffolding**: Use `init` to automatically generate a schema from your existing `.env` files.
- **Interactive Sync**: Use `sync` to interactively fill in missing variables in your `.env`.
- **Zod Integration**: Power Venvy with your existing Zod schemas using the `fromZod` bridge.

## Installation

```bash
npm install venvy
```

## Usage

### 1. Defining the Schema

Create a file named `venvy.schema.ts` (or `venvy.schema.js`) in your project root.

```typescript
import { string, number, enumeration, url, email, port } from "venvy";

export const env = {
  DB_URL: url().required().description("Main database connection string"),
  PORT: port().default(3000).description("Application server port"),
  NODE_ENV: enumeration(["development", "production", "test"]).required(),
  ADMIN_EMAIL: email().requiredIf((vars) => vars.NODE_ENV === "production"),
  JWT_SECRET: string().required().minLength(32),
};
```

#### Using Zod

If you already use Zod, you can bridge your schema:

```typescript
import { z } from "zod";
import { fromZod, defineEnv } from "venvy";

const zodSchema = z.object({
  PORT: z.number().default(3000).describe("App server port"),
  DB_URL: z.string().url().describe("Main DB URL"),
});

export const env = defineEnv(fromZod(zodSchema));
```

### 2. CLI Commands

Venvy provides a powerful CLI for management and automation.

**Initialize Venvy in an existing project:**

```bash
npx venvy init
```

**Interactively sync missing variables:**

```bash
npx venvy sync
```

**Validate the current environment:**

```bash
npx venvy validate
```

**Compare environments:**

```bash
npx venvy diff development production
```

**Inject documentation table into README:**

```bash
npx venvy docs
```

**Generate .env.example:**

```bash
npx venvy generate
```

**Set up Git pre-commit hook:**

```bash
npx venvy hook
```

### 3. Runtime Protection

To protect your application at runtime, call `defineEnv` at the very beginning of your entry point.

```typescript
import { defineEnv } from "venvy";
import { env as schema } from "./venvy.schema.js";

// This validates the environment and returns a type-safe object
export const env = defineEnv(schema);

console.log(env.DB_URL); // Fully typed as string
```

## Technical Architecture

Venvy is designed to be lightweight with minimal dependencies. It leverages TypeScript's advanced type inference to provide a seamless developer experience without requiring manual type maintenance or complex code generation.

<!-- venvy:start -->

### Environment Variables

| Variable | Type | Required | Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| DB_URL | url | Yes | - | Main PostgreSQL connection string |
| PORT | port | No | `3000` | Application server port |
| NODE_ENV | enum | Yes | - | - |
| ADMIN_EMAIL | email | Conditional | - | System administrator email for alerts |
| JWT_SECRET | string | Yes | - | Secret key for signing JSON Web Tokens |

<!-- venvy:end -->

## License

MIT
