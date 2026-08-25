// listarTodos() já está implementada — é o exemplo do fluxo desta aula:
// pedimos a um agente para gerar a query, e revisamos (parâmetros? tipos
// batendo com a interface Aluno?) antes de aceitar.
//
// buscarPorId(), criar() e remover() estão de propósito NÃO
// implementadas. É a sua vez: complete os testes marcados it.todo em
// test/repository.test.ts, peça a implementação, e revise o SQL gerado
// especificamente quanto a: uso de parâmetros (?) em vez de concatenação
// de string (injeção de SQL), e tipos batendo com Aluno/NovoAluno.

import type { Client } from "@libsql/client";

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  curso: string;
}

export type NovoAluno = Omit<Aluno, "id">;

export async function listarTodos(db: Client): Promise<Aluno[]> {
  const resultado = await db.execute("SELECT id, nome, email, curso FROM alunos ORDER BY id");
  return resultado.rows as unknown as Aluno[];
}

export async function buscarPorId(db: Client, id: number): Promise<Aluno | null> {
  throw new Error("não implementado");
}

export async function criar(db: Client, dados: NovoAluno): Promise<Aluno> {
  throw new Error("não implementado");
}

export async function remover(db: Client, id: number): Promise<boolean> {
  throw new Error("não implementado");
}
