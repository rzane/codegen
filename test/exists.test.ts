import { exists } from "../src/exists";

test("exists", async () => {
  expect(await exists("test/exists.test.ts")).toBe(true);
  expect(await exists("test/crap")).toBe(false);
});
