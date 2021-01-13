#!/usr/bin/env node

import parse from "minimist";
import { join } from "path";
import { promises as fs } from "fs";
import { generate } from "./index";
import { exists } from "./exists";
import { clientTemplate } from "./templates";

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
  env: Record<string, string | undefined>,
  log: (message: string) => void
): Promise<void> {
  const opts = parse(argv);
  const [root] = opts._;
  const schema = env.SCHEMA || opts.schema || opts.s;
  const client = opts.client || opts.c;

  if (opts.v || opts.version) {
    const pkg = require("../package.json");
    return log(pkg.version);
  }

  if (opts.h || opts.help) {
    return log(help);
  }

  if (!root) {
    throw new Error("Missing argument: ROOT");
  }

  if (!schema) {
    throw new Error("Missing option: --schema");
  }

  const input = join(root, "**/!(schema).graphql");
  const output = join(root, "index.ts");
  const schemaOutput = join(root, "schema.graphql");

  const result = await generate({
    input,
    output,
    schema,
    client,
    suffix: Boolean(opts.suffix),
    immutable: Boolean(opts.immutable),
  });

  await fs.mkdir(root, { recursive: true });

  log(`write ${output}`);
  await fs.writeFile(output, result.code);

  log(`write ${schemaOutput}`);
  await fs.writeFile(schemaOutput, result.schema);

  if (client === "react-query") {
    const clientPath = join(root, "client.ts");
    const clientExists = await exists(clientPath);

    if (!clientExists) {
      log(`write ${clientPath}`);
      await fs.writeFile(clientPath, clientTemplate);
    }
  }
}

/**
 * If this file is invoked as an executable, run the program.
 */
if (require.main === module) {
  execute(process.argv.slice(2), process.env, console.log).catch((error) => {
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
