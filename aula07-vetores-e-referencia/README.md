# Aula 07 — Vetores, referência e valor: os "ponteiros" do TypeScript

> **Módulo:** M2 — Fundamentos da linguagem sob verificação
> **Ementa oficial:** E4 — Vetores e ponteiros
> **Skills:** S2 (reforça), S4 (reforça)
> **Pré-requisitos:** Aulas 01 a 06

## Objetivos

- Declarar, percorrer e manipular arrays tipados
- Distinguir métodos que **mutam** dos que devolvem array novo
- Entender **referência vs valor** — a tradução honesta de "ponteiros" para TypeScript
- Reconhecer *aliasing* e cópia rasa, e saber quando cada um morde
- Skill de dev-com-IA: **mutação de argumento é o bug nº 1 do código gerado**

## Por que isso importa quando a IA escreve o código

Se você tivesse que escolher **um** defeito para procurar em todo código gerado por
IA, seria este: uma função que altera o array ou objeto que recebeu.

O motivo é estatístico. `sort`, `reverse`, `splice`, `push` mutam no lugar. Eles
são curtos, aparecem em toda parte no texto que treinou os modelos, e o código
resultante **produz o valor certo**. Só que ele também reordena a lista de quem
chamou, e o estrago aparece longe dali — numa outra função, num outro arquivo, três
passos depois.

É um bug que não lança, não aparece no teste da função e não é visível na
assinatura. A única defesa é entender referência, e é isso que esta aula constrói.

## Antes de começar

```bash
npm test -- aula07     # exemplos desta aula: devem PASSAR
npm run ex -- aula07   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Vetores

```typescript
// aula07-vetores-e-referencia/exemplos/01-vetores.ts
const notas: number[] = [8, 6, 10, 7];
notas.length          // 4
notas[0]              // 8
```

### Acesso fora dos limites

```typescript
notas[99]   // undefined
```

Com `noUncheckedIndexedAccess` ligado neste repositório, o tipo de `notas[i]` é
`number | undefined` — o compilador **obriga** você a tratar o caso ausente:

```typescript
const primeira = notas[0] ?? 0;
```

> **Comparando com C:**
> ```c
> int notas[4] = {8, 6, 10, 7};
> printf("%d", notas[99]);   // comportamento indefinido
> ```
> Em C, isso pode devolver lixo, dar segfault, ou funcionar por acaso em 99
> execuções e corromper memória na centésima. Em TypeScript você recebe
> `undefined`, sempre, e o compilador avisa antes de rodar.
>
> Mas atenção ao efeito colateral pedagógico disso: o estouro deixou de derrubar o
> programa e virou `undefined` silencioso. Como você viu na Aula 05, um `?? 0`
> descuidado transforma esse silêncio em `0` — e o off-by-one continua ali, só que
> disfarçado de número plausível.

### Métodos que mutam e métodos que não mutam

| Muta o array original | Devolve array novo |
| --- | --- |
| `push` `pop` `shift` `unshift` | `slice` `concat` `map` `filter` |
| `splice` `sort` `reverse` `fill` | `toSorted` `toReversed` `toSpliced` |

**Decore esta tabela.** É a diferença entre um bug e um não-bug.

```typescript
const original = [3, 1, 2];
const ordenado = [...original].sort((a, b) => a - b);  // original intacto
```

**Verifique:** `npm test -- 01-vetores`

---

## 2. Referência vs valor

Esta é a seção central da aula.

```typescript
// Primitivos são COPIADOS
let a = 10;
let b = a;
b = 20;
// a continua 10

// Arrays e objetos NÃO são copiados
const original = [1, 2, 3];
const alias = original;    // as duas variáveis apontam para o MESMO array
alias.push(4);
// original agora é [1, 2, 3, 4]
```

```
   primitivo                        array
 ┌──────────┐                  ┌──────────┐
 │  a = 10  │                  │ original ├──┐
 └──────────┘                  └──────────┘  │   ┌─────────────┐
 ┌──────────┐                  ┌──────────┐  ├──▶│ [1,2,3,4]   │
 │  b = 20  │  cópia própria   │  alias   ├──┘   └─────────────┘
 └──────────┘                  └──────────┘       mesmo dado
```

### Passar para função passa a referência

```typescript
export function funcaoQueMuta(numeros: number[]): void {
  numeros.push(999);      // altera o array de QUEM CHAMOU
}

export function funcaoQueNaoMuta(numeros: number[]): number[] {
  return [...numeros, 999];   // devolve um novo
}
```

### `===` entre objetos compara identidade

```typescript
[1, 2] === [1, 2]     // false — são dois arrays diferentes
```

Dois arrays com o mesmo conteúdo não são "iguais" para o `===`. Ele pergunta
"é o mesmo objeto?", não "tem o mesmo conteúdo?".

### Cópia rasa não basta para estruturas aninhadas

```typescript
const original = [{ nome: "Ana", notas: [8, 9] }];
const copia = [...original];      // cópia RASA
copia[0].notas.push(10);          // o objeto interno é o MESMO
// original[0].notas agora tem 3 elementos
```

O spread copia **um nível**. O array de cima é novo; os objetos dentro dele
continuam compartilhados. Para cópia profunda: `structuredClone(original)`, ou
copie explicitamente cada nível (`original.map(item => ({ ...item }))`).

**Verifique:** `npm test -- 02-referencia`

---

## 3. O que sobrou de "ponteiro" — e o que morreu

A ementa desta disciplina foi escrita quando a linguagem de referência era C, e
pede "vetores e ponteiros". Vetor traduz direto. Ponteiro, não — e fingir que
traduz seria desonesto.

Em C, um ponteiro é um **endereço de memória**, e você o manipula: `&x` pega o
endereço, `*p` acessa o valor, `p + 1` caminha pela memória. TypeScript não expõe
nada disso.

Mas a **ideia de fundo** — duas variáveis podem apontar para o mesmo dado —
existe, e é exatamente a fonte de bugs desta aula.

### O que sobrevive

| Conceito de C | Como aparece em TypeScript |
| --- | --- |
| Duas variáveis apontando para o mesmo dado | `const b = a` não copia arrays nem objetos |
| Modificar através do ponteiro afeta o original | mutação através de *alias* |
| Passar ponteiro para função | arrays e objetos vão por referência |
| Ponteiro nulo | `null` e `undefined` como ausência |
| Acesso fora dos limites | `undefined` (em C: comportamento indefinido) |
| Comparar endereços | `===` entre objetos compara identidade |

```c
// C: a função recebe o endereço e altera o array de quem chamou
void adicionar(int *v, int n) { v[n] = 999; }
```

```typescript
// TypeScript: a função recebe a referência e altera o array de quem chamou
function adicionar(v: number[]): void { v.push(999); }
```

O mecanismo é diferente. **A consequência é a mesma.**

### O que não existe

- aritmética de ponteiro (`p + 1`, `p++`)
- `malloc` / `free` — a memória é gerenciada automaticamente
- os operadores `&` e `*`
- ponteiro para função como endereço bruto — funções aqui são valores de primeira classe

> **Por que isso não é uma perda:** os bugs que os ponteiros de C causavam
> — vazamento de memória, ponteiro solto, estouro de buffer — foram eliminados
> pela linguagem. O que **não** foi eliminado é o aliasing, e é justamente ele
> que continua derrubando programas em 2026. A ementa acerta ao insistir no tema;
> só o mecanismo mudou.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"faz uma função que devolve as 3 maiores notas da turma"*

```typescript
// aula07-vetores-e-referencia/exemplos/leitura-critica/gerado-pela-ia.ts
export function tresMaiores(notas: number[]): number[] {
  return notas.sort((a, b) => b - a).slice(0, 3);
}
```

**Antes de rodar**, responda:

| Pergunta | Resposta |
| --- | --- |
| `sort` devolve um array novo ou o mesmo? | |
| Depois de `tresMaiores(minhasNotas)`, como está `minhasNotas`? | |
| O valor **devolvido** está correto? | |
| Onde o estrago vai aparecer? | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** o valor devolvido está **certo** — `[10, 9, 7]`, exatamente o
> pedido. O defeito é que `sort` ordena **no lugar** e devolve o mesmo array. Como
> arrays são passados por referência, a lista de notas de quem chamou foi
> permanentemente reordenada.
>
> É a categoria mais escorregadia de bug: o teste da própria função passa. Quem
> percebe é a função seguinte, que esperava as notas na ordem de chamada e recebe
> na ordem decrescente. No arquivo, `relatorio()` mostra isso: ela devolve
> `primeiraDaLista: 10` quando a primeira nota registrada era `5`.
>
> É de suposição sobre a biblioteca: quem escreveu supôs que `sort` devolvia uma
> cópia, como `map` e `filter` fazem. Metade dos métodos de array copia, metade
> muta, e não há nada no nome que diga qual é qual.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava **"não modifique o array recebido"**. É a linha que
> deveria estar em quase toda especificação que você escrever, e por isso ela já
> está no [`AGENTS.md`](../AGENTS.md) deste repositório.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - nenhuma função altera o array ou objeto recebido — nem conteúdo, nem ordem;
  - o array devolvido não é o mesmo objeto do recebido;
  - em estruturas aninhadas, **nada** dentro do resultado é compartilhado.
- **Casos de borda obrigatórios:** vazio · um elemento · repetidos · negativos · aninhado

Os três testes que provam ausência de aliasing:

```typescript
it("nao reordena o array recebido", () => {
  const notas = [5, 9, 2, 10, 7];
  maioresNotas(notas, 3);
  expect(notas).toEqual([5, 9, 2, 10, 7]);
});

it("devolve um array novo, nao o mesmo", () => {
  const notas = [1, 2, 3];
  expect(maioresNotas(notas, 3)).not.toBe(notas);   // toBe compara identidade
});

it("mexer no resultado nao afeta o original", () => {
  const r = aplicarAcao(c, acao);
  r.itens[0]!.quantidade = 999;
  expect(c.itens[0]?.quantidade).toBe(2);
});
```

> `toBe` compara identidade; `toEqual` compara conteúdo. Nesta aula, a diferença
> entre os dois **é** o assunto.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Ordenar/filtrar | "devolve as 3 maiores" | "Devolva as 3 maiores **sem modificar o array recebido**." | A linha que falta em quase todo pedido |
| Copiar estrutura | "copia esse objeto" | "Faça uma cópia profunda: nada dentro do resultado pode ser compartilhado com o original." | Rasa vs profunda muda tudo |
| Revisar mutação | "tá certo?" | "Este código modifica algum argumento recebido? Aponte a linha e o método responsável." | Pergunta pelo defeito específico |
| Escolher método | "usa sort" | "Use um método que não mute o original (`toSorted`, ou `[...arr].sort()`)." | Nomeia a alternativa correta |

**Ferramenta por ferramenta**

- *Copilot inline:* vai sugerir `.sort()` direto. Acrescente o `[...]` você mesmo.
- *Copilot Chat:* selecione a função e pergunte *"que argumentos esta função modifica?"*.
- *Chat de navegador:* peça a lista completa de métodos de array que mutam.
- *Agente:* exercício 3 — o único com estrutura aninhada, onde cópia rasa não salva.

---

## Git desta aula: desfazer o que a IA mutou

```bash
git restore aula07-vetores-e-referencia/exercicios/01-ranking-sem-efeito.ts
git restore .          # descarta tudo que não foi commitado
git diff               # antes de restaurar, veja o que vai perder
```

> **Rede de segurança:** repare no paralelo com o tema da aula. `git restore` é
> literalmente a versão do seu projeto do que você está fazendo no código: manter
> uma cópia que ninguém pode mutar. Se o agente reordenou o que não devia, o
> commit anterior é o seu original imutável.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Ranking sem efeito colateral**
Arquivo: `exercicios/01-ranking-sem-efeito.ts` · Teste: `npm run ex -- 01-ranking`

- Corrija o defeito da leitura crítica: não reordene o array recebido.
- A quantidade agora é parâmetro. Trate zero e negativo.
- **Aceite:** os 12 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Inventário com movimentações**
Arquivo: `exercicios/02-inventario.ts` · Teste: `npm run ex -- 02-inventario`

- Os itens são **objetos**. `[...inventario]` copia o array mas **não** os objetos
  dentro dele — alterar `item.quantidade` de um item copiado rasamente altera o
  original. O teste cobra isso explicitamente.
- **Aceite:** os 12 testes verdes **e** você consegue explicar por que cópia rasa
  não bastava.

### 🤖 Com agente — você especifica e revisa

**3. Carrinho com estrutura aninhada**
Arquivo: `exercicios/03-carrinho-compartilhado.ts` · Spec: `exercicios/03-carrinho-compartilhado.spec.md`

- Três níveis: o carrinho, o array de itens, cada item. E ainda o array de cupons.
- Escreva na especificação: *"nada dentro do resultado pode ser compartilhado com
  o original"*. Depois confira no diff se ele cumpriu nos **quatro** pontos.
- **Aceite:** os 14 testes verdes **e** as 4 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Sei dizer, de cabeça, quais métodos de array mutam e quais não.
- [ ] Sei explicar por que `[1,2] === [1,2]` é `false`.
- [ ] Sei quando cópia rasa basta e quando não basta.
- [ ] Procuro mutação de argumento por reflexo ao revisar código gerado.
- [ ] Sei explicar o que sobrou de "ponteiro" em TypeScript e o que não existe.
- [ ] Achei o bug da leitura crítica sem rodar o código.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| `.sort()` direto no argumento | array do chamador reordenado | `[...arr].sort()` ou `toSorted()` |
| `[...objetos]` em array de objetos | objetos internos ainda compartilhados | `arr.map(o => ({...o}))` ou `structuredClone` |
| `===` para comparar conteúdo | sempre `false` entre arrays distintos | `toEqual` no teste; comparação campo a campo no código |
| `splice` achando que é `slice` | array original alterado | nomes parecidos, efeitos opostos |
| `const` em array achando que congela | conteúdo muda mesmo assim | `const` protege o nome, não o dado |

---

## Resumo

Vetores são diretos; a parte difícil é que arrays e objetos vivem por **referência**
— duas variáveis podem apontar para o mesmo dado, e alterar por uma altera a outra.
É o que sobrou da ideia de ponteiro do C, sem os endereços e sem `malloc`, mas com
exatamente a mesma consequência. Daí sai o defeito mais comum do código gerado por
IA: `sort`, `reverse` e `splice` mutam no lugar, produzem o valor certo, e deixam a
lista de quem chamou reorganizada — um estrago que aparece longe, numa função que
não tem culpa nenhuma. Cópia rasa resolve um nível só; estrutura aninhada exige
cópia profunda. E a linha que deveria estar em quase toda especificação que você
escrever é: **não modifique o que recebeu**.

---

## Leitura complementar

- [MDN — Array](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Array)
- [MDN — structuredClone](https://developer.mozilla.org/pt-BR/docs/Web/API/structuredClone)
- [Mapa da ementa — tradução de "ponteiros"](../recursos/mapa-ementa.md)
