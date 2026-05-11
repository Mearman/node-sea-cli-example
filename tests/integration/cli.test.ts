import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { run } from "../../src/cli.ts";

describe("cli — help", () => {
  it("shows help with no arguments", () => {
    const result = run([]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.match(result.stdout!, /USAGE/);
    assert.match(result.stdout!, /COMMANDS/);
  });

  it("shows help with --help", () => {
    const result = run(["--help"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.match(result.stdout!, /USAGE/);
  });

  it("shows help with -h", () => {
    const result = run(["-h"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.match(result.stdout!, /USAGE/);
  });
});

describe("cli — version", () => {
  it("shows version with --version", () => {
    const result = run(["--version"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.match(result.stdout!, /^\d+\.\d+\.\d+$/);
  });

  it("shows version with -v", () => {
    const result = run(["-v"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.match(result.stdout!, /^\d+\.\d+\.\d+$/);
  });
});

describe("cli — encode", () => {
  it("encodes a string to byte values", () => {
    const result = run(["encode", "Hi"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.equal(result.stdout!, "72 105");
  });

  it("encodes a string with spaces", () => {
    const result = run(["encode", "a", "b"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.equal(result.stdout!, "97 32 98");
  });

  it("returns an error with no input", () => {
    const result = run(["encode"]);
    assert.equal(result.exitCode, 1);
    assert.ok("stderr" in result);
    assert.match(result.stderr!, /no input string provided/);
  });
});

describe("cli — decode", () => {
  it("decodes byte values to a string", () => {
    const result = run(["decode", "72", "105"]);
    assert.equal(result.exitCode, 0);
    assert.ok("stdout" in result);
    assert.equal(result.stdout!, "Hi");
  });

  it("returns an error with no input", () => {
    const result = run(["decode"]);
    assert.equal(result.exitCode, 1);
    assert.ok("stderr" in result);
    assert.match(result.stderr!, /no byte values provided/);
  });

  it("returns an error for out-of-range values", () => {
    const result = run(["decode", "999"]);
    assert.equal(result.exitCode, 1);
    assert.ok("stderr" in result);
    assert.match(result.stderr!, /invalid byte value/);
  });

  it("returns an error for non-integer values", () => {
    const result = run(["decode", "1.5"]);
    assert.equal(result.exitCode, 1);
    assert.ok("stderr" in result);
    assert.match(result.stderr!, /invalid byte value/);
  });
});

describe("cli — unknown command", () => {
  it("returns an error for unknown commands", () => {
    const result = run(["foobar"]);
    assert.equal(result.exitCode, 1);
    assert.ok("stderr" in result);
    assert.match(result.stderr!, /Unknown command: foobar/);
  });
});
