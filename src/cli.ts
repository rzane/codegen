import { Command } from "commander";
import { generateAndWrite } from "./generate";

const pkg = require("../package.json");

const command = new Command()
  .name("codegen")
  .version(pkg.version)
  .description("generate type definitions from GraphQL queries")
  .requiredOption(
    "-i, --input <input>",
    "glob of queries to generate types for"
  )
  .requiredOption(
    "-o, --output <output>",
    "path to file that will be generated"
  )
  .requiredOption(
    "-s, --schema <schema>",
    "URL or file path to a GraphQL schema"
  )
  .option("--suffix", "append suffix (e.g. Mutation, Query)")
  .option("--immutable", "generate readonly types")
  .action((opts) => {
    return generateAndWrite({
      input: opts.input,
      output: opts.output,
      schema: opts.schema,
      immutable: opts.immutable,
      suffix: opts.suffix,
    });
  });

export const run = async (argv: string[]) => {
  return command.parseAsync(argv);
};
