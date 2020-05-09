import { addQuotesToEmail } from "./formatter";

test("Adding blockquote to HTML email", () => {
  expect(addQuotesToEmail("ABC", "html")).toMatch(/<blockquote(.|\n|\r)*<\/blockquote>/);
});
