# Getting Started

## 1. Install

```bash
npm install venvy
```

## 2. Create a Schema

Create `venvy.schema.ts` in your project root. This is the single source of truth for all your environment variables.

```typescript
import { string, number, boolean, url, email, enumeration, port } from "venvy";

export const env = {
  PORT: port().default(3000).description("Port the server listens on"),
  DATABASE_URL: url().required().description("PostgreSQL connection string"),
  NODE_ENV: enumeration(["development", "production", "test"]).required(),
  ADMIN_EMAIL: email().requiredIf((v) => v.NODE_ENV === "production"),
  JWT_SECRET: string().required().minLength(32),
  FEATURE_FLAGS: boolean().default(false),
};
```

> If you have an existing `.env` file, just run `npx venvy init` and Venvy will auto-generate this file for you.

## 3. Validate Your Environment

```bash
npx venvy validate
```

Venvy will read your `.env` and check it against the schema. If anything is wrong, you get a clear, coloured error:

```
Venvy Validation Failed:
  - JWT_SECRET: Variable is required (received: undefined)
  - ADMIN_EMAIL: Invalid email address (received: notanemail)
```

## 4. Protect Your App at Startup

Call `defineEnv` at the top of your app entry point so your app never boots with an invalid config.

```typescript
// src/index.ts
import { defineEnv } from "venvy";
import { env as schema } from "../venvy.schema.js";

export const env = defineEnv(schema);
// ^ If validation fails, the process exits here with a helpful error message.

console.log(`Starting on port ${env.PORT}`);
```

## 5. Fill in Missing Variables (Interactive)

```bash
npx venvy sync
```

Venvy will ask you for each missing required variable one by one and append them to your `.env`.

## What's Next?

- Read [validators.md](./validators.md) for all available types.
- Read [cli.md](./cli.md) for the full CLI reference.
- Read [runtime.md](./runtime.md) for startup protection patterns.
