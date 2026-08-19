import { describe, it, expect } from "vitest";
import {
  NOTA_MAXIMA,
  tiposPrimitivos,
  contarAte,
  constNaoCongelaObjeto,
} from "./01-declaracoes-e-tipos.js";

describe("declaracoes", () => {
  it("constante guarda o valor esperado", () => {
    expect(NOTA_MAXIMA).toBe(10);
  });

  it("tipos primitivos", () => {
    const t = tiposPrimitivos();
    expect(typeof t.texto).toBe("string");
    expect(typeof t.numero).toBe("number");
    expect(typeof t.booleano).toBe("boolean");
    expect(t.ausente).toBeNull();
  });

  it("laco com variavel inferida", () => {
    expect(contarAte(5)).toBe(5);
    expect(contarAte(0)).toBe(0);
  });
});

describe("const impede reatribuir, nao impede mutar", () => {
  it("o array declarado com const foi alterado", () => {
    expect(constNaoCongelaObjeto()).toEqual([1, 2, 3, 4]);
  });
});
