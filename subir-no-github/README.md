# ☢ AMAZUL · Nuclear Sentinel — Sprint 1 (MVP)

Aplicativo mobile para **registro, consulta e classificação de ocorrências simuladas** em uma instalação nuclear fictícia. Desenvolvido com **React Native + Expo + TypeScript**.

## Funcionalidades
- **Login simulado** com contas de teste e **sessão persistida** (AsyncStorage) — o usuário continua logado ao reabrir o app; logout pelo botão "Sair".
- **Listagem** de ocorrências com resumo por nível de alerta (toque no contador para filtrar), pull-to-refresh e acesso aos detalhes.
- **Cadastro** com validação de campos obrigatórios, mensagens de erro visíveis sob cada campo e **prévia da classificação em tempo real**.
- **Detalhes** da ocorrência, com motivo da classificação; supervisores podem alterar o status e excluir.
- **Persistência**: catálogo inicial simulado gravado no AsyncStorage no primeiro uso; novas ocorrências e alterações ficam salvas localmente.
- **Perfis**: `operador` e `supervisor`, com controle de acesso por permissões (RBAC) pronto para evolução.

## Regras de classificação de alertas (`src/services/alertClassifier.ts`)
| Tipo | Normal | Atípica | Crítica |
|---|---|---|---|
| Radiação (mSv/h) | < 0,5 | 0,5 – 2 | > 2 |
| Temperatura (°C) | ≤ 80 | > 80 – 100 | > 100 |
| Pressão (MPa) | ≤ 15 | > 15 – 18 | > 18 |
| Falha de equipamento / Segurança física | — | padrão | — |

Palavras-chave no título/descrição (*vazamento, incêndio, contaminação, explosão, invasão, evacuação*) elevam qualquer ocorrência para **crítica**.

## Perfis e permissões (`src/services/permissions.ts`)
| Permissão | Operador | Supervisor |
|---|:-:|:-:|
| Visualizar / criar ocorrência | ✅ | ✅ |
| Alterar status | ❌ | ✅ |
| Excluir / restaurar catálogo | ❌ | ✅ |

## Contas de teste
| Perfil | E-mail | Senha |
|---|---|---|
| Operador | `operador@amazul.com` | `operador123` |
| Supervisor | `supervisor@amazul.com` | `supervisor123` |

> Na tela de login, toque em uma conta para preencher automaticamente.

## Tecnologias
React Native 0.88 · Expo SDK 58 · TypeScript (strict) · React Navigation 7 (native-stack) · AsyncStorage · Context API

## Estrutura
```
App.tsx                 # Providers + navegação
src/
  components/           # Button, TextField, OptionPicker, AlertBadge, StatusBadge, OccurrenceCard
  context/              # AuthContext (sessão + permissões)
  data/                 # usuários de teste, catálogo (setores/tipos), ocorrências iniciais
  navigation/           # AppNavigator e tipagem das rotas
  screens/              # Login, OccurrenceList, OccurrenceForm, OccurrenceDetail
  services/             # storage, auth, occurrences, alertClassifier, permissions
  types/                # User, UserRole, Session, Occurrence, AlertLevel, OccurrenceStatus...
  utils/                # validação e formatação
  theme.ts
```

## Como executar
Pré-requisitos: Node.js 18+ e o app **Expo Go** no celular (ou emulador Android/iOS).
```bash
cd nuclear-sentinel   # o projeto fica nesta subpasta do repositório
npm install
npx expo start        # escaneie o QR code com o Expo Go
# ou: npm run android | npm run ios
npm run typecheck     # verificação de tipos
```

## Próximas evoluções
API real com autenticação JWT, filtros por setor/status, notificações push para alertas críticos e histórico de alterações.
