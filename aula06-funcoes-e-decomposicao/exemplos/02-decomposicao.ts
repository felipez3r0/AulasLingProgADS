// Decomposicao: quebrar um problema em funcoes pequenas e testaveis.
//
// A mesma tarefa, duas vezes. A primeira e um bloco unico; a segunda
// e decomposta. Nao e questao de gosto: so a segunda permite descobrir
// QUAL parte esta errada quando o resultado sai errado.

export interface Aluno {
  nome: string;
  notas: number[];
  faltas: number;
  aulasTotais: number;
}

/** Versao monolitica: se o resultado sair errado, onde esta o defeito? */
export function avaliarMonolitico(aluno: Aluno): string {
  let soma = 0;
  for (const nota of aluno.notas) soma += nota;
  const media = aluno.notas.length === 0 ? 0 : soma / aluno.notas.length;
  const presenca =
    aluno.aulasTotais === 0 ? 0 : (aluno.aulasTotais - aluno.faltas) / aluno.aulasTotais;
  if (presenca < 0.75) return "reprovado por falta";
  if (media >= 6) return "aprovado";
  if (media >= 4) return "recuperacao";
  return "reprovado por nota";
}

// --- A mesma coisa, decomposta -------------------------------------------

/** Cada peca tem uma responsabilidade e pode ser testada sozinha. */
export function calcularMedia(notas: number[]): number {
  if (notas.length === 0) return 0;
  const soma = notas.reduce((total, nota) => total + nota, 0);
  return soma / notas.length;
}

export function calcularPresenca(faltas: number, aulasTotais: number): number {
  if (aulasTotais === 0) return 0;
  return (aulasTotais - faltas) / aulasTotais;
}

export function classificarPorNota(media: number): string {
  if (media >= 6) return "aprovado";
  if (media >= 4) return "recuperacao";
  return "reprovado por nota";
}

/** A funcao de cima vira a composicao das pecas - e fica legivel. */
export function avaliar(aluno: Aluno): string {
  const presenca = calcularPresenca(aluno.faltas, aluno.aulasTotais);
  if (presenca < 0.75) return "reprovado por falta";
  return classificarPorNota(calcularMedia(aluno.notas));
}
