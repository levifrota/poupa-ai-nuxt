import { describe, it, expect } from "vitest";
import { removeUndefined } from "~/lib/utils";

describe("removeUndefined", () => {
  it("removes keys whose value is undefined", () => {
    const result = removeUndefined({ a: 1, b: undefined, c: "keep" });
    expect(result).toEqual({ a: 1, c: "keep" });
  });

  it("keeps falsy values that are not undefined", () => {
    const result = removeUndefined({ a: 0, b: false, c: "", d: null });
    expect(result).toEqual({ a: 0, b: false, c: "", d: null });
  });

  it("returns an equivalent object when there is nothing to remove", () => {
    const input = { a: 1, b: "two" };
    expect(removeUndefined(input)).toEqual(input);
  });
});
