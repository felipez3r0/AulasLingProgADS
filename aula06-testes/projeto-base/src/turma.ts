// Domínio da aula: gerenciar a média e aprovação de uma turma.
//
// calcularMedia() já está implementada — é o exemplo completo do fluxo
// desta aula: o teste em test/turma.test.ts foi escrito primeiro, depois
// pedimos a um agente de IA para implementar só o suficiente para
// satisfazê-lo, e revisamos o resultado antes de aceitar.
//
// estaAprovado() e aprovados() estão de propósito NÃO implementadas —
// agora é sua vez: escreva os testes (troque os it.todo por it() reais
// em test/turma.test.ts), peça à IA para implementar, e julgue o
// resultado antes de aceitar.

export interface Aluno {
  nome: string;
  notas: number[];
}

export function calcularMedia(notas: number[]): number {
  if (notas.length === 0) return 0;
  return notas.reduce((soma, nota) => soma + nota, 0) / notas.length;
}

export function estaAprovado(media: number): boolean {
  throw new Error("não implementado");
}

export function aprovados(turma: Aluno[]): Aluno[] {
  throw new Error("não implementado");
}
