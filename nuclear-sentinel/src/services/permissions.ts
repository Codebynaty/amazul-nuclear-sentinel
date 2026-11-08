import { UserRole } from '../types';

/**
 * Controle de acesso baseado em papéis (RBAC) — preparado para evolução.
 * Para criar uma nova permissão, adicione-a em Permission e mapeie nos papéis.
 */
export type Permission =
  | 'ocorrencia:criar'
  | 'ocorrencia:visualizar'
  | 'ocorrencia:alterar_status'
  | 'ocorrencia:excluir';

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  operador: ['ocorrencia:criar', 'ocorrencia:visualizar'],
  supervisor: ['ocorrencia:criar', 'ocorrencia:visualizar', 'ocorrencia:alterar_status', 'ocorrencia:excluir'],
};

export const ROLE_LABEL: Record<UserRole, string> = {
  operador: 'Operador',
  supervisor: 'Supervisor',
};

export function can(role: UserRole | undefined, permission: Permission): boolean {
  return !!role && ROLE_PERMISSIONS[role].includes(permission);
}
