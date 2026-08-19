import { describe, it, expect } from "vitest";
import { tresMaiores, relatorio } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA o defeito. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.

describe("tresMaiores - o valor devolvido esta certo", () => {
  it("devolve as tres maiores em ordem decrescente", () => {
    expect(tresMaiores([5, 9, 2, 10, 7])).toEqual([10, 9, 7]);
  });

  it("lista menor que tres devolve o que tem", () => {
    expect(tresMaiores([4, 8])).toEqual([8, 4]);
  });
});

describe("tresMaiores - o efeito que ninguem pediu", () => {
  // `sort` ordena NO LUGAR e devolve o mesmo array.
  // Como arrays sao passados por referencia, o array do chamador foi reordenado.
  it("BUG: reordena o array recebido", () => {
    const notasDaTurma = [5, 9, 2, 10, 7];
    tresMaiores(notasDaTurma);
    expect(notasDaTurma).toEqual([10, 9, 7, 5, 2]);
  });

  it("BUG: quem guardava a ordem de chamada perdeu a ordem", () => {
    const chamada = [5, 9, 2, 10, 7];
    const primeiroAntes = chamada[0];
    tresMaiores(chamada);
    expect(primeiroAntes).toBe(5);
    expect(chamada[0]).toBe(10); // mudou sem ninguem pedir
  });

  it("BUG: o efeito atravessa funcoes", () => {
    const r = relatorio([5, 9, 2, 10, 7]);
    // "primeiraDaLista" deveria ser 5, a primeira nota original
    expect(r.primeiraDaLista).toBe(10);
  });

  // Depois de corrigido (exercicio 1), o comportamento esperado e este:
  it.todo("nao deve reordenar o array recebido");
});
