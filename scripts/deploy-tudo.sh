#!/usr/bin/env bash
# =============================================================================
# deploy-tudo.sh — Push (GitHub) + Deploy do backend (Cloudflare) — Pâmella Freitas
# -----------------------------------------------------------------------------
# COMO RODAR (no Git Bash, a partir da pasta pamella-freitas/):
#     bash scripts/deploy-tudo.sh
#
# O que ele faz, sem você digitar nada:
#   1. git init + commit (se ainda não houver)
#   2. garante o repositório no GitHub (cria privado se não existir)
#   3. push da branch main
#   4. npm install (workspaces)
#   5. gera um JWT_SECRET aleatório LOCALMENTE e publica como secret + deploy do Worker
#   6. grava a URL do Worker em apps/app/app.json (expo.extra.apiUrl)
#
# SEGREDOS: lidos de ../.secrets/  (github_pat.txt e "Cloudflare Key.txt").
#           Nunca são impressos. O JWT_SECRET é gerado na hora e nunca aparece.
#           Recomendado: após validar, rotacione o PAT e mantenha .secrets fora do git.
#
# A migration do D1 JÁ foi aplicada (via conector MCP) — por isso NÃO roda migrate:remote.
# =============================================================================
set -euo pipefail

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SECRETS_DIR="$(cd "$REPO_DIR/.." && pwd)/.secrets"
cd "$REPO_DIR"

GH_USER="RafaelLuisSP"
GH_REPO="Pamellafreitas-v1"
REMOTE_HTTPS="https://github.com/$GH_USER/$GH_REPO.git"

log(){ printf '\n\033[1;32m==>\033[0m %s\n' "$1"; }
die(){ printf '\n\033[1;31mERRO:\033[0m %s\n' "$1"; exit 1; }

# --- segredos (não imprimir) -------------------------------------------------
[ -f "$SECRETS_DIR/github_pat.txt" ]    || die "Falta $SECRETS_DIR/github_pat.txt"
[ -f "$SECRETS_DIR/Cloudflare Key.txt" ] || die "Falta $SECRETS_DIR/Cloudflare Key.txt"
GH_PAT="$(tr -d '[:space:]' < "$SECRETS_DIR/github_pat.txt")"
export CLOUDFLARE_API_TOKEN="$(tr -d '[:space:]' < "$SECRETS_DIR/Cloudflare Key.txt")"

# --- 1. Git: init + commit ---------------------------------------------------
log "1/6 Git: init + commit"
[ -d .git ] || git init -b main
git config user.email "rafaelluisoliveirasp@gmail.com"
git config user.name  "$GH_USER"
git add -A
git commit -m "feat: ecossistema v1 (anamnese online + painel + design system)" \
  || echo "   (nada novo a commitar — seguindo)"
git branch -M main

# --- 2. Garante o repositório no GitHub --------------------------------------
log "2/6 Garantindo repositório no GitHub ($GH_USER/$GH_REPO)"
if curl -fsS -H "Authorization: Bearer $GH_PAT" \
     "https://api.github.com/repos/$GH_USER/$GH_REPO" >/dev/null 2>&1; then
  echo "   repositório já existe."
else
  echo "   criando repositório privado..."
  curl -fsS -X POST -H "Authorization: Bearer $GH_PAT" \
       -H "Accept: application/vnd.github+json" \
       https://api.github.com/user/repos \
       -d "{\"name\":\"$GH_REPO\",\"private\":true,\"description\":\"Ecossistema v1 — Pâmella Freitas (anamnese online + painel + design system)\"}" \
       >/dev/null || die "Não consegui criar o repo. Crie-o vazio em github.com e rode de novo."
fi

# --- 3. Push (token efêmero na URL, removido logo após) ----------------------
log "3/6 Push da branch main"
git remote remove origin 2>/dev/null || true
git remote add origin "https://x-access-token:${GH_PAT}@github.com/$GH_USER/$GH_REPO.git"
if ! git push -u origin main 2>/dev/null; then
  echo "   push direto falhou (repo pode ter commits). Tentando rebase..."
  git pull --rebase origin main || true
  git push -u origin main
fi
git remote set-url origin "$REMOTE_HTTPS"   # remove o token do remote salvo
unset GH_PAT
echo "   ok → $REMOTE_HTTPS"

# --- 4. Dependências ---------------------------------------------------------
log "4/6 npm install (pode demorar na 1ª vez)"
npm install

# --- 5. JWT_SECRET (gerado local) + secret + deploy do Worker ----------------
log "5/6 JWT_SECRET + deploy do backend (apps/api)"
cd "$REPO_DIR/apps/api"
JWT_VALUE="$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")"
printf '%s' "$JWT_VALUE" | npx --yes wrangler secret put JWT_SECRET
unset JWT_VALUE
DEPLOY_OUT="$(npx --yes wrangler deploy 2>&1)"
echo "$DEPLOY_OUT"
WORKER_URL="$(printf '%s\n' "$DEPLOY_OUT" | grep -oE 'https://[A-Za-z0-9._-]+\.workers\.dev' | head -1 || true)"
cd "$REPO_DIR"

# --- 6. Grava a URL da API no app -------------------------------------------
log "6/6 Atualizando apps/app/app.json (expo.extra.apiUrl)"
if [ -n "${WORKER_URL:-}" ]; then
  node -e "const f='apps/app/app.json';const j=require('./'+f);j.expo.extra=j.expo.extra||{};j.expo.extra.apiUrl=process.argv[1];require('fs').writeFileSync(f,JSON.stringify(j,null,2)+'\n');console.log('   apiUrl =>',process.argv[1]);" "$WORKER_URL"
else
  echo "   ⚠ não extraí a URL do Worker automaticamente — edite apps/app/app.json (expo.extra.apiUrl) com a URL impressa acima."
fi

log "PRONTO ✅  Push + deploy concluídos."
[ -n "${WORKER_URL:-}" ] && echo "API publicada: $WORKER_URL"
cat <<'FIM'

Próximos passos sugeridos:
  • Commitar a URL no app:   git add -A && git commit -m "chore: define apiUrl de produção" && git push
  • Rodar o app web:          cd apps/app && npm run web
  • Validar o fluxo E2E:      cadastro+consentimento → anamnese → envio → exportar/excluir (LGPD)
  • Restringir CORS:          em apps/api/wrangler.toml troque ALLOWED_ORIGIN="*" pelo domínio do app e rode `npm run deploy` de novo
  • Segurança:                rotacione o PAT e confirme que .secrets/ está fora do git (já coberto pelo .gitignore? .secrets está na pasta-pai, fora do repo)
FIM
