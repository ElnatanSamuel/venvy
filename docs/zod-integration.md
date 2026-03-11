# Zod Integration

If your project already uses [Zod](https://zod.dev/), you don't need to rewrite your schemas. Venvy can bridge them.

---

## When to Use This

- You have an existing Zod schema (e.g. for your API or database models)
- You want Venvy's CLI tools (`diff`, `docs`, `hook`, `generate`) without rewriting anything
- You want to avoid maintaining two separate schemas for the same variables

---

## Setup

Install Zod as a peer dependency:

```bash
npm install zod
```

---

## Usage

```typescript
// venvy.schema.ts
import { z } from "zod";
import { fromZod } from "venvy";

const zodSchema = z.object({
  PORT: z.number().default(3000).describe("App server port"),
  DATABASE_URL: z.string().url().describe("PostgreSQL connection string"),
  NODE_ENV: z.enum(["development", "production", "test"]),
  IS_DEBUG: z.boolean().default(false),
});

export const env = fromZod(zodSchema);
```

That's it. Now all Venvy CLI commands will use this schema.

```bash
npx venvy validate      # validates your env against the Zod schema
npx venvy docs          # injects a table into README.md
npx venvy diff dev prod # compares .env.development vs .env.production
```

---

## What `fromZod` Converts

| Zod type           | Venvy validator      |
| :----------------- | :------------------- |
| `z.string()`       | `string()`           |
| `z.number()`       | `number()`           |
| `z.boolean()`      | `boolean()`          |
| `z.string().url()` | `url()`              |
| `z.enum([...])`    | `enumeration([...])` |

> `.describe("...")` on a Zod field maps to `.description("...")` in Venvy, which is used by `venvy docs`.

---

## Combining Zod and Venvy DSL

You can mix both in the same schema file:

```typescript
import { z } from "zod";
import { fromZod, string, port } from "venvy";

const zodPart = fromZod(
  z.object({
    DATABASE_URL: z.string().url().describe("DB connection"),
  }),
);

export const env = {
  ...zodPart,
  PORT: port().default(3000),
  JWT_SECRET: string().required().minLength(32),
};
```

---

## Limitations

- `fromZod` is a bridge for common types. Complex Zod refinements (`.refine()`, `.transform()`, `.superRefine()`) are not supported — use Venvy's own validators for custom logic.
- Zod is a **peer dependency** — you manage the version. Any Zod v3 version is compatible.
