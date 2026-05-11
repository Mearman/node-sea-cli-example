import { describe, it, before } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";
import { existsSync } from "node:fs";

const execFileAsync = promisify(execFile);

const binaryName = process.platform === "win32"
  ? "node-sea-cli-example.exe"
  : "node-sea-cli-example";
const binaryPath = join(process.cwd(), "dist", binaryName);

describe("e2e — SEA binary", () => {
  before(() => {
    assert.ok(existsSync(binaryPath), `Binary not found at ${binaryPath}. Run 'npm run build' first.`);
  });

  it("shows help with no arguments", async () => {
    const { stdout } = await execFileAsync(binaryPath);
    assert.match(stdout, /USAGE/);
    assert.match(stdout, /COMMANDS/);
  });

  it("shows help with --help", async () => {
    const { stdout } = await execFileAsync(binaryPath, ["--help"]);
    assert.match(stdout, /USAGE/);
  });

  it("shows version with --version", async () => {
    const { stdout } = await execFileAsync(binaryPath, ["--version"]);
    assert.match(stdout.trim(), /^\d+\.\d+\.\d+$/);
  });

  it("encodes a string", async () => {
    const { stdout } = await execFileAsync(binaryPath, ["encode", "Hello"]);
    assert.equal(stdout.trim(), "72 101 108 108 111");
  });

  it("decodes byte values", async () => {
    const { stdout } = await execFileAsync(binaryPath, ["decode", "72", "101", "108", "108", "111"]);
    assert.equal(stdout.trim(), "Hello");
  });

  it("returns an error for unknown commands", async () => {
    await assert.rejects(
      () => execFileAsync(binaryPath, ["nope"]),
      (error: { code?: string; stderr?: string }) => {
        assert.equal(error.code, 1);
        assert.match(error.stderr!, /Unknown command: nope/);
        return true;
      }
    );
  });

  it("round-trips encode → decode", async () => {
    const { stdout: encoded } = await execFileAsync(binaryPath, ["encode", "test"]);
    const bytes = encoded.trim().split(" ");
    const { stdout: decoded } = await execFileAsync(binaryPath, ["decode", ...bytes]);
    assert.equal(decoded.trim(), "test");
  });
});
