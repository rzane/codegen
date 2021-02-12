import { build, Options } from "../src/config";

const scalars = {
  DateTime: "string",
  Date: "string",
  Time: "string",
};

const defaults: Options = {
  root: "root",
  schema: "schema",
  client: "react-apollo",
  immutable: false,
  suffix: false,
  colocate: undefined,
};

test("build", () => {
  expect(build(defaults)).toEqual({
    schema: "schema",
    documents: "root/**/!(schema).graphql",
    hooks: expect.objectContaining({
      afterAllFileWrite: ["prettier --write"],
    }),
    generates: {
      "root/schema.graphql": {
        plugins: ["schema-ast"],
      },
      "root/index.ts": {
        plugins: [
          "typescript",
          "typescript-operations",
          "typescript-react-apollo",
        ],
        config: {
          reactApolloVersion: 3,
          omitOperationSuffix: true,
          immutableTypes: false,
          preResolveTypes: true,
          scalars,
        },
      },
    },
  });
});

test("build (suffix)", () => {
  expect(build({ ...defaults, suffix: true })).toHaveProperty(
    ["generates", "root/index.ts", "config", "omitOperationSuffix"],
    false
  );
});

test("build (immutable)", () => {
  expect(build({ ...defaults, immutable: true })).toHaveProperty(
    ["generates", "root/index.ts", "config", "immutableTypes"],
    true
  );
});

test("build (client: react-query)", () => {
  const config = build({ ...defaults, client: "react-query" });

  expect(config).toHaveProperty(
    ["generates", "root/index.ts", "plugins", 2],
    "typescript-react-query"
  );

  expect(config).not.toHaveProperty([
    "generates",
    "root/index.ts",
    "config",
    "reactApolloVersion",
  ]);
});

test("build (colocate)", () => {
  expect(build({ ...defaults, colocate: "colocate" })).toEqual({
    schema: "schema",
    documents: "root/**/!(schema).graphql",
    hooks: expect.objectContaining({
      afterAllFileWrite: ["prettier --write"],
    }),
    generates: {
      "colocate/schema.graphql": {
        plugins: ["schema-ast"],
      },
      "colocate/index.ts": {
        plugins: ["typescript"],
        config: {
          scalars,
          immutableTypes: false,
          preResolveTypes: true,
        },
      },
      root: {
        preset: "near-operation-file",
        presetConfig: {
          baseTypesPath: "queries",
          extension: ".ts",
        },
        plugins: ["typescript-operations", "typescript-react-apollo"],
        config: {
          scalars,
          immutableTypes: false,
          preResolveTypes: true,
          omitOperationSuffix: true,
          reactApolloVersion: 3,
        },
      },
    },
  });
});
