import { describe, it, expect } from "vitest";
import { buscarAlunos, type FuncaoBuscar } from "./02-cliente-http.js";

type Config = { status: number; corpo?: unknown; rede?: "fora" };

function fetchFalso(porId: Record<string, Config>): FuncaoBuscar {
  return (async (url: string | URL | Request) => {
    const id = String(url).split("/").pop() ?? "";
    const c = porId[id] ?? { status: 404 };
    if (c.rede === "fora") throw new TypeError("fetch failed");
    return {
      ok: c.status >= 200 && c.status < 300,
      status: c.status,
      json: async () => c.corpo ?? {},
    } as Response;
  }) as FuncaoBuscar;
}

const ana = { id: "1", nome: "Ana", ra: "111" };
const bruno = { id: "2", nome: "Bruno", ra: "222" };

describe("buscarAlunos - encontrados", () => {
  it("devolve os alunos encontrados", async () => {
    const buscar = fetchFalso({ "1": { status: 200, corpo: ana } });
    const r = await buscarAlunos("http://api", ["1"], buscar);
    expect(r.encontrados).toEqual([ana]);
    expect(r.naoEncontrados).toEqual([]);
    expect(r.falhas).toEqual([]);
  });

  it("mantem a ordem dos ids recebidos", async () => {
    const buscar = fetchFalso({
      "1": { status: 200, corpo: ana },
      "2": { status: 200, corpo: bruno },
    });
    const r = await buscarAlunos("http://api", ["2", "1"], buscar);
    expect(r.encontrados.map((a) => a.id)).toEqual(["2", "1"]);
  });
});

describe("buscarAlunos - 404 nao e falha", () => {
  it("id inexistente vai para naoEncontrados", async () => {
    const buscar = fetchFalso({ "1": { status: 200, corpo: ana } });
    const r = await buscarAlunos("http://api", ["1", "99"], buscar);
    expect(r.encontrados).toEqual([ana]);
    expect(r.naoEncontrados).toEqual(["99"]);
    expect(r.falhas).toEqual([]);
  });
});

describe("buscarAlunos - falhas", () => {
  it("500 vira falha com o status", async () => {
    const buscar = fetchFalso({ "1": { status: 500 } });
    const r = await buscarAlunos("http://api", ["1"], buscar);
    expect(r.falhas).toEqual([{ id: "1", motivo: "HTTP 500" }]);
  });

  it("403 tambem", async () => {
    const buscar = fetchFalso({ "1": { status: 403 } });
    expect((await buscarAlunos("http://api", ["1"], buscar)).falhas[0]?.motivo).toBe("HTTP 403");
  });

  it("rede fora vira falha de rede", async () => {
    const buscar = fetchFalso({ "1": { status: 200, rede: "fora" } });
    const r = await buscarAlunos("http://api", ["1"], buscar);
    expect(r.falhas).toEqual([{ id: "1", motivo: "falha de rede" }]);
  });

  it("corpo sem os campos esperados vira resposta invalida", async () => {
    const buscar = fetchFalso({ "1": { status: 200, corpo: { id: "1" } } });
    const r = await buscarAlunos("http://api", ["1"], buscar);
    expect(r.falhas).toEqual([{ id: "1", motivo: "resposta invalida" }]);
  });

  it("campo com tipo errado tambem", async () => {
    const buscar = fetchFalso({ "1": { status: 200, corpo: { id: "1", nome: "A", ra: 111 } } });
    expect((await buscarAlunos("http://api", ["1"], buscar)).falhas[0]?.motivo).toBe(
      "resposta invalida",
    );
  });
});

describe("buscarAlunos - garantias", () => {
  it("nunca rejeita", async () => {
    const buscar = fetchFalso({ "1": { status: 200, rede: "fora" }, "2": { status: 500 } });
    await expect(buscarAlunos("http://api", ["1", "2", "3"], buscar)).resolves.toBeDefined();
  });

  it("classifica cada id na lista certa", async () => {
    const buscar = fetchFalso({
      "1": { status: 200, corpo: ana },
      "2": { status: 500 },
      "3": { status: 404 },
    });
    const r = await buscarAlunos("http://api", ["1", "2", "3"], buscar);
    expect(r.encontrados.map((a) => a.id)).toEqual(["1"]);
    expect(r.falhas.map((f) => f.id)).toEqual(["2"]);
    expect(r.naoEncontrados).toEqual(["3"]);
  });

  it("lista vazia devolve tudo vazio", async () => {
    const r = await buscarAlunos("http://api", [], fetchFalso({}));
    expect(r).toEqual({ encontrados: [], naoEncontrados: [], falhas: [] });
  });

  it("monta a URL a partir da baseUrl", async () => {
    const urls: string[] = [];
    const espiao = (async (url: string | URL | Request) => {
      urls.push(String(url));
      return { ok: true, status: 200, json: async () => ana } as Response;
    }) as FuncaoBuscar;
    await buscarAlunos("http://api.exemplo", ["1"], espiao);
    expect(urls).toEqual(["http://api.exemplo/alunos/1"]);
  });
});
