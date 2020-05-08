import parse from "minimist";
import { join } from "path";
import { promises as fs } from "fs";
import { generate } from "./index";

const help = `Usage: codegen [ROOT] [options]

generate type definitions from GraphQL queries

Options:
  -s, --schema <SCHEMA>  URL or file path to a GraphQL schema
  --suffix               append suffix (e.g. Mutation, Query)
  --immutable            generate readonly types
  -v, --version          output the version number
  -h, --help             display help for command
`;

export const execute = async (
  argv: string[],
  env: Record<string, string | undefined>,
  log: (message: string) => void
): Promise<void> => {
  const opts = parse(argv);
  const [root] = opts._;
  const schema = env.SCHEMA || opts.schema;

  if (opts.h || opts.help) {
    return log(help);
  }

  if (opts.v || opts.version) {
    const pkg = require("../package.json");
    return log(pkg.version);
  }

  if (!root) {
    throw new Error("Missing argument: ROOT");
  }

  if (!schema) {
    throw new Error("Missing option: --schema");
  }

  const input = join(root, "**/!(schema).graphql");
  const output = join(root, "index.ts");
  const schemaOutput = join(root, "schema.graphql");

  const result = await generate({
    input,
    output,
    schema,
    suffix: Boolean(opts.suffix),
    immutable: Boolean(opts.immutable),
  });

  await fs.mkdir(root, { recursive: true });
  await fs.writeFile(output, result.code);
  await fs.writeFile(schemaOutput, result.schema);
};

if (require.main === module) {
  execute(process.argv, process.env, console.log).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
