import { describe, it, expect, beforeEach } from "vitest";
import {
  buscarAtivos,
  buscarUsuarios,
  limparCache,
  tamanhoDoCache,
  type Usuario,
} from "./02-revisar-diff.js";

const usuarios = (): Usuario[] => [
  { id: "1", nome: "Ana Silva", email: "ana@fatec.br", ativo: true },
  { id: "2", nome: "Bruno Costa", email: "bruno@fatec.br", ativo: true },
  { id: "3", nome: "Ana Souza", email: "anasouza@fatec.br", ativo: false },
];

beforeEach(() => limparCache());

describe("versao enxuta", () => {
  it("busca por nome entre os ativos", () => {
    expect(buscarAtivos(usuarios(), "ana").map((u) => u.id)).toEqual(["1"]);
  });

  it("nao traz inativos", () => {
    expect(buscarAtivos(usuarios(), "souza")).toEqual([]);
  });
});

describe("versao gerada: as decisoes que ninguem pediu", () => {
  it("faz o basico direito", () => {
    expect(buscarUsuarios(usuarios(), "bruno").map((u) => u.id)).toEqual(["2"]);
  });

  it("SURPRESA 1: traz inativo quando o nome bate exatamente", () => {
    expect(buscarUsuarios(usuarios(), "ana souza").map((u) => u.id)).toEqual(["3"]);
  });

  it("SURPRESA 2: ordena por nome, o que ninguem pediu", () => {
    const fora: Usuario[] = [
      { id: "9", nome: "Zeca", email: "z@f.br", ativo: true },
      { id: "8", nome: "Alfa", email: "a@f.br", ativo: true },
    ];
    expect(buscarUsuarios(fora, "@f.br").map((u) => u.nome)).toEqual(["Alfa", "Zeca"]);
  });

  it("SURPRESA 3: pagina por padrao, escondendo resultados", () => {
    const muitos: Usuario[] = Array.from({ length: 30 }, (_, i) => ({
      id: String(i),
      nome: `Pessoa ${String(i).padStart(2, "0")}`,
      email: `p${i}@f.br`,
      ativo: true,
    }));
    expect(buscarUsuarios(muitos, "@f.br")).toHaveLength(20);
  });

  it("SURPRESA 4: o cache global torna a funcao imprevisivel", () => {
    const lista = usuarios();
    expect(buscarUsuarios(lista, "ana").map((u) => u.id)).toEqual(["1"]);
    // O usuario 1 e desativado...
    lista[0]!.ativo = false;
    // ...mas a busca continua devolvendo o resultado antigo.
    expect(buscarUsuarios(lista, "ana").map((u) => u.id)).toEqual(["1"]);
    expect(tamanhoDoCache()).toBe(1);
  });

  it("SURPRESA 5: o segundo slice(0,50) e codigo morto", () => {
    // porPagina ja limita a 20; o slice(0, 50) nunca faz nada.
    // Codigo que nao faz nada e codigo que ninguem consegue justificar.
    const muitos: Usuario[] = Array.from({ length: 100 }, (_, i) => ({
      id: String(i),
      nome: `P${i}`,
      email: `p${i}@f.br`,
      ativo: true,
    }));
    expect(buscarUsuarios(muitos, "@f.br", 1, 20)).toHaveLength(20);
  });
});
