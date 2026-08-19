// Codigo gerado por IA a partir do pedido:
//
//   "salva o cadastro do aluno num arquivo JSON"
//
// Leia antes de rodar. O caminho feliz funciona.
// Ha tres problemas, e o terceiro so aparece quando ja e tarde.

import { readFileSync, writeFileSync, existsSync } from "node:fs";

export interface Aluno {
  id: string;
  nome: string;
}

const ARQUIVO = "dados/alunos.json"; // caminho fixo dentro da funcao

/**
 * Salva um aluno no arquivo.
 */
export function salvarAluno(aluno: Aluno): void {
  let alunos: Aluno[] = [];

  if (existsSync(ARQUIVO)) {
    try {
      alunos = JSON.parse(readFileSync(ARQUIVO, "utf8")) as Aluno[];
    } catch {
      // arquivo corrompido: comeca do zero
      alunos = [];
    }
  }

  alunos.push(aluno);
  writeFileSync(ARQUIVO, JSON.stringify(alunos));
}
