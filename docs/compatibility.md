# Compatibility

Venvy ships with two builds to support every environment:

| Build    | Path        | Module system |
| :------- | :---------- | :------------ |
| CommonJS | `dist/cjs/` | `require()`   |
| ESM      | `dist/esm/` | `import`      |

The correct build is chosen **automatically** via the `exports` field in `package.json`. You don't need to configure anything.

---

## Node.js (CommonJS)

Classic Node.js projects using `require()`:

```javascript
// index.js
const { defineEnv, string, port } = require("venvy");

const env = defineEnv({
  PORT: port().default(3000),
  DB_HOST: string().required(),
});

console.log(env.PORT);
```

---

## Node.js + TypeScript (ESM)

Modern Node.js projects with `"type": "module"` and TypeScript:

```typescript
// src/env.ts
import { defineEnv, url, string, enumeration } from "venvy";
import { env as schema } from "../venvy.schema.js";

export const env = defineEnv(schema);
```

Make sure your `tsconfig.json` uses:

```json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  }
}
```

---

## Next.js

Works out of the box. Create a `venvy.schema.ts` in the project root and call `defineEnv` in a shared `lib/env.ts` file.

```typescript
// lib/env.ts
import { defineEnv } from "venvy";
import { env as schema } from "../venvy.schema.js";

export const env = defineEnv(schema);
```

```typescript
// pages/api/hello.ts
import { env } from "../../lib/env.js";

export default function handler(req, res) {
  res.json({ db: env.DATABASE_URL });
}
```

> For Next.js, prefix frontend-safe variables with `NEXT_PUBLIC_` as usual. Venvy validates them all the same.

---

## Vite + React

Vite uses `import.meta.env` instead of `process.env`. Pass the values manually:

```typescript
// src/env.ts
import { defineEnv, url, string } from "venvy";

export const env = defineEnv(
  {
    VITE_API_BASE: url().required().description("Backend API base URL"),
    VITE_APP_NAME: string().default("My App"),
  },
  {
    VITE_API_BASE: import.meta.env.VITE_API_BASE,
    VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
  },
);
```

---

## React Native (Expo)

Use with [react-native-dotenv](https://github.com/goatandsheep/react-native-dotenv) or a similar approach:

```typescript
// env.ts
import { defineEnv, url, string } from "venvy";
import { API_URL, APP_ENV } from "@env"; // from react-native-dotenv

export const env = defineEnv(
  {
    API_URL: url().required(),
    APP_ENV: string().default("development"),
  },
  { API_URL, APP_ENV },
);
```

---

## CI/CD

Add Venvy to your pipeline to catch bad config before it hits production:

```yaml
# GitHub Actions
- name: Validate environment
  run: npx venvy validate --env production
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
    NODE_ENV: production
```

---

## Minimum Requirements

| Requirement           | Version |
| :-------------------- | :------ |
| Node.js               | 18+     |
| TypeScript (optional) | 5.0+    |
| Zod (optional)        | 3.x     |
