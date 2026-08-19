// Codigo gerado por IA a partir do pedido:
//
//   "adiciona validacao e tratamento de erros na minha API"
//
// Leia antes de rodar. A API valida. E vaza informacao.

import express, { type Express, type Request, type Response, type NextFunction } from "express";

export interface Usuario {
  id: string;
  email: string;
  senhaHash: string;
  cpf: string;
  admin: boolean;
}

export function criarApp(iniciais: Usuario[] = []): Express {
  const app = express();
  const usuarios = [...iniciais];
  app.use(express.json());

  // Devolve o objeto inteiro, incluindo hash de senha e CPF.
  app.get("/usuarios/:id", (req: Request, res: Response, proximo: NextFunction) => {
    try {
      const usuario = usuarios.find((u) => u.id === req.params.id);
      if (!usuario) throw new Error("usuario nao encontrado");
      res.json(usuario);
    } catch (erro) {
      proximo(erro);
    }
  });

  // Aceita qualquer campo do corpo, inclusive `admin`.
  app.post("/usuarios", (req: Request, res: Response) => {
    const corpo = req.body as Record<string, unknown>;
    if (typeof corpo["email"] !== "string") {
      return res.status(400).json({ erro: "email obrigatorio" });
    }
    const usuario = {
      id: String(usuarios.length + 1),
      senhaHash: "",
      cpf: "",
      admin: false,
      ...corpo, // sobrescreve TUDO acima, inclusive admin e id
    } as Usuario;
    usuarios.push(usuario);
    return res.status(201).json(usuario);
  });

  // Middleware de erro que devolve a mensagem interna ao cliente.
  app.use((erro: unknown, _req: Request, res: Response, _proximo: NextFunction) => {
    const e = erro as Error;
    res.status(500).json({
      erro: e.message,
      stack: e.stack, // caminho de arquivos do servidor, para qualquer um ver
    });
  });

  return app;
}
