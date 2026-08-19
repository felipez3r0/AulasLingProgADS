import { describe, it, expect } from "vitest";
import { aplicarEvento } from "./03-maquina-de-estados.js";
import type { Pedido } from "./01-estados-impossiveis.js";

const pendente = { id: "1", status: "pendente" } as unknown as Pedido;
const pago = { id: "1", status: "pago", dataPagamento: "2026-03-01" } as unknown as Pedido;
const enviado = {
  id: "1",
  status: "enviado",
  dataPagamento: "2026-03-01",
  codigoRastreio: "BR1",
} as unknown as Pedido;
const cancelado = { id: "1", status: "cancelado", motivo: "x" } as unknown as Pedido;

describe("aplicarEvento - transicoes validas", () => {
  it("pendente + pagar vira pago", () => {
    const r = aplicarEvento(pendente, { tipo: "pagar", data: "2026-03-01" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.pedido.status).toBe("pago");
      expect(r.pedido).toMatchObject({ dataPagamento: "2026-03-01" });
    }
  });

  it("pago + enviar vira enviado", () => {
    const r = aplicarEvento(pago, { tipo: "enviar", codigoRastreio: "BR9" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.pedido.status).toBe("enviado");
      expect(r.pedido).toMatchObject({ codigoRastreio: "BR9" });
    }
  });

  it("ao enviar, preserva a dataPagamento", () => {
    const r = aplicarEvento(pago, { tipo: "enviar", codigoRastreio: "BR9" });
    if (r.ok) expect(r.pedido).toMatchObject({ dataPagamento: "2026-03-01" });
  });

  it("pendente + cancelar vira cancelado", () => {
    const r = aplicarEvento(pendente, { tipo: "cancelar", motivo: "desistiu" });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.pedido).toMatchObject({ status: "cancelado", motivo: "desistiu" });
  });

  it("pago + cancelar vira cancelado", () => {
    const r = aplicarEvento(pago, { tipo: "cancelar", motivo: "sem estoque" });
    expect(r.ok).toBe(true);
  });
});

describe("aplicarEvento - transicoes invalidas", () => {
  it("pendente + enviar e recusado", () => {
    const r = aplicarEvento(pendente, { tipo: "enviar", codigoRastreio: "BR1" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.erro).toBe("transicao invalida: pendente + enviar");
  });

  it("pago + pagar e recusado", () => {
    const r = aplicarEvento(pago, { tipo: "pagar", data: "2026-04-01" });
    expect(r.ok).toBe(false);
  });

  it("enviado nao aceita mais nada", () => {
    for (const e of [
      { tipo: "pagar", data: "x" },
      { tipo: "enviar", codigoRastreio: "y" },
      { tipo: "cancelar", motivo: "z" },
    ] as const) {
      expect(aplicarEvento(enviado, e).ok).toBe(false);
    }
  });

  it("cancelado nao aceita mais nada", () => {
    for (const e of [
      { tipo: "pagar", data: "x" },
      { tipo: "enviar", codigoRastreio: "y" },
      { tipo: "cancelar", motivo: "z" },
    ] as const) {
      expect(aplicarEvento(cancelado, e).ok).toBe(false);
    }
  });
});

describe("aplicarEvento - garantias", () => {
  it("nunca lanca excecao", () => {
    expect(() => aplicarEvento(enviado, { tipo: "pagar", data: "x" })).not.toThrow();
  });

  it("nao modifica o pedido recebido", () => {
    const p = { id: "1", status: "pendente" } as unknown as Pedido;
    aplicarEvento(p, { tipo: "pagar", data: "2026-03-01" });
    expect(p).toEqual({ id: "1", status: "pendente" });
  });

  it("preserva o id", () => {
    const r = aplicarEvento(pendente, { tipo: "pagar", data: "2026-03-01" });
    if (r.ok) expect(r.pedido.id).toBe("1");
  });
});
