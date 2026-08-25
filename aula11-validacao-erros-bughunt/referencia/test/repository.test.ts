import { describe, expect, it } from "vitest";
import { aplicarDescontoPreview, listarTodos } from "../src/repository.js";

describe("referência vs cópia no repository", () => {
  it("aplicarDescontoPreview não altera a lista recebida como argumento", () => {
    const original = listarTodos();
    const precoAntes = original[0].preco;
    aplicarDescontoPreview(original, 10);
    expect(original[0].preco).toBe(precoAntes);
  });

  it("duas chamadas a listarTodos não compartilham referência", () => {
    const primeira = listarTodos();
    primeira[0].preco = 999999;
    const segunda = listarTodos();
    expect(segunda[0].preco).not.toBe(999999);
  });
});
