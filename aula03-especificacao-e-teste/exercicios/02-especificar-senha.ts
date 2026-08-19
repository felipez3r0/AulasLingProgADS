// EXERCICIO 2 - nivel 🤝 IA ASSISTIDA
//
// O pedido chegou assim, do "cliente":
//
//   "valida a senha do usuario, tem que ser segura"
//
// Isso NAO e uma especificacao. Sua primeira tarefa e transformar em uma.
// A especificacao ja esta escrita abaixo - leia e compare com a frase original
// para ver quantas decisoes estavam escondidas nela.
//
// Metodo:
//   1. Leia a especificacao e o arquivo de teste.
//   2. Use o chat para perguntar: "que caso de borda esta especificacao
//      ainda deixa em aberto?"
//   3. Implemente com o Copilot ligado, aceitando so o que voce entende.
//
// Rode: npm run ex -- 02-especificar

export interface ResultadoValidacao {
  valida: boolean;
  problemas: string[];
}

/**
 * Valida a senha de cadastro.
 *
 * Especificacao:
 *   - minimo 8 caracteres          -> problema: "curta"
 *   - ao menos uma letra maiuscula -> problema: "sem maiuscula"
 *   - ao menos uma letra minuscula -> problema: "sem minuscula"
 *   - ao menos um digito           -> problema: "sem numero"
 *   - nao pode conter espaco       -> problema: "tem espaco"
 *
 *   - `valida` e true somente quando `problemas` esta vazio
 *   - os problemas vem NA ORDEM acima, sem repeticao
 *   - senha vazia acumula todos os problemas aplicaveis
 *   - a funcao nao lanca erro em nenhum caso
 */
export function validarSenha(_senha: string): ResultadoValidacao {
  throw new Error("TODO: implemente validarSenha");
}
