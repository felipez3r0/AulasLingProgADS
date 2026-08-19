import { describe, it, expect } from "vitest";
import {
  listarResumos,
  listarResumosComContexto,
  type Pedido,
} from "./01-ler-o-erro.js";

const bom: Pedido = { id: "P1", itens: [{ produto: "caderno", preco: 12 }] };
const vazio: Pedido = { id: "P2", itens: [] };

describe("caminho feliz", () => {
  it("resume os pedidos", () => {
    expect(listarResumos([bom])).toEqual(["P1: a partir de R$ 12"]);
  });
});

describe("o erro cru", () => {
  it("a mensagem nao diz QUAL pedido quebrou", () => {
    let mensagem = "";
    try {
      listarResumos([bom, vazio]);
    } catch (erro) {
      mensagem = (erro as Error).message;
    }
    // Algo como "Cannot read properties of undefined (reading 'preco')".
    expect(mensagem).toContain("preco");
    expect(mensagem).not.toContain("P2"); // o id nao aparece
  });

  it("mas o stack trace diz ONDE, de baixo para cima", () => {
    let pilha = "";
    try {
      listarResumos([vazio]);
    } catch (erro) {
      pilha = (erro as Error).stack ?? "";
    }
    // A funcao que quebrou aparece primeiro; quem chamou, depois.
    expect(pilha.indexOf("precoDoPrimeiroItem")).toBeLessThan(pilha.indexOf("resumirPedido"));
  });
});

describe("erro com contexto", () => {
  it("a mensagem passa a dizer qual pedido", () => {
    let mensagem = "";
    try {
      listarResumosComContexto([bom, vazio]);
    } catch (erro) {
      mensagem = (erro as Error).message;
    }
    expect(mensagem).toBe("falha ao resumir o pedido P2");
  });

  it("e a causa original continua disponivel", () => {
    try {
      listarResumosComContexto([vazio]);
    } catch (erro) {
      const causa = (erro as Error).cause;
      expect(causa).toBeInstanceOf(Error);
      expect((causa as Error).message).toContain("preco");
    }
  });
});
