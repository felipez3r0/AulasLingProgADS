// Da frase vaga a especificacao executavel.
//
// Pedido original: "valida o email do usuario"
//
// Perguntas que a frase nao responde:
//   - o que conta como valido?
//   - string vazia e invalida ou e erro?
//   - espacos nas pontas invalidam ou sao aparados?
//   - maiusculas importam?
//
// Toda pergunta sem resposta vira uma decisao que a IA toma por voce.

/**
 * Valida um endereco de email para cadastro no sistema.
 *
 * Especificacao (as respostas que faltavam):
 *   - precisa ter exatamente um "@"
 *   - precisa ter ao menos um caractere antes do "@"
 *   - o dominio precisa conter um "." com ao menos um caractere de cada lado
 *   - espacos nas pontas sao aparados antes de validar
 *   - string vazia e invalida (devolve false, nao lanca erro)
 *   - maiusculas e minusculas nao importam
 */
export function emailValido(email: string): boolean {
  const limpo = email.trim();
  if (limpo.length === 0) return false;

  const partes = limpo.split("@");
  if (partes.length !== 2) return false;

  const [usuario, dominio] = partes;
  if (!usuario || !dominio) return false;

  const pedacosDoDominio = dominio.split(".");
  if (pedacosDoDominio.length < 2) return false;

  return pedacosDoDominio.every((pedaco) => pedaco.length > 0);
}
