import { MOCK_USERS } from '../data/users';
import { Session } from '../types';
import { getItem, removeItem, setItem, STORAGE_KEYS } from './storage';

/** Autenticação SIMULADA: valida contra MOCK_USERS e persiste a sessão. */
export async function login(email: string, senha: string): Promise<Session> {
  await new Promise((r) => setTimeout(r, 400)); // simula latência de rede
  const found = MOCK_USERS.find((u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.senha === senha);
  if (!found) throw new Error('E-mail ou senha inválidos.');
  const { senha: _omit, ...user } = found;
  const session: Session = {
    user,
    token: `mock-${user.id}-${Date.now()}`,
    iniciadaEm: new Date().toISOString(),
  };
  await setItem(STORAGE_KEYS.SESSION, session);
  return session;
}

export async function restoreSession(): Promise<Session | null> {
  return getItem<Session>(STORAGE_KEYS.SESSION);
}

export async function logout(): Promise<void> {
  await removeItem(STORAGE_KEYS.SESSION);
}
