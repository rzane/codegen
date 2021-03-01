import * as path from "path";
import type { Types } from "@graphql-codegen/plugin-helpers";

export interface Options {
  root: string;
  schema: string;
  client: string;
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
  const apollo = plugins.includes("typescript-react-apollo");

  if (typescript || operations) {
    config.scalars = SCALARS;
    config.preResolveTypes = true;
    config.immutableTypes = opts.immutable;
  }

  if (operations) {
    config.omitOperationSuffix = !opts.suffix;
  }

  if (apollo) {
    config.reactApolloVersion = 3;
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
        `typescript-${opts.client}`,
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
    documents,
    hooks: HOOKS,
    generates: {
      [schemaOutput]: { plugins: ["schema-ast"] },
      [types]: configure(opts, ["typescript"]),
      [opts.root]: {
        preset: "near-operation-file",
        presetConfig: {
          baseTypesPath,
          extension: ".ts",
        },
        ...configure(opts, [
          "typescript-operations",
          `typescript-${opts.client}`,
        ]),
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
