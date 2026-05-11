import { stringToBytes } from "./convert.ts";
import { VERSION } from "./version.ts";

export type CommandResult =
  | { stdout: string; stderr?: string; exitCode: 0 }
  | { stdout?: string; stderr: string; exitCode: 1 };

export function run(args: string[]): CommandResult {
  const command = args[0];

  if (command === undefined || command === "--help" || command === "-h") {
    return {
      stdout: usage(),
      exitCode: 0,
    };
  }

  if (command === "--version" || command === "-v") {
    return {
      stdout: VERSION,
      exitCode: 0,
    };
  }

  if (command === "encode") {
    return encode(args.slice(1));
  }

  if (command === "decode") {
    return decode(args.slice(1));
  }

  return {
    stderr: `Unknown command: ${command}\n${usage()}`,
    exitCode: 1,
  };
}

function encode(args: string[]): CommandResult {
  const input = args.join(" ");
  if (input.length === 0) {
    return { stderr: "Error: no input string provided", exitCode: 1 };
  }
  const bytes = stringToBytes(input);
  return {
    stdout: bytes.join(" "),
    exitCode: 0,
  };
}

function decode(args: string[]): CommandResult {
  if (args.length === 0) {
    return { stderr: "Error: no byte values provided", exitCode: 1 };
  }
  const byteValues: number[] = [];
  for (const arg of args) {
    const parsed = Number(arg);
    if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) {
      return {
        stderr: `Error: invalid byte value "${arg}" — must be an integer 0–255`,
        exitCode: 1,
      };
    }
    byteValues.push(parsed);
  }
  return {
    stdout: String.fromCharCode(...byteValues),
    exitCode: 0,
  };
}

function usage(): string {
  return [
    `node-sea-cli-example v${VERSION}`,
    "",
    "USAGE",
    "  node-sea-cli-example <command> [options]",
    "",
    "COMMANDS",
    "  encode <string>    Encode a string as space-separated byte values",
    "  decode <bytes...>  Decode space-separated byte values back to a string",
    "",
    "OPTIONS",
    "  -h, --help         Show this help message",
    "  -v, --version      Show version",
  ].join("\n");
}
