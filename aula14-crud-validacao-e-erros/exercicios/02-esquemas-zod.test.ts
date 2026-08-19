import { describe, it, expect } from "vitest";
import { validarEvento } from "./02-esquemas-zod.js";

const valido = {
  titulo: "Semana de Tecnologia",
  vagas: 100,
  modalidade: "online" as const,
  dataIso: "2026-09-15",
  tags: ["ia", "typescript"],
};

const problemasDe = (entrada: unknown): { campo: string; mensagem: string }[] => {
  const r = validarEvento(entrada);
  return r.ok ? [] : r.problemas;
};

describe("validarEvento - caminho feliz", () => {
  it("aceita evento valido", () => {
    const r = validarEvento(valido);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.dados.titulo).toBe("Semana de Tecnologia");
  });

  it("apara espacos do titulo", () => {
    const r = validarEvento({ ...valido, titulo: "   Com espacos aqui   " });
    if (r.ok) expect(r.dados.titulo).toBe("Com espacos aqui");
  });

  it("descricao e local sao opcionais", () => {
    expect(validarEvento(valido).ok).toBe(true);
  });
});

describe("validarEvento - campos simples", () => {
  it("titulo curto", () => {
    expect(problemasDe({ ...valido, titulo: "abc" })).toContainEqual({
      campo: "titulo",
      mensagem: "titulo muito curto",
    });
  });

  it("titulo longo demais", () => {
    expect(problemasDe({ ...valido, titulo: "a".repeat(81) }).length).toBeGreaterThan(0);
  });

  it("vagas zero", () => {
    expect(problemasDe({ ...valido, vagas: 0 })).toContainEqual({
      campo: "vagas",
      mensagem: "vagas deve ser positivo",
    });
  });

  it("vagas nao inteiro", () => {
    expect(problemasDe({ ...valido, vagas: 1.5 }).length).toBeGreaterThan(0);
  });

  it("vagas acima do maximo", () => {
    expect(problemasDe({ ...valido, vagas: 1001 }).length).toBeGreaterThan(0);
  });

  it("modalidade fora do enum", () => {
    expect(problemasDe({ ...valido, modalidade: "hologramas" }).length).toBeGreaterThan(0);
  });

  it("data em formato errado", () => {
    expect(problemasDe({ ...valido, dataIso: "15/09/2026" })).toContainEqual({
      campo: "dataIso",
      mensagem: "data deve estar no formato aaaa-mm-dd",
    });
  });

  it("descricao longa demais", () => {
    expect(problemasDe({ ...valido, descricao: "x".repeat(501) }).length).toBeGreaterThan(0);
  });
});

describe("validarEvento - tags", () => {
  it("mais de 5 tags", () => {
    expect(problemasDe({ ...valido, tags: ["a", "b", "c", "d", "e", "f"] }).length).toBeGreaterThan(0);
  });

  it("tags repetidas", () => {
    expect(problemasDe({ ...valido, tags: ["ia", "ia"] })).toContainEqual({
      campo: "tags",
      mensagem: "tags nao podem repetir",
    });
  });

  it("exatamente 5 tags distintas passa", () => {
    expect(validarEvento({ ...valido, tags: ["a", "b", "c", "d", "e"] }).ok).toBe(true);
  });
});

describe("validarEvento - regra cruzada", () => {
  it("presencial sem local e invalido", () => {
    expect(problemasDe({ ...valido, modalidade: "presencial" })).toContainEqual({
      campo: "local",
      mensagem: "local e obrigatorio nesta modalidade",
    });
  });

  it("hibrido sem local e invalido", () => {
    expect(problemasDe({ ...valido, modalidade: "hibrido" })).toContainEqual({
      campo: "local",
      mensagem: "local e obrigatorio nesta modalidade",
    });
  });

  it("presencial com local e valido", () => {
    expect(validarEvento({ ...valido, modalidade: "presencial", local: "Auditorio" }).ok).toBe(true);
  });

  it("online sem local e valido", () => {
    expect(validarEvento({ ...valido, modalidade: "online" }).ok).toBe(true);
  });
});

describe("validarEvento - varios problemas", () => {
  it("acumula problemas de campos diferentes", () => {
    const p = problemasDe({ titulo: "ab", vagas: -1, modalidade: "x", dataIso: "ontem" });
    expect(p.length).toBeGreaterThanOrEqual(4);
  });

  it("entrada que nao e objeto tambem devolve problema", () => {
    const r = validarEvento("nao sou objeto");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.problemas.length).toBeGreaterThan(0);
  });

  it("nunca lanca", () => {
    for (const entrada of [null, undefined, 42, [], "texto"]) {
      expect(() => validarEvento(entrada)).not.toThrow();
    }
  });
});
