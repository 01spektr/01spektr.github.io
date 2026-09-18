import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const messagesDir = path.join(root, "src/lib/i18n/messages");
const configFile = path.join(root, "src/lib/i18n/config.ts");
const localeFiles = fs
  .readdirSync(messagesDir)
  .filter((name) => /^[a-z]{2}\.ts$/.test(name));
const configuredLocales = [
  ...fs.readFileSync(configFile, "utf8").matchAll(/^\s{2}([a-z]{2}):\s*\{/gm),
].map((match) => match[1]);
const fileLocales = localeFiles.map((name) => path.basename(name, ".ts"));

function keysFrom(file) {
  const source = fs.readFileSync(path.join(messagesDir, file), "utf8");
  const keys = [...source.matchAll(/^\s*"([^"]+)"\s*:/gm)].map((match) => match[1]);
  const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
  if (duplicates.length) throw new Error(`${file}: duplicate keys: ${[...new Set(duplicates)].join(", ")}`);
  return new Set(keys);
}

const baseFile = "ru.ts";
const base = keysFrom(baseFile);
let failed = false;

const missingFiles = configuredLocales.filter((code) => !fileLocales.includes(code));
const unregisteredFiles = fileLocales.filter((code) => !configuredLocales.includes(code));
if (missingFiles.length || unregisteredFiles.length) {
  failed = true;
  if (missingFiles.length) console.error(`missing locale files: ${missingFiles.join(", ")}`);
  if (unregisteredFiles.length) console.error(`unregistered locale files: ${unregisteredFiles.join(", ")}`);
}

for (const file of localeFiles.filter((name) => name !== baseFile)) {
  const current = keysFrom(file);
  const missing = [...base].filter((key) => !current.has(key));
  const extra = [...current].filter((key) => !base.has(key));
  if (missing.length || extra.length) {
    failed = true;
    console.error(`${file}:`);
    if (missing.length) console.error(`  missing: ${missing.join(", ")}`);
    if (extra.length) console.error(`  extra: ${extra.join(", ")}`);
  }
}

if (failed) process.exit(1);
console.log(`i18n OK: ${localeFiles.length} locales, ${base.size} shared keys`);
