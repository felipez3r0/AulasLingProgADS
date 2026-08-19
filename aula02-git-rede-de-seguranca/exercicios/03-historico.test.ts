import { describe, it, expect } from "vitest";
import { resumirPorAutor, type Commit } from "./03-historico.js";

const historico = (): Commit[] => [
  { hash: "a1", autor: "ana", mensagem: "feat: login", arquivosAlterados: 3 },
  { hash: "b2", autor: "bruno", mensagem: "fix: typo", arquivosAlterados: 1 },
  { hash: "c3", autor: "ana", mensagem: "test: login", arquivosAlterados: 2 },
  { hash: "d4", autor: "carla", mensagem: "docs: readme", arquivosAlterados: 1 },
  { hash: "e5", autor: "ana", mensagem: "refactor", arquivosAlterados: 5 },
];

describe("resumirPorAutor", () => {
  it("agrupa commits por autor", () => {
    const ana = resumirPorAutor(historico()).find((r) => r.autor === "ana");
    expect(ana?.commits).toBe(3);
    expect(ana?.arquivosAlterados).toBe(10);
  });

  it("ordena por numero de commits, do maior para o menor", () => {
    expect(resumirPorAutor(historico())[0]?.autor).toBe("ana");
  });

  it("desempata pelo nome do autor em ordem alfabetica", () => {
    const nomes = resumirPorAutor(historico()).map((r) => r.autor);
    expect(nomes).toEqual(["ana", "bruno", "carla"]);
  });

  it("historico vazio devolve lista vazia", () => {
    expect(resumirPorAutor([])).toEqual([]);
  });

  it("um unico commit funciona", () => {
    const um: Commit[] = [{ hash: "x", autor: "dani", mensagem: "init", arquivosAlterados: 7 }];
    expect(resumirPorAutor(um)).toEqual([{ autor: "dani", commits: 1, arquivosAlterados: 7 }]);
  });

  it("nao modifica o array recebido", () => {
    const commits = historico();
    resumirPorAutor(commits);
    expect(commits.map((c) => c.hash)).toEqual(["a1", "b2", "c3", "d4", "e5"]);
  });
});
