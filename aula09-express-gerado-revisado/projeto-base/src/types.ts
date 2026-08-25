// Tipos do contrato (herdados de aula08 — recursos/template-contrato-api.md).
// Este é o "combinado" que qualquer implementação gerada precisa satisfazer.

export interface Aluno {
  id: number;
  nome: string;
  email: string;
  curso: string;
}

export type NovoAluno = Omit<Aluno, "id">;

export interface ErroApi {
  erro: string;
}
