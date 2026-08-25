# Aula 14 - Projeto: Revisão Cruzada entre Grupos e Deploy

**Modo de IA: Par**

## Objetivos da aula

- Revisar o backend de outro grupo usando a rubrica de code review, com foco em contrato, segurança (SQL) e tratamento de erros.
- Publicar o backend do próprio grupo no Render, com banco no Turso.
- Entender e documentar a limitação de cold start do plano gratuito.

## Leitura prévia (antes da aula)

- Backend do grupo rodando localmente (`npm run dev`) e testado (`npm test`) antes de vir para a aula — deploy de código quebrado só perde tempo.
- Releia [`recursos/roteiro-deploy-render-turso.md`](../recursos/roteiro-deploy-render-turso.md).

---

## Conteúdo

### Revisão cruzada entre grupos

Igual à aula12, mas agora no projeto real e entre grupos diferentes (não só dentro do mesmo grupo): use a [rubrica de code review](../recursos/rubrica-code-review.md), com atenção especial a:

- O contrato documentado bate com o que o endpoint realmente faz?
- Alguma query concatena valor de usuário direto no SQL?
- Erros retornam o formato JSON combinado, ou vazam stack trace/mensagem interna?

### Deploy: Render + Turso

Siga o [roteiro completo](../recursos/roteiro-deploy-render-turso.md): banco no Turso → schema aplicado remotamente → serviço no Render com `DATABASE_URL`/`DATABASE_AUTH_TOKEN` como variáveis de ambiente (nunca commitadas) → `app.listen(process.env.PORT)`.

**Cold start:** o plano free do Render hiberna o serviço após inatividade — a primeira requisição depois disso demora bem mais para responder. Isso é esperado, documente no README do projeto para quem for testar (incluindo o professor na defesa) não confundir com bug.

---

## Atividades em sala

1. **Revisão cruzada entre grupos:** troca de repositório com outro grupo (designado pelo professor), revisão com a rubrica, comentários no PR ou como issue.
2. **Deploy assistido:** cada grupo publica o backend no Render + Turso, com o professor disponível para destravar problemas de variável de ambiente/build.

## Exercícios para casa

- **Exercício 1 (Par):** aplique os comentários recebidos na revisão cruzada, respondendo cada um (corrigido ou justificado).
- **Exercício 2 (Sem IA):** teste a URL pública do seu backend (não localhost) com pelo menos 3 requisições diferentes, documentando os resultados no README do projeto — inclua a URL publicada.
- **Exercício 3 (Par):** confirme com quem faz o front do grupo que a API publicada (não a local) está sendo consumida corretamente pelo front.

## Critério de entrega

- Backend publicado, URL no README do projeto.
- `DATABASE_URL`/`DATABASE_AUTH_TOKEN` configurados como variável de ambiente no Render — nenhum segredo commitado no repositório.
- Pelo menos um PR de revisão cruzada entre grupos, com comentários respondidos.
- README do projeto documentando o cold start do free tier.
