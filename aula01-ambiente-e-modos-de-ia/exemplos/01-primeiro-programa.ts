// Primeiro programa do curso.
//
// Repare que ele nao imprime nada: ele EXPORTA uma funcao.
// Isso e proposital. Um `console.log` prova que o programa rodou;
// so um teste prova que ele fez a coisa certa.

/** Monta a saudacao de boas-vindas da disciplina. */
export function saudacao(nome: string): string {
  return `Ola, ${nome}! Bem-vindo a disciplina.`;
}

/** Devolve a versao do Node que esta executando este codigo. */
export function versaoDoNode(): string {
  return process.version;
}
