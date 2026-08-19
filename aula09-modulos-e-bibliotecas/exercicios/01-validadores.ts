// EXERCICIO 1 - nivel 🚫 SEM IA
//
// Desligue as sugestoes: Ctrl+Shift+P > "GitHub Copilot: Disable Completions"
//
// Corrija os dois defeitos da leitura critica, SEM instalar nenhuma
// biblioteca. Tudo aqui se resolve com a biblioteca padrao.
//
// Rode: npm run ex -- 01-validadores

/**
 * Valida um CPF.
 *
 * Especificacao:
 *   - aceita com ou sem pontuacao ("529.982.247-25" ou "52998224725")
 *   - precisa ter 11 digitos apos remover a pontuacao
 *   - RECUSA sequencias de digitos todos iguais (111.111.111-11, etc.)
 *   - valida os dois digitos verificadores
 *   - entrada vazia devolve false, sem lancar erro
 */
export function validarCPF(_cpf: string): boolean {
  throw new Error("TODO: implemente validarCPF");
}

/**
 * Formata uma data ISO (aaaa-mm-dd) para o formato brasileiro (dd/mm/aaaa).
 *
 * Especificacao:
 *   - o resultado NAO pode depender do fuso horario da maquina
 *     (dica: nao use `new Date(texto)`; trabalhe com a propria string)
 *   - formato de entrada invalido lanca Error("data invalida")
 *   - mes ou dia fora da faixa lanca Error("data invalida")
 *   - preserva zeros a esquerda: "2026-03-05" vira "05/03/2026"
 */
export function formatarData(_iso: string): string {
  throw new Error("TODO: implemente formatarData");
}
