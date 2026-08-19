import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { salvarAluno } from "./gerado-pela-ia.js";

// Este arquivo DOCUMENTA os defeitos. Por isso ele passa.
// Corrigir e o exercicio 1 da aula.
//
// Repare: nao ha um unico teste que EXECUTE salvarAluno.
// Isso nao e descuido - e o primeiro defeito. A funcao fixa o caminho
// "dados/alunos.json" relativo ao diretorio de onde o processo foi
// iniciado. Roda-la num teste escreveria dentro do repositorio do curso,
// e o resultado dependeria de onde voce chamou `npm test`.

describe("salvarAluno - o defeito 1: caminho fixo", () => {
  it("BUG: a funcao nao aceita um caminho, entao nao da para testar isolada", () => {
    // A unica forma de "testar" seria deixar a funcao escrever no projeto.
    // Nao vamos fazer isso. A ausencia de teste E o sintoma.
    expect(typeof salvarAluno).toBe("function");
    expect(salvarAluno.length).toBe(1); // recebe so o aluno, nao o caminho
  });
});

describe("salvarAluno - o defeito 2: catch que engole", () => {
  it("BUG: JSON corrompido faz a funcao APAGAR todos os registros", () => {
    // O `catch { alunos = [] }` trata "arquivo ilegivel" como "arquivo vazio".
    // O proximo writeFileSync grava so o aluno novo - e os anteriores somem,
    // sem erro, sem log, sem ninguem perceber.
    const codigo = readFileSync(new URL("./gerado-pela-ia.ts", import.meta.url), "utf8");
    expect(codigo).toContain("alunos = [];");
    expect(codigo).toContain("catch");
  });
});

describe("salvarAluno - o defeito 3: escrita nao atomica", () => {
  it("BUG: writeFileSync direto no arquivo final", () => {
    const codigo = readFileSync(new URL("./gerado-pela-ia.ts", import.meta.url), "utf8");
    // Nao ha arquivo temporario nem rename: uma queda no meio da escrita
    // deixa o JSON pela metade e perde a colecao inteira.
    expect(codigo).toContain('writeFileSync(ARQUIVO');
    expect(codigo).not.toContain("rename");
  });

  it.todo("deve receber o caminho como parametro");
  it.todo("deve falhar alto quando o JSON estiver corrompido");
  it.todo("deve escrever de forma atomica");
});
