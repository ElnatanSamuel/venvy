# Runtime Protection

Venvy can protect your app at startup by validating the environment before any code runs. If validation fails, the process exits immediately with a clear error — not some cryptic crash 20 lines later.

---

## `defineEnv(schema)`

The standard way to validate and access your environment. Returns a **fully typed** object based on your schema.

```typescript
import { defineEnv } from "venvy";
import { env as schema } from "./venvy.schema.js";

export const env = defineEnv(schema);
```

### What happens when it fails

```
Venvy Validation Failed:
  - JWT_SECRET: Variable is required (received: undefined)
  - PORT: Port must be between 1 and 65535 (received: 99999)
```

Then `process.exit(1)` is called. Your app never starts.

### Type Inference

The return type is fully inferred from your schema — no manual types needed.

```typescript
const env = defineEnv({
  PORT: port().default(3000), // → number
  DB_URL: url().required(), // → string
  NODE_ENV: enumeration(["dev", "prod"]).required(), // → "dev" | "prod"
});

env.PORT; // TypeScript knows: number
env.DB_URL; // TypeScript knows: string
env.NODE_ENV; // TypeScript knows: "dev" | "prod"
```

---

## Recommended Pattern

Keep your schema and env export in one place and import it everywhere:

```typescript
// src/env.ts
import { defineEnv } from "venvy";
import { env as schema } from "../venvy.schema.js";

export const env = defineEnv(schema);
```

```typescript
// src/server.ts
import { env } from "./env.js";

app.listen(env.PORT, () => {
  console.log(`Listening on ${env.PORT}`);
});
```

```typescript
// src/db.ts
import { env } from "./env.js";

const client = new PostgresClient({ url: env.DATABASE_URL });
```

This way `defineEnv` only runs once at boot, and every file gets the same validated, typed object.

---

## `guard(schema)`

A lower-level alternative to `defineEnv`. Throws an error instead of exiting the process, giving you control over the error handling.

```typescript
import { guard } from "venvy";
import { env as schema } from "./venvy.schema.js";

try {
  const env = guard(schema);
  startServer(env);
} catch (err) {
  console.error("Config error:", err.message);
  process.exit(1);
}
```

Use `guard` when you need custom error logging (e.g. sending to Sentry before crashing).
