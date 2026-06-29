// Site 100% pt-BR (mercado exclusivamente Brasil). O export web do Expo gera
// <html lang="en">, o que faz o Chrome oferecer traducao automatica e embaralhar
// a pagina. Aqui forcamos pt-BR e desativamos a traducao (meta oficial notranslate).
// Importado no topo do index.ts, roda antes do React montar.
import { Platform } from 'react-native';

if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const html = document.documentElement;
  html.lang = 'pt-BR';
  html.setAttribute('translate', 'no');
  html.classList.add('notranslate');

  const ensureMeta = (kind: 'name' | 'http-equiv', key: string, content: string) => {
    const selector = `meta[${kind}="${key}"]`;
    let el = document.head.querySelector(selector) as HTMLMetaElement | null;
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(kind, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Desliga a oferta de traducao do Google/Chrome e fixa o idioma do conteudo.
  ensureMeta('name', 'google', 'notranslate');
  ensureMeta('http-equiv', 'content-language', 'pt-BR');
}
