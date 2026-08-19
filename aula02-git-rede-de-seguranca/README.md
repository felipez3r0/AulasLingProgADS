# Aula 02 — Git como rede de segurança e leitura de diff

> **Módulo:** M1 — Fundação: ambiente, versionamento e verificação
> **Ementa oficial:** transversal (instrumental)
> **Skills:** S2 (introduz), S11 (introduz), S8 (reforça)
> **Pré-requisitos:** Aula 01

## Objetivos

- Usar Git para versionar, comparar e desfazer com segurança
- **Ler um diff** e enxergar mudança de comportamento escondida em mudança de estilo
- Escrever teste de caracterização: a rede antes de mexer no que já funciona
- Publicar no GitHub e entender o papel do Pull Request
- Skill de dev-com-IA: **o diff é a interface de revisão de tudo que a IA escreve**

## Por que isso importa quando a IA escreve o código

Quando um agente altera dez arquivos de uma vez, você não vai reler o projeto
inteiro. Vai ler o **diff** — as linhas que mudaram. Essa é, literalmente, a
interface entre você e o trabalho da máquina.

E aqui está a armadilha: modelos de linguagem são muito bons em produzir código
que *parece* equivalente. Trocam um laço por `reduce`, um `null` por `undefined`,
um `for` por `map`. O diff fica curto e elegante, e o comportamento mudou. Se você
lê o diff procurando "está feio ou está bonito", passa. Se lê procurando "que
entrada faz as duas versões discordarem", pega.

A outra metade da rede é o Git em si. Aceitar uma mudança grande é barato quando
`git restore` desfaz tudo em um segundo. É caro quando o trabalho anterior não
estava commitado.

## Antes de começar

```bash
npm test -- aula02     # exemplos desta aula: devem PASSAR
npm run ex -- aula02   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Os três estados do Git

```
  seu editor          área de stage         histórico
 ┌────────────┐      ┌────────────┐      ┌────────────┐
 │  working   │ add  │   staged   │commit│ committed  │
 │ directory  │─────▶│            │─────▶│            │
 └────────────┘      └────────────┘      └────────────┘
       ▲                                        │
       └────────────────────────────────────────┘
                    restore / revert
```

| Comando | O que faz |
| --- | --- |
| `git status` | o que mudou e em que estado está |
| `git diff` | as linhas alteradas **ainda não** em stage |
| `git diff --staged` | as linhas que vão entrar no próximo commit |
| `git add <arquivo>` | move para o stage |
| `git commit -m "..."` | grava no histórico |
| `git log --oneline` | o histórico, resumido |

> **Comparando com C:** não há equivalente — versionamento não é da linguagem. Mas
> se você já salvou `programa_v2_final_AGORA_VAI.c`, você estava fazendo Git à mão,
> sem o histórico e sem o `diff`.

---

## 2. Ler um diff é ler código

Um diff mostra só o que mudou. Linhas com `-` saíram, com `+` entraram:

```diff
 export function totalEmEstoque(itens) {
-  let total = 0;
-  for (const item of itens) {
-    if (item.quantidade > 0) {
-      total += item.preco * item.quantidade;
-    }
-  }
-  return total;
+  return itens.reduce((total, item) => total + item.preco * item.quantidade, 0);
 }
```

Este é exatamente o tipo de diff que uma IA produz quando você pede "refatora para
ficar mais limpo". Sete linhas viram uma. Parece ganho puro.

**Mas o `if (item.quantidade > 0)` sumiu.**

```typescript
// aula02-git-rede-de-seguranca/exemplos/01-o-que-um-diff-esconde.ts
```

Com dados normais, as duas versões dão o mesmo resultado — por isso a mudança passa
despercebida em revisão superficial e nos testes de caminho feliz. Com uma
quantidade negativa (devolução lançada errado, importação com defeito), a versão
antiga ignorava o item e a nova **subtrai** do total.

**A pergunta certa ao ler um diff não é "ficou melhor?".** É:

> **Que entrada faz a versão antiga e a nova discordarem?**

Se você não consegue responder, ainda não leu o diff — só olhou.

> **Quando a IA escreve isto:** "refatorar" para um modelo significa reescrever
> num estilo mais idiomático. Preservar comportamento em casos de borda não está
> incluído no pedido, a menos que você inclua. Peça: *"refatore preservando o
> comportamento exato, inclusive para entradas inválidas"*.

**Verifique:** `npm test -- 01-o-que-um-diff-esconde`

---

## 3. Teste de caracterização: a rede antes do trapézio

Você quer mexer num código que funciona, mas ninguém sabe explicar direito o que
ele faz. A sequência segura tem três passos:

1. **Escreva testes que descrevem o comportamento atual** — inclusive as
   esquisitices. Não o que ele *deveria* fazer: o que ele **faz**.
2. Confirme que passam com o código antigo.
3. Refatore (você ou a IA). Se todos continuarem verdes, o comportamento
   sobreviveu.

```typescript
// aula02-git-rede-de-seguranca/exemplos/02-teste-de-caracterizacao.spec.ts
it("ignora item com quantidade negativa - esquisitice preservada", () => {
  expect(totalEmEstoque([{ preco: 100, quantidade: -1 }])).toBe(0);
});
```

Esse teste não afirma que ignorar negativos é a regra certa. Afirma que é a regra
**atual** — e por isso a refatoração que a apagou seria pega na hora.

> **Quando a IA escreve isto:** é o uso mais valioso de IA em código legado. Peça:
> *"escreva testes que capturem o comportamento atual desta função, incluindo
> entradas inválidas e casos de borda — não corrija nada"*. A IA é boa em enumerar
> casos, e é exatamente aí que a atenção humana falha.

**Verifique:** `npm test -- 02-teste-de-caracterizacao`

---

## 4. Desfazer: os três níveis

```bash
# 1. Descartar alteração ainda não commitada num arquivo
git restore src/arquivo.ts

# 2. Descartar TUDO que não foi commitado (o agente fez besteira)
git restore .

# 3. Desfazer um commit já feito, criando um commit que o reverte
git revert <hash>
```

> **`revert` vs `reset`:** `revert` cria um commit novo desfazendo o anterior — o
> histórico continua honesto e é seguro em branch compartilhada. `reset` reescreve
> o histórico e pode destruir trabalho. Enquanto você estiver aprendendo, use
> `revert`.

O nível 2 é o que muda sua relação com a IA. Se `git restore .` devolve o projeto
ao último commit, você pode deixar um agente tentar algo ambicioso sem risco. A
condição é uma só: **commitar antes de soltar o agente.**

---

## 5. GitHub e Pull Request

```bash
git remote add origin <url>
git push -u origin main

git checkout -b aula02-exercicios     # branch para o seu trabalho
git push -u origin aula02-exercicios  # e abra o PR no GitHub
```

Um **Pull Request** é uma proposta de mudança aberta para revisão antes de entrar
na branch principal. É onde o diff deixa de ser ferramenta pessoal e vira
conversa: comentários linha a linha, pedidos de ajuste, aprovação.

A partir da Aula 12, você vai revisar PRs abertos por um **agente**. O
[checklist de revisão](../recursos/checklist-revisao-de-codigo-ia.md) e o
[template de PR](../.github/pull_request_template.md) deste repositório existem
para esse momento — vale ler os dois agora.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"refatora essa função pra ficar mais limpa"*

**Antes** (a função original):

```typescript
export function buscarAluno(alunos: Aluno[], ra: string): Aluno | null {
  for (const aluno of alunos) {
    if (aluno.ra === ra) return aluno;
  }
  return null;
}
```

**Depois** (o que a IA devolveu):

```typescript
// aula02-git-rede-de-seguranca/exemplos/leitura-critica/gerado-pela-ia.ts
export function buscarAluno(alunos: Aluno[], ra: string): Aluno | undefined {
  return alunos.find((aluno) => aluno.ra === ra);
}
```

**Antes de rodar**, preencha:

| Aspecto | Versão antiga | Versão nova |
| --- | --- | --- |
| encontra o aluno | | |
| não encontra | | |
| tipo de retorno declarado | | |
| quem chamava com `=== null` | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado diferente do original?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** `find` devolve `undefined` quando não encontra; a função original
> devolvia `null`. São valores distintos. Todo código que fazia
> `if (resultado === null)` parou de entrar naquele ramo — e como a assinatura
> também mudou, o TypeScript reclama em alguns chamadores e fica calado em outros
> (`== null` aceita os dois; `=== null` não).
>
> É a pior categoria de mudança: pequena, plausível, e quebra à distância — no
> chamador, não na função alterada.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: "mais limpa" é um critério estético. A IA otimizou o que foi
> pedido. Faltou: *"preservando a assinatura e o comportamento para todos os casos"*.

---

## Verificação: como provar que funciona

- **Invariante desta aula:** uma refatoração só está correta se **todos** os testes
  de caracterização escritos antes dela continuarem verdes.
- **Casos de borda obrigatórios:** vazio · não encontrado · zero · negativo · duplicado
- **O teste que pegaria o bug acima:**

```typescript
it("nao encontrado devolve null", () => {
  expect(buscarAluno(turma, "999")).toBeNull();
});
```

Antes de aceitar qualquer refatoração, sua ou da IA:

```bash
npm test              # os testes anteriores continuam verdes?
git diff              # eu li TODAS as linhas que mudaram?
npm run typecheck     # a assinatura mudou sem eu perceber?
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Refatorar | "deixa esse código mais limpo" | "Refatore preservando o comportamento exato, inclusive para entradas inválidas e casos de borda. Se algum comportamento precisar mudar, avise antes." | "Limpo" é estética; comportamento é contrato |
| Revisar diff | "esse diff tá ok?" | "Que entrada faz a versão antiga e a nova produzirem resultados diferentes?" | Pede o contraexemplo, não a aprovação |
| Caracterizar | "escreve testes" | "Escreva testes que capturem o comportamento **atual** desta função, incluindo entradas inválidas. Não corrija nada." | Impede a IA de "melhorar" o que você quer congelar |
| Mensagem de commit | "escreve o commit" | "Com base neste `git diff`, escreva uma mensagem de commit dizendo o que mudou e por quê." | Dá o diff como contexto |

**Ferramenta por ferramenta**

- *Copilot inline:* útil para escrever os muitos casos parecidos de um teste de caracterização.
- *Copilot Chat:* selecione o trecho antigo e o novo e peça o contraexemplo.
- *Chat de navegador:* cole o `git diff` e peça revisão cética.
- *Agente:* exercício 3, com a especificação preenchida antes.

---

## Git desta aula: comparar e desfazer

```bash
git diff                          # o que mudou e ainda não está no stage
git diff --staged                 # o que vai entrar no próximo commit
git diff HEAD~1 HEAD              # o que o último commit mudou
git diff main..minha-branch       # o que a branch mudou em relação à main

git restore arquivo.ts            # descarta alteração de um arquivo
git restore .                     # descarta tudo que não foi commitado
git revert <hash>                 # desfaz um commit, com histórico honesto
```

> **Rede de segurança:** o hábito que vale o semestre inteiro — **commit antes de
> soltar a IA**. Com o trabalho salvo, `git restore .` transforma qualquer
> experimento fracassado em um segundo de prejuízo.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Restaure o contrato**
Arquivo: `exercicios/01-busca-compativel.ts` · Teste: `npm run ex -- 01-busca`

- Reescreva `buscarAluno` mantendo o comportamento original: não encontrado
  devolve `null`.
- Use `find` ou laço — o contrato é que importa, não o estilo.
- **Aceite:** os 7 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Caracterize o legado**
Arquivo: `exercicios/02-caracterizacao.ts` · Teste: `npm run ex -- 02-caracterizacao`

- Leia o código legado no comentário e **rastreie** o que ele faz antes de escrever.
- Use o chat para conferir seu entendimento: *"que entrada faz esta função devolver
  algo surpreendente?"* — mas forme sua hipótese primeiro.
- Cuidado com a ordem das regras: o limite de 50 é aplicado **depois** do adicional
  de distância. Inverter a ordem passa nos casos comuns e falha nos extremos.
- **Aceite:** testes verdes **e** você consegue explicar cada esquisitice preservada.

### 🤖 Com agente — você especifica e revisa

**3. Resumo de histórico por autor**
Arquivo: `exercicios/03-historico.ts` · Spec: `exercicios/03-historico.spec.md`

- Preencha a especificação **antes** de chamar o agente.
- Depois: `git diff` e revise linha a linha. Responda as 4 perguntas do `.spec.md`.
- Observe se ele usou `.sort()` direto no array recebido — o teste pega, mas o
  ponto é você ter percebido **na leitura**, antes do teste avisar.
- **Aceite:** teste verde **e** seção de revisão preenchida.

---

## Autoavaliação

- [ ] Sei ler um diff e dizer que entrada faz as duas versões discordarem.
- [ ] Sei explicar a diferença entre `null` e `undefined` como valor de retorno.
- [ ] Sei escrever um teste de caracterização antes de refatorar.
- [ ] Sei desfazer: um arquivo, tudo, e um commit já feito.
- [ ] Achei o bug da leitura crítica sem rodar o código.
- [ ] Commitei antes de deixar a IA mexer no meu código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| Refatoração que troca `null` por `undefined` | Chamador para de entrar num ramo, sem erro | Fixe o tipo de retorno no teste |
| Ler o diff procurando estilo | "Ficou mais bonito", bug passa | Pergunte pelo contraexemplo, não pela estética |
| `git reset --hard` sem entender | Trabalho perdido | Use `git revert`; `reset` só com certeza |
| Deixar o agente rodar com trabalho não commitado | Não dá para voltar | Commit antes, sempre |
| Commit gigante no fim do dia | Diff que ninguém revisa, nem você | Um commit por unidade de trabalho |

---

## Resumo

O diff é a interface entre você e o código que a IA escreveu — e ler diff é ler
código, não avaliar estilo. A pergunta que revela mudança escondida é sempre a
mesma: *que entrada faz a versão antiga e a nova discordarem?* Refatorações
geradas por IA trocam `null` por `undefined`, perdem um `if`, invertem uma ordem —
mudanças curtas, plausíveis, que quebram no chamador. A defesa em duas camadas:
teste de caracterização escrito **antes** de mexer, e commit feito **antes** de
soltar o agente. Com as duas, aceitar uma mudança ambiciosa custa um segundo de
`git restore` se der errado.

---

## Leitura complementar

- [Pro Git — Livro oficial, em português](https://git-scm.com/book/pt-br/v2)
- [GitHub Docs — Sobre Pull Requests](https://docs.github.com/pt/pull-requests)
- [Atlassian — git diff](https://www.atlassian.com/br/git/tutorials/saving-changes/git-diff)
