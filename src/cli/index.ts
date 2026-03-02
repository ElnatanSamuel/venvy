#!/usr/bin/env node
import { Command } from "commander";
import { validateCommand } from "./commands/validate.js";
import { diffCommand } from "./commands/diff.js";
import { generateCommand } from "./commands/generate.js";
import { docsCommand } from "./commands/docs.js";
import { hookCommand } from "./commands/hook.js";
import { initCommand } from "./commands/init.js";
import { syncCommand } from "./commands/sync.js";

const program = new Command();

program
  .name("venvy")
  .description("Strict environment variable governance tool")
  .version("1.0.0");

program
  .command("validate")
  .description("Validate environment variables against schema")
  .option("--env <type>", "Environment type (e.g., production, development)")
  .action(validateCommand);

program
  .command("diff <env1> <env2>")
  .description("Compare two environment files")
  .action(diffCommand);

program
  .command("generate")
  .description("Generate .env.example from schema")
  .action(generateCommand);

program
  .command("docs")
  .description("Inject environment variable table into README.md")
  .action(docsCommand);

program
  .command("hook")
  .description("Set up Git pre-commit hook")
  .action(hookCommand);

program
  .command("init")
  .description("Initialize venvy.schema.ts from existing .env files")
  .action(initCommand);

program
  .command("sync")
  .description("Interactively fill in missing environment variables")
  .action(syncCommand);

program.parse();
