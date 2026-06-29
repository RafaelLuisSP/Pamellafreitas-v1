/* =============================================================
   Manual da Marca · Pâmella Freitas
   Interações: progresso de leitura, navegação ativa,
   menu móvel e revelação suave (no tempo da página).
   ============================================================= */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Barra de progresso de leitura ---- */
  var progresso = document.getElementById('progresso');
  function atualizarProgresso() {
    var h = document.documentElement;
    var alturaRolavel = h.scrollHeight - h.clientHeight;
    var pct = alturaRolavel > 0 ? (h.scrollTop / alturaRolavel) * 100 : 0;
    if (progresso) progresso.style.width = pct.toFixed(2) + '%';
  }
  window.addEventListener('scroll', atualizarProgresso, { passive: true });
  atualizarProgresso();

  /* ---- Menu móvel ---- */
  var botaoMenu = document.getElementById('botao-menu');
  var sidebar = document.getElementById('sidebar');
  function fecharMenu() {
    if (!sidebar) return;
    sidebar.classList.remove('aberto');
    if (botaoMenu) botaoMenu.setAttribute('aria-expanded', 'false');
  }
  if (botaoMenu && sidebar) {
    botaoMenu.addEventListener('click', function () {
      var aberto = sidebar.classList.toggle('aberto');
      botaoMenu.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  }

  /* ---- Navegação ativa (sidebar) ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.sidebar__link'));
  var secoes = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  // Fechar menu móvel ao clicar num link
  links.forEach(function (a) {
    a.addEventListener('click', fecharMenu);
  });

  if ('IntersectionObserver' in window && secoes.length) {
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute('id');
          links.forEach(function (a) {
            a.classList.toggle('ativo', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    secoes.forEach(function (s) { obsNav.observe(s); });
  }

  /* ---- Revelação suave ao rolar ---- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (prefersReduced || !('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('visivel'); });
  } else {
    var obsReveal = new IntersectionObserver(function (entradas, obs) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('visivel');
          obs.unobserve(e.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { obsReveal.observe(el); });
  }
})();
