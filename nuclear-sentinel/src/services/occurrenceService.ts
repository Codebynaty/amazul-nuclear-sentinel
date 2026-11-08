import { SEED_OCCURRENCES } from '../data/occurrences';
import { Occurrence, OccurrenceStatus, OccurrenceType, Sector, SessionUser } from '../types';
import { classifyOccurrence } from './alertClassifier';
import { getItem, setItem, STORAGE_KEYS } from './storage';

/** Lê as ocorrências; no primeiro uso grava o catálogo inicial simulado. */
export async function listOccurrences(): Promise<Occurrence[]> {
  let data = await getItem<Occurrence[]>(STORAGE_KEYS.OCCURRENCES);
  if (!data) {
    data = SEED_OCCURRENCES;
    await setItem(STORAGE_KEYS.OCCURRENCES, data);
  }
  return [...data].sort((a, b) => b.criadoEm.localeCompare(a.criadoEm));
}

export async function getOccurrence(id: string): Promise<Occurrence | undefined> {
  return (await listOccurrences()).find((o) => o.id === id);
}

export interface NewOccurrence {
  titulo: string;
  descricao: string;
  setor: Sector;
  tipo: OccurrenceType;
  valorMedido?: number;
}

export async function createOccurrence(input: NewOccurrence, user: SessionUser): Promise<Occurrence> {
  const all = await listOccurrences();
  const { nivel, motivo } = classifyOccurrence(input);
  const now = new Date().toISOString();
  const occ: Occurrence = {
    id: `oc-${Date.now()}`,
    ...input,
    nivelAlerta: nivel,
    motivoClassificacao: motivo,
    status: 'aberta',
    registradoPor: { id: user.id, nome: user.nome, papel: user.papel },
    criadoEm: now,
    atualizadoEm: now,
  };
  await setItem(STORAGE_KEYS.OCCURRENCES, [occ, ...all]);
  return occ;
}

export async function updateStatus(id: string, status: OccurrenceStatus): Promise<Occurrence | undefined> {
  const all = await listOccurrences();
  let updated: Occurrence | undefined;
  const next = all.map((o) => {
    if (o.id !== id) return o;
    updated = { ...o, status, atualizadoEm: new Date().toISOString() };
    return updated;
  });
  await setItem(STORAGE_KEYS.OCCURRENCES, next);
  return updated;
}

export async function deleteOccurrence(id: string): Promise<void> {
  const all = await listOccurrences();
  await setItem(STORAGE_KEYS.OCCURRENCES, all.filter((o) => o.id !== id));
}

/** Restaura o catálogo inicial (útil para demonstração). */
export async function resetOccurrences(): Promise<void> {
  await setItem(STORAGE_KEYS.OCCURRENCES, SEED_OCCURRENCES);
}
