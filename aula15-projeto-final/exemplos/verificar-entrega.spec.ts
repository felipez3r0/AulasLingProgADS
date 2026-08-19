import { describe, it, expect } from "vitest";
import { verificarEntrega, type EstadoDoProjeto } from "./verificar-entrega.js";

const projetoPronto = (over: Partial<EstadoDoProjeto> = {}): EstadoDoProjeto => ({
  temReadme: true,
  temGitignore: true,
  temDiarioDeIa: true,
  temCi: true,
  quantidadeDeCommits: 22,
  quantidadeDeBranches: 3,
  temPrDeAgenteRevisado: true,
  recursosComCrudCompleto: 2,
  recursosSeRelacionam: true,
  quantidadeDeFiltros: 3,
  regrasDeNegocio: 2,
  testesPassam: true,
  typecheckPassa: true,
  cobreCasosDeBorda: true,
  arquivosComSegredo: [],
  usaAnyNoCodigo: false,
  ...over,
});

describe("projeto pronto", () => {
  it("passa em tudo", () => {
    const r = verificarEntrega(projetoPronto());
    expect(r.prontoParaEntregar).toBe(true);
    expect(r.bloqueios).toEqual([]);
    expect(r.percentualAtendido).toBe(100);
  });
});

describe("bloqueios", () => {
  it("segredo commitado bloqueia", () => {
    const r = verificarEntrega(projetoPronto({ arquivosComSegredo: [".env"] }));
    expect(r.prontoParaEntregar).toBe(false);
    expect(r.bloqueios[0]).toContain(".env");
  });

  it("suite vermelha bloqueia", () => {
    expect(verificarEntrega(projetoPronto({ testesPassam: false })).bloqueios).toContain(
      "suite de testes vermelha",
    );
  });

  it("typecheck com erro bloqueia", () => {
    expect(verificarEntrega(projetoPronto({ typecheckPassa: false })).bloqueios).toContain(
      "typecheck com erros",
    );
  });

  it("diario ausente bloqueia", () => {
    expect(verificarEntrega(projetoPronto({ temDiarioDeIa: false })).bloqueios).toContain(
      "DIARIO-IA.md ausente",
    );
  });
});

describe("criterios objetivos", () => {
  it("um recurso so nao basta", () => {
    const r = verificarEntrega(projetoPronto({ recursosComCrudCompleto: 1 }));
    expect(r.itens.find((i) => i.criterio.includes("CRUD"))?.ok).toBe(false);
    expect(r.prontoParaEntregar).toBe(false);
  });

  it("poucos commits reprova o criterio de Git", () => {
    const r = verificarEntrega(projetoPronto({ quantidadeDeCommits: 3 }));
    expect(r.itens.find((i) => i.criterio.includes("commits"))?.ok).toBe(false);
    expect(r.itens.find((i) => i.criterio.includes("commits"))?.observacao).toContain("3");
  });

  it("uso de any reprova", () => {
    expect(
      verificarEntrega(projetoPronto({ usaAnyNoCodigo: true })).itens.find((i) =>
        i.criterio.includes("any"),
      )?.ok,
    ).toBe(false);
  });

  it("so caminho feliz reprova cobertura", () => {
    expect(
      verificarEntrega(projetoPronto({ cobreCasosDeBorda: false })).itens.find((i) =>
        i.criterio.includes("borda"),
      )?.ok,
    ).toBe(false);
  });

  it("sem PR de agente revisado reprova", () => {
    expect(
      verificarEntrega(projetoPronto({ temPrDeAgenteRevisado: false })).itens.find((i) =>
        i.criterio.includes("PR de agente"),
      )?.ok,
    ).toBe(false);
  });
});

describe("percentual", () => {
  it("cai conforme os itens falham", () => {
    const r = verificarEntrega(
      projetoPronto({ temReadme: false, temCi: false, quantidadeDeFiltros: 0 }),
    );
    expect(r.percentualAtendido).toBeLessThan(100);
    expect(r.percentualAtendido).toBeGreaterThan(50);
  });

  it("um projeto vazio atende quase nada", () => {
    const r = verificarEntrega({
      temReadme: false,
      temGitignore: false,
      temDiarioDeIa: false,
      temCi: false,
      quantidadeDeCommits: 1,
      quantidadeDeBranches: 1,
      temPrDeAgenteRevisado: false,
      recursosComCrudCompleto: 0,
      recursosSeRelacionam: false,
      quantidadeDeFiltros: 0,
      regrasDeNegocio: 0,
      testesPassam: false,
      typecheckPassa: false,
      cobreCasosDeBorda: false,
      arquivosComSegredo: [],
      usaAnyNoCodigo: true,
    });
    expect(r.percentualAtendido).toBe(0);
    expect(r.prontoParaEntregar).toBe(false);
  });
});
