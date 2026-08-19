import { defineConfig } from "vitest/config";

// Suite de EXEMPLOS.
//
// Roda somente os arquivos `.spec.ts` dentro de `exemplos/`.
// Estes testes SEMPRE passam: eles provam que o codigo demonstrado na aula
// funciona como o texto afirma. E esta a suite que o CI valida.
//
// Uso:
//   npm test              -> todos os exemplos do curso
//   npm test -- aula05    -> so os exemplos da aula 05
export default defineConfig({
  test: {
    include: ["aula*/exemplos/**/*.spec.ts"],
    environment: "node",
    passWithNoTests: false,
    // Fuso fixo: o curso e brasileiro e varias aulas dependem de data.
    // Sem isto, um teste passaria na maquina do aluno (UTC-3) e falharia
    // no CI (UTC) - exatamente o tipo de bug que a aula 09 ensina a achar.
    env: { TZ: "America/Sao_Paulo" },
  },
});
