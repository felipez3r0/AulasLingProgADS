# Aula 05 — Comandos de desvio e controle de malhas

> **Módulo:** M2 — Fundamentos da linguagem sob verificação
> **Ementa oficial:** E2 — Comandos de desvio; E3 — Controle de malhas
> **Skills:** S4 (introduz), S2 (reforça)
> **Pré-requisitos:** Aulas 01 a 04

## Objetivos

- Usar `if`/`else if`/`else`, `switch` e o operador ternário
- Usar `for`, `while`, `do-while`, `for...of`, `break` e `continue`
- Escrever e depurar laços aninhados
- **Rastrear a execução de um laço no papel**, prevendo a saída antes de rodar
- Skill de dev-com-IA: **achar o off-by-one sem executar o código**

## Por que isso importa quando a IA escreve o código

Modelos de linguagem escrevem laços com a estrutura certa e o **limite errado**
com uma frequência notável. `i < n` e `i <= n` são igualmente plausíveis no texto
que treinou o modelo; qual dos dois está certo depende do seu problema, e o modelo
não tem como saber.

O resultado é o pior tipo de bug: o código roda, não lança nada, e produz uma
resposta com a cara de certa. Uma janela a mais, um elemento a menos, um relatório
com uma linha fantasma.

Não existe atalho para pegar isso. Ou você **rastreia a execução** — segue os
valores passo a passo, no papel ou na cabeça — ou você aceita e descobre depois.
Rastrear é a habilidade que esta aula treina, e é a que separa quem revisa código
de IA de quem apenas o aprova.

## Antes de começar

```bash
npm test -- aula05     # exemplos desta aula: devem PASSAR
npm run ex -- aula05   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Comandos de desvio

```typescript
// aula05-desvio-e-malhas/exemplos/01-desvio.ts
export function classificar(nota: number): string {
  if (nota >= 9) return "A";
  else if (nota >= 7) return "B";
  else if (nota >= 5) return "C";
  else return "D";
}
```

A cadeia é avaliada **de cima para baixo** e para no primeiro que der `true`.
Isso torna a **ordem** parte da lógica:

```typescript
// ORDEM ERRADA — e nenhum erro é reportado
export function classificarOrdemErrada(nota: number): string {
  if (nota >= 5) return "C";      // captura TUDO de 5 pra cima
  else if (nota >= 7) return "B"; // inalcançável
  else if (nota >= 9) return "A"; // inalcançável
  else return "D";
}
```

Nota 10 devolve `"C"`. Os ramos `B` e `A` nunca executam, e nem o compilador nem
o linter reclamam — para eles, é código válido.

### `switch`

```typescript
switch (numero) {
  case 1: return "domingo";
  case 7: return "sabado";
  default: return "dia invalido";
}
```

Compara com `===`. Cada caso precisa de `break` ou `return`; sem isso, a execução
"escorrega" para o caso seguinte.

> **Comparando com C:** o *fallthrough* do `switch` é herdado de C e é fonte
> clássica de bug nas duas linguagens. Neste repositório, o `tsconfig.json` liga
> `noFallthroughCasesInSwitch`, então esquecer o `break` vira **erro de
> compilação** — uma proteção que o C não te dá.

**Verifique:** `npm test -- 01-desvio`

---

## 2. Controle de malhas

| Laço | Quando usar |
| --- | --- |
| `for (let i = 0; i < n; i++)` | quando você precisa do **índice** |
| `for (const x of lista)` | quando você precisa dos **valores** — o mais comum |
| `while (cond)` | quantidade de voltas desconhecida; testa **antes** |
| `do { } while (cond)` | precisa executar **ao menos uma vez**; testa depois |

```typescript
// aula05-desvio-e-malhas/exemplos/02-malhas.ts
export function somarLista(numeros: number[]): number {
  let soma = 0;
  for (const numero of numeros) {
    soma += numero;
  }
  return soma;
}
```

`break` sai do laço; `continue` pula para a próxima volta.

> **Comparando com C:**
> ```c
> for (int i = 0; i < n; i++) { ... }
> ```
> A sintaxe é idêntica. A diferença prática: `for...of` não tem equivalente direto
> em C, e é o que você deve usar quando o índice não interessa — menos índice,
> menos off-by-one.

### Laços aninhados

O de dentro roda **inteiro** a cada volta do de fora. Dois laços de `n` voltas dão
`n²` iterações — com `n = 1000`, um milhão.

**Verifique:** `npm test -- 02-malhas`

---

## 3. Rastreio de execução: a técnica central desta aula

Rastrear é seguir os valores passo a passo, sem rodar. Faça numa tabela.

Exemplo: quantas voltas dá `for (let i = 0; i <= leituras.length - 3; i++)` com
`leituras.length === 5`?

| `i` | condição `i <= 5 - 3` | entra? | janela `[i, i+3)` | último índice usado |
| --- | --- | --- | --- | --- |
| 0 | `0 <= 2` | sim | `[0,1,2]` | 2 |
| 1 | `1 <= 2` | sim | `[1,2,3]` | 3 |
| 2 | `2 <= 2` | sim | `[2,3,4]` | 4 |
| 3 | `3 <= 2` | **não** | — | — |

Três voltas, último índice `4` — exatamente o último elemento. O limite está certo.

Agora o mesmo com `i < leituras.length - 1`:

| `i` | condição `i < 4` | entra? | último índice usado |
| --- | --- | --- | --- |
| 0..2 | sim | sim | 2, 3, 4 |
| 3 | `3 < 4` | **sim** | **6** ← passou do fim |

Quatro voltas, e a última lê os índices 5 e 6 de um array que vai até 4.

**A pergunta de rastreio, sempre:** *na última volta que o laço executa, qual é o
maior índice acessado — e ele existe?*

> **Quando a IA escreve isto:** peça o rastreio a ela também, mas **depois** de
> fazer o seu. *"Para uma lista de 5 elementos, liste os valores de `i` e os
> índices acessados em cada iteração."* Se a resposta dela bater com a sua, ótimo.
> Se não bater, um dos dois está errado — e vale descobrir qual antes de aceitar.

---

## 4. Índices em TypeScript: `undefined` em vez de lixo

```typescript
const numeros = [1, 2, 3];
numeros[10]   // undefined — não é erro, não é lixo de memória
```

Com `noUncheckedIndexedAccess` ligado (como neste repositório), o tipo de
`numeros[i]` é `number | undefined`, e o compilador **obriga** você a tratar isso.

> **Comparando com C:** em C, acessar fora dos limites é *comportamento
> indefinido* — pode devolver lixo, pode dar segfault, pode funcionar por acaso
> em 99 execuções e corromper memória na centésima. Em TypeScript você recebe
> `undefined`, previsivelmente, e o compilador te avisa antes de rodar.
>
> É uma proteção real. Mas repare: ela transforma o estouro em `undefined`
> silencioso, e `undefined ?? 0` transforma em `0` silencioso. O off-by-one não
> desaparece — só muda de disfarce.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"percorre a lista de leituras do sensor e devolve a média móvel de cada janela de 3 leituras"*

A primeira versão está **correta**. A segunda, pedida como "otimize para não usar
`slice`", não está:

```typescript
// aula05-desvio-e-malhas/exemplos/leitura-critica/gerado-pela-ia.ts
export function mediaMovelOtimizada(leituras: number[]): number[] {
  const resultado: number[] = [];
  for (let i = 0; i < leituras.length - 1; i++) {
    let soma = 0;
    for (let j = 0; j < 3; j++) {
      soma += leituras[i + j] ?? 0;
    }
    resultado.push(soma / 3);
  }
  return resultado;
}
```

**Antes de rodar**, rastreie com `[10, 20, 30, 40, 50]`:

| `i` | condição `i < 4` | entra? | índices lidos (`i+0`, `i+1`, `i+2`) | algum não existe? |
| --- | --- | --- | --- | --- |
| 0 | | | | |
| 1 | | | | |
| 2 | | | | |
| 3 | | | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** o limite virou `i < leituras.length - 1`, então o laço dá **4**
> voltas em vez de 3. Na última, lê os índices 3, 4 e **5** — e o 5 não existe.
>
> O `?? 0` é a parte mais instrutiva. Ele foi acrescentado para calar o compilador,
> que corretamente avisava que o acesso podia ser `undefined`. Em vez de corrigir
> o limite, a geração silenciou o aviso: a soma vira `40 + 50 + 0`, e a última
> média sai `30` — um número plausível, no meio de uma lista de números plausíveis.
>
> Sem o `?? 0` teria havido `NaN`, que ao menos é visível. **O `?? 0` transformou
> um bug barulhento em um bug silencioso.**
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava o invariante **"para N leituras e janela T, o
> resultado tem exatamente N − T + 1 elementos"**. Um teste dessa afirmação pega o
> erro imediatamente.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - o número de iterações é previsível a partir da entrada — escreva a fórmula;
  - nenhum índice acessado ultrapassa `length - 1`;
  - todo `?? 0` num acesso indexado é suspeito: pergunte por que ele foi preciso.
- **Casos de borda obrigatórios:** vazio · um elemento · exatamente o tamanho da
  janela · um a menos · um a mais

```typescript
it("5 leituras com janela 3 gera exatamente 3 janelas", () => {
  expect(mediaMovel([10, 20, 30, 40, 50], 3)).toHaveLength(3);
});
```

Testar o **tamanho** da saída pega off-by-one mais rápido que testar os valores.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Gerar laço | "percorre em janelas de 3" | "Para N elementos e janela T, o resultado tem exatamente N−T+1 itens. Nenhum acesso pode passar de `length-1`." | Dá o invariante que decide o limite |
| Conferir limite | "tá certo o for?" | "Para uma lista de 5 elementos, liste os valores de `i` e os índices acessados em cada iteração." | Força o rastreio, não a opinião |
| Otimizar | "otimiza esse laço" | "Otimize preservando o número exato de iterações e os índices acessados." | Impede que "otimizar" mude o limite |
| Suspeitar de `??` | — | "Por que este `?? 0` é necessário? Se for para evitar acesso fora do array, corrija o limite." | Trata o sintoma como sintoma |

**Ferramenta por ferramenta**

- *Copilot inline:* ótimo para o corpo do laço, perigoso no cabeçalho. Rastreie o limite sempre.
- *Copilot Chat:* peça o rastreio tabelado, depois compare com o seu.
- *Chat de navegador:* bom para explicar por que uma condição de parada não termina.
- *Agente:* exercício 3.

---

## Git desta aula: commits por etapa

Um laço complicado se resolve em etapas. Commite cada uma:

```bash
git commit -m "aula05: implementa media movel com janela fixa"
git commit -m "aula05: generaliza para janela de tamanho variavel"
git commit -m "aula05: trata janela maior que a lista"

git diff HEAD~2 HEAD    # o que mudou nas duas últimas etapas
```

> **Rede de segurança:** quando um laço passa a produzir resultado diferente,
> `git diff` sobre o commit anterior mostra exatamente qual limite você mexeu.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Média móvel com janela correta**
Arquivo: `exercicios/01-media-movel.ts` · Teste: `npm run ex -- 01-media-movel`

- **Preencha a tabela de rastreio antes de escrever código.** Descubra no papel
  qual deve ser o limite do laço.
- A janela agora é parâmetro: para N leituras e janela T, saem N−T+1 janelas.
- **Aceite:** os 12 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Relatório FizzBuzz com contadores**
Arquivo: `exercicios/02-fizzbuzz-relatorio.ts` · Teste: `npm run ex -- 02-fizzbuzz`

- O Copilot vai sugerir o FizzBuzz clássico quase instantaneamente. **Leia antes de
  aceitar:** aqui os contadores são exclusivos — um "FizzBuzz" não conta em
  `totalFizz` nem em `totalBuzz`.
- A ordem dos testes de divisibilidade decide tudo: verificar múltiplo de 3 antes
  de múltiplo de 15 quebra o caso 15.
- **Aceite:** os 8 testes verdes **e** você consegue explicar a ordem escolhida.

### 🤖 Com agente — você especifica e revisa

**3. Análise de vendas do ano**
Arquivo: `exercicios/03-analise-vendas.ts` · Spec: `exercicios/03-analise-vendas.spec.md`

- Preencha a especificação **antes** de chamar o agente.
- Há uma assimetria proposital: `piorMes` considera só meses com venda, mas a
  sequência de crescimento percorre os 12 meses, zerados incluídos. Verifique no
  diff se ele respeitou os dois.
- **Aceite:** os 12 testes verdes **e** as 4 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Consigo rastrear um laço no papel e dizer quantas voltas ele dá.
- [ ] Sei responder "qual é o maior índice acessado na última volta?".
- [ ] Sei explicar por que a ordem dos `else if` muda o resultado.
- [ ] Desconfio de `?? 0` em acesso indexado.
- [ ] Achei o bug da leitura crítica sem rodar o código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| `<=` onde devia ser `<` | uma volta a mais, lê fora do array | Rastreie a última iteração |
| Ordem errada de `else if` | ramos inalcançáveis, sem aviso | Do mais restritivo para o mais geral |
| `case` sem `break` | executa o caso seguinte | `noFallthroughCasesInSwitch` já pega |
| `?? 0` para calar o compilador | bug silencioso em vez de barulhento | Corrija o limite, não o sintoma |
| `while` que não avança | laço infinito | Garanta que a variável de parada muda |
| Laço aninhado sobre lista grande | lentidão inesperada | Conte: `n²` cresce rápido |

---

## Resumo

Desvio e repetição são a metade da ementa que a IA escreve com estrutura certa e
limite errado — porque `<` e `<=` são igualmente plausíveis para um modelo, e só o
seu problema decide qual serve. O bug resultante não lança nada: produz uma janela
a mais, uma linha fantasma, um número plausível. A defesa é o rastreio: seguir os
valores no papel e responder "na última volta, qual o maior índice acessado, e ele
existe?". Um `?? 0` num acesso indexado quase sempre é o sintoma de um limite
errado que foi calado em vez de corrigido. E o teste que pega off-by-one mais
rápido não verifica os valores — verifica o **tamanho** da saída.

---

## Leitura complementar

- [MDN — Controle de fluxo e tratamento de erros](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)
- [MDN — Laços e iterações](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Loops_and_iteration)
- [TypeScript — `noUncheckedIndexedAccess`](https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess)
