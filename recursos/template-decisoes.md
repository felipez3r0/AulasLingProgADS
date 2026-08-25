# DECISOES.md — template

Copie este arquivo para a raiz do repositório do backend do seu grupo. Toda vez que um agente de IA gerar código não trivial (mais que autocomplete de uma linha), registre uma entrada — **antes** de esquecer o motivo.

Uma entrada por decisão relevante, não uma por prompt. Não precisa registrar autocomplete simples; registre quando a IA gerou uma rota, um schema, uma query, um trecho de lógica de negócio, ou uma correção de bug.

---

## Formato de cada entrada

```markdown
## [aaaa-mm-dd] Título curto da decisão

**Pedido:** o que foi pedido à IA (cole o prompt real, ou resuma se for longo).

**Aceito / Rejeitado / Ajustado:** qual dos três, e o resultado final.

**Motivo:** por que aceitou como veio, por que rejeitou, ou o que precisou ajustar e por quê.
```

## Exemplo preenchido

```markdown
## 2026-09-10 Rota POST /emprestimos

**Pedido:** "Implemente POST /emprestimos a partir deste contrato e teste"
(colado o trecho do contrato + o teste de aula09).

**Ajustado:** aceitei a estrutura da rota, mas a validação gerada não
verificava se o livro já estava emprestado (regra de negócio do nosso
tema) — adicionei essa checagem manualmente antes do insert.

**Motivo:** o teste que escrevi não cobria esse caso de borda, e o
prompt não continha essa regra. Os testes precisam cobrir as regras
de negócio, não só o esqueleto do contrato.
```

```markdown
## 2026-09-14 Query de buscarPorId no repository

**Pedido:** "Implemente buscarPorId(db, id) a partir da assinatura e do
teste em test/repository.test.ts".

**Rejeitado:** a primeira versão concatenava `id` direto na string SQL
(`WHERE id = ${id}`). Pedi para reescrever usando parâmetro (`?`).

**Motivo:** injeção de SQL — exatamente o que revisamos na aula10.
```
