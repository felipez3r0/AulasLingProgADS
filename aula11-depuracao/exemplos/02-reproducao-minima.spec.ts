import { describe, it, expect } from "vitest";
import {
  relatorioMensal,
  relatorioMensalCorrigido,
  normalizarNome,
  normalizarNomeCorrigido,
  reproducaoMinima,
  type Venda,
} from "./02-reproducao-minima.js";

const vendas: Venda[] = [
  { vendedor: "Ana Silva", valor: 100, data: "2026-01-05" },
  { vendedor: "Ana  Silva", valor: 200, data: "2026-01-12" }, // dois espacos
];

describe("passo 1: o sintoma no pipeline grande", () => {
  it("o mesmo vendedor aparece duas vezes", () => {
    const r = relatorioMensal(vendas);
    expect(Object.keys(r)).toHaveLength(2);
  });
});

describe("passo 3: a reproducao minima", () => {
  it("duas linhas bastam para mostrar o problema", () => {
    const { a, b, iguais } = reproducaoMinima();
    expect(a).toBe("ana  silva");
    expect(b).toBe("ana silva");
    expect(iguais).toBe(false);
  });

  it("o split(' ') gera um campo vazio entre os dois espacos", () => {
    expect("Ana  Silva".split(" ")).toEqual(["Ana", "", "Silva"]);
  });

  it("e o join(' ') recoloca esse vazio: a operacao inteira nao faz nada", () => {
    expect("Ana  Silva".split(" ").join(" ")).toBe("Ana  Silva");
    expect(normalizarNome("Ana  Silva")).not.toBe(normalizarNome("Ana Silva"));
  });
});

describe("passo 4: correcao e teste permanente", () => {
  it("a normalizacao passa a tratar espacos repetidos", () => {
    expect(normalizarNomeCorrigido("Ana  Silva")).toBe("ana silva");
    expect(normalizarNomeCorrigido("  Ana\tSilva  ")).toBe("ana silva");
  });

  it("o relatorio agrupa corretamente", () => {
    const r = relatorioMensalCorrigido(vendas);
    expect(Object.keys(r)).toEqual(["ana silva"]);
    expect(r["ana silva"]).toBe(300);
  });
});
