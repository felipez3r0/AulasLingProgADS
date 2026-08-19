# Aula 04 — Variáveis, tipos, operadores e expressões

> **Módulo:** M2 — Fundamentos da linguagem sob verificação
> **Ementa oficial:** E1 — Variáveis, constantes, operadores e expressões
> **Skills:** S7 (introduz), S3 (reforça)
> **Pré-requisitos:** Aulas 01 a 03

## Objetivos

- Declarar variáveis e constantes com tipos em TypeScript
- Usar operadores aritméticos, relacionais e lógicos, e entender precedência
- Reconhecer **coerção de tipos** e o estrago que ela causa em dados de entrada
- Usar o sistema de tipos como contrato verificado pelo compilador
- Skill de dev-com-IA: **o type-checker é o primeiro revisor do código gerado**

## Por que isso importa quando a IA escreve o código

Existe um revisor que lê 100% do que a IA escreve, não se cansa e não é
simpático: o compilador. Cada anotação de tipo que você põe é uma regra que ele
vai cobrar do código gerado — antes de qualquer teste rodar, antes de você ler
o diff.

E há um erro específico que só o tipo pega: **dados que chegam como texto**.
Formulário, arquivo CSV, resposta de API — tudo chega string. Uma IA que recebe
`valor` sem saber que é string escreve `total + valor`, e `10 + "5"` dá `"105"`.
O programa não quebra. Ele soma errado, em silêncio, para sempre.

Tipar a entrada transforma esse bug invisível em erro de compilação. É a diferença
entre descobrir na sua máquina e descobrir no boleto do cliente.

## Antes de começar

```bash
npm test -- aula04     # exemplos desta aula: devem PASSAR
npm run ex -- aula04   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Variáveis, constantes e tipos

```typescript
// aula04-variaveis-tipos-operadores/exemplos/01-declaracoes-e-tipos.ts
const NOTA_MAXIMA = 10;        // não muda
let contador = 0;              // vai mudar
const nome: string = "Ana";    // anotação explícita
```

**Regra prática:** use `const` por padrão; troque para `let` só quando precisar
reatribuir. Nunca use `var`.

| Tipo | Exemplo | Observação |
| --- | --- | --- |
| `string` | `"Ana"` | não existe `char` — um caractere é uma string de tamanho 1 |
| `number` | `8.5`, `42` | um só tipo para inteiro e decimal |
| `boolean` | `true` | |
| `null` | `null` | ausência intencional |
| `undefined` | `undefined` | declarado, sem valor atribuído |

> **Comparando com C:**
> ```c
> int idade = 20;
> float altura = 1.68;
> const float PI = 3.14159;
> ```
> Em C você tem `int`, `float`, `double`, `char` — tamanhos de memória diferentes.
> Em TypeScript há um `number` só, e o tipo existe apenas em tempo de compilação:
> ele é apagado antes de rodar. O tipo não é para a máquina. É para você e para o
> revisor automático.

### Inferência: quando não anotar

```typescript
let contador = 0;  // o TS já sabe que é number
```

Anotar seria redundante. Anote quando o tipo **não** for óbvio, ou quando quiser
fixar o contrato — em parâmetros e retornos de função, sempre.

### `const` não congela o conteúdo

```typescript
const numeros = [1, 2, 3];
numeros.push(4);      // permitido — o array é o mesmo, mudou o conteúdo
// numeros = [9];     // proibido — isso seria reatribuir
```

Este é o mal-entendido mais comum de quem vem de C. `const` protege o **nome**,
não o **dado**. Voltamos a isso na Aula 07, onde vira o assunto principal.

> **Quando a IA escreve isto:** modelos usam `let` por padrão em muitos contextos,
> mesmo quando nada é reatribuído. Não é erro, mas é ruído: `const` comunica
> "isto não muda" a quem lê depois. Peça `const` por padrão nas suas instruções.

**Verifique:** `npm test -- 01-declaracoes`

---

## 2. Operadores

### Aritméticos e precedência

```typescript
2 + 3 * 4        // 14 — multiplicação primeiro
(2 + 3) * 4      // 20 — parênteses mandam
7 % 2            // 1  — resto da divisão
```

`%` é a ferramenta padrão para "é par?" e "de N em N":

```typescript
export function ehPar(n: number): boolean {
  return n % 2 === 0;
}
```

### Relacionais e lógicos

| Operador | Significado |
| --- | --- |
| `===` `!==` | igual / diferente **sem conversão** — use sempre estes |
| `==` `!=` | igual / diferente **com conversão** — evite |
| `<` `>` `<=` `>=` | comparações |
| `&&` `\|\|` `!` | e / ou / não |

Os lógicos têm **curto-circuito**: em `a && b`, se `a` for falso, `b` nem é avaliado.

---

## 3. Coerção: o operador `+` tem duas personalidades

Esta é a seção mais importante da aula.

```typescript
// aula04-variaveis-tipos-operadores/exemplos/02-operadores-e-coercao.ts
const quantidade = "10";   // veio de um formulário, portanto é string
quantidade + 5             // "105"  — concatenou
Number(quantidade) + 5     // 15     — somou
```

`+` soma números e **concatena** strings. Se um dos lados for string, o outro é
convertido para string. Nenhum erro é lançado.

Onde isso te pega: **todo dado de entrada é texto**.

| Origem | O que chega |
| --- | --- |
| campo de formulário | `string` |
| linha de CSV | `string` |
| `JSON.parse` de uma API | depende do JSON — pode vir `"10"` |
| argumento de linha de comando | `string` |

### `==` versus `===`

```typescript
0 == ""      // true  — converte antes de comparar
0 === ""     // false — tipos diferentes, ponto final
```

**Regra do curso: use sempre `===`.** As regras de conversão do `==` são muitas e
não valem a pena memorizar.

### `??` versus `||` para valores padrão

```typescript
valor ?? 0    // cai no 0 apenas se valor for null ou undefined
valor || -1   // cai no -1 também quando valor é 0, "" ou false
```

`??` é quase sempre o que você quer. Com `||`, um preço de `0` ou um nome vazio
são tratados como "ausentes" — bug clássico e difícil de ver.

> **Quando a IA escreve isto:** `||` para valor padrão é um padrão antigo e muito
> frequente no texto de treinamento dos modelos. Você vai receber `||` onde
> deveria ser `??`. É uma das coisas mais fáceis de pegar na revisão de diff —
> procure por `|| 0` e `|| ""`.

**Verifique:** `npm test -- 02-operadores`

---

## 4. Tipos como contrato

Uma assinatura é uma promessa verificada:

```typescript
export function media(notas: number[]): number
```

Ela diz três coisas ao compilador — e ao Copilot, que lê o que está acima do
cursor: recebe um array de números, devolve um número, e nada mais.

Neste repositório o `tsconfig.json` liga duas flags que existem por serem
**conteúdo de aula**:

| Flag | O que faz | Onde aparece |
| --- | --- | --- |
| `noUncheckedIndexedAccess` | `array[i]` tem tipo `T \| undefined` | Aula 07 |
| `noFallthroughCasesInSwitch` | `case` sem `break` vira erro | Aula 05 |

Rode `npm run typecheck` sempre que aceitar código gerado. É a revisão mais barata
que existe: leva segundos e não depende da sua atenção.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"soma os valores dos itens do pedido que vêm do formulário"*

```typescript
// aula04-variaveis-tipos-operadores/exemplos/leitura-critica/gerado-pela-ia.ts
export function somarPedidoReduce(itens: ItemFormulario[]) {
  return itens.reduce((total, item) => total + item.valor, "");
}
```

**Antes de rodar**, rastreie para `[{valor: "12"}, {valor: "3"}]`:

| Iteração | `total` antes | `item.valor` | `total + item.valor` | tipo do resultado |
| --- | --- | --- | --- | --- |
| início | `""` | — | — | |
| 1ª | | `"12"` | | |
| 2ª | | `"3"` | | |
| retorno | | | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** o acumulador começa como `""`, uma string. Logo `+` concatena em
> vez de somar, e a função devolve `"123"` em vez de `15`. Pior: pedido vazio
> devolve `""`, não `0` — e quem receber isso vai fazer contas com uma string.
>
> A outra versão do arquivo, que usa `Number()`, acerta a soma mas tem um defeito
> irmão: `Number("abc")` é `NaN`, e `NaN` contamina o total sem lançar erro.
> `NaN + 10` é `NaN`, `NaN > 5` é `false`, e o pedido some do relatório sem
> nenhuma mensagem.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir os dois defeitos é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava dizer que **os valores chegam como texto e o total
> precisa ser `number`**, e o que fazer com texto que não é número. O tipo
> `valor: string` estava lá — mas o prompt não pedia a conversão, e a IA não é
> obrigada a inferir a sua intenção a partir do tipo.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - toda função que recebe texto e devolve número **converte explicitamente**;
  - nenhum resultado numérico pode ser `NaN`;
  - o tipo do retorno é verificado no teste, não só o valor.
- **Casos de borda obrigatórios:** vazio · zero · negativo · texto não numérico · decimal

```typescript
it("o resultado e number, nao string", () => {
  expect(typeof somarPedido(pedido)).toBe("number");
});

it("nunca devolve NaN", () => {
  expect(somarPedido(pedido)).not.toBeNaN();
});
```

Comandos:

```bash
npm run typecheck        # o revisor que lê 100% do código
npm test -- aula04
npm run ex -- aula04
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Somar dados de entrada | "soma os valores" | "Os valores chegam como `string`. Converta explicitamente; o retorno é `number`. Texto não numérico lança erro em vez de virar `NaN`." | Diz a origem do dado e o que fazer com lixo |
| Valor padrão | "usa um valor padrão se não vier nada" | "Use `??` e não `||`: zero e string vazia são valores legítimos." | Impede o padrão antigo que a IA prefere |
| Revisar coerção | "tá certo?" | "Onde neste código pode acontecer coerção implícita de tipo? Liste as linhas." | Pede o modo de falha específico |

**Ferramenta por ferramenta**

- *Copilot inline:* escreva a assinatura tipada primeiro. `(valor: string): number` já
  restringe muito a sugestão.
- *Copilot Chat:* `/explain` num trecho e pergunte *"que conversão implícita acontece aqui?"*.
- *Chat de navegador:* peça a tabela de conversões do `==` — e depois nunca mais use `==`.
- *Agente:* exercício 3.

---

## Git desta aula: mensagens que dizem o quê e o porquê

```bash
git add aula04-variaveis-tipos-operadores/exercicios/01-somar-formulario.ts
git commit -m "aula04: converte valores de formulario antes de somar"
```

| Fraca | Boa |
| --- | --- |
| `fix` | `aula04: converte valores de formulario antes de somar` |
| `ajustes` | `aula04: troca || por ?? para preservar zero` |

> **Rede de segurança:** commit antes de deixar a IA reescrever a função inteira.
> Se a versão nova concatenar onde deveria somar, `git restore .` resolve.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Soma de formulário, sem NaN e sem concatenação**
Arquivo: `exercicios/01-somar-formulario.ts` · Teste: `npm run ex -- 01-somar-formulario`

- Converta explicitamente; o retorno é `number`, inclusive para pedido vazio.
- Texto não numérico e campo vazio lançam `Error("valor invalido: <valor>")`.
- Cuidado: `Number("")` é `0`, não `NaN`. O campo vazio precisa de verificação própria.
- **Aceite:** os 9 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Conversor de temperatura**
Arquivo: `exercicios/02-conversor-unidades.ts` · Teste: `npm run ex -- 02-conversor-unidades`

- Escreva a assinatura e o contrato antes de ligar as sugestões.
- Estratégia que simplifica: converta sempre para Celsius primeiro, valide, depois
  converta para o destino. Assim você escreve 4 fórmulas em vez de 9.
- O Copilot costuma acertar as fórmulas e esquecer o arredondamento e o zero absoluto.
- **Aceite:** os 14 testes verdes **e** você consegue explicar cada linha aceita.

### 🤖 Com agente — você especifica e revisa

**3. Planilha de notas**
Arquivo: `exercicios/03-planilha-notas.ts` · Spec: `exercicios/03-planilha-notas.spec.md`

- Preencha a especificação **antes** de chamar o agente.
- São **três** validações e a ordem entre elas importa: um campo com texto inválido
  não pode ser reportado como "nota fora da faixa". Confira isso no diff.
- Verifique se ele usou `Number.isNaN(x)` — comparar com `=== NaN` nunca funciona,
  porque `NaN !== NaN`.
- **Aceite:** os 15 testes verdes **e** as 4 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Sei quando usar `const` e por que ele não impede mutação.
- [ ] Sei prever o resultado de `"10" + 5` e de `Number("10") + 5`.
- [ ] Sei explicar por que `||` e `??` dão resultados diferentes com `0`.
- [ ] Rodo `npm run typecheck` por hábito depois de aceitar código gerado.
- [ ] Achei o bug da leitura crítica sem rodar o código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| `reduce` com acumulador `""` | soma vira concatenação | Comece o acumulador com `0` |
| `Number("")` é `0` | campo vazio vira zero silencioso | Verifique string vazia antes de converter |
| `NaN === NaN` é `false` | verificação de NaN nunca dispara | Use `Number.isNaN(x)` |
| `\|\|` para valor padrão | `0` e `""` tratados como ausentes | Use `??` |
| `==` em vez de `===` | comparação com conversão | Use sempre `===` |
| `parseInt` sem base | `parseInt("08")` já foi `0` | Prefira `Number()` |

---

## Resumo

O sistema de tipos é o revisor que lê tudo o que a IA escreve, sem se cansar — e
cada anotação sua é uma regra que ele passa a cobrar. O erro que ele mais evita
nesta aula é o de coerção: `+` soma números e concatena strings, e como todo dado
de entrada chega como texto, `total + valor` vira `"105"` sem lançar nada. As
armadilhas irmãs são `Number("")` valendo `0`, `NaN` se propagando em silêncio, e
`||` tratando `0` como ausência quando o certo era `??`. Converta sempre de forma
explícita, teste o **tipo** do retorno e não só o valor, e rode `npm run typecheck`
antes de aceitar qualquer código gerado.

---

## Leitura complementar

- [TypeScript — Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
- [MDN — Operadores de comparação](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators)
- [MDN — Nullish coalescing (`??`)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
