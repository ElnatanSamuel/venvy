<div align="center">

![Venvy Logo](public/white.png)

# 🚀 Venvy

[![npm version](https://badge.fury.io/js/venvy.svg)](https://www.npmjs.com/package/venvy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

**🔧 Strict environment variable governance for modern applications**

[📖 Documentation](https://venvydocs.vercel.app/) • [📦 npm Package](https://www.npmjs.com/package/venvy) • [🌐 Website](https://venvydocs.vercel.app/)

---

Venvy is a professional command-line tool and library designed for **strict environment variable governance** in Node.js, React, Next.js, and React Native applications. It ensures that your applications always run with a valid, type-safe, and complete set of environment variables.

</div>

## ✨ Why Venvy?

Stop letting environment variables cause runtime errors and configuration nightmares! Venvy brings **enterprise-grade environment governance** to your projects with zero configuration overhead.

### 🎯 Core Purpose

- **🛡️ Strict Validation**: Enforce that all required environment variables are present and match defined types at application startup or during CI/CD
- **⚡ Type Safety**: Automatically infer TypeScript types from your environment schema, ensuring that `process.env` access is safe and predictable
- **🔄 Cross-Environment Consistency**: Detect missing or extra variables across different environment files (e.g., .env.development vs. .env.production)
- **🚀 Simplified Onboarding**: Generate .env.example files automatically to help new developers set up their local environments quickly
- **🚦 CI/CD Integration**: Exit with non-zero codes when validation fails, allowing you to catch configuration errors before they reach production

## 🚀 Features

- **📋 Schema-Based Definition**: Define your environment structure using a fluent API that supports strings, numbers, booleans, enums, and URLs
- **🔍 Advanced Validators**: Built-in support for `email()`, `ip()`, `port()`, and custom `regex()` validation
- **🎭 Conditional Validation**: Use `requiredIf()` to make variables required only under specific conditions
- **📚 Automatic Documentation**: Generate and inject environment variable tables directly into your README.md
- **🪝 Git Hooks**: Automatically set up pre-commit hooks to prevent invalid configurations from being committed
- **⚡ JIT Schema Loading**: Load `.ts` schema files directly in the CLI without a manual compilation step
- **🏗️ Project Scaffolding**: Use `init` to automatically generate a schema from your existing `.env` files
- **🤝 Interactive Sync**: Use `sync` to interactively fill in missing variables in your `.env`
- **🔗 Zod Integration**: Power Venvy with your existing Zod schemas using the `fromZod` bridge

## 📦 Installation

```bash
npm install venvy
```

Or get started immediately with npx:

```bash
npx venvy init
```

## 🎯 Quick Start

### 1. Define Your Schema

Create a file named `venvy.schema.ts` (or `venvy.schema.js`) in your project root:

```typescript
import { string, number, enumeration, url, email, port } from "venvy";

export const env = {
  DB_URL: url().required().description("Main database connection string"),
  PORT: port().default(3000).description("Application server port"),
  NODE_ENV: enumeration(["development", "production", "test"]).required(),
  ADMIN_EMAIL: email().requiredIf((vars) => vars.NODE_ENV === "production"),
  JWT_SECRET: string().required().minLength(32),
  API_RATE_LIMIT: number().default(1000).min(1).max(10000),
  CORS_ORIGINS: string().default("http://localhost:3000").regex(/^https?:\/\/.+/),
};
```

#### 🎨 Using Zod

If you already use Zod, you can bridge your schema seamlessly:

```typescript
import { z } from "zod";
import { fromZod, defineEnv } from "venvy";

const zodSchema = z.object({
  PORT: z.number().default(3000).describe("App server port"),
  DB_URL: z.string().url().describe("Main DB URL"),
  NODE_ENV: z.enum(["development", "production", "test"]),
});

export const env = defineEnv(fromZod(zodSchema));
```

### 2. CLI Commands

Venvy provides a powerful CLI for management and automation.

#### 🚀 Initialize Venvy in an existing project:

```bash
npx venvy init
```

#### 🤝 Interactively sync missing variables:

```bash
npx venvy sync
```

#### ✅ Validate the current environment:

```bash
npx venvy validate
```

#### 🔍 Compare environments:

```bash
npx venvy diff development production
```

#### 📚 Inject documentation table into README:

```bash
npx venvy docs
```

#### 📄 Generate .env.example:

```bash
npx venvy generate
```

#### 🪝 Set up Git pre-commit hook:

```bash
npx venvy hook
```

### 3. Runtime Protection

To protect your application at runtime, call `defineEnv` at the very beginning of your entry point:

```typescript
import { defineEnv } from "venvy";
import { env as schema } from "./venvy.schema.js";

// This validates the environment and returns a type-safe object
export const env = defineEnv(schema);

console.log(env.DB_URL); // Fully typed as string
console.log(env.PORT);    // Fully typed as number
```

## 🏗️ Advanced Usage

### Conditional Requirements

Make variables required only in specific scenarios:

```typescript
export const env = {
  NODE_ENV: enumeration(["development", "production", "test"]).required(),
  DEBUG_MODE: boolean().default(false),
  SENTRY_DSN: url().requiredIf((vars) => vars.NODE_ENV === "production"),
  LOG_LEVEL: enumeration(["error", "warn", "info", "debug"])
    .default("info")
    .requiredIf((vars) => vars.DEBUG_MODE),
};
```

### Custom Validation

Add your own validation logic:

```typescript
export const env = {
  API_KEY: string()
    .required()
    .regex(/^sk_[a-zA-Z0-9]{32}$/)
    .description("Stripe API key (starts with sk_)"),
  
  DATABASE_POOL_SIZE: number()
    .default(10)
    .min(1)
    .max(100)
    .description("Database connection pool size"),
};
```

### Environment Comparison

Ensure consistency across your environments:

```bash
# Check what's different between staging and production
npx venvy diff staging production

# Output:
# ❌ Missing in production: DEBUG_MODE
# ⚠️  Different values: API_RATE_LIMIT (staging: 100, production: 1000)
# ✅ All other variables match!
```

## 🛠️ Technical Architecture

Venvy is designed to be **lightweight with minimal dependencies**. It leverages TypeScript's advanced type inference to provide a seamless developer experience without requiring manual type maintenance or complex code generation.

### Key Design Principles

- **Zero Runtime Overhead**: Validation happens once at startup
- **Type Safety First**: All environment access is fully typed
- **Developer Experience**: Intuitive CLI with helpful error messages
- **CI/CD Ready**: Built for automated workflows

## 📚 API Reference

### Core Validators

| Validator | Description | Example |
|-----------|-------------|---------|
| `string()` | String values | `string().required().minLength(5)` |
| `number()` | Numeric values | `number().default(42).min(0).max(100)` |
| `boolean()` | Boolean values | `boolean().default(false)` |
| `url()` | URL validation | `url().required().protocol("https")` |
| `email()` | Email validation | `email().required()` |
| `port()` | Port numbers | `port().default(3000)` |
| `enumeration()` | Enum values | `enumeration(["dev", "prod"]).required()` |

### Advanced Methods

- `.required()` - Mark as required
- `.default(value)` - Set default value
- `.description(text)` - Add description for docs
- `.requiredIf(condition)` - Conditional requirement
- `.regex(pattern)` - Custom regex validation
- `.min/max` - Numeric/string constraints

## 🌟 Community & Support

- **📖 [Full Documentation](https://venvydocs.vercel.app/)** - Comprehensive guides and API reference
- **🐛 [Issue Tracker](https://github.com/ElnatanSamuel/venvy/issues)** - Report bugs and request features
- **💬 [Discussions](https://github.com/ElnatanSamuel/venvy/discussions)** - Community discussions and Q&A

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

```bash
git clone https://github.com/ElnatanSamuel/venvy.git
cd venvy
npm install
npm run dev
```

## 📄 License

MIT © [Elnatan Samuel](https://github.com/ElnatanSamuel)

---

<div align="center">

**⭐ Star this repo if Venvy helped you!**

Made with ❤️ by [Elnatan Samuel](https://github.com/ElnatanSamuel)

</div>

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
