// Reexporta a app para o teste, e mostra como o servidor seria iniciado.

import { criarApp, type Aluno } from "./api/app.js";

export { criarApp };
export type { Aluno };

export const alunosDeExemplo: Aluno[] = [
  { id: "1", nome: "Ana Silva", ra: "111", curso: "ADS" },
  { id: "2", nome: "Bruno Costa", ra: "222", curso: "Mecatronica" },
];

/**
 * Em producao voce chamaria isto num arquivo separado (server.ts):
 *
 *   criarApp(alunosDeExemplo).listen(3000, () => {
 *     console.log("http://localhost:3000");
 *   });
 *
 * Repare que `criarApp` NAO abre porta. Essa e a razao de o teste
 * conseguir exercitar a API inteira sem subir servidor.
 */
export function descreverInicializacao(porta: number): string {
  return `servidor escutaria em http://localhost:${porta}`;
}
