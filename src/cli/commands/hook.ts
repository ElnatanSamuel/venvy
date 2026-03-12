import { writeFileSync, chmodSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { ui } from "../../utils/ui.js";

export function hookCommand() {
  const gitDir = join(process.cwd(), ".git");
  if (!existsSync(gitDir)) {
    console.error(
      "\x1b[31m%s\x1b[0m",
      "Error: .git directory not found. Are you in a git repository?",
    );
    process.exit(1);
  }

  const hooksDir = join(gitDir, "hooks");
  if (!existsSync(hooksDir)) {
    mkdirSync(hooksDir);
  }

  const preCommitPath = join(hooksDir, "pre-commit");
  const hookContent = `#!/bin/sh
# Venvy pre-commit hook
npx venvy validate
`;

  writeFileSync(preCommitPath, hookContent);
  chmodSync(preCommitPath, "755");

  ui.success("Successfully set up Venvy pre-commit hook");
  console.log("");
}
