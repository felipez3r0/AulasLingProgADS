// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Voce vai construir a ferramenta que revisa o trabalho do agente:
// um analisador de diff que levanta as bandeiras vermelhas do
// checklist de revisao do curso.
//
// Metodo: contrato primeiro, sugestao depois. Aqui o Copilot ajuda
// bastante nas expressoes regulares - e e onde ele mais erra tambem.
// Teste cada padrao antes de aceitar.
//
// Rode: npm run ex -- 02-alertas-de-diff

export type Gravidade = "alta" | "media";

export interface Alerta {
  gravidade: Gravidade;
  regra: string;
  arquivo: string;
}

/**
 * Analisa um diff unificado e levanta alertas de revisao.
 *
 * Formato do diff (simplificado):
 *   linhas "+++ b/caminho/do/arquivo.ts" indicam o arquivo atual
 *   linhas iniciadas por "+" sao adicoes
 *   linhas iniciadas por "-" sao remocoes
 *
 * Regras, NESTA ORDEM de deteccao por arquivo:
 *
 *   gravidade "alta":
 *     - "teste alterado": o caminho termina em ".test.ts" ou ".spec.ts"
 *       e ha ao menos uma linha adicionada OU removida nele
 *     - "possivel segredo": alguma linha ADICIONADA contem uma atribuicao
 *       a chave que contenha "senha", "password", "token", "secret" ou
 *       "apikey" (sem diferenciar maiusculas), com um valor entre aspas
 *       de 8 ou mais caracteres
 *
 *   gravidade "media":
 *     - "dependencia nova": o arquivo e "package.json" e ha linha
 *       adicionada dentro de aspas seguida de dois pontos e uma versao
 *       (ex: `+    "lodash": "^4.17.21"`)
 *     - "erro engolido": alguma linha adicionada contem "catch" seguido
 *       de bloco vazio ou so com comentario
 *
 * Regras gerais:
 *   - cada regra aparece no maximo UMA vez por arquivo
 *   - os alertas vem ordenados: todos os de gravidade alta primeiro, e
 *     dentro da mesma gravidade, na ordem em que os arquivos aparecem no diff
 *   - diff vazio devolve lista vazia
 *   - diff sem nenhuma bandeira devolve lista vazia
 */
export function analisarDiff(_diff: string): Alerta[] {
  throw new Error("TODO: implemente analisarDiff");
}
