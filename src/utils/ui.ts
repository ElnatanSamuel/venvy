/**
 * Premium UI helpers for Venvy CLI
 */

const COLORS = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  magenta: "\x1b[35m",
};

export const ui = {
  dim: COLORS.dim,
  reset: COLORS.reset,
  /**
   * Print a styled header
   */
  header(text: string) {
    console.log(
      `\n${COLORS.cyan}${COLORS.bright}${text.toUpperCase()}${COLORS.reset}\n`,
    );
  },

  /**
   * Print a success message
   */
  success(message: string) {
    console.log(`${COLORS.green}check${COLORS.reset} ${message}`);
  },

  /**
   * Print an error message
   */
  error(message: string) {
    console.log(`${COLORS.red}error${COLORS.reset} ${message}`);
  },

  /**
   * Print a warning message
   */
  warn(message: string) {
    console.log(`${COLORS.yellow}warn${COLORS.reset} ${message}`);
  },

  /**
   * Print a boxed message
   */
  box(content: string, title?: string) {
    const lines = content.split("\n");
    const width =
      Math.max(...lines.map((l) => l.length), title ? title.length : 0) + 4;

    const top = `┌─${title ? ` ${COLORS.bright}${title}${COLORS.reset} ` : ""}${"─".repeat(width - (title ? title.length + 2 : 0) - 2)}┐`;
    const bottom = `└${"─".repeat(width - 2)}┘`;

    console.log(`\n${COLORS.dim}${top}${COLORS.reset}`);
    lines.forEach((line) => {
      console.log(
        `${COLORS.dim}│${COLORS.reset}  ${line.padEnd(width - 4)}  ${COLORS.dim}│${COLORS.reset}`,
      );
    });
    console.log(`${COLORS.dim}${bottom}${COLORS.reset}\n`);
  },

  /**
   * Print a table
   */
  table(headers: string[], rows: string[][]) {
    const colWidths = headers.map(
      (h, i) => Math.max(h.length, ...rows.map((r) => r[i]?.length || 0)) + 2,
    );

    const separator = colWidths.map((w) => "─".repeat(w)).join("┬");
    const top = `┌${colWidths.map((w) => "─".repeat(w)).join("┬")}┐`;
    const headerRow = `│${headers.map((h, i) => ` ${COLORS.bright}${h.padEnd(colWidths[i] - 1)}${COLORS.reset}`).join("│")}│`;
    const mid = `├${colWidths.map((w) => "─".repeat(w)).join("┼")}┤`;
    const bottom = `└${colWidths.map((w) => "─".repeat(w)).join("┴")}┘`;

    console.log(`${COLORS.dim}${top}${COLORS.reset}`);
    console.log(`${headerRow}`);
    console.log(`${COLORS.dim}${mid}${COLORS.reset}`);

    rows.forEach((row) => {
      const formattedRow = `│${row.map((cell, i) => ` ${cell.padEnd(colWidths[i] - 1)}`).join(`${COLORS.dim}│${COLORS.reset}`)}│`;
      console.log(formattedRow);
    });

    console.log(`${COLORS.dim}${bottom}${COLORS.reset}`);
  },
};
