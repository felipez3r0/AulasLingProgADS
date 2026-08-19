# Contexto para agentes de IA

> Este arquivo tem duas funções. Ele é o contexto que um agente de codificação
> (Claude Code, Codex CLI, Cursor, Copilot Agent) lê antes de tocar neste
> repositório — e é **material didático da Aula 12**, onde você vai escrever um
> arquivo como este para o seu próprio projeto.
>
> Leia-o como aluno pelo menos uma vez. Um agente sem contexto age por suposição;
> um agente com contexto age por instrução. A diferença é este arquivo.

## O que é este projeto

Repositório didático da disciplina **Linguagem de Programação** do curso de
Análise e Desenvolvimento de Sistemas da FATEC (2º semestre).

São 15 aulas. Cada pasta `aulaNN-slug/` contém:

- `README.md` — a aula
- `exemplos/` — código demonstrado no texto, com testes `*.spec.ts` que **passam**
- `exercicios/` — esqueletos para o aluno resolver, com testes `*.test.ts` que **falham**

Linguagem: TypeScript estrito, ESM, executado com `tsx` sobre Node 22. Testes com Vitest.

## Comandos

```bash
npm install              # uma vez, na raiz
npm test                 # testes dos exemplos — devem passar
npm test -- aula05       # só os exemplos da aula 05
npm run ex -- aula05     # exercícios da aula 05 (modo watch)
npm run ex:run           # exercícios, uma passada só
npm run typecheck        # tsc --noEmit
npm run estrutura        # valida template das aulas e cobertura da ementa
npm run check            # typecheck + testes + estrutura
```

## Regras

1. **Nunca edite arquivos `*.test.ts` nem `*.spec.ts`.** Eles são a especificação.
   Fazer o teste passar alterando o teste não é resolver o problema — é apagar o problema.
2. **Só altere arquivos dentro da pasta da aula indicada pelo usuário.** Se a tarefa
   parecer exigir mudança fora dela, pergunte antes.
3. **Não instale dependências novas** sem pedir confirmação e justificar por que a
   biblioteca padrão não resolve.
4. **Não resolva exercícios por conta própria.** Os arquivos em `exercicios/` são
   trabalho do aluno. Só mexa neles se o aluno pedir explicitamente e disser que
   está no nível 🤖 da trilha.
5. **Ao terminar, rode o comando de verificação e mostre a saída real.** Não afirme
   que passou; prove que passou.
6. **Português do Brasil** em comentários, mensagens de commit e explicações.

## Estilo de código

- TypeScript estrito. Sem `any`. Sem `@ts-ignore`.
- Funções puras quando possível: **não mute os argumentos recebidos**. Se precisar
  alterar um array ou objeto do chamador, copie primeiro.
- Nomes em português, exceto termos consagrados da linguagem (`map`, `filter`, `id`).
- Sem `console.log` em código de exercício — o teste é a saída.
- Um arquivo por conceito. Se um arquivo passa de ~120 linhas, provavelmente são dois.

## Convenções que o verificador cobra

- `exemplos/` usa sufixo `.spec.ts` e sempre passa.
- `exercicios/` usa sufixo `.test.ts` e começa falhando.
- Todo `.ts` de exemplo tem um `.spec.ts` irmão; todo `.ts` de exercício tem um `.test.ts` irmão.
- Prefixo numérico (`01-`, `02-`) casa com o número do exercício no README.
- Todo `README.md` de aula declara `**Ementa oficial:**` e `**Skills:**` no bloco de metadados.

Rodar `npm run estrutura` verifica tudo isso — inclusive que os 7 itens da ementa
oficial da FATEC continuam cobertos por alguma aula.
