import { Codegen } from "../src";
import { join, dirname } from "path";
import { stat, mkdtemp, mkdir, copyFile } from "fs/promises";

async function isFile(name: string) {
  try {
    const stats = await stat(name);
    return stats.isFile();
  } catch (_error) {
    return false;
  }
}

async function setup(name: string, sources: string[]) {
  await mkdir("tmp", { recursive: true });
  const tmp = await mkdtemp(join("tmp", name));

  for (const source of sources) {
    const dest = join(tmp, source);
    await mkdir(dirname(dest), { recursive: true });
    await copyFile(join("examples", name, source), dest);
  }

  return (name: string) => join(tmp, name);
}

test("run", async () => {
  const resolve = await setup("default", ["src/queries/post.graphql"]);

  await Codegen.run([
    resolve("src/queries"),
    "--schema",
    "examples/schema.graphql",
  ]);

  expect(await isFile(resolve("src/queries/index.ts"))).toBe(true);
  expect(await isFile(resolve("src/queries/schema.graphql"))).toBe(true);
});

test("run (colocated)", async () => {
  const resolve = await setup("colocated", [
    "src/components/Post/queries.graphql",
  ]);

  await Codegen.run([
    resolve("src"),
    "--schema",
    "examples/schema.graphql",
    "--colocate",
    resolve("src/schema"),
  ]);

  expect(await isFile(resolve("src/schema/index.ts"))).toBe(true);
  expect(await isFile(resolve("src/schema/schema.graphql"))).toBe(true);
  expect(await isFile(resolve("src/components/Post/queries.ts"))).toBe(true);
});
