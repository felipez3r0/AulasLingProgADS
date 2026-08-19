// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-planilha-notas.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// Rode: npm run ex -- 03-planilha-notas

/** Uma linha de planilha exportada em CSV: todo campo chega como texto. */
export interface LinhaPlanilha {
  aluno: string;
  nota1: string;
  nota2: string;
  peso1: string;
  peso2: string;
}

export interface NotaFinal {
  aluno: string;
  media: number;
  situacao: "aprovado" | "recuperacao" | "reprovado";
}

/**
 * Calcula a media ponderada de cada aluno a partir de dados de planilha.
 *
 * Especificacao:
 *   - todos os campos numericos chegam como texto e precisam ser convertidos
 *   - media = (nota1*peso1 + nota2*peso2) / (peso1 + peso2)
 *   - a media e arredondada para 1 casa decimal
 *   - situacao: media >= 6 "aprovado"; >= 4 "recuperacao"; abaixo "reprovado"
 *   - campo nao numerico lanca Error("dado invalido no aluno <nome>")
 *   - soma dos pesos igual a zero lanca Error("peso total zero no aluno <nome>")
 *   - nota fora de 0..10 lanca Error("nota fora da faixa no aluno <nome>")
 *   - planilha vazia devolve lista vazia
 *   - a funcao NAO pode modificar o array recebido
 *   - a ordem da saida e a mesma da entrada
 */
export function processarPlanilha(_linhas: LinhaPlanilha[]): NotaFinal[] {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
