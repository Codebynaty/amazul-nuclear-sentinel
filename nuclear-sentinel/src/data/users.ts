import { User } from '../types';

/** Contas de teste (documentadas no README). Autenticação simulada. */
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    nome: 'Ana Operadora',
    email: 'operador@amazul.com',
    senha: 'operador123',
    papel: 'operador',
    matricula: 'OP-1001',
  },
  {
    id: 'u2',
    nome: 'Carlos Supervisor',
    email: 'supervisor@amazul.com',
    senha: 'supervisor123',
    papel: 'supervisor',
    matricula: 'SP-2001',
  },
];
