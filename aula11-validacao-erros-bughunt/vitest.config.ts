import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["referencia/test/**/*.test.ts", "bugs/*/test/**/*.test.ts"],
  },
});
