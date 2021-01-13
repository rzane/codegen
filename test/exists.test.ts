import { exists } from "../src/exists";

test("exists", async () => {
  expect(await exists("test/fixtures/post.graphql")).toBe(true);
  expect(await exists("test/fixtures/none.graphql")).toBe(false);
});
