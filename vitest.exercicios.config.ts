import { defineConfig } from "vitest/config";

// Suite de EXERCICIOS.
//
// Roda somente os arquivos `.test.ts` dentro de `exercicios/`.
// Estes testes COMECAM VERMELHOS de proposito: eles sao o enunciado do
// exercicio em forma executavel. Deixa-los verdes e a sua tarefa.
//
// Uso:
//   npm run ex -- aula05      -> exercicios da aula 05, em modo watch
//   npm run ex -- aula05/01   -> so o exercicio 1 da aula 05
export default defineConfig({
  test: {
    include: ["aula*/exercicios/**/*.test.ts"],
    environment: "node",
    passWithNoTests: true,
    // Fuso fixo: o curso e brasileiro e varias aulas dependem de data.
    // Sem isto, um teste passaria na maquina do aluno (UTC-3) e falharia
    // no CI (UTC) - exatamente o tipo de bug que a aula 09 ensina a achar.
    env: { TZ: "America/Sao_Paulo" },
  },
});
