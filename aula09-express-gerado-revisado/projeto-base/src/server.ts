// GET /alunos já está implementado — é o exemplo do fluxo desta aula:
// o contrato (types.ts + test/server.test.ts) veio primeiro, a rota foi
// gerada a partir dele, e o resultado foi revisado antes de aceitar.
//
// POST, GET /:id, PUT e DELETE estão de propósito NÃO registrados. É a
// sua vez: complete os testes marcados it.todo em test/server.test.ts a
// partir do contrato em recursos/template-contrato-api.md, peça a um
// agente de IA para implementar as rotas correspondentes aqui, e revise
// o que ele gerar antes de aceitar (nomes de campos, códigos de status,
// formato do corpo de erro).

import express, { Express } from "express";
import { Aluno } from "./types.js";

export function createApp(): Express {
  const app = express();
  app.use(express.json());

  const alunos: Aluno[] = [
    { id: 1, nome: "Ana", email: "ana@exemplo.com", curso: "ADS" },
  ];

  app.get("/alunos", (req, res) => {
    res.json(alunos);
  });

  // TODO: GET /alunos/:id -> 200 com o aluno, ou 404 com { erro: "..." }
  // TODO: POST /alunos -> valida nome/email obrigatórios, 201 com o aluno criado, ou 400
  // TODO: PUT /alunos/:id -> atualiza, 200 com o aluno, ou 404
  // TODO: DELETE /alunos/:id -> 204, ou 404

  return app;
}
