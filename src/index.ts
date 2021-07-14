#!/usr/bin/env node

import { Command, flags } from "@oclif/command";
import { generate } from "@graphql-codegen/cli";
import { build } from "./config";

class Codegen extends Command {
  static description = "Generate type definitions from GraphQL queries.";

  static args = [
    {
      name: "root",
      required: true,
      description: "The directory where your GraphQL queries live",
    },
  ];

  static flags = {
    schema: flags.string({
      char: "s",
      description: "URL or file path to the GraphQL schema",
      env: "SCHEMA",
      required: true,
    }),
    suffix: flags.boolean({
      description: "Append a suffix to generated types",
    }),
    immutable: flags.boolean({
      description: "Generate readonly types",
    }),
    colocate: flags.string({
      description: "Generate files adjacent to their GraphQL source",
    }),
    "show-config": flags.boolean({
      description: "Show the generated configuration",
    }),
    version: flags.version(),
    help: flags.help(),
  };

  async run() {
    const { args, flags } = this.parse(Codegen);

    const config = build({
      root: args.root,
      schema: flags.schema,
      suffix: flags.suffix,
      immutable: flags.immutable,
      colocate: flags.colocate,
    });

    if (flags["show-config"]) {
      this.log(JSON.stringify(config, null, 2));
    } else {
      await generate(config);
    }
  }
}

/**
 * If this file is invoked as an executable, run the program.
 */
if (require.main === module) {
  (Codegen.run() as Promise<any>).catch(require("@oclif/errors/handle"));
}
