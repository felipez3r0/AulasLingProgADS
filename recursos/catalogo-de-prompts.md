# Catálogo de prompts

Prompts prontos, organizados por situação. Não são fórmulas mágicas: são exemplos
do que separa um pedido vago de uma especificação. Adapte, não copie cego.

O padrão que percorre todos eles: **contexto + tarefa + restrição + critério de aceite**.

---

## Entender código

```
Explique este trecho linha a linha. Ao final, diga qual entrada faria
ele produzir um resultado errado e por quê.
```

```
Estou aprendendo TypeScript e venho de C. Explique o que este código faz,
usando comparações com C onde ajudar.
```

```
Que caso de borda este código não trata? Liste, não conserte.
```

> Peça o modo de falha. "Está certo?" quase sempre recebe "sim, está bom!" —
> a resposta agradável é mais provável que a correta.

---

## Gerar código

**Fraco:**
```
faz uma função de média
```

**Bom:**
```
Implemente `media(notas: number[]): number` em `src/notas.ts`.

Regras:
- array vazio retorna 0
- não modifique o array recebido
- não use bibliotecas externas

Critério de aceite: `npx vitest run src/notas.spec.ts` verde.
Não altere o arquivo de teste.
```

O que mudou: assinatura tipada, arquivo alvo, caso de borda explícito, restrição
e um comando que decide se terminou.

---

## Gerar testes

```
Escreva testes Vitest para a função abaixo. Cubra: caminho feliz, array vazio,
valor negativo, valor no limite e argumento ausente. Um `it` por caso, com
nome descrevendo o comportamento esperado, não o método testado.
```

```
Que casos de teste eu não pensei? Liste os casos, sem escrever o código ainda.
```

> Este é um dos melhores usos de IA no curso: ela é boa em enumerar casos de borda,
> que é exatamente onde a atenção humana falha.

---

## Depurar

**Fraco:**
```
não funciona, me ajuda
```

**Bom:**
```
Comportamento esperado: soma([1,2,3]) deve retornar 6.
Comportamento observado: retorna 3.

Reprodução mínima:
[cole aqui o menor código que mostra o problema]

Erro completo:
[cole o stack trace inteiro, não um resumo]

Versões: Node 22, TypeScript 5.9, Vitest 3.

Não me dê o código corrigido ainda. Liste 3 hipóteses para a causa,
da mais provável para a menos, e como eu testo cada uma.
```

> Pedir hipóteses em vez da correção mantém você no comando do diagnóstico — e
> é o que você vai precisar fazer quando a IA errar duas vezes seguidas.

---

## Revisar

```
Revise este diff procurando especificamente por:
1. funções que modificam argumentos recebidos
2. métodos de biblioteca invocados com assinatura errada
3. erros capturados e ignorados
4. casos de borda não tratados

Para cada problema, aponte a linha e mostre a entrada que o dispara.
```

```
Este código foi gerado por IA. Aja como revisor cético: liste o que você
mudaria antes de aprovar, em ordem de gravidade.
```

---

## Dirigir um agente

```
Objetivo
Implementar as funções declaradas em aula07/exercicios/01-inventario.ts.

Critério de aceite
`npm run ex:run -- aula07/01` verde.

Pode alterar
- aula07/exercicios/01-inventario.ts

NÃO pode alterar
- qualquer arquivo *.test.ts ou *.spec.ts
- qualquer arquivo fora de aula07/

Restrições
- sem dependências novas
- nenhuma função pode modificar o array recebido

Antes de começar, leia aula07/README.md e o arquivo de teste para
entender o contrato. Ao terminar, rode o comando de aceite e mostre a saída.
```

---

## Aprender (e não só resolver)

```
Não me dê a resposta. Me faça 3 perguntas que me levem a descobrir
onde está o erro no meu código.
```

```
Eu implementei assim: [código]. Existe uma forma mais idiomática em
TypeScript? Mostre as duas lado a lado e diga o que se ganha e o que se
perde em cada uma.
```

```
Me dê 5 exercícios sobre [tema], em ordem crescente de dificuldade,
sem as soluções.
```

> O último é o prompt mais subestimado do curso. A IA é boa geradora de prática,
> e prática é o que constrói a competência que nenhum prompt substitui.

---

## Anti-padrões

| Prompt | Por que dá errado |
| --- | --- |
| "faz o exercício 3 pra mim" | Você entrega o que não entende, e a próxima aula assume que você entendeu |
| "tá certo?" | Convida à concordância, não à análise |
| "cria um sistema de biblioteca completo" | Escopo grande demais para revisar; você vai aceitar sem ler |
| "conserta" (sem contexto) | A IA adivinha qual era o problema, e às vezes adivinha errado |
| colar o arquivo inteiro e dizer "erro" | Enterra o sinal no ruído; use reprodução mínima |
