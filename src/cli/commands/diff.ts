import { parseEnvFile } from "../../utils/env.js";
import { join } from "path";

export function diffCommand(env1: string, env2: string) {
  const path1 = join(process.cwd(), `.env.${env1}`);
  const path2 = join(process.cwd(), `.env.${env2}`);

  const data1 = parseEnvFile(path1);
  const data2 = parseEnvFile(path2);

  const allKeys = Array.from(
    new Set([...Object.keys(data1), ...Object.keys(data2)]),
  );

  console.log(`\nComparing ${env1} vs ${env2}:\n`);
  console.log(
    "------------------------------------------------------------------",
  );
  console.log(
    `${"VARIABLE".padEnd(25)} | ${env1.padEnd(15)} | ${env2.padEnd(15)}`,
  );
  console.log(
    "------------------------------------------------------------------",
  );

  allKeys.forEach((key) => {
    const val1 = data1[key] ?? "\x1b[31mMISSING\x1b[0m";
    const val2 = data2[key] ?? "\x1b[31mMISSING\x1b[0m";

    if (val1 !== val2) {
      console.log(
        `${key.padEnd(25)} | ${val1.padEnd(15)} | ${val2.padEnd(15)}`,
      );
    }
  });
  console.log(
    "------------------------------------------------------------------\n",
  );
}
