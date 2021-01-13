import { parse, printSchema } from "graphql";
import { codegen } from "@graphql-codegen/core";
import { loadSchema, loadDocuments } from "@graphql-tools/load";
import { UrlLoader } from "@graphql-tools/url-loader";
import { JsonFileLoader } from "@graphql-tools/json-file-loader";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import * as typescript from "@graphql-codegen/typescript";
import * as typescriptOperations from "@graphql-codegen/typescript-operations";
import * as typescriptReactApollo from "@graphql-codegen/typescript-react-apollo";
import * as typescriptReactQuery from "@graphql-codegen/typescript-react-query";

export interface Options {
  input: string;
  output: string;
  schema: string;
  client?: string;
  suffix?: boolean;
  immutable?: boolean;
}

export interface Result {
  schema: string;
  code: string;
}

function getClient(opts: Options): [string, any, object] {
  if (opts.client === "react-query") {
    return [
      "typescriptReactQuery",
      typescriptReactQuery,
      { fetcher: "./client#execute" },
    ];
  }

  return ["typescriptReactApollo", typescriptReactApollo, {}];
}

/**
 * Generate code and return it as a string.
 */
export async function generate(opts: Options): Promise<Result> {
  const schemaAst = await loadSchema(opts.schema, {
    loaders: [new UrlLoader(), new JsonFileLoader(), new GraphQLFileLoader()],
  });

  const documents = await loadDocuments(opts.input, {
    loaders: [new GraphQLFileLoader()],
  });

  const schema = printSchema(schemaAst);
  const { suffix = false, immutable = false } = opts;
  const [clientName, clientPlugin, clientConfig] = getClient(opts);

  const code = await codegen({
    filename: opts.output,
    schema: parse(schema),
    schemaAst,
    documents,
    plugins: [
      { typescript: {} },
      { typescriptOperations: {} },
      { [clientName]: {} },
    ],
    pluginMap: {
      typescript,
      typescriptOperations,
      [clientName]: clientPlugin,
    },
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
        JSON: "{ [key: string]: any }",
      },
      ...clientConfig,
    },
  });

  return { schema, code };
}
