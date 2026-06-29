# Arquitetura

## Visão geral
Monorepo npm workspaces com três pacotes: `apps/api` (backend), `apps/app` (cliente
Expo/RN Web) e `packages/shared` (domínio compartilhado: questionário, tipos, painel).

## Backend (`apps/api`)
- **Runtime:** Cloudflare Workers, framework **Hono**.
- **ORM:** Drizzle sobre **D1** (SQLite). Migrations versionadas em `drizzle/`.
- **Auth:** JWT custom HS256 assinado com WebCrypto (`src/lib/jwt.ts`); senhas com
  **PBKDF2-SHA256** (100k iterações, `src/lib/password.ts`). Nenhum provedor de auth de terceiros.
- **Validação:** zod (`src/validation.ts`).
- **CORS:** configurável por `ALLOWED_ORIGIN`.

### Modelo de dados
- `guardians` — responsável legal (id, nome, e-mail único, hash de senha).
- `consents` — registro de consentimento LGPD (tipo, granted, versão, timestamp).
- `children` — criança (vinculada ao responsável).
- `anamnese_sessions` — 1 sessão por criança (status draft/submitted, grupo atual).
- `anamnese_answers` — respostas (upsert por `session_id + question_id`).

> D1/SQLite não habilita `PRAGMA foreign_keys` por padrão: a exclusão em cascata é feita
> explicitamente em `src/lib/repo.ts` (essencial para o direito de exclusão da LGPD).

### Endpoints
| Método | Rota | Auth | Descrição |
|---|---|---|---|
| GET | `/` | — | Health/info |
| POST | `/auth/register` | — | Cria responsável + consentimento; retorna tokens |
| POST | `/auth/login` | — | Login; retorna tokens |
| POST | `/auth/refresh` | — | Renova tokens via refresh token |
| GET | `/account/me` | JWT | Perfil do responsável |
| GET | `/account/export` | JWT | Exporta todos os dados (portabilidade LGPD) |
| DELETE | `/account` | JWT | Exclui conta e dados (cascata) |
| GET/POST | `/children` | JWT | Lista/cria crianças |
| GET/PATCH/DELETE | `/children/:id` | JWT | Detalha/edita/remove criança |
| GET | `/anamnese/questionnaire` | JWT | Estrutura dos 6 grupos |
| GET | `/anamnese/:childId` | JWT | Sessão + respostas |
| PUT | `/anamnese/:childId` | JWT | Salva rascunho (upsert) |
| POST | `/anamnese/:childId/submit` | JWT | Finaliza a anamnese |

## App (`apps/app`)
- **Expo + RN + RN Web**, navegação `@react-navigation/native-stack`.
- **Design system** em `src/theme/tokens.ts` (paleta, espaçamento, raio, sombras do Manual).
  Tipografia **Spectral** (display) + **Mulish** (corpo) via `@expo-google-fonts`.
- **Componentes** em `src/components/ui.tsx` (Button, Field, Card, ProgressBar, Logo, etc.).
- **Auth** em `src/auth/AuthContext.tsx`; **cliente HTTP** com refresh automático em `src/api/client.ts`.
- **Telas:** Login, Cadastro (com consentimento LGPD), Home, Cadastro de criança,
  Anamnese (6 grupos + progresso + rascunho), Revisão/Envio, Painel, Privacidade.
- Microcopy fiel ao manual ("Vamos com calma", "Ainda não há nada aqui — e tudo bem").

## Shared (`packages/shared`)
- `questionnaire.ts` — 30 perguntas em 6 grupos (fonte: RAG Notion).
- `panel.ts` — variáveis, faixas e `calcPanel()` do simulador.
- `types.ts` — contratos compartilhados entre API e app.
