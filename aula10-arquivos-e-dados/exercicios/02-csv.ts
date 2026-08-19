// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Metodo: contrato primeiro, sugestao depois.
//
// Atencao: o Copilot vai sugerir `linha.split(",")` sem pensar duas vezes.
// Isso quebra em campo com virgula entre aspas - que e o caso mais comum
// de CSV vindo de planilha. Leia a especificacao antes de aceitar.
//
// Rode: npm run ex -- 02-csv

export interface LinhaAluno {
  nome: string;
  ra: string;
  nota: number;
}

/**
 * Converte o conteudo de um CSV em registros.
 *
 * Especificacao:
 *   - a primeira linha e o cabecalho: nome,ra,nota
 *   - campos podem vir entre aspas duplas; nesse caso, virgulas dentro
 *     das aspas NAO separam campos
 *   - aspas duplas dentro de campo entre aspas vem duplicadas ("")
 *   - linhas em branco sao ignoradas
 *   - `nota` e convertida para number; se nao for numero valido,
 *     lanca Error("nota invalida na linha <n>") - n contando a partir de 1
 *     e ignorando o cabecalho
 *   - quantidade de colunas diferente de 3 lanca Error("colunas invalidas na linha <n>")
 *   - conteudo vazio ou so cabecalho devolve lista vazia
 *   - aceita quebra de linha \n e \r\n
 */
export function analisarCsv(_conteudo: string): LinhaAluno[] {
  throw new Error("TODO: implemente analisarCsv");
}

/**
 * Converte registros de volta para CSV.
 *
 * Especificacao:
 *   - primeira linha e o cabecalho nome,ra,nota
 *   - campos que contenham virgula ou aspas saem entre aspas, com as
 *     aspas internas duplicadas
 *   - separador de linha e \n; ha quebra de linha ao final
 *   - lista vazia devolve so o cabecalho, com quebra de linha
 */
export function gerarCsv(_linhas: LinhaAluno[]): string {
  throw new Error("TODO: implemente gerarCsv");
}
