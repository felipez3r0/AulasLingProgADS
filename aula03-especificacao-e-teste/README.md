# Aula 03 — Da intenção ao teste: especificação como critério de aceite

> **Módulo:** M1 — Fundação: ambiente, versionamento e verificação
> **Ementa oficial:** transversal (apoia E1)
> **Skills:** S1 (introduz), S6 (introduz), S3 (reforça)
> **Pré-requisitos:** Aulas 01 e 02

## Objetivos

- Transformar um pedido vago em especificação: entrada, saída, casos de borda, restrições
- Escrever testes com Vitest a partir da especificação
- Distinguir asserção forte de asserção fraca
- Entender que **um prompt bom e uma especificação boa são o mesmo texto**
- Skill de dev-com-IA: **sem critério de aceite, não existe "pronto"**

## Por que isso importa quando a IA escreve o código

Toda ambiguidade que você deixa no pedido, a IA resolve sozinha — e ela nunca
avisa que decidiu. "Desconto progressivo de 10% acima de 100 e 20% acima de 500":
as faixas acumulam ou não? Você provavelmente sabe a resposta. A IA vai chutar, e
o chute tem 50% de chance de ser o oposto do que você queria.

Essa é a mudança mais concreta na profissão. Quando você escrevia todo o código,
as decisões pequenas eram tomadas enquanto digitava, e você nem percebia que eram
decisões. Agora elas são delegadas — e só as que você **escreveu** chegam à máquina.

A boa notícia é que o texto que evita isso já existe e você já sabe para que serve:
é a especificação. E ela tem uma forma executável, que não depende de ninguém ler
com atenção — o teste.

## Antes de começar

```bash
npm test -- aula03     # exemplos desta aula: devem PASSAR
npm run ex -- aula03   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. O que falta numa frase

Pedido real de cliente:

> "valida o email do usuário"

Parece claro. Não é. Escondidas nessa frase há pelo menos cinco decisões:

| Pergunta | Se você não responder | Quem decide |
| --- | --- | --- |
| O que conta como válido? | regra inventada | a IA |
| String vazia: inválida ou erro? | comportamento imprevisível | a IA |
| Espaços nas pontas invalidam? | bug de cadastro | a IA |
| Maiúsculas importam? | usuário não consegue entrar | a IA |
| Devolve booleano ou lança? | chamador quebra | a IA |

A mesma frase, agora como especificação:

```typescript
// aula03-especificacao-e-teste/exemplos/01-da-frase-a-especificacao.ts
/**
 * Valida um endereco de email para cadastro no sistema.
 *
 * Especificacao:
 *   - precisa ter exatamente um "@"
 *   - precisa ter ao menos um caractere antes do "@"
 *   - o dominio precisa conter um "." com ao menos um caractere de cada lado
 *   - espacos nas pontas sao aparados antes de validar
 *   - string vazia e invalida (devolve false, nao lanca erro)
 *   - maiusculas e minusculas nao importam
 */
```

**Este bloco é, ao mesmo tempo, três coisas:** documentação para quem lê, contexto
para o Copilot que vai completar a função abaixo dele, e o roteiro dos testes.

> **Quando a IA escreve isto:** cole a frase vaga num chat e peça
> *"que perguntas você precisaria que eu respondesse para implementar isso sem
> chutar?"*. É um dos usos mais produtivos de IA no curso — ela é boa em enumerar
> o que ficou em aberto.

**Verifique:** `npm test -- 01-da-frase`

---

## 2. A especificação vira teste quase palavra por palavra

```typescript
// aula03-especificacao-e-teste/exemplos/01-da-frase-a-especificacao.spec.ts
it("exige exatamente um arroba", () => {
  expect(emailValido("anafatec.br")).toBe(false);
  expect(emailValido("ana@@fatec.br")).toBe(false);
});

it("apara espacos nas pontas", () => {
  expect(emailValido("  ana@fatec.br  ")).toBe(true);
});

it("string vazia e invalida, e nao lanca erro", () => {
  expect(() => emailValido("")).not.toThrow();
  expect(emailValido("")).toBe(false);
});
```

Uma linha da especificação → um `it`. Se você não consegue escrever o `it`, a linha
da especificação ainda está vaga.

Esse é o teste mais barato de qualidade de um pedido: **tente traduzir cada frase
em uma asserção.** O que não traduz, não estava especificado.

---

## 3. Anatomia de um teste

Três passos, sempre:

```typescript
it("soma preco vezes quantidade de cada produto", () => {
  const itens = carrinho();            // Preparar — monte o cenário
  const total = calcularTotal(itens);  // Agir — chame o que está sendo testado
  expect(total).toBe(38);              // Verificar — afirme o resultado
});
```

| Peça | Papel |
| --- | --- |
| `describe` | agrupa testes relacionados |
| `it` | um comportamento, descrito em português |
| `expect(x).toBe(y)` | a afirmação |

O nome do `it` descreve **o comportamento**, não o método. `"soma preço vezes
quantidade"` é útil quando falha; `"testa calcularTotal"` não diz nada.

> **Comparando com C:** em C você provavelmente testava com `printf` e olho. A
> diferença não é a linguagem — é que o teste automatizado ainda estará te
> protegendo daqui a três semanas, quando você (ou a IA) mexer nessa função de novo.

---

## 4. Asserção forte e asserção fraca

Este é o ponto que decide se seus testes servem para revisar código de IA.

```typescript
// FRACA: passa com qualquer número positivo. Não prova o cálculo.
expect(calcularTotal(carrinho())).toBeGreaterThan(0);

// FORTE: só passa com o valor certo.
expect(calcularTotal(carrinho())).toBe(38);
```

O critério para julgar um teste:

> **Que implementação errada passaria neste teste?**

Se você consegue imaginar uma, o teste é fraco. `toBeGreaterThan(0)` é satisfeito
por `return 1`.

Asserções que costumam ser fracas: `toBeDefined()`, `toBeTruthy()`,
`not.toBeNull()`, `toBeGreaterThan(0)`. Nem sempre erradas — mas raramente
suficientes sozinhas.

> **Quando a IA escreve isto:** peça testes a um modelo e você recebe, com
> frequência, uma suíte verde cheia de `toBeDefined()`. Fica bonita no relatório
> e não prova nada. Ao revisar teste gerado, aplique a pergunta acima a cada `expect`.

**Verifique:** `npm test -- 02-anatomia`

---

## 5. Casos de borda: onde tudo quebra

Para qualquer função, percorra esta lista:

| Categoria | Exemplos |
| --- | --- |
| **Vazio** | array `[]`, string `""`, objeto sem campos |
| **Zero** | `0`, `0.0`, quantidade zero |
| **Negativo** | `-1`, valor negativo onde só se espera positivo |
| **Limite** | exatamente o valor da fronteira (`>= 9` vs `> 9`) |
| **Ausente** | `null`, `undefined`, campo opcional não informado |
| **Grande** | número muito alto, lista muito longa |
| **Repetido** | mesmo elemento duas vezes |

O **limite** é o mais traiçoeiro e o mais frequente em código gerado. Um modelo
acerta a estrutura do `if` e erra o operador de comparação, porque ambos são
igualmente plausíveis no texto de treinamento — e só a sua especificação diz qual
é o certo.

---

## 6. O mesmo texto serve para você e para a máquina

Compare:

```
faz uma função de média
```

```
Implemente `media(notas: number[]): number` em `src/notas.ts`.

- array vazio retorna 0
- não modifique o array recebido
- sem bibliotecas externas

Critério de aceite: `npx vitest run src/notas.spec.ts` verde.
Não altere o arquivo de teste.
```

O segundo é um prompt melhor **e** uma especificação melhor **e** o roteiro dos
testes. São o mesmo artefato. Você não aprende "engenharia de prompt" separada da
engenharia de software: aprende a especificar, e o prompt melhora junto.

Note as quatro partes, que vão reaparecer na Aula 12 ao dirigir agentes:
**objetivo · restrições · fronteira · critério de aceite**.

Mais exemplos em [recursos/catalogo-de-prompts.md](../recursos/catalogo-de-prompts.md).

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"cria uma função que aplica desconto progressivo: 10% acima de 100 reais, 20% acima de 500"*

```typescript
// aula03-especificacao-e-teste/exemplos/leitura-critica/gerado-pela-ia.ts
export function aplicarDesconto(valor: number): number {
  let desconto = 0;
  if (valor > 100) desconto += 0.1;
  if (valor > 500) desconto += 0.2;
  return valor * (1 - desconto);
}
```

**Antes de rodar**, rastreie para `valor = 1000`:

| Passo | Condição | Entra? | `desconto` |
| --- | --- | --- | --- |
| início | | | `0` |
| primeiro `if` | `1000 > 100` | | |
| segundo `if` | `1000 > 500` | | |
| retorno | `1000 * (1 - desconto)` | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** para valores acima de 500, **os dois `if` entram**, e o desconto
> acumula: `0.1 + 0.2 = 0.3`. Uma compra de 1000 sai por 700, não por 800.
>
> Repare que o código está *certo* para uma leitura do pedido — a leitura em que as
> faixas são cumulativas. O erro não está na implementação: está na frase. "10%
> acima de 100, 20% acima de 500" não diz se as faixas acumulam, e a IA escolheu.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: faltava a frase **"as faixas não acumulam: vale a faixa mais
> alta atingida"**. Uma linha. É sempre uma linha — e é sempre a que você não
> escreveu.

---

## Verificação: como provar que funciona

- **Invariante desta aula:** cada linha da especificação tem pelo menos um `it`
  correspondente. O que não tem teste, não está especificado.
- **Casos de borda obrigatórios:** vazio · zero · negativo · limite · ausente · repetido
- **O teste que pegaria o bug acima:**

```typescript
it("acima de 500 aplica 20%, e nao 30%", () => {
  expect(aplicarDesconto(1000)).toBe(800);
});
```

Comandos:

```bash
npm test -- aula03       # exemplos
npm run ex -- aula03     # exercícios
npm run ex -- 01-desconto  # um exercício só
npm run typecheck
```

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Descobrir o que falta | "implementa isso" | "Que perguntas você precisaria que eu respondesse para implementar isso sem chutar?" | Devolve a ambiguidade antes de virar código |
| Gerar casos de teste | "escreve testes" | "Liste os casos de borda desta especificação. Só a lista, sem código ainda." | Você mantém o controle do que entra |
| Implementar | "faz uma função de desconto" | especificação completa + critério de aceite | Não sobra decisão para a máquina |
| Revisar spec | "tá bom assim?" | "Que duas implementações diferentes satisfazem esta especificação?" | Se existem duas, ela está ambígua |

O último é o melhor prompt desta aula. Se a IA consegue mostrar duas
implementações incompatíveis que satisfazem o seu texto, o texto ainda não está pronto.

**Ferramenta por ferramenta**

- *Copilot inline:* escreva a especificação em comentário **antes** da assinatura — ela vira o contexto da sugestão.
- *Copilot Chat:* `/tests` sobre uma função já implementada, depois avalie cada asserção com a pergunta da seção 4.
- *Chat de navegador:* peça a lista de perguntas em aberto sobre um requisito.
- *Agente:* exercício 3 — a especificação é o que você entrega a ele.

---

## Git desta aula: commits que contam a história

```bash
git add aula03-especificacao-e-teste/exercicios/01-desconto-progressivo.ts
git commit -m "aula03: corrige faixas de desconto para nao acumular"

git log --oneline
```

Mensagem de commit segue a mesma lógica da especificação: diz **o que mudou e por
quê**, não como.

| Fraca | Boa |
| --- | --- |
| `update` | `aula03: corrige faixas de desconto para nao acumular` |
| `fix` | `aula03: trata array vazio em calcularMedia` |
| `wip` | `aula03: adiciona casos de borda ao teste de senha` |

> **Rede de segurança:** um commit por exercício resolvido. Se o próximo experimento
> der errado, `git restore .` volta ao último ponto bom.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Desconto sem acumular**
Arquivo: `exercicios/01-desconto-progressivo.ts` · Teste: `npm run ex -- 01-desconto`

- Implemente a versão correta: as faixas **não** acumulam.
- Atenção aos limites: 100 e 500 exatos ficam na faixa de baixo.
- Valor negativo lança `Error("valor invalido")`.
- **Aceite:** os 9 testes verdes, sem alterar o arquivo de teste.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Validação de senha**
Arquivo: `exercicios/02-especificar-senha.ts` · Teste: `npm run ex -- 02-especificar`

- O pedido original era *"valida a senha do usuário, tem que ser segura"*. Compare
  com a especificação no arquivo e conte quantas decisões estavam escondidas.
- Antes de implementar, pergunte ao chat: *"que caso de borda esta especificação
  ainda deixa em aberto?"*
- Cuidado com a **ordem** dos problemas e com a proibição de repetir.
- **Aceite:** testes verdes **e** você consegue explicar cada linha aceita.

### 🤖 Com agente — você especifica e revisa

**3. Conflitos de agenda**
Arquivo: `exercicios/03-agenda.ts` · Spec: `exercicios/03-agenda.spec.md`

- Preencha a especificação **antes** de chamar o agente.
- A regra mais fácil de errar: *encostar não é conflito* — depende de `<` e não `<=`.
  Confira isso no diff antes de rodar o teste.
- **Aceite:** teste verde **e** as 4 perguntas de revisão respondidas.

---

## Autoavaliação

- [ ] Consigo transformar um pedido vago numa especificação com casos de borda.
- [ ] Sei dizer, para um `expect`, que implementação errada passaria nele.
- [ ] Escrevo o nome do `it` descrevendo comportamento, não método.
- [ ] Percorro a lista de bordas (vazio, zero, negativo, limite, ausente) por hábito.
- [ ] Achei o bug da leitura crítica sem rodar o código.
- [ ] Entendi que o prompt e a especificação são o mesmo texto.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| Faixas ambíguas | IA acumula o que não devia acumular | Escreva "as faixas não acumulam" |
| Asserção frouxa | Suíte verde, comportamento errado | Pergunte que implementação errada passaria |
| Testar o método, não o comportamento | Nome de teste inútil quando falha | `it("array vazio devolve 0")`, não `it("testa media")` |
| Esquecer o limite exato | `>= ` vs `>` erra em 1 caso | Sempre teste o valor exato da fronteira |
| Ponto flutuante | `0.1 * 3 !== 0.3` | Arredonde e teste o arredondamento |

---

## Resumo

Um pedido em linguagem natural sempre esconde decisões, e toda decisão que você não
escreve é tomada pela IA sem aviso. Especificar é responder essas perguntas antes:
entrada, saída, casos de borda, restrições. A especificação tem uma forma
executável — o teste — e a tradução é quase linha a linha: o que você não consegue
transformar em `it`, ainda está vago. Um teste só vale o que sua asserção afirma, e
o critério para julgar é sempre "que implementação errada passaria nisto?". No fim,
o texto que serve de especificação, de prompt e de roteiro de testes é o mesmo
texto — por isso especificar bem é a habilidade que melhora tudo de uma vez.

---

## Leitura complementar

- [Vitest — Expect API](https://vitest.dev/api/expect.html)
- [MDN — Testes automatizados](https://developer.mozilla.org/pt-BR/docs/Learn/Tools_and_testing)
- [Catálogo de prompts do curso](../recursos/catalogo-de-prompts.md)
