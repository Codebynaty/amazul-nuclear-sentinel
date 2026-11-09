/** Papéis de usuário. A estrutura de permissões fica em services/permissions.ts. */
export type UserRole = 'operador' | 'supervisor';

export interface User {
  id: string;
  nome: string;
  email: string;
  senha: string; // apenas para autenticação SIMULADA
  papel: UserRole;
  matricula: string;
}

/** Usuário exposto à sessão (sem senha). */
export type SessionUser = Omit<User, 'senha'>;

export interface Session {
  user: SessionUser;
  token: string;
  iniciadaEm: string; // ISO
}

/** Nível de alerta calculado pelas regras de classificação. */
export type AlertLevel = 'normal' | 'atipica' | 'critica';

export type OccurrenceStatus = 'aberta' | 'em_analise' | 'resolvida';

export type OccurrenceType =
  | 'radiacao'
  | 'temperatura'
  | 'pressao'
  | 'falha_equipamento'
  | 'seguranca';

export type Sector =
  | 'Reator'
  | 'Turbinas'
  | 'Resfriamento'
  | 'Armazenamento de Combustível'
  | 'Sala de Controle'
  | 'Perímetro';

export interface Occurrence {
  id: string;
  titulo: string;
  descricao: string;
  setor: Sector;
  tipo: OccurrenceType;
  /** Valor medido pelo sensor (unidade depende do tipo). Opcional para tipos qualitativos. */
  valorMedido?: number;
  nivelAlerta: AlertLevel;
  motivoClassificacao: string;
  status: OccurrenceStatus;
  registradoPor: { id: string; nome: string; papel: UserRole };
  criadoEm: string; // ISO
  atualizadoEm: string; // ISO
}

/** Dados digitados no formulário (antes da classificação). */
export interface OccurrenceInput {
  titulo: string;
  descricao: string;
  setor: Sector | '';
  tipo: OccurrenceType | '';
  valorMedido: string;
}

export type FormErrors<T> = Partial<Record<keyof T, string>>;
