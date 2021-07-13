#!/usr/bin/env node

import parse from "minimist";
import { generate } from "@graphql-codegen/cli";
import { build } from "./config";

const help = `Usage: codegen [ROOT] [options]

Generate type definitions from GraphQL queries.

Arguments:
  ROOT (required)
    The directory where your GraphQL queries live.

Options:
  -s, --schema <SCHEMA> (required)
    URL or file path to a GraphQL schema. This option will be overridden
    when the SCHEMA environment variable is set.

  --suffix
    Append a suffix to operations (e.g. usePersonQuery). This
    is helpful for avoiding naming collisions.

  --immutable
    Generate readonly types.

  --colocate
    Generate files adjacent to their GraphQL source.

  --show-config
    Show the generated configuration

  -v, --version
    Output the version number

  -h, --help
    Display this help information`;

export async function execute(
  argv: string[],
  env: Record<string, string | undefined>
): Promise<void> {
  const opts = parse(argv);
  const [root] = opts._;
  const schema = env.SCHEMA || opts.schema || opts.s;

  if (opts.v || opts.version) {
    const pkg = require("../package.json");
    return console.log(pkg.version);
  }

  if (opts.h || opts.help) {
    return console.log(help);
  }

  if (!root) {
    throw new Error("Missing argument: ROOT");
  }

  if (!schema) {
    throw new Error("Missing option: --schema");
  }

  const config = build({
    root,
    schema,
    suffix: Boolean(opts.suffix),
    immutable: Boolean(opts.immutable),
    colocate: opts.colocate,
  });

  if (opts["show-config"]) {
    console.log(JSON.stringify(config, null, 2));
  } else {
    await generate(config);
  }
}

/**
 * If this file is invoked as an executable, run the program.
 */
if (require.main === module) {
  execute(process.argv.slice(2), process.env).catch((error) => {
    if (process.env.DEBUG) {
      console.error(error);
    } else if (error.code) {
      console.error(`${error.code}: ${error.message}`);
    } else {
      console.error(error.message);
    }

    process.exit(1);
  });
}
