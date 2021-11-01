#!/usr/bin/env node

import { Command, flags } from "@oclif/command";
import { generate } from "@graphql-codegen/cli";
import { build } from "./config";

export class Codegen extends Command {
  static description = "Generate type definitions from GraphQL queries.";

  static args = [
    {
      name: "root",
      required: true,
      description: "directory where your GraphQL queries live",
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
      description: "append a suffix to generated types",
    }),
    immutable: flags.boolean({
      description: "generate readonly types",
    }),
    colocate: flags.string({
      description: "generate files adjacent to their GraphQL source",
    }),
    types: flags.string({
      char: "t",
      multiple: true,
      description: "declare type for a custom scalar",
    }),
    "show-config": flags.boolean({
      description: "show the generated configuration",
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
      scalars: (flags.types ?? []).reduce(this.parseScalar, {}),
    });

    if (flags["show-config"]) {
      this.log(JSON.stringify(config, null, 2));
    } else {
      await generate(config);
    }
  }

  private parseScalar = (scalars: Record<string, string>, value: string) => {
    const [scalar, type] = value.split(":", 2);

    if (!scalar || !type) {
      this.error(
        `Types should be represented as "scalar:type" (got: "${value}")`
      );
    }

    return { ...scalars, [scalar]: type };
  };
}

/**
 * If this file is invoked as an executable, run the program.
 */
if (require.main === module) {
  (Codegen.run() as Promise<any>).catch(require("@oclif/errors/handle"));
}
