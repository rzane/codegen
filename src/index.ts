import { parse, printSchema } from "graphql";
import { codegen } from "@graphql-codegen/core";
import { loadSchema, loadDocuments } from "@graphql-toolkit/core";
import { UrlLoader } from "@graphql-toolkit/url-loader";
import { JsonFileLoader } from "@graphql-toolkit/json-file-loader";
import { GraphQLFileLoader } from "@graphql-toolkit/graphql-file-loader";
import * as typescript from "@graphql-codegen/typescript";
import * as typescriptOperations from "@graphql-codegen/typescript-operations";
import * as typescriptReactApollo from "@graphql-codegen/typescript-react-apollo";

export interface Options {
  input: string;
  output: string;
  schema: string;
  suffix?: boolean;
  immutable?: boolean;
}

export interface Result {
  schema: string;
  code: string;
}

/**
 * Generate code and return it as a string.
 */
export const generate = async (opts: Options): Promise<Result> => {
  const schemaAst = await loadSchema(opts.schema, {
    loaders: [new UrlLoader(), new JsonFileLoader(), new GraphQLFileLoader()],
  });

  const documents = await loadDocuments(opts.input, {
    loaders: [new GraphQLFileLoader()],
  });

  const schema = printSchema(schemaAst);
  const { suffix = false, immutable = false } = opts;

  const code = await codegen({
    filename: opts.output,
    schema: parse(schema),
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
      noNamespaces: true,
      preResolveTypes: true,
      reactApolloVersion: 3,
      omitOperationSuffix: !suffix,
      immutableTypes: immutable,
      scalars: {
        DateTime: "string",
        Date: "string",
        Time: "string",
        JSON: "{ [key: string]: any }",
      },
    },
  });

  return { schema, code };
};
