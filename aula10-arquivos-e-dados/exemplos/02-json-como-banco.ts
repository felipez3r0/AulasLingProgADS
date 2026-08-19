// JSON como banco de dados: o padrao "repositorio".
//
// Toda a persistencia do projeto final vai sair daqui.

import { readFile, writeFile, mkdir, rename } from "node:fs/promises";
import { dirname } from "node:path";

export interface Aluno {
  id: string;
  nome: string;
  ra: string;
}

/**
 * Le a colecao. Arquivo inexistente devolve lista vazia - nao e erro,
 * e o estado inicial de um banco que ainda nao recebeu nada.
 */
export async function lerColecao(caminho: string): Promise<Aluno[]> {
  try {
    const bruto = await readFile(caminho, "utf8");
    const dados: unknown = JSON.parse(bruto);
    if (!Array.isArray(dados)) throw new Error("formato invalido: esperava uma lista");
    return dados as Aluno[];
  } catch (erro) {
    if (erro instanceof Error && "code" in erro && erro.code === "ENOENT") return [];
    throw erro;
  }
}

/**
 * Escrita ATOMICA: grava num arquivo temporario e so entao renomeia.
 *
 * Sem isso, uma queda no meio da escrita deixa o JSON pela metade -
 * e o arquivo inteiro, com todos os registros, vira lixo ilegivel.
 * `rename` no mesmo disco e atomico: ou aconteceu, ou nao aconteceu.
 */
export async function salvarColecao(caminho: string, alunos: Aluno[]): Promise<void> {
  await mkdir(dirname(caminho), { recursive: true });
  const temporario = `${caminho}.tmp`;
  await writeFile(temporario, JSON.stringify(alunos, null, 2), "utf8");
  await rename(temporario, caminho);
}

export async function inserir(caminho: string, aluno: Aluno): Promise<Aluno> {
  const alunos = await lerColecao(caminho);
  if (alunos.some((a) => a.ra === aluno.ra)) {
    throw new Error(`RA duplicado: ${aluno.ra}`);
  }
  await salvarColecao(caminho, [...alunos, aluno]);
  return aluno;
}

export async function buscarPorId(caminho: string, id: string): Promise<Aluno | null> {
  const alunos = await lerColecao(caminho);
  return alunos.find((a) => a.id === id) ?? null;
}

export async function remover(caminho: string, id: string): Promise<boolean> {
  const alunos = await lerColecao(caminho);
  const restantes = alunos.filter((a) => a.id !== id);
  if (restantes.length === alunos.length) return false;
  await salvarColecao(caminho, restantes);
  return true;
}
