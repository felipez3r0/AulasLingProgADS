# Checklist de revisão de código gerado por IA

Use isto **toda vez** que for aceitar código que você não escreveu — sugestão do
Copilot, resposta de chat, diff de agente ou PR aberto por bot.

O checklist não é burocracia. Cada item corresponde a um erro que modelos de
linguagem cometem com frequência, e que passa despercebido porque o código
*parece* correto. Código gerado por IA erra bonito: indentado, nomeado, comentado.

---

## 1. Entendimento (antes de qualquer outra coisa)

- [ ] Consigo explicar **cada linha** em voz alta, sem consultar a IA de novo.
- [ ] Sei dizer o que acontece com entrada vazia, zero, negativa e no limite.
- [ ] Se eu apagasse isso agora, conseguiria reescrever algo equivalente.

> Se a primeira caixa falha, pare aqui. As outras não importam: você está prestes
> a assumir a manutenção de um código que não é seu.

## 2. O código faz o que foi pedido?

- [ ] Ele resolve o problema que eu tenho, e não um parecido.
- [ ] Não faz **mais** do que eu pedi (funcionalidade extra é superfície extra de bug).
- [ ] Os nomes descrevem o que a coisa realmente faz, não o que eu queria que fizesse.

## 3. Verificação

- [ ] `npm run typecheck` passa.
- [ ] Eu **rodei** os testes. Não estou supondo pela leitura.
- [ ] Existe teste para os casos de borda, não só para o caminho feliz.
- [ ] Nenhum arquivo de teste foi alterado para fazer o teste passar.

> O truque mais comum de um agente encurralado é enfraquecer a asserção.
> `git diff -- '*.test.ts' '*.spec.ts'` deve vir vazio.

## 4. Armadilhas típicas de código gerado

### Mutação de argumento
- [ ] Nenhuma função altera um array ou objeto que o chamador ainda vai usar.

```typescript
// Cheiro clássico: sort e reverse alteram o array original
export function maiores(notas: number[]): number[] {
  return notas.sort((a, b) => b - a).slice(0, 3);  // BUG: reordenou o array do chamador
}
```

### API que não existe (ou existe com outra assinatura)
- [ ] Todo método invocado existe de fato — conferido na documentação, não na memória.
- [ ] A ordem dos argumentos confere (`slice` vs `splice`, `sort` vs `toSorted`).

### Dependência alucinada
- [ ] Todo pacote sugerido existe no npm, com downloads, repositório e publicação recente.
- [ ] Nenhum `npm install` foi feito sem essa conferência.

> Modelos inventam nomes de pacote plausíveis. Existe ataque que registra
> justamente esses nomes inventados (*slopsquatting*) esperando que alguém instale.

### Erro engolido
- [ ] Nenhum `catch` vazio, nenhum erro capturado e ignorado.
- [ ] O caso de falha faz alguma coisa visível — lança, retorna erro ou registra.

### Comparação e conversão
- [ ] `===` em vez de `==`, salvo motivo explícito.
- [ ] Nenhuma conversão de tipo silenciosa mudando o significado.

### Concorrência e ordem
- [ ] Todo `await` que precisava existir está lá (`async` sem `await` é bandeira vermelha).

## 5. Segurança

- [ ] Nenhum segredo, token, senha, chave ou dado pessoal no diff.
- [ ] Nenhum dado do usuário chega ao sistema sem validação.
- [ ] Nada que eu colei no chat era confidencial.

> Segredo commitado não some com `git rm`. Ele continua no histórico. Se acontecer:
> **revogue a credencial primeiro**, depois limpe o histórico.

## 6. Tamanho e escopo

- [ ] O diff é pequeno o bastante para eu ter lido inteiro. Eu li inteiro.
- [ ] Nenhum arquivo fora do escopo da tarefa foi alterado.
- [ ] Nenhuma dependência nova entrou sem justificativa.

---

## O teste final

> **Se isso quebrar em produção às 23h de uma sexta-feira, eu consigo consertar?**

Se a resposta for não, o problema não é o código. É que ele ainda não é seu.
