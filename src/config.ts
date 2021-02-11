import { join } from "path";
import type { Types } from "@graphql-codegen/plugin-helpers";

export interface Options {
  root: string;
  schema: string;
  client: string;
  suffix: boolean;
  immutable: boolean;
}

export function build(opts: Options): Types.Config {
  const { root, schema, suffix, immutable, client } = opts;

  const output = join(root, "index.ts");
  const schemaOutput = join(root, "schema.graphql");
  const documents = join(root, "**/!(schema).graphql");

  return {
    schema,
    documents,
    hooks: {
      afterAllFileWrite: ["prettier --write"],
      afterOneFileWrite: [],
      afterStart: [],
      beforeAllFileWrite: [],
      beforeDone: [],
      beforeOneFileWrite: [],
      onError: [],
      onWatchTriggered: [],
    },
    generates: {
      [schemaOutput]: {
        plugins: ["schema-ast"],
      },
      [output]: {
        plugins: [
          "typescript",
          "typescript-operations",
          `typescript-${client}`,
        ],
        config: {
          strict: true,
          noNamespaces: true,
          preResolveTypes: true,
          reactApolloVersion: 3,
          omitOperationSuffix: !suffix,
          immutableTypes: immutable,
          scalars: {
            DateTime: "string",
            Date: "string",
            Time: "string",
          },
        },
      },
    },
  };
}
