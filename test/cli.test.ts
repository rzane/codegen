import { join } from "path";
import { promises as fs } from "fs";
import { execute } from "../src/cli";

const { version } = require("../package.json");
const root = join(__dirname, "fixtures");
const output = join(root, "index.ts");
const schema = join(root, "schema.graphql");

beforeEach(() => jest.resetAllMocks());
beforeEach(() => fs.unlink(output).catch(() => {}));

test("--version", async () => {
  const log = jest.fn();
  await execute(["-v"], {}, log);
  expect(log).toHaveBeenCalledWith(version);
});

test("--help", async () => {
  const log = jest.fn();
  await execute(["--help"], {}, log);
  expect(log).toHaveBeenCalledWith(expect.stringContaining("codegen [ROOT]"));
});

test("errors with no arguments", async () => {
  const log = jest.fn();
  await expect(execute([], {}, log)).rejects.toThrow(/Missing argument/);
});

test("errors with no schema", async () => {
  const log = jest.fn();
  await expect(execute([root], {}, log)).rejects.toThrow(/Missing option/);
});

test("generates code and write to a file", async () => {
  const log = jest.fn();
  const mkdir = jest.spyOn(fs, "mkdir");
  const writeFile = jest.spyOn(fs, "writeFile");

  await execute([root, "--schema", schema], {}, log);

  expect(mkdir).toHaveBeenCalledTimes(1);
  expect(writeFile).toHaveBeenCalledTimes(2);
});

test("generates code using a schema specified by env", async () => {
  const log = jest.fn();
  const mkdir = jest.spyOn(fs, "mkdir");
  const writeFile = jest.spyOn(fs, "writeFile");

  await execute([root], { SCHEMA: schema }, log);

  expect(mkdir).toHaveBeenCalledTimes(1);
  expect(writeFile).toHaveBeenCalledTimes(2);
});
