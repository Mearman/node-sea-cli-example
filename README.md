# node-sea-cli-example

Example CLI tool built as a Node.js Single Executable Application (SEA). Demonstrates how to bundle TypeScript into a standalone binary using [tsdown](https://tsdown.dev/) with its built-in `exe` option.

## What it does

A tiny CLI that encodes strings to byte values and back:

```bash
$ node-sea-cli-example encode Hello
72 101 108 108 111

$ node-sea-cli-example decode 72 101 108 108 111
Hello
```

## Prerequisites

- Node.js >= 26

## Setup

```bash
npm install
```

## Build

```bash
npm run build
```

This uses tsdown (powered by Rolldown) to bundle TypeScript and build the SEA in one step. Produces a standalone binary at `dist/node-sea-cli-example` (or `dist/node-sea-cli-example.exe` on Windows).

On macOS, tsdown also handles codesigning automatically.

## Test

```bash
# Unit tests (pure logic)
npm run test:unit

# Integration tests (CLI command parsing)
npm run test:integration

# E2E tests (runs the actual SEA binary)
npm run build && npm run test:e2e

# All tests
npm run test
```

Tests use Node.js's built-in `node:test` runner with `--experimental-strip-types` — no test framework dependency needed.

## CI

The GitHub Actions workflow runs on every push to `main` and every PR:

1. **Test** — unit and integration tests on Linux x64, macOS arm64, macOS x64 (Intel), and Windows x64
2. **Build & E2E** — builds the SEA binary and runs e2e tests on all four native platforms
3. **Build & E2E (linux-arm64)** — builds and tests Linux arm64 via QEMU emulation in a Docker container
4. **Upload artifacts** — on main branch pushes, uploads six binaries as downloadable artifacts:
   - `node-sea-cli-example-linux-x64`
   - `node-sea-cli-example-linux-arm64`
   - `node-sea-cli-example-macos-arm64`
   - `node-sea-cli-example-macos-x64`
   - `node-sea-cli-example-windows-x64.exe`

Windows arm64 is not currently covered — no GitHub Actions runner (native or emulated) exists for it.

## Project structure

```
src/
  index.ts       Entry point — reads argv, calls CLI, exits
  cli.ts         Command routing and result formatting
  convert.ts     Pure logic — string ↔ byte conversions
  version.ts     Version constant
tests/
  unit/          Pure logic tests (no I/O, no process)
  integration/   CLI command parsing tests (in-process)
  e2e/           End-to-end tests (spawns the actual SEA binary)
tsdown.config.ts Build configuration (bundle + SEA in one step)
```
