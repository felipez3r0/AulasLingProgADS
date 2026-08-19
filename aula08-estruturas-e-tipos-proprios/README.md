# Aula 08 — Estruturas, uniões e tipos definidos pelo usuário

> **Módulo:** M2 — Fundamentos da linguagem sob verificação
> **Ementa oficial:** E6 — Estruturas, uniões e tipos definidos pelo usuário
> **Skills:** S7 (reforça), S1 (reforça)
> **Pré-requisitos:** Aulas 01 a 07

## Objetivos

- Modelar dados com `interface` e `type`, incluindo campos opcionais e `readonly`
- Usar **union types**, literal types e *type guards*
- Escrever **uniões discriminadas** com verificação de exaustividade
- Conhecer generics e utility types (`Pick`, `Omit`, `Partial`, `Record`)
- Skill de dev-com-IA: **tornar estados inválidos irrepresentáveis**

## Por que isso importa quando a IA escreve o código

Existe uma forma de revisar código gerado que é mais barata que ler o diff, mais
rápida que rodar teste e não depende da sua atenção: **fechar o tipo antes de
pedir**.

Um tipo frouxo — cheio de campos opcionais — aceita qualquer coisa. A IA gera algo
plausível, o compilador não reclama, e o erro só aparece quando um cliente recebe
`"Pedido a caminho. Rastreio: undefined"`.

Um tipo fechado recusa o inválido antes de qualquer teste rodar. E quando você
acrescenta um caso novo mais tarde, o compilador aponta **todos** os lugares que
precisam mudar — inclusive nos que a IA escreveu e você não lembra que existem.

Modelar bem o domínio deixou de ser refinamento e virou a instrução mais eficiente
que você dá à máquina.

## Antes de começar

```bash
npm test -- aula08     # exemplos desta aula: devem PASSAR
npm run ex -- aula08   # exercícios: devem FALHAR (é o esperado)
```

---

## 1. Estruturas: `interface` e `type`

```typescript
// aula08-estruturas-e-tipos-proprios/exemplos/01-estruturas.ts
export interface Aluno {
  ra: string;
  nome: string;
  curso: string;
  ativo: boolean;
}

export interface Matricula {
  readonly id: string;    // não pode ser reatribuída
  alunoRa: string;
  disciplina: string;
  nota?: number;          // pode não existir
}
```

| Recurso | Sintaxe | Efeito |
| --- | --- | --- |
| opcional | `nota?: number` | o tipo vira `number \| undefined` |
| somente leitura | `readonly id: string` | reatribuir não compila |
| aninhado | `professor: { nome: string }` | estrutura dentro de estrutura |

> **Comparando com C:**
> ```c
> struct Aluno {
>   char ra[16];
>   char nome[64];
>   int ativo;
> };
> ```
> A ideia é a mesma: dar nome a um agregado de campos. As diferenças: aqui não há
> gestão de memória nem tamanho fixo de string, e o tipo **existe só em tempo de
> compilação** — ele é apagado antes de rodar. Serve para o compilador te avisar,
> não para a máquina alocar.

`interface` e `type` fazem quase o mesmo. Regra prática: `interface` para formatos
de objeto; `type` quando você precisar de união ou composição.

### Atualizar sem mutar

A lição da Aula 07 aplicada a objetos:

```typescript
export function desativar(aluno: Aluno): Aluno {
  return { ...aluno, ativo: false };   // objeto novo
}
```

**Verifique:** `npm test -- 01-estruturas`

---

## 2. Uniões

```typescript
type Identificador = string | number;
type Status = "pendente" | "pago" | "cancelado";   // literal types
```

Com uma união, você precisa **estreitar** antes de usar métodos específicos:

```typescript
function formatarId(id: string | number): string {
  if (typeof id === "string") return id.toUpperCase();   // aqui é string
  return `#${id}`;                                        // aqui é number
}
```

Isso se chama *type guard*. Repare que é um desvio condicional — o conteúdo da
Aula 05 — só que o compilador acompanha o raciocínio junto com você.

---

## 3. Uniões discriminadas: o coração da aula

Cada variante carrega um campo que a identifica:

```typescript
// aula08-estruturas-e-tipos-proprios/exemplos/02-unioes.ts
export type Pagamento =
  | { metodo: "dinheiro"; valor: number }
  | { metodo: "cartao"; valor: number; parcelas: number }
  | { metodo: "pix"; valor: number; chave: string };
```

Dentro de `case "cartao"`, o campo `parcelas` existe. Fora dele, acessá-lo **não
compila**.

> **Comparando com C:**
> ```c
> struct Valor {
>   int tipo;                        // a tag, mantida na mão
>   union { int i; char *s; } dados;
> };
> ```
> Em C, `union` é sobre **memória**: os campos compartilham o mesmo espaço, um
> válido de cada vez, e cabe a você lembrar qual — guardando uma *tag* manualmente.
> Esquecer de checar a tag **compila** e quebra em execução.
>
> Em TypeScript, união é sobre **possibilidades**, e a tag é verificada pelo
> compilador. Esquecer de tratar um caso é erro de compilação. Mesmo nome, problema
> diferente, garantia muito melhor.

### Verificação de exaustividade

```typescript
function verificarExaustividade(valor: never): never {
  throw new Error(`variante nao tratada: ${JSON.stringify(valor)}`);
}

switch (p.metodo) {
  case "dinheiro": /* ... */
  case "cartao":   /* ... */
  case "pix":      /* ... */
  default: return verificarExaustividade(p);   // p só é `never` se tudo foi tratado
}
```

Este é o padrão mais valioso da aula. Se alguém acrescentar `{ metodo: "boleto" }`
ao tipo, `p` deixa de ser `never` no `default`, e **o compilador aponta todos os
`switch` do projeto que precisam mudar**.

> **Quando a IA escreve isto:** é exatamente a proteção que você quer ao trabalhar
> com um agente. Você pede "adicione pagamento por boleto"; ele altera o tipo; o
> `typecheck` lista os cinco lugares que ficaram incompletos. Sem exaustividade,
> ele altera o tipo, esquece dois lugares, e tudo continua compilando.

### `Resultado<T>`: falha como valor

```typescript
export type Resultado<T> = { ok: true; valor: T } | { ok: false; erro: string };
```

Em vez de lançar exceção, a falha vira parte do tipo de retorno — e quem chama é
**obrigado** pelo compilador a considerar o caso de erro. Volta na Aula 14.

**Verifique:** `npm test -- 02-unioes`

---

## 4. Generics e utility types

```typescript
function primeiro<T>(lista: T[]): T | undefined {
  return lista[0];
}

primeiro([1, 2, 3]);      // number | undefined
primeiro(["a", "b"]);     // string | undefined
```

`T` é um tipo que quem chama decide. O mesmo código, sem perder a informação de tipo.

| Utility type | O que faz |
| --- | --- |
| `Pick<T, "a" \| "b">` | só os campos escolhidos |
| `Omit<T, "id">` | tudo menos os campos listados |
| `Partial<T>` | todos os campos opcionais |
| `Record<K, V>` | objeto com chaves `K` e valores `V` |

`Omit<Produto, "id">` é o tipo de "produto para criar" — ainda sem id. Derivar
tipos assim evita duplicação e mantém tudo sincronizado quando o original muda.

---

## Leitura crítica: ache o bug

O trecho abaixo foi gerado por IA a partir do pedido:

> *"modela o estado de um pedido: pode estar pendente, pago, enviado com código de rastreio, ou cancelado com motivo"*

```typescript
// aula08-estruturas-e-tipos-proprios/exemplos/leitura-critica/gerado-pela-ia.ts
export interface Pedido {
  id: string;
  status: "pendente" | "pago" | "enviado" | "cancelado";
  codigoRastreio?: string;
  motivoCancelamento?: string;
  dataPagamento?: string;
}
```

**Antes de rodar**, responda:

| Estado que eu tento escrever | O tipo aceita? | Existe no mundo real? |
| --- | --- | --- |
| `{ status: "enviado" }` sem rastreio | | |
| `{ status: "cancelado" }` sem motivo | | |
| `{ status: "cancelado", codigoRastreio: "BR1" }` | | |
| `{ status: "pendente", dataPagamento: "..." }` | | |

**Perguntas**

1. Qual entrada faz este código produzir resultado errado?
2. O erro é de lógica, de tipo, de borda ou de suposição sobre a biblioteca?
3. O que faltava no prompt para evitá-lo?

> **Resposta:** o tipo aceita **todas** as quatro linhas da tabela, e só a primeira
> coluna de cada uma existe de verdade. Um pedido enviado sem rastreio compila
> perfeitamente, e a mensagem que chega ao cliente é
> `"Pedido a caminho. Rastreio: undefined"`.
>
> Faça as contas: 4 status × 2³ combinações de campos opcionais = **32 estados
> representáveis**, dos quais 4 são válidos. O tipo está descrevendo 28 situações
> que não existem, e o compilador vai defender todas elas.
>
> A causa é a forma escolhida: um `status` solto mais campos opcionais soltos. Não
> há nada ligando `status: "enviado"` a `codigoRastreio`. A união discriminada faz
> exatamente essa ligação.
>
> Documentado e provado em `exemplos/leitura-critica/gerado-pela-ia.spec.ts`.
> Corrigir é o exercício 🚫 1.
>
> Sobre a pergunta 3: o pedido estava até bem escrito — ele **dizia** "enviado com
> código de rastreio". Faltou a instrução de forma: *"use uma união discriminada;
> cada estado só carrega os campos que fazem sentido nele"*. Sem isso, o modelo
> escolhe a forma mais comum no código do mundo, que é a frouxa.

---

## Verificação: como provar que funciona

- **Invariantes desta aula:**
  - todo estado representável pelo tipo é um estado que existe de verdade;
  - todo `switch` sobre união tem verificação de exaustividade;
  - nenhuma saída para o usuário pode conter `"undefined"`.
- **Casos de borda obrigatórios:** cada variante · campo opcional ausente · valor zero

```typescript
it("nenhuma mensagem contem undefined", () => {
  for (const p of todosOsEstados) {
    expect(mensagemDoPedido(p)).not.toContain("undefined");
  }
});
```

> **A verificação mais importante desta aula não é um teste.** É `npm run typecheck`
> continuar passando **enquanto** o estado inválido se torna impossível de escrever.
> Depois de resolver o exercício 1, tente acrescentar isto ao arquivo:
>
> ```typescript
> const invalido: Pedido = { id: "1", status: "enviado" };
> ```
>
> Se o seu tipo estiver certo, isso não compila. Essa recusa é o resultado.

---

## Prompts desta aula

| Situação | Prompt fraco | Prompt bom | Por quê |
| --- | --- | --- | --- |
| Modelar estado | "modela o pedido com status" | "Use uma união discriminada por `status`. Cada variante carrega **apenas** os campos que fazem sentido nela. Estados inválidos devem ser impossíveis de escrever." | Diz a forma, não só o conteúdo |
| Tratar variantes | "faz um switch pro status" | "Use `switch` com verificação de exaustividade via `never`, para que uma variante nova quebre a compilação." | Garante manutenção futura |
| Revisar tipo | "esse tipo tá bom?" | "Quantos estados este tipo permite representar? Quantos existem de verdade? Liste os inválidos." | Torna o problema contável |
| Erro sem exceção | "trata o erro" | "Devolva `Resultado<T> = {ok:true,valor:T} \| {ok:false,erro:string}` em vez de lançar." | Obriga o chamador a tratar |

O terceiro é o melhor prompt de revisão desta aula: **contar os estados
inválidos** transforma "acho que está frouxo" em um número.

**Ferramenta por ferramenta**

- *Copilot inline:* escreva o tipo primeiro; o corpo do `switch` sai quase de graça depois.
- *Copilot Chat:* selecione o tipo e peça a lista de estados inválidos que ele permite.
- *Chat de navegador:* bom para discutir alternativas de modelagem antes de escrever.
- *Agente:* exercício 3 — e note que ele depende do tipo que **você** modelou.

---

## Git desta aula: tags para marcos

Fim do Módulo 2 é um marco: você cobriu E1 a E6 da ementa.

```bash
git tag -a v1-fundamentos -m "Fundamentos da linguagem concluidos"
git push origin v1-fundamentos

git tag                  # lista as tags
git show v1-fundamentos  # o que estava no código nesse ponto
```

> **Rede de segurança:** uma tag é um nome permanente para um commit. Antes de
> começar o Módulo 3, você tem um ponto nomeado ao qual sempre pode voltar.

---

## Exercícios

### 🚫 Sem IA — construir modelo mental

> Desligue as sugestões: `Ctrl+Shift+P` → *GitHub Copilot: Disable Completions*.

**1. Estados impossíveis**
Arquivo: `exercicios/01-estados-impossiveis.ts` · Teste: `npm run ex -- 01-estados-impossiveis`

- Substitua a interface frouxa por uma união discriminada de quatro variantes.
- Implemente `mensagemDoPedido` com `switch` e verificação de exaustividade.
- **Depois de passar nos testes**, faça a prova real: escreva
  `const p: Pedido = { id: "1", status: "enviado" };` e confirme que
  `npm run typecheck` **recusa**. Depois apague a linha.
- **Aceite:** os 7 testes verdes + o typecheck recusando o estado inválido.

### 🤝 Com IA assistida — você dirige, ela digita

**2. Catálogo de itens**
Arquivo: `exercicios/02-catalogo.ts` · Teste: `npm run ex -- 02-catalogo`

- O tipo já está fechado no arquivo. **Repare no efeito:** com a união
  discriminada pronta, as sugestões do Copilot para os `switch` nascem quase
  corretas — ele não tem como inventar um campo que não existe na variante.
- É a demonstração prática da tese da aula: o tipo é a instrução mais eficiente.
- **Aceite:** os 13 testes verdes **e** você consegue explicar cada `case`.

### 🤖 Com agente — você especifica e revisa

**3. Máquina de estados do pedido**
Arquivo: `exercicios/03-maquina-de-estados.ts` · Spec: `exercicios/03-maquina-de-estados.spec.md`

- Este exercício **importa o tipo que você modelou no exercício 1**. Se o seu tipo
  ficou frouxo, o agente vai conseguir escrever código errado que compila. Se
  ficou fechado, o compilador barra o agente antes de você precisar revisar.
- A especificação proíbe `throw`: falha é valor de retorno.
- **Aceite:** os 12 testes verdes, `npm run typecheck` limpo **e** as 4 perguntas
  de revisão respondidas.

---

## Autoavaliação

- [ ] Sei escrever uma união discriminada e explicar por que ela é melhor que campos opcionais.
- [ ] Sei implementar verificação de exaustividade com `never`.
- [ ] Consigo contar quantos estados inválidos um tipo frouxo permite.
- [ ] Sei explicar a diferença entre a `union` do C e a união do TypeScript.
- [ ] Achei o bug da leitura crítica sem rodar o código.
- [ ] Fechei o tipo **antes** de pedir a implementação à IA.

---

## Armadilhas conhecidas

| Armadilha | Sintoma | Como evitar |
| --- | --- | --- |
| Campos opcionais soltos | estados impossíveis compilam | União discriminada |
| `switch` sem exaustividade | variante nova esquecida em silêncio | Caso `default` com `never` |
| `interface` onde precisava de `type` | união não compila | `type` para uniões |
| `\|\|` com campo opcional numérico | `0` tratado como ausente | `??` |
| `as` para calar o compilador | erro adiado para a execução | Corrija o tipo |

---

## Resumo

Estruturas dão nome a agregados de campos, como o `struct` do C. Uniões são onde a
comparação fica interessante: em C, `union` compartilha memória e a tag é sua
responsabilidade; em TypeScript, a união é de possibilidades e a tag é verificada
pelo compilador. Daí sai a tese da aula: um tipo frouxo, com `status` solto e
campos opcionais soltos, permite 32 estados quando existem 4 — e defende todos os
28 inválidos. A união discriminada liga cada campo ao estado em que ele faz
sentido, e a verificação de exaustividade com `never` faz o compilador apontar
todos os lugares que precisam mudar quando um caso novo entra. Fechar o tipo antes
de pedir é a instrução mais barata e mais eficaz que você dá a uma IA: ela recusa o
inválido antes de qualquer teste rodar.

---

## Leitura complementar

- [TypeScript — Unions and Intersection Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)
- [TypeScript — Narrowing e exaustividade](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TypeScript — Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
