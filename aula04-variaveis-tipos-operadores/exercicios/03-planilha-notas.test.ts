import { describe, it, expect } from "vitest";
import { processarPlanilha, type LinhaPlanilha } from "./03-planilha-notas.js";

const planilha = (): LinhaPlanilha[] => [
  { aluno: "Ana", nota1: "8", nota2: "10", peso1: "1", peso2: "1" },
  { aluno: "Bruno", nota1: "5", nota2: "4", peso1: "2", peso2: "1" },
  { aluno: "Carla", nota1: "2", nota2: "3", peso1: "1", peso2: "1" },
];

describe("processarPlanilha - calculo", () => {
  it("calcula media ponderada", () => {
    const r = processarPlanilha(planilha());
    expect(r[0]?.media).toBe(9);
    expect(r[1]?.media).toBe(4.7);
  });

  it("arredonda para 1 casa decimal", () => {
    const r = processarPlanilha([
      { aluno: "X", nota1: "7", nota2: "8", peso1: "1", peso2: "2" },
    ]);
    expect(r[0]?.media).toBe(7.7);
  });

  it("respeita os pesos", () => {
    const r = processarPlanilha([
      { aluno: "X", nota1: "10", nota2: "0", peso1: "3", peso2: "1" },
    ]);
    expect(r[0]?.media).toBe(7.5);
  });
});

describe("processarPlanilha - situacao", () => {
  it("classifica cada aluno", () => {
    const r = processarPlanilha(planilha());
    expect(r[0]?.situacao).toBe("aprovado");
    expect(r[1]?.situacao).toBe("recuperacao");
    expect(r[2]?.situacao).toBe("reprovado");
  });

  it("media exatamente 6 e aprovado", () => {
    const r = processarPlanilha([{ aluno: "X", nota1: "6", nota2: "6", peso1: "1", peso2: "1" }]);
    expect(r[0]?.situacao).toBe("aprovado");
  });

  it("media exatamente 4 e recuperacao", () => {
    const r = processarPlanilha([{ aluno: "X", nota1: "4", nota2: "4", peso1: "1", peso2: "1" }]);
    expect(r[0]?.situacao).toBe("recuperacao");
  });
});

describe("processarPlanilha - erros", () => {
  it("dado nao numerico lanca erro com o nome do aluno", () => {
    expect(() =>
      processarPlanilha([{ aluno: "Ana", nota1: "oito", nota2: "10", peso1: "1", peso2: "1" }]),
    ).toThrow("dado invalido no aluno Ana");
  });

  it("peso total zero lanca erro", () => {
    expect(() =>
      processarPlanilha([{ aluno: "Bruno", nota1: "8", nota2: "9", peso1: "0", peso2: "0" }]),
    ).toThrow("peso total zero no aluno Bruno");
  });

  it("nota acima de 10 lanca erro", () => {
    expect(() =>
      processarPlanilha([{ aluno: "Carla", nota1: "11", nota2: "9", peso1: "1", peso2: "1" }]),
    ).toThrow("nota fora da faixa no aluno Carla");
  });

  it("nota negativa lanca erro", () => {
    expect(() =>
      processarPlanilha([{ aluno: "Dani", nota1: "-1", nota2: "9", peso1: "1", peso2: "1" }]),
    ).toThrow("nota fora da faixa no aluno Dani");
  });

  it("campo invalido tem prioridade sobre faixa", () => {
    expect(() =>
      processarPlanilha([{ aluno: "Eva", nota1: "abc", nota2: "99", peso1: "1", peso2: "1" }]),
    ).toThrow("dado invalido no aluno Eva");
  });
});

describe("processarPlanilha - garantias", () => {
  it("planilha vazia devolve lista vazia", () => {
    expect(processarPlanilha([])).toEqual([]);
  });

  it("preserva a ordem da entrada", () => {
    expect(processarPlanilha(planilha()).map((r) => r.aluno)).toEqual(["Ana", "Bruno", "Carla"]);
  });

  it("nao modifica o array recebido", () => {
    const linhas = planilha();
    processarPlanilha(linhas);
    expect(linhas).toEqual(planilha());
  });

  it("nenhuma media e NaN", () => {
    for (const r of processarPlanilha(planilha())) {
      expect(r.media).not.toBeNaN();
    }
  });
});
