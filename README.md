# Pâmella Freitas — Ecossistema digital (Psicologia Infantil)

Monorepo do ecossistema de apoio à atuação da psicóloga infantil **Pâmella Freitas**.
Atendimento exclusivo a **crianças menores de 14 anos**; quem usa os formulários e o
portal são sempre os **pais/responsáveis legais**.

Três frentes em um só produto:

1. **Anamnese online (área privada dos pais)** — portal com login/senha onde o responsável
   preenche, em casa e no seu tempo, um questionário de **30 perguntas em 6 grupos**.
2. **Painel de planejamento de atendimentos** — simulador de faturamento (R$).
3. **Design system da marca** — tokens, tipografia e tom extraídos do Manual da Marca v1.0.

## Arquitetura

```
pamella-freitas/
├── apps/
│   ├── api/     Cloudflare Workers + Hono + Drizzle (D1) + JWT custom + LGPD
│   └── app/     Expo + React Native + React Native Web (login, anamnese, painel, privacidade)
└── packages/
    └── shared/  Questionário (30 perguntas), tipos e lógica do painel (compartilhados)
```

## Stack (imutável, Cloudflare-first)

- **Backend:** Cloudflare Workers + Hono
- **Dados:** D1 + Drizzle ORM, KV (sessões/futuro rate-limit)
- **Auth:** JWT custom via WebCrypto (HS256) + senha PBKDF2 — sem provedores terceiros
- **Mobile/Web:** React Native + React Native Web + Expo + EAS Build
- **Idioma:** português do Brasil · **Moeda do painel:** R$ (atendimento no Brasil)
- TypeScript strict em todo o monorepo

## Recursos Cloudflare (já provisionados)

| Recurso | Nome | ID |
|---|---|---|
| D1 | `pamella-freitas` | `0cec288f-bc92-432c-a187-b1b9a325d8aa` |
| KV | `pamella-freitas-kv` | `f280d703cfd849db9da8de88588f467b` |

## Como rodar

Pré-requisitos: Node 20+, conta Cloudflare (wrangler), Expo CLI.

```bash
npm install

# 1) Backend (Cloudflare Workers)
cd apps/api
cp .dev.vars.example .dev.vars          # defina um JWT_SECRET local
npm run migrate:local                    # aplica o schema no D1 local
npm run dev                              # http://localhost:8787

# 2) App (Expo / RN Web) — em outro terminal
cd apps/app
npm run web                              # abre no navegador
```

Para produção do backend:

```bash
cd apps/api
npx wrangler secret put JWT_SECRET       # segredo forte (NUNCA versionar)
npm run migrate:remote                   # aplica o schema no D1 remoto
npm run deploy
```

Depois, no app, defina a URL da API publicada em `apps/app/app.json` (`expo.extra.apiUrl`)
ou via `EXPO_PUBLIC_API_URL`, e troque `ALLOWED_ORIGIN` no `wrangler.toml` pelo domínio do app.

## LGPD (dado sensível de menor) — implementado

- Consentimento explícito do responsável no cadastro (registrado em `consents`).
- Uso exclusivamente clínico; armazenamento em D1 com acesso restrito + área protegida por JWT.
- **Exportar dados** (`GET /account/export`) e **exclusão definitiva** (`DELETE /account`,
  cascata manual) disponíveis na tela de Privacidade.
- Aviso de que o preenchimento **não substitui** a consulta.

## Documentação

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — decisões técnicas, modelo de dados e API.
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — passo a passo de deploy (Cloudflare + EAS).

> Fonte da verdade (RAG): página **07 - Pâmella Freitas** no Notion.
