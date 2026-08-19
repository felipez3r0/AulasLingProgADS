import { describe, it, expect } from "vitest";
import { auditar, type Dependencia } from "./03-auditoria-dependencias.js";

const HOJE = "2026-06-01";

const boa: Dependencia = {
  nome: "express",
  versaoDeclarada: "^5.0.0",
  ultimaPublicacao: "2026-05-01",
  downloadsSemanais: 30_000_000,
  temRepositorio: true,
};

const suspeita: Dependencia = {
  nome: "cpf-validador-br",
  versaoDeclarada: "*",
  ultimaPublicacao: "2019-01-01",
  downloadsSemanais: 12,
  temRepositorio: false,
};

describe("auditar - classificacao", () => {
  it("dependencia saudavel tem risco baixo e nenhum motivo", () => {
    expect(auditar([boa], HOJE)).toEqual([{ nome: "express", risco: "baixo", motivos: [] }]);
  });

  it("dependencia suspeita acumula todos os motivos", () => {
    const r = auditar([suspeita], HOJE);
    expect(r[0]?.risco).toBe("alto");
    expect(r[0]?.motivos).toEqual([
      "sem repositorio",
      "poucos downloads",
      "abandonada",
      "versao sem trava",
    ]);
  });

  it("um motivo so e risco medio", () => {
    const d: Dependencia = { ...boa, nome: "obscura", downloadsSemanais: 10 };
    const r = auditar([d], HOJE);
    expect(r[0]?.risco).toBe("medio");
    expect(r[0]?.motivos).toEqual(["poucos downloads"]);
  });

  it("dois motivos ainda e risco medio", () => {
    const d: Dependencia = { ...boa, nome: "obscura", downloadsSemanais: 10, temRepositorio: false };
    expect(auditar([d], HOJE)[0]?.risco).toBe("medio");
  });

  it("tres motivos ja e risco alto", () => {
    const d: Dependencia = {
      ...boa,
      nome: "obscura",
      downloadsSemanais: 10,
      temRepositorio: false,
      versaoDeclarada: ">1.0.0",
    };
    expect(auditar([d], HOJE)[0]?.risco).toBe("alto");
  });
});

describe("auditar - limites das regras", () => {
  it("exatamente 1000 downloads nao e motivo", () => {
    const d: Dependencia = { ...boa, downloadsSemanais: 1000 };
    expect(auditar([d], HOJE)[0]?.motivos).toEqual([]);
  });

  it("999 downloads e motivo", () => {
    const d: Dependencia = { ...boa, downloadsSemanais: 999 };
    expect(auditar([d], HOJE)[0]?.motivos).toContain("poucos downloads");
  });

  it("publicacao de exatamente 2 anos atras nao e abandonada", () => {
    const d: Dependencia = { ...boa, ultimaPublicacao: "2024-06-01" };
    expect(auditar([d], HOJE)[0]?.motivos).toEqual([]);
  });

  it("publicacao de 2 anos e 1 dia e abandonada", () => {
    const d: Dependencia = { ...boa, ultimaPublicacao: "2024-05-31" };
    expect(auditar([d], HOJE)[0]?.motivos).toContain("abandonada");
  });

  it("versao com ^ ou ~ nao e sem trava", () => {
    expect(auditar([{ ...boa, versaoDeclarada: "~1.0.0" }], HOJE)[0]?.motivos).toEqual([]);
    expect(auditar([{ ...boa, versaoDeclarada: "1.0.0" }], HOJE)[0]?.motivos).toEqual([]);
  });

  it("versao * ou > e sem trava", () => {
    expect(auditar([{ ...boa, versaoDeclarada: "*" }], HOJE)[0]?.motivos).toContain(
      "versao sem trava",
    );
    expect(auditar([{ ...boa, versaoDeclarada: ">=2.0.0" }], HOJE)[0]?.motivos).toContain(
      "versao sem trava",
    );
  });
});

describe("auditar - ordenacao e bordas", () => {
  it("ordena por risco e depois por nome", () => {
    const deps: Dependencia[] = [
      { ...boa, nome: "zebra" },
      suspeita,
      { ...boa, nome: "alfa", downloadsSemanais: 5 },
      { ...boa, nome: "beta" },
    ];
    expect(auditar(deps, HOJE).map((a) => a.nome)).toEqual([
      "cpf-validador-br",
      "alfa",
      "beta",
      "zebra",
    ]);
  });

  it("lista vazia", () => {
    expect(auditar([], HOJE)).toEqual([]);
  });

  it("data invalida lanca erro com o nome", () => {
    const d: Dependencia = { ...boa, nome: "quebrada", ultimaPublicacao: "ontem" };
    expect(() => auditar([d], HOJE)).toThrow("data invalida: quebrada");
  });

  it("nao modifica o array recebido", () => {
    const deps = [{ ...boa, nome: "zebra" }, suspeita];
    auditar(deps, HOJE);
    expect(deps.map((d) => d.nome)).toEqual(["zebra", "cpf-validador-br"]);
  });
});
