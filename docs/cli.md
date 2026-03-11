# CLI Reference

All commands are available via `npx venvy` or the `venvy` binary if installed globally.

Every command reads your schema from `venvy.schema.ts` or `venvy.schema.js` in the current working directory.

---

## `venvy init`

Scans your `.env` file and generates a `venvy.schema.ts` with inferred types. Ideal for adding Venvy to an existing project in seconds.

```bash
npx venvy init
```

**What it does:**

- Reads `.env` in the current directory
- Infers types: numbers, booleans, URLs, and strings
- Writes a ready-to-use `venvy.schema.ts`

---

## `venvy validate`

Validates the current environment against the schema. Exits with code `1` if validation fails.

```bash
npx venvy validate
npx venvy validate --env production   # reads .env.production
```

**Options:**

| Flag           | Description                                                   |
| :------------- | :------------------------------------------------------------ |
| `--env <name>` | Load a named env file (e.g. `production` → `.env.production`) |

**Use in CI/CD:**
Add to your pipeline to catch bad config before deploy:

```yaml
- run: npx venvy validate --env production
```

---

## `venvy sync`

Interactively fills in any missing required variables and writes them to your `.env`.

```bash
npx venvy sync
```

**What it does:**

- Compares your schema against your current `.env`
- Prompts you for each missing required variable
- Validates your input in real-time against the schema rules
- Appends the new values to `.env`

---

## `venvy diff <env1> <env2>`

Compares two environment files and shows what's missing or different between them.

```bash
npx venvy diff development production
# Compares .env.development against .env.production
```

**Output example:**

```
Variable         development     production
DB_HOST          localhost       db.prod.example.com
FEATURE_FLAGS    true            MISSING
```

---

## `venvy generate`

Generates a `.env.example` file from the schema. Variables with `.default()` are shown with their default values; required ones are shown blank.

```bash
npx venvy generate
```

**Output `.env.example`:**

```
PORT=3000
DATABASE_URL=
NODE_ENV=
JWT_SECRET=
```

Commit this file to your repo so new devs know what they need.

---

## `venvy docs`

Injects a Markdown table of all environment variables directly into your `README.md`. Uses markers to know where to inject.

**Step 1** — Add markers to your README:

```markdown
<!-- venvy:start -->
<!-- venvy:end -->
```

**Step 2** — Run:

```bash
npx venvy docs
```

**Result** — Venvy fills in the table automatically:

```markdown
<!-- venvy:start -->

### Environment Variables

| Variable     | Type | Required | Default | Description                  |
| :----------- | :--- | :------- | :------ | :--------------------------- |
| PORT         | port | No       | 3000    | Port the server listens on   |
| DATABASE_URL | url  | Yes      | -       | PostgreSQL connection string |

<!-- venvy:end -->
```

---

## `venvy hook`

Installs a Git `pre-commit` hook that runs `venvy validate` before every commit. Prevents bad config from ever being committed.

```bash
npx venvy hook
```

Writes to `.git/hooks/pre-commit`. Safe to run multiple times.
