# Rubrica de code review

Usada na aula12 para revisar o PR de um colega, na aula14 para a revisão cruzada entre grupos, e no projeto final para os PRs dentro do grupo.

## Critérios

| Critério | O que checar | Peso |
|---|---|---|
| **Correção** | O código faz o que o contrato/issue pedia? Os casos de erro documentados no contrato estão tratados? | 30% |
| **Testes** | Existe teste cobrindo o caminho feliz **e** pelo menos um caso de borda/erro? Os testes passam? | 25% |
| **Segurança e robustez** | Validação de entrada presente? Sem concatenar valor de usuário em SQL? Erros tratados sem vazar detalhe interno ao cliente? | 20% |
| **Legibilidade** | Nomes claros, sem duplicação óbvia, sem código morto? Um colega consegue entender sem perguntar ao autor? | 15% |
| **Clareza do feedback dado** (para quem revisa) | Os comentários feitos no PR são específicos e acionáveis (apontam linha + o que mudar), não genéricos ("melhorar isso") | 10% |

## Como comentar um PR

- Aponte a **linha exata** e o que você observou — não "está errado", mas "esta rota não valida `preco <= 0`, o contrato exige positivo".
- Separe **bloqueante** ("isso quebra o contrato / abre brecha de segurança") de **sugestão** ("poderia extrair isso numa função, não é obrigatório").
- Se não entender por que o autor fez de um jeito, pergunte antes de pedir para mudar — pode haver um motivo que você não viu.
- Elogie o que está bom, não só o que precisa mudar — um review só de críticas desmotiva e não ensina o que funcionou.

## Como responder a um review recebido

- Toda thread bloqueante precisa de uma resposta: ou você corrigiu, ou explicou por que discorda (e o revisor concorda ou insiste).
- Não silenciosamente ignore um comentário — resolver sem responder é o mesmo problema que threads de comentário sem resposta em qualquer ferramenta.
