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
  },
});
