# Validators

All validators are factory functions imported from `venvy`. Every validator supports the [base methods](#base-methods) listed at the bottom.

---

## `string()`

Validates any string value.

**Extra methods:**

| Method            | Description                                          |
| :---------------- | :--------------------------------------------------- |
| `.minLength(n)`   | Fails if the string is shorter than `n` characters   |
| `.regex(pattern)` | Fails if the string doesn't match the given `RegExp` |

```typescript
import { string } from "venvy";

JWT_SECRET: string().required().minLength(32),
API_KEY: string().required().regex(/^sk_/),
```

---

## `number()`

Parses a string from the environment into a JavaScript `number`. Returns `0` if optional and missing.

```typescript
import { number } from "venvy";

TIMEOUT_MS: number().default(5000),
```

---

## `boolean()`

Accepts `"true"` or `"1"` as truthy, `"false"` or `"0"` as falsy. Returns `false` if optional and missing.

```typescript
import { boolean } from "venvy";

ENABLE_LOGGING: boolean().default(true),
```

---

## `enumeration(options[])`

Ensures the value is one of the provided strings. In TypeScript the type is automatically inferred as a union.

```typescript
import { enumeration } from "venvy";

NODE_ENV: enumeration(["development", "production", "test"]).required(),
// TypeScript type: "development" | "production" | "test"
```

---

## `url()`

Parses the value with the native `URL` constructor. Fails if the string is not a valid URL.

```typescript
import { url } from "venvy";

DATABASE_URL: url().required(),
// Valid:   "https://db.example.com"
// Invalid: "db.example.com"  →  Error: Invalid URL
```

---

## `email()`

Validates the value against a standard email format.

```typescript
import { email } from "venvy";

SUPPORT_EMAIL: email().required(),
// Valid:   "support@company.com"
// Invalid: "notanemail"  →  Error: Invalid email address
```

---

## `ip()`

Validates an IPv4 address.

```typescript
import { ip } from "venvy";

SERVER_IP: ip().required(),
// Valid:   "192.168.1.1"
// Invalid: "999.x.y.z"  →  Error: Invalid IP address
```

---

## `port()`

Validates that the value is a number between `1` and `65535`.

```typescript
import { port } from "venvy";

PORT: port().default(3000),
// Valid:   3000, 443, 8080
// Invalid: 0, 70000  →  Error: Port must be between 1 and 65535
```

---

## Base Methods

These methods are available on **every** validator.

### `.required()`

Marks the variable as mandatory. Validation fails if it is absent and has no default.

### `.default(value)`

Provides a fallback value when the variable is absent from the environment.

### `.description(text)`

Human-readable description. Used by `venvy docs` to generate the README table.

### `.requiredIf(condition)`

Makes the variable required only when the condition returns `true`. The condition receives the full env object.

```typescript
// Only required when NODE_ENV is "production"
ADMIN_EMAIL: email().requiredIf(v => v.NODE_ENV === "production"),
```
