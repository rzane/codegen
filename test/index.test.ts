import { join } from "path";
import { tmpdir } from "os";
import { promises as fs } from "fs";
import { randomBytes } from "crypto";
import { generate, generateAndWrite, GenerateOptions } from "../src";

const tmp = (...path: string[]): string => {
  const rand = randomBytes(10).toString("hex");
  return join(tmpdir(), rand, ...path);
};

const fixture = (...path: string[]): string => {
  return join(__dirname, "fixtures", ...path);
};

const makeConfig = (opts: Partial<GenerateOptions> = {}): GenerateOptions => ({
  output: tmp("index.ts"),
  schema: fixture("schema.graphql"),
  input: fixture("queries.graphql"),
  ...opts,
});

test("generates code", async () => {
  const config = makeConfig();
  const code = await generate(config);
  expect(code).toMatchSnapshot();
});

test("generate code with immutable types", async () => {
  const config = makeConfig({ immutable: true });
  const code = await generate(config);
  expect(code).toContain("readonly id: Scalars['ID']");
});

test("generate code with suffix", async () => {
  const config = makeConfig({ immutable: true });
  const code = await generate(config);
  expect(code).toContain("type CreatePostMutation");
});

test("generates code and writes it to disk", async () => {
  const config = makeConfig();
  await generateAndWrite(config);

  const stat = await fs.stat(config.output);
  expect(stat.size).toEqual(3939);
});
