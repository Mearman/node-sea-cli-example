import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { stringToBytes, bytesToString } from "../../src/convert.ts";

describe("stringToBytes", () => {
  it("converts an empty string to an empty array", () => {
    assert.deepEqual(stringToBytes(""), []);
  });

  it("converts a single ASCII character", () => {
    assert.deepEqual(stringToBytes("A"), [65]);
  });

  it("converts a multi-character string", () => {
    assert.deepEqual(stringToBytes("Hi"), [72, 105]);
  });

  it("converts spaces and punctuation", () => {
    assert.deepEqual(stringToBytes("a b"), [97, 32, 98]);
  });

  it("throws on non-ASCII characters", () => {
    assert.throws(
      () => stringToBytes("é"),
      (error: unknown) => {
        assert.ok(error instanceof Error);
        assert.match(error.message, /Non-ASCII character at position 0/);
        return true;
      }
    );
  });
});

describe("bytesToString", () => {
  it("converts an empty array to an empty string", () => {
    assert.equal(bytesToString([]), "");
  });

  it("converts a single byte", () => {
    assert.equal(bytesToString([65]), "A");
  });

  it("converts multiple bytes", () => {
    assert.equal(bytesToString([72, 105]), "Hi");
  });

  it("round-trips through stringToBytes", () => {
    const original = "Hello World";
    assert.equal(bytesToString(stringToBytes(original)), original);
  });
});
