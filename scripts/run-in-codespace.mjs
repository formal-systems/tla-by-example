// Receives a spec handed over by the site's "Run in VS Code" button (see
// src/lib/vscode-handoff.ts): writes the files to playground/<dir>/, opens
// them in VS Code and model-checks them with TLC in this terminal.
//
// Usage: node scripts/run-in-codespace.mjs <base64url payload>
import fs from "fs";
import os from "os";
import path from "path";
import { spawn, spawnSync } from "child_process";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function fail(message) {
  console.error(`run-in-codespace: ${message}`);
  process.exit(1);
}

function decode(arg) {
  if (!arg) fail("missing payload; copy the command again from the site's \"Run in VS Code\" button");
  try {
    return JSON.parse(Buffer.from(arg, "base64url").toString("utf-8"));
  } catch {
    fail("could not decode the payload; was the command copied completely?");
  }
}

// File and folder names come from the payload: only allow plain names.
const safeName = (name, ext) => {
  if (typeof name !== "string" || !new RegExp(`^[\\w-]+\\.${ext}$`).test(name)) fail(`invalid file name: ${name}`);
  return name;
};
const safeDir = (dir) => {
  if (typeof dir !== "string" || !/^[\w-]+(\/[\w-]+)*$/.test(dir)) fail(`invalid folder: ${dir}`);
  return dir;
};

// Prefer the tla2tools.jar bundled with the installed TLA+ extension, so the
// terminal run and the extension's "Check model with TLC" use the same TLC.
function findTlaTools() {
  if (process.env.TLA2TOOLS_JAR) return process.env.TLA2TOOLS_JAR;
  const home = os.homedir();
  const candidates = [];
  for (const dir of [".vscode-remote/extensions", ".vscode-server/extensions", ".vscode/extensions"]) {
    const extDir = path.join(home, dir);
    if (!fs.existsSync(extDir)) continue;
    for (const ext of fs.readdirSync(extDir)) {
      const jar = path.join(extDir, ext, "tools", "tla2tools.jar");
      if (ext.startsWith("tlaplus.vscode-ide-") && fs.existsSync(jar)) candidates.push(jar);
    }
  }
  return candidates.sort().at(-1);
}

const payload = decode(process.argv[2]);
if (payload?.v !== 1) fail("unsupported payload version; reload the site and copy the command again");

const dir = path.join(root, "playground", safeDir(payload.dir));
fs.mkdirSync(dir, { recursive: true });
const files = [payload.spec, payload.cfg, ...(payload.extra ?? [])];
for (const [i, f] of files.entries()) {
  const name = safeName(f?.name, i === 1 ? "cfg" : "tla");
  fs.writeFileSync(path.join(dir, name), f.content.endsWith("\n") ? f.content : f.content + "\n");
}
const specPath = path.join(dir, payload.spec.name);
const cfgPath = path.join(dir, payload.cfg.name);
console.log(`Wrote ${files.length} file(s) to ${path.relative(root, dir)}/`);

// Open the spec and cfg in the editor (the `code` CLI exists in VS Code terminals).
spawnSync("code", [cfgPath, specPath], { stdio: "ignore" });

const jar = findTlaTools();
if (!jar) {
  fail("TLA+ extension not installed yet; wait until the codespace finishes setting up and run the command again");
}

console.log(`Running TLC on ${payload.spec.name} with ${payload.cfg.name}...\n`);
const tlc = spawn(
  "java",
  [
    "-XX:+UseParallelGC", "-cp", jar, "tlc2.TLC",
    "-workers", "auto",
    "-metadir", fs.mkdtempSync(path.join(os.tmpdir(), "tlc-")),
    "-config", payload.cfg.name,
    payload.spec.name,
  ],
  { cwd: dir, stdio: "inherit" },
);
tlc.on("error", (err) => fail(`could not start java: ${err.message}`));
tlc.on("exit", (code) => {
  console.log(
    `\nFor the interactive results and error-trace view: open ${payload.spec.name} and run ` +
      `"TLA+: Check model with TLC" (Ctrl/Cmd+Shift+P).`,
  );
  process.exit(code ?? 1);
});
