// Estruturas: objetos, interfaces e type aliases.
// E o "struct" da ementa, com verificacao em tempo de compilacao.

/** interface: o formato de um objeto. */
export interface Aluno {
  ra: string;
  nome: string;
  curso: string;
  ativo: boolean;
}

/** Propriedade opcional (?) e somente leitura (readonly). */
export interface Matricula {
  readonly id: string; // nao pode ser reatribuida depois de criada
  alunoRa: string;
  disciplina: string;
  nota?: number; // pode nao existir ainda
}

/** type alias: mesma ideia; use type quando precisar de uniao ou composicao. */
export type Coordenada = { x: number; y: number };

/** Estruturas aninhadas. */
export interface Turma {
  codigo: string;
  professor: { nome: string; email: string };
  alunos: Aluno[];
}

export function criarAluno(ra: string, nome: string): Aluno {
  return { ra, nome, curso: "ADS", ativo: true };
}

/** Destructuring: extrai campos para variaveis. */
export function descrever({ nome, curso }: Aluno): string {
  return `${nome} (${curso})`;
}

/** Spread para "atualizar" sem mutar - a licao da aula 07 aplicada a objetos. */
export function desativar(aluno: Aluno): Aluno {
  return { ...aluno, ativo: false };
}

/** Nota opcional exige tratamento explicito. */
export function notaOuZero(matricula: Matricula): number {
  return matricula.nota ?? 0;
}
