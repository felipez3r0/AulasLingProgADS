// Codigo gerado por IA a partir do pedido:
//
//   "cria uma API REST de produtos com Express"
//
// Leia antes de rodar. As rotas funcionam. Os STATUS estao errados -
// e status errado quebra o cliente, nao o servidor.

import express, { type Request, type Response } from "express";

export interface Produto {
  id: string;
  nome: string;
  preco: number;
}

export function criarApp(iniciais: Produto[] = []) {
  const app = express();
  const produtos: Produto[] = [...iniciais];
  app.use(express.json());

  // Devolve 200 mesmo quando nao encontra, com corpo nulo.
  app.get("/produtos/:id", (req: Request, res: Response) => {
    const produto = produtos.find((p) => p.id === req.params.id);
    return res.json(produto ?? null);
  });

  // Devolve 200 na criacao, e sem Location.
  app.post("/produtos", (req: Request, res: Response) => {
    const { nome, preco } = req.body as Partial<Produto>;
    const produto: Produto = {
      id: String(produtos.length + 1),
      nome: nome ?? "",
      preco: preco ?? 0,
    };
    produtos.push(produto);
    return res.json(produto);
  });

  // Devolve 500 para dado invalido - culpa o servidor por erro do cliente.
  app.put("/produtos/:id", (req: Request, res: Response) => {
    const produto = produtos.find((p) => p.id === req.params.id);
    if (!produto) return res.status(500).json({ erro: "produto nao encontrado" });
    const { preco } = req.body as Partial<Produto>;
    if (typeof preco !== "number") {
      return res.status(500).json({ erro: "preco invalido" });
    }
    produto.preco = preco;
    return res.json(produto);
  });

  return app;
}
