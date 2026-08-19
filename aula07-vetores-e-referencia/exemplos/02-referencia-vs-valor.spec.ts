import { describe, it, expect } from "vitest";
import {
  primitivoECopiado,
  arrayEReferencia,
  copiaComSpread,
  funcaoQueMuta,
  funcaoQueNaoMuta,
  identidadeVsConteudo,
  copiaRasaNaoBastaParaAninhado,
} from "./02-referencia-vs-valor.js";

describe("primitivos sao copiados", () => {
  it("mudar b nao afeta a", () => {
    expect(primitivoECopiado()).toEqual({ a: 10, b: 20 });
  });
});

describe("arrays sao referencia", () => {
  it("alterar o alias altera o original", () => {
    const { original, alias, iguais } = arrayEReferencia();
    expect(original).toEqual([1, 2, 3, 4]);
    expect(alias).toEqual([1, 2, 3, 4]);
    expect(iguais).toBe(true); // e o MESMO array
  });

  it("spread cria um array de verdade novo", () => {
    const { original, copia, iguais } = copiaComSpread();
    expect(original).toEqual([1, 2, 3]);
    expect(copia).toEqual([1, 2, 3, 4]);
    expect(iguais).toBe(false);
  });
});

describe("funcoes recebem a referencia", () => {
  it("a funcao mutante altera o array do chamador", () => {
    const meus = [1, 2];
    funcaoQueMuta(meus);
    expect(meus).toEqual([1, 2, 999]);
  });

  it("a funcao nao mutante deixa o do chamador intacto", () => {
    const meus = [1, 2];
    const novo = funcaoQueNaoMuta(meus);
    expect(meus).toEqual([1, 2]);
    expect(novo).toEqual([1, 2, 999]);
  });
});

describe("identidade vs conteudo", () => {
  it("=== compara identidade", () => {
    const { mesmaIdentidade, mesmoConteudo } = identidadeVsConteudo();
    expect(mesmaIdentidade).toBe(false);
    expect(mesmoConteudo).toBe(true);
  });
});

describe("copia rasa nao protege o que esta aninhado", () => {
  it("o objeto interno continua compartilhado", () => {
    expect(copiaRasaNaoBastaParaAninhado().originalMudou).toBe(true);
  });
});
