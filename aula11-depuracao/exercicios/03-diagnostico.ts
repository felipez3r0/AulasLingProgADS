// EXERCICIO 3 - nivel 🤖 COM AGENTE
//
// Escreva a especificacao em 03-diagnostico.spec.md ANTES de chamar o agente.
// Depois: git diff, e revise linha a linha.
//
// A tarefa aqui e ferramenta de diagnostico: transformar um erro cru
// num relatorio que a proxima pessoa (ou a IA) consiga usar.
//
// Rode: npm run ex -- 03-diagnostico

export interface RelatorioDeErro {
  mensagem: string;
  tipo: string;
  cadeiaDeCausas: string[];
  arquivoDeOrigem: string | null;
  linhaDeOrigem: number | null;
  ehErroDeSistema: boolean;
}

/**
 * Transforma um erro capturado num relatorio estruturado.
 *
 * Especificacao:
 *   - `mensagem`: a mensagem do erro; para valor lancado que NAO seja Error
 *     (ex: `throw "texto"`), use a representacao em texto do valor
 *   - `tipo`: o nome do construtor ("Error", "TypeError", "RangeError");
 *     para valor que nao e Error, use "NaoEhErro"
 *   - `cadeiaDeCausas`: as mensagens dos erros em `cause`, do mais externo
 *     para o mais interno, SEM incluir a mensagem do erro de topo;
 *     lista vazia quando nao ha causa
 *   - `arquivoDeOrigem` e `linhaDeOrigem`: extraidos da PRIMEIRA linha do
 *     stack que contenha "at "; o formato esperado e "arquivo:linha:coluna"
 *     ao final da linha; quando nao der para extrair, use null
 *   - `ehErroDeSistema`: true quando o erro tem a propriedade `code`
 *     comecando com "E" (ENOENT, EACCES, ...)
 *   - a funcao NUNCA lanca: qualquer entrada produz um relatorio
 *   - cadeia circular de causas nao pode gerar laco infinito:
 *     pare ao reencontrar um erro ja visitado
 */
export function diagnosticar(_erro: unknown): RelatorioDeErro {
  throw new Error("TODO: especifique para o agente e revise o que ele escrever");
}
