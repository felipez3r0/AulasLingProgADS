// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// Aqui voce NAO escreve do zero: as funcoes ja existem e tem bug.
// Sua tarefa e DIAGNOSTICAR e corrigir.
//
// Metodo obrigatorio (e o metodo da aula):
//   1. Rode o teste e leia a falha. Qual entrada quebra?
//   2. Reduza: qual e a MENOR entrada que reproduz?
//   3. Escreva sua hipotese no bloco abaixo, ANTES de chamar a IA.
//   4. So entao use a IA - passando a reproducao minima, nao o arquivo inteiro.
//   5. Corrija e confirme.
//
// SUAS HIPOTESES (preencha antes de chamar a IA):
//
//   BUG 1 - calcularSaldo
//     Entrada minima que quebra:
//     Esperado:
//     Obtido:
//     Causa provavel:
//
//   BUG 2 - maioresTransacoes
//     Entrada minima que quebra:
//     Esperado:
//     Obtido:
//     Causa provavel:
//
//   BUG 3 - extratoAcumulado
//     Entrada minima que quebra:
//     Esperado:
//     Obtido:
//     Causa provavel:
//
// Rode: npm run ex -- 02-caca-ao-bug

export interface Transacao {
  id: string;
  tipo: "credito" | "debito";
  valor: number;
}

/**
 * Calcula o saldo final.
 *
 * Especificacao:
 *   - credito soma, debito subtrai, partindo de `saldoInicial`
 *   - valor negativo lanca Error("valor invalido")
 *   - valor que NAO seja um numero finito (NaN, Infinity) tambem lanca
 *     Error("valor invalido")
 *   - o resultado e arredondado para 2 casas decimais
 *   - lista vazia devolve o saldo inicial
 *
 * TEM UM BUG.
 */
export function calcularSaldo(transacoes: Transacao[], saldoInicial: number): number {
  let saldo = saldoInicial;
  for (const t of transacoes) {
    if (t.valor < 0) throw new Error("valor invalido");
    saldo += t.tipo === "credito" ? t.valor : -t.valor;
  }
  return Math.round(saldo * 100) / 100;
}

/**
 * Devolve as maiores transacoes, da maior para a menor.
 *
 * Especificacao:
 *   - no maximo `quantidade` transacoes
 *   - ordenadas por valor decrescente
 *   - empate no valor e desempatado pelo id, em ordem crescente
 *   - NAO modifica a lista recebida
 *
 * TEM UM BUG (com dois sintomas).
 */
export function maioresTransacoes(transacoes: Transacao[], quantidade: number): Transacao[] {
  return transacoes.sort((a, b) => b.valor - a.valor).slice(0, quantidade);
}

/**
 * Devolve o extrato com o saldo ACUMULADO apos cada transacao.
 *
 * Especificacao:
 *   - uma linha por transacao, na ordem recebida
 *   - `saldo` e o saldo depois de aplicar aquela transacao e todas as anteriores
 *   - cada saldo arredondado para 2 casas decimais
 *   - lista vazia devolve lista vazia
 *
 * TEM UM BUG.
 */
export function extratoAcumulado(
  transacoes: Transacao[],
  saldoInicial: number,
): { id: string; saldo: number }[] {
  return transacoes.map((t) => {
    const delta = t.tipo === "credito" ? t.valor : -t.valor;
    return { id: t.id, saldo: Math.round((saldoInicial + delta) * 100) / 100 };
  });
}
