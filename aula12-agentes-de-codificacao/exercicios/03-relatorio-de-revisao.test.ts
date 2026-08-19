import { describe, it, expect } from "vitest";
import { revisar, type EntregaDoAgente } from "./03-relatorio-de-revisao.js";

const entrega = (over: Partial<EntregaDoAgente> = {}): EntregaDoAgente => ({
  descricao: "corrige calculo de frete acima de 200",
  arquivosAlterados: ["src/frete.ts"],
  linhasAdicionadas: 12,
  linhasRemovidas: 4,
  alertas: [],
  testesPassaram: true,
  typecheckPassou: true,
  ...over,
});

describe("revisar - aprovar", () => {
  it("entrega limpa e aprovada sem motivos", () => {
    expect(revisar(entrega())).toEqual({
      decisao: "aprovar",
      motivos: [],
      precisaLerComCuidado: false,
    });
  });
});

describe("revisar - recusar", () => {
  it("testes falhando recusa", () => {
    const r = revisar(entrega({ testesPassaram: false }));
    expect(r.decisao).toBe("recusar");
    expect(r.motivos).toEqual(["testes falhando"]);
  });

  it("typecheck falhando recusa", () => {
    expect(revisar(entrega({ typecheckPassou: false })).decisao).toBe("recusar");
  });

  it("alerta grave recusa", () => {
    const r = revisar(
      entrega({ alertas: [{ gravidade: "alta", regra: "teste alterado", arquivo: "x.test.ts" }] }),
    );
    expect(r.decisao).toBe("recusar");
    expect(r.motivos).toEqual(["alerta grave: teste alterado"]);
  });

  it("varios problemas somam motivos, na ordem da especificacao", () => {
    const r = revisar(
      entrega({
        testesPassaram: false,
        typecheckPassou: false,
        alertas: [
          { gravidade: "alta", regra: "possivel segredo", arquivo: "c.ts" },
          { gravidade: "media", regra: "dependencia nova", arquivo: "package.json" },
        ],
      }),
    );
    expect(r.motivos).toEqual([
      "testes falhando",
      "typecheck falhando",
      "alerta grave: possivel segredo",
      "alerta: dependencia nova",
    ]);
  });
});

describe("revisar - pedir ajustes", () => {
  it("alerta medio pede ajustes, nao recusa", () => {
    const r = revisar(
      entrega({ alertas: [{ gravidade: "media", regra: "erro engolido", arquivo: "s.ts" }] }),
    );
    expect(r.decisao).toBe("pedir ajustes");
    expect(r.motivos).toEqual(["alerta: erro engolido"]);
  });

  it("diff grande pede ajustes", () => {
    const r = revisar(entrega({ linhasAdicionadas: 150, linhasRemovidas: 60 }));
    expect(r.decisao).toBe("pedir ajustes");
    expect(r.motivos).toEqual(["diff grande"]);
  });

  it("exatamente 200 linhas nao e diff grande", () => {
    expect(revisar(entrega({ linhasAdicionadas: 150, linhasRemovidas: 50 })).motivos).toEqual([]);
  });

  it("muitos arquivos pede ajustes", () => {
    const r = revisar(entrega({ arquivosAlterados: Array.from({ length: 11 }, (_, i) => `a${i}.ts`) }));
    expect(r.motivos).toEqual(["muitos arquivos"]);
  });

  it("exatamente 10 arquivos nao dispara", () => {
    const r = revisar(entrega({ arquivosAlterados: Array.from({ length: 10 }, (_, i) => `a${i}.ts`) }));
    expect(r.motivos).toEqual([]);
  });

  it("descricao curta pede ajustes", () => {
    expect(revisar(entrega({ descricao: "ajustes" })).motivos).toEqual(["sem descricao"]);
  });

  it("descricao so com espacos conta como curta", () => {
    expect(revisar(entrega({ descricao: "          " })).motivos).toEqual(["sem descricao"]);
  });

  it("descricao de exatamente 10 caracteres passa", () => {
    expect(revisar(entrega({ descricao: "1234567890" })).motivos).toEqual([]);
  });
});

describe("revisar - precisaLerComCuidado", () => {
  it("diff grande exige leitura cuidadosa", () => {
    expect(revisar(entrega({ linhasAdicionadas: 300 })).precisaLerComCuidado).toBe(true);
  });

  it("muitos arquivos tambem", () => {
    const e = entrega({ arquivosAlterados: Array.from({ length: 20 }, (_, i) => `a${i}.ts`) });
    expect(revisar(e).precisaLerComCuidado).toBe(true);
  });

  it("e independente da decisao: pode recusar sem ser grande", () => {
    const r = revisar(entrega({ testesPassaram: false }));
    expect(r.decisao).toBe("recusar");
    expect(r.precisaLerComCuidado).toBe(false);
  });

  it("e pode ser grande e ainda assim so pedir ajustes", () => {
    const r = revisar(entrega({ linhasAdicionadas: 500 }));
    expect(r.decisao).toBe("pedir ajustes");
    expect(r.precisaLerComCuidado).toBe(true);
  });
});
