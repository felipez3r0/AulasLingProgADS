import { describe, it, expect } from "vitest";
import {
  buscarCotacao,
  buscarVarias,
  buscarVariasTolerante,
  type FuncaoBuscar,
} from "./02-consumir-api.js";

/** Um `fetch` de mentira: devolve o que o teste mandar, sem tocar na rede. */
function fetchFalso(
  porMoeda: Record<string, { status: number; corpo: unknown }>,
): FuncaoBuscar {
  return (async (url: string | URL | Request) => {
    const moeda = String(url).split("/").pop() ?? "";
    const config = porMoeda[moeda] ?? { status: 404, corpo: {} };
    return {
      ok: config.status >= 200 && config.status < 300,
      status: config.status,
      json: async () => config.corpo,
    } as Response;
  }) as FuncaoBuscar;
}

describe("buscarCotacao", () => {
  it("devolve a cotacao", async () => {
    const buscar = fetchFalso({ USD: { status: 200, corpo: { valor: 5.4 } } });
    expect(await buscarCotacao("USD", buscar)).toEqual({ moeda: "USD", valor: 5.4 });
  });

  it("status 404 lanca - fetch sozinho NAO lancaria", async () => {
    const buscar = fetchFalso({});
    await expect(buscarCotacao("XXX", buscar)).rejects.toThrow("HTTP 404");
  });

  it("status 500 lanca", async () => {
    const buscar = fetchFalso({ USD: { status: 500, corpo: {} } });
    await expect(buscarCotacao("USD", buscar)).rejects.toThrow("HTTP 500");
  });

  it("resposta com formato inesperado lanca", async () => {
    const buscar = fetchFalso({ USD: { status: 200, corpo: { valor: "cinco" } } });
    await expect(buscarCotacao("USD", buscar)).rejects.toThrow("formato inesperado");
  });
});

describe("buscarVarias", () => {
  it("devolve todas em paralelo", async () => {
    const buscar = fetchFalso({
      USD: { status: 200, corpo: { valor: 5.4 } },
      EUR: { status: 200, corpo: { valor: 6.1 } },
    });
    expect(await buscarVarias(["USD", "EUR"], buscar)).toEqual([
      { moeda: "USD", valor: 5.4 },
      { moeda: "EUR", valor: 6.1 },
    ]);
  });

  it("uma falha derruba o conjunto inteiro", async () => {
    const buscar = fetchFalso({ USD: { status: 200, corpo: { valor: 5.4 } } });
    await expect(buscarVarias(["USD", "XXX"], buscar)).rejects.toThrow();
  });
});

describe("buscarVariasTolerante", () => {
  it("separa sucessos de falhas", async () => {
    const buscar = fetchFalso({ USD: { status: 200, corpo: { valor: 5.4 } } });
    const r = await buscarVariasTolerante(["USD", "XXX"], buscar);
    expect(r.sucessos).toEqual([{ moeda: "USD", valor: 5.4 }]);
    expect(r.falhas).toEqual(["XXX"]);
  });
});
