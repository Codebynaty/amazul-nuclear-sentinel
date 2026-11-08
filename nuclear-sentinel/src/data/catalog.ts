import { OccurrenceType, Sector, OccurrenceStatus, AlertLevel } from '../types';

export const SECTORS: Sector[] = [
  'Reator',
  'Turbinas',
  'Resfriamento',
  'Armazenamento de Combustível',
  'Sala de Controle',
  'Perímetro',
];

export const OCCURRENCE_TYPES: { value: OccurrenceType; label: string; unidade?: string; medivel: boolean }[] = [
  { value: 'radiacao', label: 'Radiação', unidade: 'mSv/h', medivel: true },
  { value: 'temperatura', label: 'Temperatura', unidade: '°C', medivel: true },
  { value: 'pressao', label: 'Pressão', unidade: 'MPa', medivel: true },
  { value: 'falha_equipamento', label: 'Falha de equipamento', medivel: false },
  { value: 'seguranca', label: 'Segurança física', medivel: false },
];

export const STATUS_LABEL: Record<OccurrenceStatus, string> = {
  aberta: 'Aberta',
  em_analise: 'Em análise',
  resolvida: 'Resolvida',
};

export const ALERT_LABEL: Record<AlertLevel, string> = {
  normal: 'Normal',
  atipica: 'Atípica',
  critica: 'Crítica',
};

export const getTypeInfo = (t: OccurrenceType) => OCCURRENCE_TYPES.find((o) => o.value === t)!;
