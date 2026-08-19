// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-importador.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// ATENCAO: este exercicio mexe em ARQUIVOS DE VERDADE. Um agente com
// permissao de escrita pode apagar coisa que voce nao queria.
// Commite antes de solta-lo.
//
// Rode: npm run ex -- 03-importador

export interface RegistroImportado {
  nome: string;
  ra: string;
  nota: number;
}

export interface ResultadoImportacao {
  importados: number;
  ignorados: number;
  problemas: string[];
  arquivoGerado: string;
}

/**
 * Importa todos os arquivos .csv de uma pasta e consolida num JSON.
 *
 * Especificacao:
 *   - le todos os arquivos com extensao .csv da `pastaEntrada`,
 *     em ordem alfabetica de nome
 *   - cada CSV tem cabecalho nome,ra,nota (separador simples por virgula;
 *     nao precisa tratar aspas neste exercicio)
 *   - linhas com nota nao numerica sao IGNORADAS, e cada uma acrescenta
 *     "<arquivo>:<numeroDaLinha> nota invalida" a `problemas`
 *   - linhas com numero de colunas diferente de 3 sao IGNORADAS, com
 *     "<arquivo>:<numeroDaLinha> colunas invalidas"
 *   - RA repetido (em qualquer arquivo) e IGNORADO, com
 *     "<arquivo>:<numeroDaLinha> RA duplicado" - vale o primeiro que aparecer
 *   - o resultado consolidado e gravado em `caminhoSaida`, como JSON
 *     com indentacao de 2 espacos, ordenado por RA crescente
 *   - a escrita deve ser atomica (temporario + rename)
 *   - `importados` conta as linhas aceitas; `ignorados`, as recusadas
 *   - `arquivoGerado` e o `caminhoSaida` recebido
 *   - pasta sem nenhum .csv gera um JSON com lista vazia
 *   - pasta inexistente REJEITA com Error("pasta nao encontrada")
 *   - a numeracao de linha comeca em 1 e ignora o cabecalho
 */
export async function importarPasta(
  _pastaEntrada: string,
  _caminhoSaida: string,
): Promise<ResultadoImportacao> {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
