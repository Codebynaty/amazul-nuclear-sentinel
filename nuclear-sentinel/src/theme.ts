import { AlertLevel } from './types';

export const colors = {
  bg: '#0B1220',
  surface: '#131C2E',
  surfaceAlt: '#1B2740',
  border: '#26324A',
  text: '#E6ECF5',
  textMuted: '#8C9AB3',
  primary: '#2F80ED',
  danger: '#EB5757',
  success: '#27AE60',
  warning: '#F2C94C',
};

export const alertColors: Record<AlertLevel, { bg: string; fg: string }> = {
  normal: { bg: '#123524', fg: '#4ADE80' },
  atipica: { bg: '#3A2E0B', fg: '#FACC15' },
  critica: { bg: '#3B1215', fg: '#F87171' },
};

export const spacing = (n: number) => n * 4;
