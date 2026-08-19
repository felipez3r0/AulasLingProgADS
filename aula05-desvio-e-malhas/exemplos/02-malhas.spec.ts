import { describe, it, expect } from "vitest";
import {
  somarAte,
  somarLista,
  contarDigitos,
  peloMenosUmaVez,
  primeiroNegativo,
  tabuada,
} from "./02-malhas.js";

describe("for", () => {
  it("soma de 1 ate n", () => {
    expect(somarAte(5)).toBe(15);
  });

  it("n igual a zero nao entra no laco", () => {
    expect(somarAte(0)).toBe(0);
  });
});

describe("for...of", () => {
  it("soma os valores da lista", () => {
    expect(somarLista([1, 2, 3])).toBe(6);
  });

  it("lista vazia soma zero", () => {
    expect(somarLista([])).toBe(0);
  });
});

describe("while e do-while", () => {
  it("conta digitos", () => {
    expect(contarDigitos(1234)).toBe(4);
    expect(contarDigitos(7)).toBe(1);
    expect(contarDigitos(-42)).toBe(2);
  });

  it("zero tem um digito - caso que o while sozinho erraria", () => {
    expect(contarDigitos(0)).toBe(1);
  });

  it("do-while executa ao menos uma vez, mesmo com condicao falsa", () => {
    expect(peloMenosUmaVez()).toBe(1);
  });
});

describe("break e continue", () => {
  it("encontra o primeiro negativo", () => {
    expect(primeiroNegativo([3, 5, -2, -8])).toBe(-2);
  });

  it("devolve null quando nao ha negativo", () => {
    expect(primeiroNegativo([1, 2, 3])).toBeNull();
  });
});

describe("lacos aninhados", () => {
  it("gera ate x ate combinacoes", () => {
    expect(tabuada(3)).toHaveLength(9);
    expect(tabuada(3)[0]).toBe("1x1=1");
    expect(tabuada(3)[8]).toBe("3x3=9");
  });
});
