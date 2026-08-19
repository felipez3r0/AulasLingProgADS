// Referencia vs valor: o que sobrou da ideia de ponteiro em TypeScript.
//
// Primitivos (number, string, boolean) sao COPIADOS na atribuicao.
// Arrays e objetos NAO: a nova variavel aponta para o mesmo dado.

/** Primitivo: a copia e independente. */
export function primitivoECopiado(): { a: number; b: number } {
  let a = 10;
  let b = a; // copia o valor
  b = 20;
  return { a, b }; // a continua 10
}

/** Array: as duas variaveis apontam para o MESMO array. */
export function arrayEReferencia(): { original: number[]; alias: number[]; iguais: boolean } {
  const original = [1, 2, 3];
  const alias = original; // NAO copia - aponta para o mesmo array
  alias.push(4);
  return { original, alias, iguais: original === alias };
}

/** Copiar de verdade: spread cria um array novo. */
export function copiaComSpread(): { original: number[]; copia: number[]; iguais: boolean } {
  const original = [1, 2, 3];
  const copia = [...original];
  copia.push(4);
  return { original, copia, iguais: original === copia };
}

/** Passar array para funcao passa a REFERENCIA: a funcao pode alterar o do chamador. */
export function funcaoQueMuta(numeros: number[]): void {
  numeros.push(999);
}

/** A versao que nao muta: copia antes de mexer. */
export function funcaoQueNaoMuta(numeros: number[]): number[] {
  return [...numeros, 999];
}

/** `===` entre objetos compara IDENTIDADE, nao conteudo. */
export function identidadeVsConteudo(): { mesmaIdentidade: boolean; mesmoConteudo: boolean } {
  const a = [1, 2];
  const b = [1, 2];
  return {
    mesmaIdentidade: a === b, // false: sao dois arrays diferentes
    mesmoConteudo: JSON.stringify(a) === JSON.stringify(b), // true
  };
}

/** Copia RASA: o nivel de cima e novo, o de dentro continua compartilhado. */
export function copiaRasaNaoBastaParaAninhado(): {
  originalMudou: boolean;
} {
  const original = [{ nome: "Ana", notas: [8, 9] }];
  const copia = [...original]; // copia rasa
  copia[0]!.notas.push(10); // mexe no objeto interno, que e compartilhado
  return { originalMudou: original[0]!.notas.length === 3 };
}
