import { describe, expect, it } from "vitest";
import { somar } from "../src/exemplo.js";

describe("somar", () => {
  it("soma dois números", () => {
    expect(somar(2, 3)).toBe(5);
  });
});
