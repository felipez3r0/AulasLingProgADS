// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Voce especifica e revisa. O agente digita.
//
// ANTES de chamar o agente, escreva a especificacao em
// 03-boletim.spec.md (o arquivo ja esta la, com o esqueleto).
//
// DEPOIS que ele terminar, a parte que nao e delegavel:
//   git diff        <- leia linha a linha antes de commitar
//
// Rode: npm run ex -- aula01/03

export interface Aluno {
  nome: string;
  notas: number[];
}

export interface LinhaBoletim {
  nome: string;
  media: number;
  conceito: string;
  aprovado: boolean;
}

/**
 * Monta o boletim da turma.
 *
 * Para cada aluno, calcula a media das notas, converte em conceito
 * (mesmas faixas do exercicio 2) e marca como aprovado quem tiver media >= 5.
 *
 * Regras:
 *   - aluno sem notas tem media 0, conceito "D" e nao esta aprovado
 *   - a media e arredondada para 1 casa decimal
 *   - a funcao NAO pode modificar o array recebido nem os objetos dentro dele
 *   - o resultado vem ordenado por media, da maior para a menor
 */
export function montarBoletim(_alunos: Aluno[]): LinhaBoletim[] {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
