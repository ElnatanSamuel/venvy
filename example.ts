import { defineEnv, string, number, enumeration, url } from "./src";

// Mocking some environment variables for demonstration
process.env.DB_URL = "postgres://localhost:5432/mydb";
process.env.PORT = "3000";
process.env.NODE_ENV = "development";
process.env.JWT_SECRET = "very-long-secret-key-at-least-32-chars";

const env = defineEnv({
  DB_URL: url().required(),
  PORT: number().default(3000),
  NODE_ENV: enumeration(["development", "production", "test"]).required(),
  JWT_SECRET: string().required().minLength(32),
});

console.log("Validated Environment:", env);
console.log("PORT type:", typeof env.PORT); // should be number
