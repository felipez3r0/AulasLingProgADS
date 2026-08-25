import { describe, expect, it } from "vitest";
import { ehVogal } from "../src/exemplo.js";

describe("ehVogal", () => {
  it("reconhece vogais minúsculas", () => {
    expect(ehVogal("a")).toBe(true);
  });

  it("rejeita consoantes", () => {
    expect(ehVogal("b")).toBe(false);
  });
});
