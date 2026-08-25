# Guia para revisão dos materiais (uso interno)

Instruções para quem for reescrever ou manter as pastas de aula deste repositório. É a convenção de autoria do material, não conteúdo para o aluno.

---

## Estrutura de cada `aulaNN-*/README.md`

1. Objetivos da aula (o que o aluno vai saber **fazer**, não *saber*)
2. Modo de IA da aula (Sem IA / Tutor / Par) declarado no topo
3. Leitura prévia (para aulas de sala invertida — Bloco 1)
4. Conteúdo — curto; o que o aluno já viu em C recebe só o mapeamento C → TS, não reexplicação
5. Atividades em sala — sempre com pelo menos uma de **leitura/previsão** ou **verificação**, não só de escrita
6. Exercícios para casa, com modo de IA indicado por exercício
7. Critério de entrega (o que deve estar no commit)

---

## Convenções de tooling

- **Test runner/framework:** [Vitest](https://vitest.dev) em todo `projeto-base/` que precisa de testes rodáveis. Script padrão `"test": "vitest run"` (execução única, sem watch). Ver `recursos/template-scaffolding/` para o modelo validado.
- **Estrutura de scaffolding padrão** (aulas 06, 09, 10, 11 e 13-14; a 11 usa o formato próprio descrito abaixo):

  ```
  aulaNN-tema/
    README.md                 # conteúdo pedagógico
    projeto-base/
      package.json
      tsconfig.json
      .gitignore
      src/                     # esqueleto tipado / contrato já pronto
      test/                    # testes em Vitest
      README.md                # como rodar
  ```

  Cada `projeto-base/` é autocontido (própria instalação, próprio `npm test`) — não há `package.json`/`vitest.config.ts` compartilhado na raiz do repositório, para que uma pasta de aula funcione isolada se copiada/zipada.
- **aula11-validacao-erros-bughunt** foge do padrão acima: usa `referencia/` (gabarito) + `bugs/01..04/{src,test}` em vez de um `projeto-base/` único.
- Ao adicionar dependências em qualquer `projeto-base/`, instale sem pin de versão e depois registre no `package.json` a versão resolvida com caret (ex.: `"vitest": "^4.1.11"`), commitando o `package-lock.json` junto. Foi assim que `recursos/template-scaffolding/` foi montado — evita `latest` solto sem congelar o material num patch específico.

## Sigilo de provas

`prova1/` e `prova2-defesas/` existem no repositório público só com a estrutura/formato. O banco de questões e os gabaritos reais nunca são commitados (cobertos por `.gitignore` local a cada pasta) — mantenha-os em local próprio (LMS, repositório privado do professor).

## Fallback de cota do Copilot (ou assistente equivalente)

As aulas 09, 10, 11 e 13-14 são as que mais dependem de geração de código via IA (modo "Par"). Se a cota do plano gratuito esgotar no meio do semestre:

- Degradar temporariamente essas atividades para o modo "Tutor" (o aluno escreve o código, só pergunta/pede explicação à IA);
- Ou indicar um assistente alternativo com cota disponível (ex.: outro provedor com free tier).

Registrar a decisão tomada na própria aula afetada, para não haver ambiguidade sobre o modo de IA vigente naquele encontro.
