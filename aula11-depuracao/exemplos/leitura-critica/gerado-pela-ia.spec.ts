import { describe, it, expect } from "vitest";
import { paginarV1, paginarV2, paginarV3 } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA cada rodada. Por isso ele passa.
// Escrever a especificacao que faltava e o exercicio 1 da aula.

const dez = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

describe("rodada 1: total de paginas errado", () => {
  it("BUG: 10 itens de 3 em 3 deveriam dar 4 paginas, nao 3", () => {
    expect(paginarV1(dez, 0, 3).totalPaginas).toBe(3);
  });
});

describe("rodada 2: total corrigido, indice base 0", () => {
  it("o total agora esta certo", () => {
    expect(paginarV2(dez, 0, 3).totalPaginas).toBe(4);
  });

  it("BUG: quem chama com pagina 1 esperando a PRIMEIRA recebe a segunda", () => {
    expect(paginarV2(dez, 1, 3).itens).toEqual([4, 5, 6]);
  });
});

describe("rodada 3: base 1, e agora a lista vazia", () => {
  it("pagina 1 devolve os primeiros", () => {
    expect(paginarV3(dez, 1, 3).itens).toEqual([1, 2, 3]);
  });

  it("BUG: pagina 0 devolve vazio em silencio, sem reclamar", () => {
    // inicio = (0 - 1) * 3 = -3, e slice(-3, 0) devolve [] porque o fim
    // calculado (0) vem antes do inicio (indice 7). Nenhum erro e lancado:
    // a tela simplesmente aparece sem resultado.
    expect(paginarV3(dez, 0, 3).itens).toEqual([]);
  });

  it("BUG: porPagina zero produz NaN em totalPaginas", () => {
    expect(paginarV3(dez, 1, 0).totalPaginas).toBe(Infinity);
  });

  it("BUG: lista vazia diz pagina 1 de 0", () => {
    const r = paginarV3([], 1, 3);
    expect(r.itens).toEqual([]);
    expect(r.totalPaginas).toBe(0);
  });

  // O ponto da aula: cada rodada corrigiu o sintoma relatado e criou outro,
  // porque nunca existiu uma especificacao dizendo o que era certo.
  it.todo("escrever a especificacao ANTES da proxima correcao");
});
