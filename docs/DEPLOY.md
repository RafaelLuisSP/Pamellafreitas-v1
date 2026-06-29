# Deploy

## Backend — Cloudflare Workers + D1

1. **Autenticar:** `npx wrangler login`.
2. **Segredo JWT:** `cd apps/api && npx wrangler secret put JWT_SECRET` (use um valor longo e aleatório).
3. **Migrations remotas:** `npm run migrate:remote` (aplica `drizzle/0000_init.sql` no D1 `pamella-freitas`).
4. **Deploy:** `npm run deploy`. Anote a URL publicada (ex.: `https://pamella-freitas-api.<sub>.workers.dev`).
5. **CORS:** em `wrangler.toml`, troque `ALLOWED_ORIGIN = "*"` pelo domínio do app em produção e refaça o deploy.

O D1 (`0cec288f-bc92-432c-a187-b1b9a325d8aa`) e o KV (`f280d703cfd849db9da8de88588f467b`)
já estão referenciados no `wrangler.toml`.

## App — Expo / EAS

- **Web:** `cd apps/app && npm run web` (dev) ou `npx expo export -p web` para build estático
  (publicável em Cloudflare Pages).
- **Mobile (EAS):** `npm i -g eas-cli && eas login && eas build -p android` (ou `ios`).
- **URL da API:** defina `expo.extra.apiUrl` no `app.json` (ou `EXPO_PUBLIC_API_URL`) com a URL do Worker.

## Pós-deploy — checklist
- [ ] `JWT_SECRET` definido como secret (nunca no repositório).
- [ ] `ALLOWED_ORIGIN` restrito ao domínio do app.
- [ ] Migrations aplicadas no D1 remoto.
- [ ] Fluxos validados: cadastro+consentimento → anamnese (rascunho) → envio → exportar/excluir (LGPD).
