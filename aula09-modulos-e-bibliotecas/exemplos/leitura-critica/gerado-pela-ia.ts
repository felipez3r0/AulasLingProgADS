// Codigo gerado por IA a partir do pedido:
//
//   "preciso validar CPF e formatar datas no meu projeto"
//
// A resposta veio assim (reproduzida aqui como texto, porque instalar
// o que ela sugeriu seria justamente o erro):
//
//   "Instale as bibliotecas:
//      npm install cpf-validador-br date-format-ptbr
//    E use:
//      import { validarCPF } from 'cpf-validador-br';
//      import { formatarData } from 'date-format-ptbr';"
//
// Nenhum desses dois pacotes existe no npm. Os nomes sao plausiveis,
// a sintaxe esta correta, e o codigo parece pronto para colar.
//
// Abaixo, as mesmas funcoes escritas sem dependencia nenhuma - e uma
// delas com um defeito, para voce achar.

/**
 * Valida um CPF pelos digitos verificadores.
 */
export function validarCPF(cpf: string): boolean {
  const digitos = cpf.replace(/\D/g, "");
  if (digitos.length !== 11) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += Number(digitos[i]) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== Number(digitos[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += Number(digitos[i]) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  return resto === Number(digitos[10]);
}

/**
 * Formata uma data ISO (aaaa-mm-dd) para o formato brasileiro.
 *
 * A implementacao usa `new Date(texto)`, que interpreta a string
 * "2026-03-01" como UTC - e `getDate()` devolve o dia no fuso LOCAL.
 * Em qualquer fuso a oeste de Greenwich (o Brasil inteiro), o dia volta um.
 */
export function formatarData(iso: string): string {
  const data = new Date(iso);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  return `${dia}/${mes}/${data.getFullYear()}`;
}
