import { join } from "path";
import { generate, Options } from "../src";

const fixture = (...path: string[]): string => {
  return join(__dirname, "fixtures", ...path);
};

const makeOptions = (opts: Partial<Options> = {}): Options => ({
  output: "index.ts",
  schema: fixture("schema.graphql"),
  input: fixture("queries.graphql"),
  ...opts,
});

test("generates code", async () => {
  const opts = makeOptions();
  const { code } = await generate(opts);
  expect(code).toContain("  id: Scalars['ID']");
  expect(code).toMatchSnapshot();
});

test("generates code with react-query", async () => {
  const opts = makeOptions({ client: "react-query" });

  const { code } = await generate(opts);
  expect(code).toContain("import { execute } from './client';");
  expect(code).toMatchSnapshot();
});

test("generate code with immutability", async () => {
  const opts = makeOptions({ immutable: true });
  const { code } = await generate(opts);
  expect(code).toContain("  readonly id: Scalars['ID']");
  expect(code).toMatchSnapshot();
});

test("generates code without suffix by default", async () => {
  const opts = makeOptions();
  const { code } = await generate(opts);
  expect(code).toContain("export function useCreatePost(");
  expect(code).toMatchSnapshot();
});

test("generate code with suffix", async () => {
  const opts = makeOptions({ suffix: true });
  const { code } = await generate(opts);
  expect(code).toContain("export function useCreatePostMutation(");
  expect(code).toMatchSnapshot();
});
