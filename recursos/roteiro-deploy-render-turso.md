# Roteiro de deploy: Render + Turso

Passo a passo para publicar o backend do projeto final. Free tier dos dois serviços.

## 1. Banco de dados no Turso

1. Crie uma conta gratuita em [turso.tech](https://turso.tech).
2. Instale a CLI (ou use o painel web) e crie um banco: `turso db create nome-do-projeto`.
3. Pegue a URL de conexão: `turso db show nome-do-projeto --url` → algo como `libsql://nome-do-projeto-usuario.turso.io`.
4. Gere um token de autenticação: `turso db tokens create nome-do-projeto`.
5. Guarde os dois valores — vão virar variáveis de ambiente no Render, **nunca commitados no repositório**.

## 2. Rodar o schema no banco remoto

Antes do primeiro deploy, crie as tabelas no banco do Turso (o mesmo `SCHEMA_SQL`/migração usado localmente):

```bash
turso db shell nome-do-projeto < caminho/para/schema.sql
```

Ou, com o client `@libsql/client` apontando para a URL do Turso, rode uma vez seu script de criação de schema localmente contra o banco remoto.

## 3. Backend no Render

1. Crie uma conta gratuita em [render.com](https://render.com) e conecte seu repositório do GitHub.
2. **New → Web Service**, selecione o repositório do backend.
3. Configurações:
   - **Build command:** `npm install && npm run build` (ou o script equivalente do seu projeto)
   - **Start command:** `npm start` (deve rodar o servidor compilado, ex.: `node dist/server.js`)
   - **Instance type:** Free
4. Em **Environment**, adicione as variáveis:
   - `DATABASE_URL` = a URL `libsql://...` do Turso
   - `DATABASE_AUTH_TOKEN` = o token gerado no passo 1
   - `PORT` (o Render injeta a própria porta automaticamente — seu `app.listen` deve usar `process.env.PORT`, não uma porta fixa)
5. Deploy. Acompanhe os logs — se o build falhar, geralmente é `devDependencies` que deveriam ser `dependencies` (o Render não instala `devDependencies` em produção por padrão em alguns planos — confira o script de build).

## 4. Cold start do plano gratuito — o que esperar

No plano free do Render, o serviço **hiberna após um período sem tráfego** e a primeira requisição depois disso demora bem mais (dezenas de segundos) para "acordar" o servidor. Isso é esperado, não é bug do seu código. Implicações práticas:

- Avise quem for testar sua API (professor, colegas do front) que a primeira chamada pode demorar.
- Não é adequado para uma demonstração ao vivo sem aquecer o serviço antes (faça uma requisição alguns minutos antes de apresentar).
- Não tente "resolver" isso com hacks de manter o servidor sempre ativo — é uma limitação conhecida e aceita do free tier.

## 5. Checklist final

- [ ] `DATABASE_URL`/`DATABASE_AUTH_TOKEN` configurados no Render, **não** commitados em nenhum arquivo do repositório.
- [ ] `.env` (se usado localmente) está no `.gitignore`.
- [ ] `app.listen(process.env.PORT ?? 3000, ...)` — nunca uma porta fixa hardcoded em produção.
- [ ] Schema criado no banco do Turso antes do primeiro deploy.
- [ ] URL pública do backend testada (não só localmente) e documentada no README do projeto.
