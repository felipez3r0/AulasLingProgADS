// Implementação correta — gabarito do professor. Não mostrar ao aluno
// antes do bug hunt; serve de referência para corrigir bugs/01, 02 e 03
// (todos compartilham este mesmo "spec", testado em referencia/test/app.test.ts).

import express, { Express, NextFunction, Request, Response } from "express";
import { z } from "zod";

const ProdutoSchema = z.object({
  nome: z.string().min(2),
  preco: z.number().positive(),
});

interface Produto {
  id: number;
  nome: string;
  preco: number;
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

class NotFoundError extends ApiError {
  constructor(recurso: string) {
    super(404, `${recurso} não encontrado`);
  }
}

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  const produtos: Produto[] = [{ id: 1, nome: "Mouse", preco: 89.9 }];
  let proximoId = 2;

  app.get("/produtos", (req, res) => {
    res.json([...produtos]);
  });

  app.get("/produtos/:id", (req: Request, res: Response, next: NextFunction) => {
    const produto = produtos.find((p) => p.id === Number(req.params.id));
    if (!produto) {
      next(new NotFoundError("Produto"));
      return;
    }
    res.json(produto);
  });

  app.post("/produtos", (req: Request, res: Response) => {
    const resultado = ProdutoSchema.safeParse(req.body);
    if (!resultado.success) {
      res.status(400).json({ erro: "Dados inválidos", detalhes: resultado.error.issues });
      return;
    }
    const produto: Produto = { id: proximoId++, ...resultado.data };
    produtos.push(produto);
    res.status(201).json(produto);
  });

  // Middleware de erro: DEPOIS de todas as rotas, com 4 parâmetros.
  app.use((erro: Error, req: Request, res: Response, next: NextFunction) => {
    if (erro instanceof ApiError) {
      res.status(erro.statusCode).json({ erro: erro.message });
      return;
    }
    res.status(500).json({ erro: "Erro interno do servidor" });
  });

  return app;
}
