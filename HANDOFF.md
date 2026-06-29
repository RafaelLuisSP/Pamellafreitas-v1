# HANDOFF — Pâmella Freitas (retomar em nova sessão do Cowork)

> Atualizado em 29/06/2026. Fonte da verdade (RAG): Notion → página **07 - Pâmella Freitas**
> → subpágina **Build v1 — Ecossistema digital**. Projeto: psicologia infantil; quem usa o
> sistema são sempre os **pais/responsáveis** (crianças < 14).

---

## ⭐ Cole isto na primeira mensagem da nova sessão

```
Contexto: projeto Pâmella Freitas (psicologia infantil). Leia o RAG no Notion
(página "07 - Pâmella Freitas" + subpágina "Build v1") e o arquivo
pamella-freitas/HANDOFF.md na pasta do projeto.

O "site pamellafreitas.com" É A APLICAÇÃO (área segura dos pais / anamnese online +
painel). O Manual da Marca é só REFERÊNCIA de design (já aplicada nos tokens).
Login é por MAGIC LINK (sem senha), e-mail via Resend.

A v1 com magic link já está no disco e o backend foi type-checado. Assuma com autonomia:
1) Push do monorepo para github.com/RafaelLuisSP/Pamellafreitas-v1 (main, na raiz),
   substituindo o site de Brand Book que está lá (preservado na branch claude/...).
2) Configurar os 4 secrets do Actions e deixar o CI publicar (Worker + Pages).
3) Ligar os custom domains (pamellafreitas.com -> Pages; api.pamellafreitas.com -> Worker).
4) Verificar domínio no Resend e validar o fluxo ponta a ponta. Registrar tudo no RAG.
```

---

## 0. Decisões desta sessão (importantes)

- **Escopo corrigido:** o entregável é a **aplicação** (área dos pais/anamnese + painel),
  não o site do Manual da Marca. O Manual é **referência** (paleta/tipografia já nos tokens).
- **Auth trocada para MAGIC LINK** (sem senha): o responsável informa o e-mail + consente
  (LGPD), recebe um link por e-mail (**Resend**), clica e entra. Nome do responsável é
  pedido depois (onboarding). Senha/PBKDF2 removidos do fluxo.
- **Arquitetura de publicação:** `pamellafreitas.com` (+www) = app web (Cloudflare Pages);
  `api.pamellafreitas.com` = Worker (API). D1 e KV já provisionados.

## 1. Estado atual (o que já está pronto, no disco)

- **Monorepo** em `pamella-freitas/`:
  - **Backend (apps/api)** — magic link: `POST /auth/magic/request`, `POST /auth/magic/verify`,
    `POST /auth/refresh`; onboarding `PATCH /account/me`; LGPD (consentimento no 1º acesso,
    `GET /account/export`, `DELETE /account`). **`tsc --noEmit` = 0 erros** (validado nas versões
    do projeto: typescript 5.7, zod 3.25, drizzle 0.36, hono 4.12, workers-types).
  - **Frontend (apps/app)** — tela de acesso (e-mail + consentimento), captura do `?token=` na
    URL (web), onboarding de nome, painel, anamnese (6 grupos), privacidade. Fluxo revisado.
  - **Resend** (`apps/api/src/lib/email.ts`) — envio do magic link com template na voz/paleta da marca.
  - **CI/CD** (`.github/workflows/deploy.yml`) — typecheck + deploy do Worker + build/deploy do
    Pages; sincroniza `JWT_SECRET` e `RESEND_API_KEY` no Worker.
  - **SPA fallback** (`apps/app/public/_redirects`) — para o link `/entrar?token=...` abrir o app.
- **Domínio** `pamellafreitas.com` **JÁ ATIVO** na Cloudflare (não precisa apontar nameservers).
- **D1** `pamella-freitas` (`0cec288f-bc92-432c-a187-b1b9a325d8aa`) com as 5 tabelas
  (migration `0000_init` aplicada). **KV** `pamella-freitas-kv` (`f280d703cfd849db9da8de88588f467b`).
- ⚠️ **As mudanças do magic link estão SÓ no disco local (Windows). Ainda NÃO no GitHub.**

## 2. Pendências (ordem sugerida)

### 2.1 Push do monorepo → GitHub  ← primeiro
Repo: `github.com/RafaelLuisSP/Pamellafreitas-v1` · branch `main` · na **raiz**.
O **conector GitHub do Cowork só acessa repos PÚBLICOS** (diagnóstico: `get_me` ok, octocat
público ok, mas 404 em todos os privados). Duas saídas:
- **(A) Repo público temporário:** torne o repo público → a nova sessão faz o push via MCP →
  volte a privado depois. (Expõe o código enquanto público.)
- **(B) Push local (Git Bash), recomendado e sem expor nada:**
  ```bash
  cd "/c/Users/rafae/OneDrive/Documentos/Negócios/06 - Pamella Freitas/07 - Pâmella Freitas/pamella-freitas"
  git init -b main
  git add .
  git commit -m "feat: ecossistema v1 — anamnese (magic link) + painel + design system + CI/CD"
  git remote add origin https://github.com/RafaelLuisSP/Pamellafreitas-v1.git
  git push -u origin main --force   # usuário: RafaelLuisSP · senha: PAT (.secrets/github_pat.txt)
  ```
  `--force` substitui a `main` (hoje com o site de Brand Book) pelo projeto. O **Brand Book fica
  preservado** na branch `claude/pamella-freitas-brand-site-exdju9` (+ PR #1).

### 2.2 Secrets no GitHub (Settings → Secrets and variables → Actions)
- `CLOUDFLARE_API_TOKEN` — permissões: Workers Scripts:Edit, Pages:Edit, D1:Edit, Account:Read.
- `CLOUDFLARE_ACCOUNT_ID` = `164f30db67b8404ba4f8ef7668baa90e`
- `JWT_SECRET` — segredo longo e aleatório (assina os tokens de sessão).
- `RESEND_API_KEY` — chave do Resend (envio do magic link).

### 2.3 Deploy (automático no push, após os secrets)
O Actions publica o Worker (`api`) e o Pages (`pamella-freitas-web`). Para acompanhar: aba Actions.

### 2.4 Custom domains (Cloudflare)
- `pamellafreitas.com` + `www` → projeto Pages `pamella-freitas-web` (Custom domains).
- `api.pamellafreitas.com` → Worker `pamella-freitas-api`. Após a 1ª publicação, **descomente**
  em `apps/api/wrangler.toml` a linha `# routes = [{ pattern = "api.pamellafreitas.com", custom_domain = true }]`
  e refaça o deploy (ou ligue pelo dashboard: Workers → Settings → Domains).

### 2.5 Resend
Verificar o domínio `pamellafreitas.com` no Resend (adicionar os registros DNS na Cloudflare) para
enviar de `acesso@pamellafreitas.com`. Até verificar, usar remetente de teste `onboarding@resend.dev`
(ajustar `EMAIL_FROM` em `wrangler.toml`).

### 2.6 Assets da marca
Símbolo (broto/árvore) já esboçado em SVG. Gerar `icon.png`, `adaptive-icon.png`, `splash`, `favicon.png`
e referenciar em `apps/app/app.json` (hoje só há `backgroundColor`). Paleta: musgo #2E3A2C, folha
#5F7B57, broto #AFC298, linho #F5EFE4.

### 2.7 Validar fluxo E2E
acesso (e-mail + consentimento) → e-mail do magic link → `/entrar?token=` → onboarding (nome) →
criar criança → anamnese (6 grupos, rascunho) → revisão/envio → exportar / excluir (LGPD).

### 2.8 RAG (Notion)
Registrar o resultado na subpágina **Build v1**.

## 3. Arquivos alterados/criados nesta sessão (disco local)

**Backend** (`apps/api/`): `src/types.ts`, `src/validation.ts`, `src/lib/magic.ts` (novo),
`src/lib/email.ts` (novo), `src/routes/auth.ts`, `src/routes/account.ts`, `wrangler.toml`.
`src/lib/password.ts` ficou **órfão** (não usado) — pode remover.
**Frontend** (`apps/app/`): `app.json`, `src/api/client.ts`, `src/auth/AuthContext.tsx`,
`src/screens/LoginScreen.tsx` (exporta `AccessScreen`), `src/screens/RegisterScreen.tsx`
(exporta `OnboardingScreen`), `src/navigation/RootNavigator.tsx`, `src/navigation/types.ts`,
`public/_redirects` (novo).
**Raiz**: `.github/workflows/deploy.yml` (novo).

## 4. Rotas da API (atualizadas)
- `POST /auth/magic/request` { email, consent:true } · `POST /auth/magic/verify` { token } · `POST /auth/refresh`
- `GET|PATCH /account/me` · `GET /account/export` · `DELETE /account`
- `GET|POST /children` · `GET|PATCH|DELETE /children/:id`
- `GET /anamnese/questionnaire` · `GET|PUT /anamnese/:childId` · `POST /anamnese/:childId/submit`

## 5. ⚠️ Notas técnicas (para a nova sessão)
- **Mount OneDrive defasado:** o sandbox (bash) lê versões DESATUALIZADAS/truncadas dos arquivos
  recém-escritos. Use o **Read tool** (lê do Windows, confiável) ou faça o push do conteúdo do disco.
  O backend foi validado recriando os arquivos no `/tmp` e rodando `tsc`.
- **Conector GitHub do Cowork:** escopo somente público (não enxerga repos privados). Para push via
  MCP, o repo precisa estar público; senão, push local com PAT.
- **Conector Cloudflare (MCP):** gerencia D1/KV/R2 e roda queries, mas **não publica Worker/Pages**
  (sem deploy) e **não cria zonas** — deploy é via CI/wrangler; zona já existe.
- `LoginScreen.tsx`/`RegisterScreen.tsx` mantêm os nomes de arquivo mas exportam
  `AccessScreen`/`OnboardingScreen` (renomear quando conveniente).

_Gerado na sessão Cowork de 29/06/2026._
