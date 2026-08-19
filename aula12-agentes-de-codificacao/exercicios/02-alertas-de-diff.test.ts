import { describe, it, expect } from "vitest";
import { analisarDiff } from "./02-alertas-de-diff.js";

const diffLimpo = `
+++ b/src/calculo.ts
+export function somar(a: number, b: number): number {
+  return a + b;
+}
`;

const diffComTeste = `
+++ b/src/calculo.test.ts
-  expect(somar(2, 3)).toBe(5);
+  expect(somar(2, 3)).toBeDefined();
`;

const diffComSegredo = `
+++ b/src/config.ts
+const apiKey = "sk-abcdef1234567890";
`;

const diffComDependencia = `
+++ b/package.json
+    "lodash": "^4.17.21",
`;

const diffComCatchVazio = `
+++ b/src/servico.ts
+  try { salvar(); } catch {}
`;

describe("analisarDiff - diff limpo", () => {
  it("nenhum alerta", () => {
    expect(analisarDiff(diffLimpo)).toEqual([]);
  });

  it("diff vazio", () => {
    expect(analisarDiff("")).toEqual([]);
  });
});

describe("analisarDiff - gravidade alta", () => {
  it("detecta teste alterado", () => {
    expect(analisarDiff(diffComTeste)).toEqual([
      { gravidade: "alta", regra: "teste alterado", arquivo: "src/calculo.test.ts" },
    ]);
  });

  it("detecta .spec.ts tambem", () => {
    const d = `
+++ b/src/x.spec.ts
+  expect(1).toBe(1);
`;
    expect(analisarDiff(d)[0]?.regra).toBe("teste alterado");
  });

  it("detecta possivel segredo", () => {
    expect(analisarDiff(diffComSegredo)).toEqual([
      { gravidade: "alta", regra: "possivel segredo", arquivo: "src/config.ts" },
    ]);
  });

  it("reconhece varias palavras-chave de segredo", () => {
    for (const chave of ["senha", "password", "TOKEN", "secret", "apiKey"]) {
      const d = `
+++ b/src/c.ts
+const ${chave} = "valor-bem-longo-aqui";
`;
      expect(analisarDiff(d)[0]?.regra).toBe("possivel segredo");
    }
  });

  it("valor curto nao dispara alerta de segredo", () => {
    const d = `
+++ b/src/c.ts
+const token = "abc";
`;
    expect(analisarDiff(d)).toEqual([]);
  });
});

describe("analisarDiff - gravidade media", () => {
  it("detecta dependencia nova", () => {
    expect(analisarDiff(diffComDependencia)).toEqual([
      { gravidade: "media", regra: "dependencia nova", arquivo: "package.json" },
    ]);
  });

  it("nao alerta dependencia fora do package.json", () => {
    const d = `
+++ b/src/x.ts
+    "lodash": "^4.17.21",
`;
    expect(analisarDiff(d)).toEqual([]);
  });

  it("detecta catch vazio", () => {
    expect(analisarDiff(diffComCatchVazio)).toEqual([
      { gravidade: "media", regra: "erro engolido", arquivo: "src/servico.ts" },
    ]);
  });

  it("detecta catch so com comentario", () => {
    const d = `
+++ b/src/y.ts
+  try { x(); } catch { /* ignora */ }
`;
    expect(analisarDiff(d)[0]?.regra).toBe("erro engolido");
  });

  it("catch com corpo nao dispara", () => {
    const d = `
+++ b/src/y.ts
+  try { x(); } catch (e) { registrar(e); }
`;
    expect(analisarDiff(d)).toEqual([]);
  });
});

describe("analisarDiff - ordenacao e duplicatas", () => {
  it("alta vem antes de media", () => {
    const d = diffComDependencia + diffComSegredo;
    expect(analisarDiff(d).map((a) => a.gravidade)).toEqual(["alta", "media"]);
  });

  it("cada regra aparece uma vez por arquivo", () => {
    const d = `
+++ b/src/c.ts
+const token = "primeiro-segredo-longo";
+const senha = "segundo-segredo-longo";
`;
    expect(analisarDiff(d)).toHaveLength(1);
  });

  it("arquivos diferentes geram alertas separados", () => {
    const d = `
+++ b/a.test.ts
+expect(1).toBe(1);
+++ b/b.spec.ts
+expect(2).toBe(2);
`;
    expect(analisarDiff(d)).toHaveLength(2);
  });

  it("dentro da mesma gravidade, mantem a ordem dos arquivos no diff", () => {
    const d = `
+++ b/z.test.ts
+expect(1).toBe(1);
+++ b/a.spec.ts
+expect(2).toBe(2);
`;
    expect(analisarDiff(d).map((a) => a.arquivo)).toEqual(["z.test.ts", "a.spec.ts"]);
  });
});
