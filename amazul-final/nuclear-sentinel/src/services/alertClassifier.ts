import { AlertLevel, OccurrenceType } from '../types';

/**
 * Regras simples de classificação de alertas.
 *   Radiação (mSv/h):  < 0.5 normal | 0.5–2 atípica | > 2 crítica
 *   Temperatura (°C):  ≤ 80 normal  | 80–100 atípica | > 100 crítica
 *   Pressão (MPa):     ≤ 15 normal  | 15–18 atípica  | > 18 crítica
 *   Falha de equipamento / Segurança: atípica por padrão
 *   Palavras-chave críticas na descrição (vazamento, incêndio, contaminação,
 *   explosão, invasão, evacuação) elevam qualquer ocorrência para crítica.
 */
export const THRESHOLDS: Record<'radiacao' | 'temperatura' | 'pressao', { atipica: number; critica: number; unidade: string; label: string }> = {
  radiacao: { atipica: 0.5, critica: 2, unidade: 'mSv/h', label: 'Radiação' },
  temperatura: { atipica: 80, critica: 100, unidade: '°C', label: 'Temperatura' },
  pressao: { atipica: 15, critica: 18, unidade: 'MPa', label: 'Pressão' },
};

export const CRITICAL_KEYWORDS = ['vazamento', 'incêndio', 'incendio', 'contaminação', 'contaminacao', 'explosão', 'explosao', 'invasão', 'invasao', 'evacuação', 'evacuacao'];

export interface ClassificationResult {
  nivel: AlertLevel;
  motivo: string;
}

export function classifyOccurrence(params: {
  tipo: OccurrenceType;
  valorMedido?: number;
  titulo?: string;
  descricao?: string;
}): ClassificationResult {
  const { tipo, valorMedido } = params;
  const texto = `${params.titulo ?? ''} ${params.descricao ?? ''}`.toLowerCase();
  const keyword = CRITICAL_KEYWORDS.find((k) => texto.includes(k));
  if (keyword) {
    return { nivel: 'critica', motivo: `Palavra-chave crítica identificada: "${keyword}".` };
  }

  if (tipo === 'radiacao' || tipo === 'temperatura' || tipo === 'pressao') {
    const t = THRESHOLDS[tipo];
    if (valorMedido === undefined || Number.isNaN(valorMedido)) {
      return { nivel: 'atipica', motivo: `${t.label} sem valor medido — tratada como atípica.` };
    }
    if (valorMedido > t.critica) {
      return { nivel: 'critica', motivo: `${t.label} ${valorMedido} ${t.unidade} acima do limite crítico (> ${t.critica}).` };
    }
    const atipica = tipo === 'radiacao' ? valorMedido >= t.atipica : valorMedido > t.atipica;
    if (atipica) {
      return { nivel: 'atipica', motivo: `${t.label} ${valorMedido} ${t.unidade} acima do normal e abaixo do crítico (≤ ${t.critica}).` };
    }
    return { nivel: 'normal', motivo: `${t.label} ${valorMedido} ${t.unidade} dentro do limite normal.` };
  }

  const label = tipo === 'falha_equipamento' ? 'Falha de equipamento' : 'Ocorrência de segurança física';
  return { nivel: 'atipica', motivo: `${label} é tratada como atípica por padrão.` };
}
