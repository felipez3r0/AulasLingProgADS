## O que este PR faz

<!-- Uma ou duas frases. Se voce nao consegue resumir, o PR esta grande demais. -->

## Como verificar

```bash
npm run typecheck
npm test
npm run ex -- aulaNN
```

<!-- Descreva o que quem revisa deve ver acontecendo. -->

---

## Checklist de revisao de codigo gerado por IA

Marque apenas o que for verdade. Caixa desmarcada nao reprova o PR — ela diz onde olhar.

### Entendimento
- [ ] Consigo explicar **cada linha** deste diff sem consultar a IA de novo.
- [ ] Nao ha codigo aqui que eu tenha aceitado sem entender.
- [ ] Os nomes de variaveis e funcoes dizem o que a coisa realmente faz.

### Verificacao
- [ ] `npm run typecheck` passa.
- [ ] Os testes passam, e eu **rodei** — nao estou supondo.
- [ ] Existe teste para os casos de borda: vazio, zero, negativo, limite, ausente.
- [ ] Nenhum arquivo `*.spec.ts` ou `*.test.ts` foi alterado para fazer o teste passar.

### Riscos tipicos de codigo gerado
- [ ] Nenhuma funcao modifica (muta) um argumento que o chamador ainda usa.
- [ ] Toda biblioteca/metodo invocado existe de fato e a assinatura confere com a documentacao.
- [ ] Nenhuma dependencia nova foi instalada sem eu conferir o pacote no npm.
- [ ] Nenhum segredo, token, senha ou dado pessoal foi commitado.
- [ ] Erros sao tratados — nao ha `catch` vazio nem erro engolido em silencio.

### Registro de uso de IA
- Ferramenta usada: <!-- Copilot inline / Copilot Chat / chat de navegador / agente CLI / Copilot Agent -->
- O que a IA fez:
- O que **eu** fiz:
- Onde ela errou e como eu percebi:
