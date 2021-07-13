import * as path from "path";
import type { Types } from "@graphql-codegen/plugin-helpers";

export interface Options {
  root: string;
  schema: string;
  suffix: boolean;
  immutable: boolean;
  colocate: string | undefined;
}

const HOOKS = {
  afterAllFileWrite: ["prettier --write"],
  afterOneFileWrite: [],
  afterStart: [],
  beforeAllFileWrite: [],
  beforeDone: [],
  beforeOneFileWrite: [],
  onError: [],
  onWatchTriggered: [],
};

const SCALARS = {
  DateTime: "string",
  Date: "string",
  Time: "string",
};

function configure(opts: Options, plugins: string[]): Types.ConfiguredOutput {
  const config: Types.PluginConfig = {};
  const typescript = plugins.includes("typescript");
  const operations = plugins.includes("typescript-operations");

  if (typescript || operations) {
    config.scalars = SCALARS;
    config.preResolveTypes = true;
    config.immutableTypes = opts.immutable;
  }

  if (operations) {
    config.omitOperationSuffix = !opts.suffix;
  }

  return { plugins, config };
}

function buildDefault(opts: Options): Types.Config {
  const output = path.join(opts.root, "index.ts");
  const schemaOutput = path.join(opts.root, "schema.graphql");
  const documents = path.join(opts.root, "**/!(schema).graphql");

  return {
    schema: opts.schema,
    documents,
    hooks: HOOKS,
    generates: {
      [schemaOutput]: { plugins: ["schema-ast"] },
      [output]: configure(opts, [
        "typescript",
        "typescript-operations",
        "typed-document-node",
      ]),
    },
  };
}

function buildColocate(opts: Options): Types.Config {
  const types = path.join(opts.colocate!, "index.ts");
  const baseTypesPath = path.relative(opts.root, opts.colocate!);

  const schemaOutput = path.join(opts.colocate!, "schema.graphql");
  const documents = path.join(opts.root, "**/!(schema).graphql");

  return {
    schema: opts.schema,
    hooks: HOOKS,
    generates: {
      [schemaOutput]: { plugins: ["schema-ast"] },
      [types]: configure(opts, ["typescript"]),
      [opts.root]: {
        documents,
        preset: "near-operation-file",
        presetConfig: { baseTypesPath, extension: ".ts" },
        ...configure(opts, ["typescript-operations", "typed-document-node"]),
      },
    },
  };
}

export function build(opts: Options): Types.Config {
  if (opts.colocate) {
    return buildColocate(opts);
  } else {
    return buildDefault(opts);
  }
}
