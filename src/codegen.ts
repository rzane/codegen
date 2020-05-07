import { promises as fs } from "fs";
import { dirname } from "path";
import { parse, printSchema } from "graphql";
import { codegen } from "@graphql-codegen/core";
import { loadSchema, loadDocuments } from "@graphql-toolkit/core";
import { UrlLoader } from "@graphql-toolkit/url-loader";
import { JsonFileLoader } from "@graphql-toolkit/json-file-loader";
import { GraphQLFileLoader } from "@graphql-toolkit/graphql-file-loader";
import * as typescript from "@graphql-codegen/typescript";
import * as typescriptOperations from "@graphql-codegen/typescript-operations";
import * as typescriptReactApollo from "@graphql-codegen/typescript-react-apollo";

export interface GenerateConfig {
  input: string;
  output: string;
  schema: string;
  suffix?: boolean;
  immutable?: boolean;
}

const makeDefault = <T>(value: T | undefined, defaultValue: T): T => {
  return typeof value === "undefined" ? defaultValue : value;
};

/**
 * Generate code and write it to disk.
 */
export const generateAndWrite = async (
  config: GenerateConfig
): Promise<void> => {
  const code = await generate(config);
  const parent = dirname(config.output);

  await fs.mkdir(parent, { recursive: true });
  await fs.writeFile(config.output, code);
};

/**
 * Generate code and return it as a string.
 */
export const generate = async (config: GenerateConfig): Promise<string> => {
  const schemaAst = await loadSchema(config.schema, {
    loaders: [new UrlLoader(), new JsonFileLoader(), new GraphQLFileLoader()],
  });

  const documents = await loadDocuments(config.input, {
    loaders: [new GraphQLFileLoader()],
  });

  return codegen({
    filename: config.output,
    schema: parse(printSchema(schemaAst)),
    schemaAst,
    documents,
    plugins: [
      { typescript: {} },
      { typescriptOperations: {} },
      { typescriptReactApollo: {} },
    ],
    pluginMap: {
      typescript,
      typescriptOperations,
      typescriptReactApollo,
    },
    config: {
      withComponent: false,
      withHOC: false,
      withHooks: true,
      noNamespaces: true,
      preResolveTypes: true,
      omitOperationSuffix: makeDefault(config.suffix, true),
      immutableTypes: makeDefault(config.immutable, false),
      scalars: {
        DateTime: "string",
        Date: "string",
        Time: "string",
        JSON: "{ [key: string]: any }",
      },
    },
  });
};
