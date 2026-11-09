import { getTypeInfo } from '../data/catalog';
import { FormErrors, OccurrenceInput } from '../types';

export function validateLogin(email: string, senha: string): { email?: string; senha?: string } {
  const errors: { email?: string; senha?: string } = {};
  if (!email.trim()) errors.email = 'Informe o e-mail.';
  else if (!/^\S+@\S+\.\S+$/.test(email.trim())) errors.email = 'E-mail em formato inválido.';
  if (!senha) errors.senha = 'Informe a senha.';
  else if (senha.length < 6) errors.senha = 'A senha deve ter ao menos 6 caracteres.';
  return errors;
}

export function parseNumber(v: string): number | undefined {
  if (!v.trim()) return undefined;
  const n = Number(v.replace(',', '.'));
  return Number.isFinite(n) ? n : NaN;
}

export function validateOccurrence(input: OccurrenceInput): FormErrors<OccurrenceInput> {
  const e: FormErrors<OccurrenceInput> = {};
  if (!input.titulo.trim()) e.titulo = 'O título é obrigatório.';
  else if (input.titulo.trim().length < 5) e.titulo = 'O título deve ter ao menos 5 caracteres.';
  if (!input.descricao.trim()) e.descricao = 'A descrição é obrigatória.';
  else if (input.descricao.trim().length < 10) e.descricao = 'Descreva com ao menos 10 caracteres.';
  if (!input.setor) e.setor = 'Selecione o setor.';
  if (!input.tipo) e.tipo = 'Selecione o tipo de ocorrência.';
  else if (getTypeInfo(input.tipo).medivel) {
    const n = parseNumber(input.valorMedido);
    if (n === undefined) e.valorMedido = 'O valor medido é obrigatório para este tipo.';
    else if (Number.isNaN(n)) e.valorMedido = 'Informe um número válido.';
    else if (n < 0) e.valorMedido = 'O valor não pode ser negativo.';
  }
  return e;
}
