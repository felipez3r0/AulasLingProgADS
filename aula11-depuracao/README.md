# Aula 11 — Depuração por hipótese: quando a IA erra e insiste

> **Módulo:** M3 — Programa real: bibliotecas, arquivos e depuração
> **Ementa oficial:** transversal (reforça E2, E3, E5)
> **Skills:** S5 (introduz), S4 (reforça)
> **Pré-requisitos:** Aulas 01 a 10

## Objetivos

- Ler um stack trace: o que ele diz, e em que ordem
- Reduzir um problema à **reprodução mínima**
- Depurar por **hipótese**: prever, testar, descartar
- Usar o debugger do VS Code e `console.log` de forma deliberada
- Reconhecer e sair do **laço de correções que não convergem** com a IA
- Skill de dev-com-IA: **relatar um bug de forma que a IA consiga resolvê-lo**

## Por que isso importa quando a IA escreve o código

Existe uma experiência que todo mundo que usa IA para programar já teve: você
relata o bug, ela corrige, o bug muda de lugar. Você relata o novo, ela corrige,
volta o primeiro. Na quinta rodada o código está pior do que começou e ninguém
entende mais nada.

Isso não acontece porque o modelo é ruim. Acontece porque **ele está corrigindo
sintomas**, e sintoma é tudo o que você deu a ele. Sem uma especificação do que
seria o comportamento certo, cada rodada é um chute calibrado pela última
reclamação — e chutes não convergem.

Sair desse laço é uma habilidade própria, e não é delegável: a IA não pode
diagnosticar por você, porque diagnosticar é justamente decidir **o que deveria
estar acontecendo**. Essa é a aula que ensina isso.

## Antes de começar

```bash
npm test -- aula11     # exemplos desta aula: devem PASSAR
npm run ex -- aula11   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Ler o erro inteiro

Uma mensagem de erro tem três partes, e a maioria das pessoas lê só a primeira:

```
TypeError: Cannot read properties of undefined (reading 'preco')
    at precoDoPrimeiroItem (/app/aula11/exemplos/01-ler-o-erro.ts:12:24)
    at resumirPedido (/app/aula11/exemplos/01-ler-o-erro.ts:17:44)
    at listarResumos (/app/aula11/exemplos/01-ler-o-erro.ts:22:20)
```

| Parte | O que diz |
| --- | --- |
| `TypeError` | **que tipo** de problema |
| `Cannot read properties of undefined (reading 'preco')` | **o quê** — algo era `undefined` e você pediu `.preco` |
| as linhas `at ...` | **onde** — a pilha de chamadas |

**A pilha se lê de cima para baixo, do mais interno para o mais externo.** A
primeira linha é onde estourou; a última é de onde você chamou. O caminho entre as
duas é a história de como o valor errado chegou lá.

> **Comparando com C:** em C, ler `p->campo` com `p` nulo dá *segmentation fault* —
> o programa morre sem dizer onde. Você precisa de `gdb` e de um binário compilado
> com símbolos. Aqui a pilha vem pronta, com nome de arquivo e número de linha.
> **Aproveite isso**: colar só a última linha da mensagem no chat é jogar fora
> justamente o que o C não te dava.

### Erro com contexto

```typescript
// aula11-depuracao/exemplos/01-ler-o-erro.ts
try {
  return resumirPedido(pedido);
} catch (erro) {
  throw new Error(`falha ao resumir o pedido ${pedido.id}`, { cause: erro });
}
```

A mensagem original dizia *"Cannot read properties of undefined"*. A nova diz
**qual pedido**. E `cause` preserva o erro de baixo, então você não perde a pista.

> **Quando a IA escreve isto:** modelos capturam e relançam com frequência, mas
> costumam **perder** o erro original — `throw new Error("erro ao processar")` e
> pronto. Ao revisar, procure `catch` que descarta a causa. Sem `cause`, o
> diagnóstico começa do zero.

**Verifique:** `npm test -- 01-ler-o-erro`

---

## 2. Reprodução mínima

A ferramenta de diagnóstico mais subestimada. O procedimento:

1. **Confirme** que você consegue provocar o bug de propósito.
2. **Reduza a entrada**: menos itens, valores mais simples.
3. **Reduza o código**: chame a função suspeita direto, sem o pipeline em volta.
4. **Pare** quando remover mais alguma coisa fizer o bug sumir. O que sobrou é a causa.

```typescript
// aula11-depuracao/exemplos/02-reproducao-minima.ts
// De: relatorioMensal(vendas) — o mesmo vendedor aparece duas vezes
// Para: duas linhas
normalizarNome("Ana  Silva")  // "ana  silva"
normalizarNome("Ana Silva")   // "ana silva"
```

O bug estava em `split(" ").join(" ")` — uma operação que **parece** normalizar
espaços e não faz absolutamente nada: o que foi separado por um espaço é reunido
pelo mesmo espaço.

**A reprodução mínima serve a três coisas ao mesmo tempo:** ela é o diagnóstico,
é o que você manda para a IA, e vira o teste de regressão depois de corrigido.

**Verifique:** `npm test -- 02-reproducao-minima`

---

## 3. Depurar por hipótese

Depuração não é olhar o código até a resposta aparecer. É o método experimental:

1. **Observe** — qual é exatamente o comportamento errado?
2. **Formule** — "acredito que X está acontecendo porque Y".
3. **Preveja** — "se eu estiver certo, então Z também deve ser verdade".
4. **Teste** — verifique Z.
5. **Descarte ou confirme** — e repita.

O passo 3 é o que a maioria pula, e é o que faz a diferença. Uma hipótese que não
gera previsão não é uma hipótese: é um palpite.

### Ferramentas

**`console.log` deliberado** — não espalhado. Imprima o **estado** nos limites:

```typescript
console.log("entrada:", { pedidos: pedidos.length, primeiro: pedidos[0] });
console.log("apos filtro:", filtrados.length);
```

**Debugger do VS Code** — melhor quando você não sabe onde olhar. Este repositório
já traz a configuração pronta em [`.vscode/launch.json`](../.vscode/launch.json):
*Depurar arquivo TypeScript atual* e *Depurar teste Vitest atual*. Ponha um
breakpoint, rode com `F5`, inspecione as variáveis, avance com `F10`.

**`git bisect`** — quando funcionava antes e não funciona agora:

```bash
git bisect start
git bisect bad                 # o commit atual está quebrado
git bisect good v1-fundamentos # este estava bom
# o git te leva ao meio; teste e responda good/bad
git bisect reset
```

Em ~10 passos ele encontra o commit exato entre mil. É o argumento prático a favor
de commits pequenos.

---

## 4. Relatar um bug para a IA

O que separa uma resposta útil de uma inútil:

| Relato ruim | Relato bom |
| --- | --- |
| "não funciona" | "esperado 6, obtive 3" |
| o arquivo inteiro colado | a reprodução mínima |
| "deu erro" | o stack trace **completo** |
| "conserta" | "liste 3 hipóteses para a causa, da mais provável para a menos" |

O modelo do relato:

```
Comportamento esperado: soma([1,2,3]) deve retornar 6.
Comportamento observado: retorna 3.

Reprodução mínima:
[o menor código que mostra o problema]

Erro completo:
[stack trace inteiro, não um resumo]

Versões: Node 22, TypeScript 5.9, Vitest 3.

Não me dê o código corrigido ainda. Liste 3 hipóteses para a causa,
da mais provável para a menos, e como eu testo cada uma.
```

A última frase é a mais importante. **Pedir hipóteses em vez da correção mantém
você no comando do diagnóstico** — e é o que impede o laço da próxima seção.

---

## 5. Quando parar de pedir correção

Reconheça o padrão: **cada correção resolve o sintoma relatado e cria outro.**

Se isso aconteceu duas vezes, pare. Não peça a terceira correção. Faça isto:

1. **Escreva a especificação** do comportamento correto — entradas, saídas, bordas.
   É quase sempre a coisa que nunca existiu.
2. **Transforme a especificação em testes**, todos de uma vez.
3. **Aí sim** peça uma implementação que satisfaça os testes, ou escreva você mesmo.

Você trocou "corrija este sintoma" por "satisfaça este contrato". A diferença é que
o contrato não se move quando você conserta uma parte.

> **Regra prática:** duas rodadas sem convergir significam que falta especificação,
> não que falta capacidade. Cinco rodadas significam que você está depurando o
> chute da IA em vez do seu programa.

---

## Leitura crítica: ache o bug

O arquivo desta seção não traz um bug — traz **um diálogo inteiro**, com o pedido:

> *"essa função de paginação tá com bug, conserta"*

```typescript
// aula11-depuracao/exemplos/leitura-critica/gerado-pela-ia.ts

// RODADA 1 — "a última página vem vazia"
totalPaginas: Math.floor(lista.length / porPagina)     // 10/3 = 3, deveria ser 4

// RODADA 2 — "agora conta certo, mas a página 1 pula os primeiros"
totalPaginas: Math.ceil(lista.length / porPagina)      // corrigido
const inicio = pagina * porPagina;                      // ainda base 0

// RODADA 3 — "agora a página 1 funciona, mas quebrou com lista vazia"
const inicio = (pagina - 1) * porPagina;                // base 1
```

**Antes de rodar**, preencha:

| Rodada | O que foi corrigido | O que quebrou | Por quê |
| --- | --- | --- | --- |
| 1 → 2 | | | |
| 2 → 3 | | | |
| 3 → ? | | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** na rodada 3, `paginar(lista, 0, 3)` calcula `inicio = -3`, e
> `slice(-3, 0)` devolve **lista vazia** — porque o fim calculado (`0`) vem antes
> do início real (índice 7). Nenhum erro é lançado: a tela simplesmente aparece sem
> resultado. E `porPagina = 0` produz `totalPaginas: Infinity`.
>
> Mas o defeito de verdade não é nenhum desses. É que **nunca existiu uma
> especificação**. As páginas começam em 0 ou em 1? O que acontece com página fora
> do intervalo? E com `porPagina` zero? Nada disso foi dito, então cada rodada
> resolveu a última reclamação e produziu a próxima.
>
> Repare que a IA acertou o que foi pedido **todas as vezes**. O problema é que
> "conserta" não é um pedido — é um sintoma.
>
> Documentado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`. Escrever a
> especificação que faltava, e implementar de uma vez só, é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava tudo. A rodada 1 deveria ter sido: *"as páginas são
> numeradas a partir de 1; página acima do total devolve vazio; `porPagina < 1`
> lança erro; lista vazia dá `totalPaginas: 0`"*.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - todo bug corrigido deixa para trás um teste que o pegaria de novo;
  - nenhum `catch` descarta a causa original;
  - nenhuma correção entra sem que você saiba **por que** o bug acontecia.
- **Casos de borda obrigatórios:** vazio · zero · negativo · limite · fora do intervalo

```typescript
// A reprodução mínima vira teste permanente:
it("espacos repetidos nao criam chaves diferentes", () => {
  expect(normalizarNomeCorrigido("Ana  Silva")).toBe("ana silva");
});
```

> **Corrigir sem deixar teste é adiar o bug**, não resolvê-lo. Especialmente quando
> a próxima pessoa a mexer nesse código for um agente que não estava na conversa.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Relatar bug | "não funciona, me ajuda" | esperado / obtido / repro mínima / stack completo / versões | Dá o que é preciso para diagnosticar |
| Diagnosticar | "conserta isso" | "Liste 3 hipóteses para a causa, da mais provável para a menos, e como eu testo cada uma." | Você mantém o diagnóstico |
| Entender o erro | "que erro é esse?" | "O que esta mensagem significa, e que situação no meu código a produziria?" | Liga a mensagem ao seu contexto |
| Reduzir | — | "Qual é a menor entrada que reproduziria este comportamento?" | A IA é boa em reduzir casos |
| Sair do laço | "tenta de novo" | "Pare de corrigir. Vamos escrever a especificação: quais são as entradas, saídas e casos de borda corretos?" | Troca sintoma por contrato |

**Ferramenta por ferramenta**

- *Copilot inline:* pouco útil aqui. Depuração é raciocínio, não digitação.
- *Copilot Chat:* `/fix` sobre o trecho **com o erro selecionado** — ele lê o contexto.
- *Chat de navegador:* o melhor lugar para o relato completo com stack trace.
- *Agente:* pode rodar os testes e iterar sozinho. Poderoso **e** o maior risco de
  laço: dê a ele o critério de aceite, nunca o sintoma.

---

## Git desta aula: `bisect` e `stash`

```bash
# funcionava antes, quebrou agora - ache o commit culpado
git bisect start
git bisect bad
git bisect good v1-fundamentos
# ... teste e responda good/bad até o git apontar o commit
git bisect reset

# guardar o experimento sem commitar
git stash
git stash pop
```

> **Rede de segurança:** `bisect` só funciona bem com commits pequenos e que
> **rodam**. Um commit gigante de "várias correções" é um beco sem saída para o
> `bisect` — mais um motivo para commitar por unidade de trabalho.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. A paginação, com a especificação que faltava**
Arquivo: `exercicios/01-paginacao.ts` · Teste: `npm run ex -- 01-paginacao`

- As três rodadas falharam por falta de especificação. Aqui ela está escrita.
  Implemente **de uma vez só**.
- Repare no contraste: com a especificação pronta, isto é uma função de dez linhas.
- **Aceite:** os 18 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Caça ao bug**
Arquivo: `exercicios/02-caca-ao-bug.ts` · Teste: `npm run ex -- 02-caca-ao-bug`

- Aqui o código **já existe** e tem três bugs. Note que o teste começa
  **parcialmente verde**: 10 passam, 7 falham. Sua tarefa é diagnóstico, não escrita.
- **Preencha o bloco de hipóteses no topo do arquivo antes de chamar a IA.** Depois
  passe a ela a reprodução mínima, não o arquivo inteiro.
- Um dos bugs envolve `NaN` atravessando uma validação. Vale entender **por que**
  `NaN < 0` é `false`.
- **Aceite:** os 17 testes verdes **e** o bloco de hipóteses preenchido.

### 🤖 Com agente — você especifica e revisa

**3. Ferramenta de diagnóstico**
Arquivo: `exercicios/03-diagnostico.ts` · Spec: `exercicios/03-diagnostico.spec.md`

- Uma função que transforma erro cru em relatório estruturado — a ferramenta que
  você usaria para relatar bugs melhor.
- Ela é **defensiva**: existe para funcionar quando tudo o mais já falhou. Um
  `throw` aqui esconde o erro que você estava diagnosticando. Procure no diff por
  caminhos que possam lançar.
- Atenção à cadeia circular de causas: sem proteção, é laço infinito.
- **Aceite:** os 17 testes verdes **e** as 4 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Sei ler um stack trace e dizer em que ordem as chamadas aconteceram.
- [ ] Sei reduzir um bug à menor entrada que o reproduz.
- [ ] Formulo hipótese com previsão antes de mexer no código.
- [ ] Sei usar breakpoint no VS Code.
- [ ] Reconheço quando as correções da IA pararam de convergir — e sei o que fazer.
- [ ] Deixo um teste de regressão para cada bug que corrijo.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| Colar só a última linha do erro | resposta genérica e inútil | Stack trace completo |
| Pedir "conserta" sem especificação | correções que não convergem | Escreva o contrato |
| Corrigir sem entender | o bug volta em outro lugar | Só corrija depois de saber por quê |
| `catch` que perde a causa | diagnóstico começa do zero | `new Error(msg, { cause: erro })` |
| `console.log` espalhado | ruído no lugar de sinal | Imprima estado nos limites |
| Corrigir sem deixar teste | o bug reaparece meses depois | Repro mínima vira teste |
| `NaN` em comparação | validação não dispara | `Number.isFinite` |

---

## Resumo

O laço em que cada correção da IA cria um bug novo não é falha do modelo: é o que
acontece quando você entrega sintomas em vez de especificação. Sair dele exige o
método que esta aula treina — ler o stack trace inteiro (que em C você nem teria),
reduzir à menor entrada que reproduz, e formular hipótese com previsão antes de
tocar no código. A reprodução mínima serve às três coisas de uma vez: é o
diagnóstico, é o que você manda para a IA, e vira o teste de regressão. E quando
duas rodadas de correção não convergirem, pare de pedir a terceira: escreva a
especificação, transforme em testes, e troque "corrija este sintoma" por "satisfaça
este contrato" — porque o contrato não se move quando você conserta uma parte.

---

## Leitura complementar

- [MDN — Error.cause](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Error/cause)
- [VS Code — Debugging](https://code.visualstudio.com/docs/editor/debugging)
- [Git — bisect](https://git-scm.com/docs/git-bisect)
