import { Command } from "commander";
import { generateAndWrite } from "./codegen";

const pkg = require("../package.json");
const program = new Command();

program.name("devtool");
program.version(pkg.version);

program
  .command("codegen")
  .description("generate type definitions from GraphQL queries")
  .requiredOption("-i, --input", "glob of queries to generate types for")
  .requiredOption("-o, --output", "path to file that will be generated")
  .requiredOption("-s, --schema", "URL or file path to a GraphQL schema")
  .option("--suffix", "append suffix (e.g. Mutation, Query)")
  .option("--immutable", "generate readonly types")
  .action((opts) => generateAndWrite(opts));

export const run = async (argv: string[]) => {
  return program.parseAsync(argv);
};
