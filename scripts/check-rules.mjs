import fs from "node:fs";
import path from "node:path";

const SRC_DIR = path.resolve(process.cwd(), "src");
const APP_DIR = path.resolve(process.cwd(), "app");

const errors = [];

function checkFile(filePath) {
  const relPath = path.relative(process.cwd(), filePath).replace(/\\/g, "/");
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, index) => {
    const lineNum = index + 1;

    // 1. Check for @ts-ignore
    if (line.includes("@ts-ignore")) {
      errors.push(`${relPath}:${lineNum} - '@ts-ignore' is forbidden. Use '@ts-expect-error' with a reason.`);
    }

    // 2. Check for console.log
    if (line.includes("console.log(")) {
      errors.push(`${relPath}:${lineNum} - 'console.log' is forbidden in source files.`);
    }

    // 3. Check for hex colors outside src/theme/colors.ts
    if (!relPath.endsWith("src/theme/colors.ts")) {
      const hexMatch = line.match(/#[0-9a-fA-F]{3,8}\b/);
      // Ignore comments or URLs
      if (hexMatch && !line.trim().startsWith("//") && !line.trim().startsWith("*")) {
        errors.push(`${relPath}:${lineNum} - Hardcoded hex color '${hexMatch[0]}' found. Use theme tokens.`);
      }
    }

    // 4. Check for float money (parseFloat)
    if (line.includes("parseFloat(") && (line.includes("money") || line.includes("amount") || line.includes("price"))) {
      errors.push(`${relPath}:${lineNum} - 'parseFloat' used for money. Money must use integer minor units.`);
    }

    // 5. Check for deep relative imports into src barrels
    if (/\.\.\/\.\.\//.test(line) && /from ["']\.\.\//.test(line)) {
      errors.push(`${relPath}:${lineNum} - Deep relative import found. Use the '@/...' path alias.`);
    }
  });
}

function walkDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath);
    } else if (/\.(ts|tsx|js|mjs)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

walkDir(SRC_DIR);
walkDir(APP_DIR);

if (errors.length > 0) {
  process.stderr.write("\x1b[31mRepo rule check failed:\x1b[0m\n");
  for (const err of errors) {
    process.stderr.write(`  ❌ ${err}\n`);
  }
  process.exit(1);
} else {
  process.stdout.write("\x1b[32m✔ Repo rules check passed cleanly.\x1b[0m\n");
  process.exit(0);
}
