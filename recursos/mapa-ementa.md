# Mapa da ementa oficial

A ementa da disciplina é documento formal do curso e foi escrita quando a
linguagem de referência era C. Este curso usa TypeScript. Este documento mostra,
item por item, **onde cada tópico da ementa é coberto** e **como ele foi traduzido**
de forma honesta — sem fingir que o conceito é idêntico e sem fingir que sumiu.

`npm run estrutura` verifica automaticamente que todo item abaixo continua tendo
pelo menos uma aula responsável. Se alguém reorganizar o curso e deixar um item
órfão, o CI falha.

---

## Ementa oficial

> Variáveis, constantes, operadores e expressões. Comandos de desvio. Controle de
> malhas. Vetores e ponteiros. Funções de biblioteca. Estruturas, uniões e tipos
> definidos pelo usuário. Manipulação de arquivos.

**Objetivo oficial:** solucionar problemas utilizando a lógica de programação e a
implementação de programas por meio de uma linguagem de programação.

---

## Rastreabilidade

| Código | Item da ementa | Aula principal | Reforçado em |
| --- | --- | --- | --- |
| **E1** | Variáveis, constantes, operadores e expressões | 04 | 03, 05 |
| **E2** | Comandos de desvio | 05 | 08, 14 |
| **E3** | Controle de malhas | 05 | 07, 10 |
| **E4** | Vetores e ponteiros | 07 | 08, 10 |
| **E5** | Funções de biblioteca | 06, 09 | 10, 13 |
| **E6** | Estruturas, uniões e tipos definidos pelo usuário | 08 | 10, 14 |
| **E7** | Manipulação de arquivos | 10 | 14, 15 |

---

## Traduções que exigem explicação

Dois itens da ementa nomeiam construções que **não existem em TypeScript com o mesmo
significado**. Fingir equivalência seria desonesto; omitir seria descumprir a ementa.
A saída do curso é tratar a diferença como conteúdo.

### "Vetores e ponteiros" → Aula 07

Vetor traduz direto: array. Ponteiro, não.

Em C você manipula **endereços de memória**: `&x` pega o endereço, `*p` acessa o
valor, e aritmética de ponteiro caminha pela memória. TypeScript não expõe nada
disso. Mas a ideia de fundo — **duas variáveis podem apontar para a mesma coisa** —
existe e é a fonte de uma classe inteira de bugs.

O que sobrevive:

| Conceito de C | Como aparece em TypeScript |
| --- | --- |
| Duas variáveis apontando para o mesmo dado | Referência: `const b = a` não copia arrays e objetos |
| Modificar através do ponteiro afeta o original | Mutação através de alias — o bug mais comum em código gerado por IA |
| Passar ponteiro para função | Objetos e arrays vão por referência; a função pode alterar o do chamador |
| Ponteiro nulo | `null` e `undefined` como ausência de valor |
| Acesso fora dos limites | Em C, comportamento indefinido; em TS, `undefined` — e com `noUncheckedIndexedAccess` o compilador **obriga** você a tratar |
| Identidade vs igualdade | `===` entre objetos compara referência, não conteúdo |

O que **não** existe: aritmética de ponteiro, `malloc`/`free`, operadores `&` e `*`,
ponteiro para função como endereço bruto (funções são valores de primeira classe).

A Aula 07 tem uma seção dedicada a essa comparação, com código C e TypeScript lado a lado.

### "Uniões" → Aula 08

Em C, `union` é sobre **memória**: vários campos compartilhando o mesmo espaço, um
válido de cada vez, e cabe a você lembrar qual — normalmente guardando uma *tag* à mão:

```c
struct Valor {
  int tipo;              // 0 = inteiro, 1 = texto  <- a tag, mantida na mão
  union { int i; char* s; } dados;
};
```

Em TypeScript, união é sobre **possibilidades**, e a tag é verificada pelo compilador:

```typescript
type Valor =
  | { tipo: "inteiro"; valor: number }
  | { tipo: "texto"; valor: string };
```

A diferença que importa para o aluno: em C, esquecer de checar a tag compila e
quebra em execução. Em TypeScript, esquecer de tratar um caso da união é **erro de
compilação** — e com o padrão de exaustividade (`never`), adicionar um caso novo
faz o compilador apontar todos os lugares que precisam mudar.

Isso é conteúdo de dev-com-IA, não só de linguagem: **fechar o tipo é o jeito mais
barato de impedir que a IA gere código incoerente**, porque o erro aparece antes de
qualquer teste rodar.

### "Funções de biblioteca" → Aulas 06 e 09

A ementa se refere ao que em C é `stdio.h`, `string.h`, `math.h`. O equivalente
moderno tem duas camadas, e o curso cobre as duas:

- **Aula 06** — o que é uma função, contrato, escopo. Você precisa disso antes de
  usar as dos outros.
- **Aula 09** — biblioteca padrão (`Array`, `String`, `Math`, `JSON`, módulos
  `node:`) e bibliotecas de terceiros via npm. Aqui entra o conteúdo que C não
  tinha como ter: **como conferir que um pacote sugerido pela IA existe de fato**.

---

## O que o curso acrescenta à ementa

A ementa define o mínimo. Este curso acrescenta, porque um aluno que se forma hoje
sem isso chega despreparado:

| Tema | Aula | Por quê |
| --- | --- | --- |
| Especificação e teste automatizado | 03 | Sem critério de aceite, não há como verificar código gerado |
| Depuração sistemática | 11 | A IA erra e insiste; sair do loop é habilidade própria |
| Agentes de codificação | 12 | É o modo de trabalho que o aluno vai encontrar no estágio |
| Segurança de dependências e segredos | 09 | Superfície de ataque criada justamente pelo uso de IA |
| HTTP, REST e API | 13, 14 | Aplicação integrada dos itens E1–E7 num programa real |
