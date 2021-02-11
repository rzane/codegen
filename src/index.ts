#!/usr/bin/env node

import parse from "minimist";
import { join } from "path";
import { promises as fs } from "fs";
import { generate } from "@graphql-codegen/cli";
import { exists } from "./exists";
import { clientTemplate } from "./templates";
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

  -c, --client <react-query|react-apollo> (default: react-apollo)
    The preferred GraphQL client.

  --suffix
    Append a suffix to operations (e.g. usePersonQuery). This
    is helpful for avoiding naming collisions.

  --immutable
    Generate readonly types.

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
  const client = opts.client || opts.c || "react-apollo";

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
    client,
    suffix: Boolean(opts.suffix),
    immutable: Boolean(opts.suffix),
  });

  await generate(config);

  if (client === "react-query") {
    const clientPath = join(root, "client.ts");
    const clientExists = await exists(clientPath);

    if (!clientExists) {
      await fs.writeFile(clientPath, clientTemplate);
    }
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
