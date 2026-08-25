# Aula 12 - Code Review Cruzado de PRs com Rubrica

**Modo de IA: Par** — o PR que você revisa nasceu do fluxo Par da aula11, e a revisão é a etapa final desse fluxo. IA pode ajudar a entender o código revisado; o comentário de review é seu.

## Objetivos da aula

- Abrir um Pull Request descrevendo o que foi feito e por quê.
- Revisar o PR de um colega usando uma rubrica objetiva, com comentários específicos e acionáveis.
- Responder a um review recebido: corrigir ou justificar, nunca ignorar.

## Leitura prévia (antes da aula)

- Leia a [rubrica de code review](../recursos/rubrica-code-review.md).
- Traga pronto (commitado, com PR aberto) o Exercício 1 da aula11 (os 4 bugs corrigidos).

---

## Conteúdo

### Abrindo um Pull Request

```bash
git checkout -b fix/bug-02-erro-engolido
# ... corrige, commita ...
git push -u origin fix/bug-02-erro-engolido
```

No GitHub: **Compare & pull request** → título curto e descritivo → descrição explicando **o que** mudou e **por que** (não só "corrige bug"). Se o PR resolve um bug específico, referencie qual.

### Revisando com a rubrica

Use os 5 critérios de [`recursos/rubrica-code-review.md`](../recursos/rubrica-code-review.md): correção, testes, segurança/robustez, legibilidade, e clareza do próprio feedback dado. Pratique com o material da aula11 — os bugs plantados lá são exatamente o tipo de coisa que um review deveria pegar:

- Um PR que "corrige" `01-validacao-ausente` mas esquece de validar `preco <= 0` — o review deveria pegar isso.
- Um PR que corrige `04-referencia-compartilhada` copiando o array mas não os objetos dentro (o mesmo erro que o gabarito desta reescrita cometeu na primeira tentativa) — um bom review pegaria com um teste que muta o resultado e confere o array original.

### Exemplo de comentário bloqueante vs. sugestão

```
🔴 Bloqueante: a rota POST /produtos não valida `preco` — testei enviando
   { "nome": "x", "preco": -10 } e foi aceito. O contrato exige `preco`
   positivo.

🟡 Sugestão: `criarProduto` e `atualizarProduto` duplicam a mesma lógica
   de validação — poderia extrair uma função comum, não bloqueia o merge.
```

---

## Atividades em sala

1. **Revisão cruzada:** troque de par com um colega (não o mesmo da aula11) e revise o PR dele com os bugs corrigidos, usando a rubrica — pelo menos um comentário por critério, mesmo que seja "sem problema aqui".
2. **Responder ao review:** cada aluno responde às threads recebidas — corrigindo ou justificando — e o revisor original confere se a resposta resolveu.

## Exercícios para casa

- **Exercício 1 (Par):** revise o PR de outro colega (designado pelo professor) usando a rubrica completa; deixe pelo menos 3 comentários específicos (linha + observação).
- **Exercício 2 (Tutor):** peça a uma IA para explicar a diferença entre um comentário de review "genérico" e um "acionável" — compare com os dois exemplos dados no conteúdo desta aula.
- **Exercício 3 (Sem IA):** responda, sozinho, às threads que você recebeu no Exercício 1 do colega que revisou seu PR.

## Critério de entrega

- PR aberto no GitHub com descrição clara do que foi corrigido.
- Review recebido de um colega, com pelo menos 3 comentários, todos respondidos (corrigidos ou justificados).
- Nenhuma thread de review ignorada sem resposta.
