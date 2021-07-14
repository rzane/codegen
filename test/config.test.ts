import { build, Options } from "../src/config";

const scalars = {
  DateTime: "string",
  Date: "string",
  Time: "string",
};

const defaults: Options = {
  root: "src",
  schema: "schema",
  immutable: false,
  suffix: false,
  colocate: undefined,
  scalars: {},
};

test("build", () => {
  expect(build(defaults)).toEqual({
    schema: "schema",
    documents: "src/**/!(schema).graphql",
    hooks: expect.objectContaining({
      afterAllFileWrite: ["prettier --write"],
    }),
    generates: {
      "src/schema.graphql": {
        plugins: ["schema-ast"],
      },
      "src/index.ts": {
        plugins: ["typescript", "typescript-operations", "typed-document-node"],
        config: {
          omitOperationSuffix: true,
          dedupeFragments: true,
          immutableTypes: false,
          preResolveTypes: true,
          scalars,
        },
      },
    },
  });
});

test("build (colocate)", () => {
  expect(build({ ...defaults, colocate: "src/colocate" })).toEqual({
    schema: "schema",
    hooks: expect.objectContaining({
      afterAllFileWrite: ["prettier --write"],
    }),
    generates: {
      "src/colocate/schema.graphql": {
        plugins: ["schema-ast"],
      },
      "src/colocate/index.ts": {
        plugins: ["typescript"],
        config: {
          scalars,
          dedupeFragments: true,
          immutableTypes: false,
          preResolveTypes: true,
        },
      },
      src: {
        documents: "src/**/!(schema).graphql",
        preset: "near-operation-file",
        presetConfig: {
          baseTypesPath: "colocate",
          extension: ".ts",
        },
        plugins: ["typescript-operations", "typed-document-node"],
        config: {
          scalars,
          dedupeFragments: true,
          immutableTypes: false,
          preResolveTypes: true,
          omitOperationSuffix: true,
        },
      },
    },
  });
});

test("build (suffix)", () => {
  expect(build({ ...defaults, suffix: true })).toHaveProperty(
    ["generates", "src/index.ts", "config", "omitOperationSuffix"],
    false
  );
});

test("build (immutable)", () => {
  expect(build({ ...defaults, immutable: true })).toHaveProperty(
    ["generates", "src/index.ts", "config", "immutableTypes"],
    true
  );
});

test("build (scalars)", () => {
  expect(build({ ...defaults, scalars: { Foo: "string" } })).toHaveProperty(
    ["generates", "src/index.ts", "config", "scalars", "Foo"],
    "string"
  );
});
