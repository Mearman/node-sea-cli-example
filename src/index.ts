import { run } from "./cli.ts";
import type { CommandResult } from "./cli.ts";

function exit(result: CommandResult): never {
  if (result.stdout) process.stdout.write(result.stdout + "\n");
  if (result.stderr) process.stderr.write(result.stderr + "\n");
  process.exit(result.exitCode);
}

const args = process.argv.slice(2);
exit(run(args));
