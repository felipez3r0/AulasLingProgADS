# Rubrica do projeto final

Aplicada à Aula 15. Cada critério vale de 0 a 10; a nota final é a média ponderada.

---

## 1. Funcionalidade — peso 20%

| Nota | Descrição |
| --- | --- |
| 9–10 | CRUD completo em 2+ recursos, relacionamento entre eles, filtros por query param, todas as regras de negócio funcionando |
| 7–8 | CRUD completo, relacionamento presente, alguma regra de negócio incompleta |
| 5–6 | CRUD parcial ou sem relacionamento entre recursos |
| 0–4 | Não roda, ou operações essenciais quebram |

## 2. Verificação — peso 25%

O critério de maior peso, e o eixo da disciplina.

| Nota | Descrição |
| --- | --- |
| 9–10 | Testes automatizados cobrindo caminho feliz **e** casos de borda; testes de endpoint; `npm run typecheck` limpo; CI verde |
| 7–8 | Testes presentes e passando, mas só do caminho feliz |
| 5–6 | Poucos testes, ou testes que não provam nada relevante |
| 0–4 | Sem testes, ou testes alterados para forçar aprovação |

> Alterar um teste para fazê-lo passar zera este critério.

## 3. Qualidade do código — peso 20%

| Nota | Descrição |
| --- | --- |
| 9–10 | Tipagem rigorosa sem `any`; camadas separadas; funções pequenas e puras onde cabe; nomes que dizem a verdade; validação de entrada |
| 7–8 | Organizado, com alguma inconsistência de tipagem ou separação |
| 5–6 | Funciona, mas tudo num arquivo, ou `any` espalhado |
| 0–4 | Ilegível ou incoerente |

## 4. Uso de Git — peso 15%

| Nota | Descrição |
| --- | --- |
| 9–10 | Commits atômicos e descritivos ao longo de todo o desenvolvimento; branches por feature; PRs com revisão; `.gitignore` correto |
| 7–8 | Histórico razoável, com alguns commits grandes demais |
| 5–6 | Poucos commits, mensagens genéricas ("update", "fix") |
| 0–4 | Um ou dois commits; ou segredo commitado no histórico |

## 5. Domínio e uso de IA — peso 20%

Aqui se avalia o que a disciplina realmente ensina.

| Nota | Descrição |
| --- | --- |
| 9–10 | Explica qualquer trecho do projeto sob arguição; diário de IA honesto e específico, apontando onde a IA errou e como percebeu; pelo menos um PR gerado por agente revisado com comentários linha a linha que geraram correção real |
| 7–8 | Explica a maior parte; diário presente mas superficial; PR revisado sem observações substantivas |
| 5–6 | Hesita em trechos centrais; diário genérico |
| 0–4 | Não explica o próprio código |

> **Arguição individual.** Cada integrante responde sobre qualquer parte do
> projeto. Não saber explicar código que está no seu repositório é o resultado que
> esta disciplina existe para evitar.

---

## Entregáveis

- [ ] Repositório no GitHub com acesso ao professor
- [ ] `README.md` documentando endpoints com exemplos de requisição
- [ ] CI configurado e verde
- [ ] Pelo menos 1 PR gerado por agente, revisado e com comentários
- [ ] `DIARIO-IA.md`: o que a IA fez, o que você fez, onde ela errou, como percebeu
- [ ] Apresentação de 5–10 minutos com a API funcionando

## Penalidades

| Situação | Efeito |
| --- | --- |
| Teste alterado para passar | Zera o critério 2 |
| Segredo real commitado | −2 na nota final, e revogue a credencial imediatamente |
| Não saber explicar o próprio código na arguição | Teto de 5 no critério 5 |
| Entrega sem histórico de commits (código pronto de uma vez) | Teto de 4 no critério 4 |
