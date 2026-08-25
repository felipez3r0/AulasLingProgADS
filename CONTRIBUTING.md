# Guia para revisão dos materiais (uso interno)

Instruções para quem for reescrever ou manter as pastas de aula deste repositório. Não é conteúdo para o aluno — é a convenção de autoria do material.

---

## Estrutura de cada `aulaNN-*/README.md`

1. Objetivos da aula (o que o aluno vai saber **fazer**, não *saber*)
2. Modo de IA da aula (Sem IA / Tutor / Par) declarado no topo
3. Leitura prévia (para aulas de sala invertida — Bloco 1)
4. Conteúdo — curto; o que o aluno já viu em C recebe só o mapeamento C → TS, não reexplicação
5. Atividades em sala — sempre com pelo menos uma de **leitura/previsão** ou **verificação**, não só de escrita
6. Exercícios para casa, com modo de IA indicado por exercício
7. Critério de entrega (o que deve estar no commit)

## O que foi removido do material original (v1)

- Seções "Dica: usando IA" no rodapé de cada aula. O uso de IA passa a ser parte das atividades, não um apêndice.
- Reexplicações de conceitos vistos em C (variáveis, operadores, `if`, laços, funções) além do necessário para o mapeamento de sintaxe.
- As antigas aulas 12–14 de Express passo a passo. O conteúdo migrou para as aulas 08–11 no formato contrato → geração → revisão.
- Persistência em JSON como solução final: fica só na aula 07 como exercício de arquivos; o projeto usa SQLite.

## O que foi adicionado

- Aula 01: prova diagnóstica (ler C, prever saída, 30 min, sem IA).
- Aula 06: testes com **Vitest** — esta é a decisão de tooling do curso; o README-alvo original citava `node:test` como padrão de "não introduzir framework externo", mas o curso adotou Vitest deliberadamente (ver histórico de decisões abaixo).
- Aula 07: assincronia como conteúdo próprio, antes de qualquer código de servidor.
- Aula 10: SQLite com `@libsql/client` (não `better-sqlite3` nem `node:sqlite`, para que o mesmo código rode local e no Turso); padrão repository; aluno revisa SQL gerado (injeção, parâmetros, tipos).
- Aula 14: roteiro de deploy no Render (free) com banco no Turso (free); variáveis de ambiente; explicar cold start do plano gratuito.
- Pastas `prova1/` e `prova2-defesas/`: banco de questões no formato "prever saída / achar bug / explicar" e roteiro da defesa amostrada. **Os arquivos reais de questões e gabaritos não são commitados** — cada uma dessas pastas tem seu próprio `.gitignore` cobrindo `banco-questoes.md`, `gabarito*.md` (e `roteiro-defesa*.md` em prova2-defesas). Mantenha esses arquivos apenas localmente.
- Aula 11: conjunto de servidores Express com defeitos plantados (validação ausente, erro engolido, middleware fora de ordem, referência compartilhada indevida).
- Aula 12: rubrica de code review para os alunos.
- Projeto: template de `DECISOES.md`, do contrato de API e da divisão de responsabilidades; alinhar com os professores de Engenharia de Software e Programação Web o calendário de entregas.

**Mantido:** TypeScript + Node + Express como stack; Git em toda aula; Zod na validação (como algo que o aluno lê e ajusta, não escreve do zero); SQLite como banco.

---

## Convenções de tooling

- **Test runner/framework:** [Vitest](https://vitest.dev) em todo `projeto-base/` que precisa de testes rodáveis. Script padrão `"test": "vitest run"` (execução única, sem watch). Ver `recursos/template-scaffolding/` para o modelo validado.
- **Estrutura de scaffolding padrão** (aulas 06, 09, 10, 13-14):

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
- Ao adicionar dependências em qualquer `projeto-base/`, prefira instalar sem pin de versão e depois **fixar a versão resolvida** no `package.json` (evita quebra de compatibilidade em reinstalações futuras ao longo do semestre) — foi assim que `recursos/template-scaffolding/` foi montado.

## Sigilo de provas

`prova1/` e `prova2-defesas/` existem no repositório público só com a estrutura/formato. O banco de questões e os gabaritos reais nunca são commitados (cobertos por `.gitignore` local a cada pasta) — mantenha-os em local próprio (LMS, repositório privado do professor).

## Fallback de cota do Copilot (ou assistente equivalente)

As aulas 09, 10, 11 e 13-14 são as que mais dependem de geração de código via IA (modo "Par"). Se a cota do plano gratuito esgotar no meio do semestre:

- Degradar temporariamente essas atividades para o modo "Tutor" (o aluno escreve o código, só pergunta/pede explicação à IA);
- Ou indicar um assistente alternativo com cota disponível (ex.: outro provedor com free tier).

Registrar a decisão tomada na própria aula afetada, para não haver ambiguidade sobre o modo de IA vigente naquele encontro.

## Histórico desta reescrita

A reescrita seguiu um plano de execução faseado (Fase 0: esqueleto e infraestrutura; Fases 1–4: conteúdo final por bloco, um bloco por vez). Toda a reestruturação aconteceu na branch `reescrita-curso-ia`, criada a partir de `main` — o merge para `main` é decisão posterior, tomada só depois do material estar pronto. Existe uma branch anterior não relacionada (`claude/reescrever-curso-ia-dev-f21iay`) com outra tentativa de reescrita — foi deliberadamente ignorada por divergir da direção adotada aqui (ela usava Vitest também, mas sem SQLite e com estrutura de aulas diferente da deste plano).
