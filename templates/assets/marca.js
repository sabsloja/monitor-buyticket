/* =====================================================================
   A PROMESSA DE ABRAÃO — peças visuais desenhadas automaticamente
   ---------------------------------------------------------------------
   Este arquivo desenha, dentro dos templates:
     • o LOGO .............. <div data-logo="logo-horizontal" data-versao="fundo-escuro"></div>
     • a ESTRELA ........... <span data-estrela="ouro"></span>
     • o CÉU DE ESTRELAS ... <div class="ceu" data-estrelas="120" data-semente="7"></div>
     • o COBOGÓ ............ <div data-cobogo="#FFFFFF" data-cobogo-opacidade=".08"></div>
   Não precisa editar nada aqui.
   ===================================================================== */
(function () {
  'use strict';
  var D = window.MARCA_DADOS;

  var CORES = {
    anil: '#1E1D4A', madrugada: '#34327A', ouro: '#F4AD24', urucum: '#D1552E', areia: '#F7EEE2',
    branco: '#FFFFFF', preto: '#000000'
  };

  // Cores de cada versão do logo (as mesmas dos arquivos da pasta /logo)
  var VERSOES = {
    'colorido':     { porta: CORES.urucum, tenda: CORES.anil,  estrela: CORES.ouro,  l1: CORES.anil,  l2: CORES.urucum },
    'fundo-escuro': { porta: CORES.urucum, tenda: CORES.areia, estrela: CORES.ouro,  l1: CORES.areia, l2: CORES.ouro },
    'fundo-urucum': { porta: CORES.ouro,   tenda: CORES.areia, estrela: CORES.areia, l1: CORES.areia, l2: CORES.anil },
    'preto':        { porta: null,         tenda: '#000000',   estrela: '#000000',   l1: '#000000',   l2: '#000000' },
    'branco':       { porta: null,         tenda: '#FFFFFF',   estrela: '#FFFFFF',   l1: '#FFFFFF',   l2: '#FFFFFF' }
  };

  function cor(nome) { return CORES[nome] || nome; }

  function logoSVG(layout, versao) {
    var L = D[layout] || D['logo-horizontal'];
    var v = VERSOES[versao] || VERSOES['colorido'];
    var p = L.parts, s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + L.viewBox + '" role="img" aria-label="A Promessa de Abraão">';
    if (p.porta && v.porta) s += '<path fill="' + v.porta + '" d="' + p.porta + '"/>';
    s += '<path fill="' + v.tenda + '" d="' + p.tenda + '"/>';
    s += '<path fill="' + v.estrela + '" d="' + p.estrela + '"/>';
    if (p.l1) s += '<path fill="' + v.l1 + '" d="' + p.l1 + '"/><path fill="' + v.l2 + '" d="' + p.l2 + '"/>';
    return s + '</svg>';
  }

  function estrelaSVG(c) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + D.estrela.viewBox + '"><path fill="' + cor(c || 'ouro') + '" d="' + D.estrela.d + '"/></svg>';
  }

  // Gerador de números "aleatórios" previsíveis: a mesma semente = o mesmo céu
  function sorteio(semente) {
    var a = semente >>> 0;
    return function () {
      a += 0x6D2B79F5;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Céu contável: muitos pontos de luz (a multidão) + algumas estrelas da marca
  function desenharCeu(el) {
    var w = el.offsetWidth, h = el.offsetHeight;
    if (!w || !h) return;
    var n = +(el.dataset.estrelas || 90);
    var rnd = sorteio(+(el.dataset.semente || 1));
    var corPonto = cor(el.dataset.cor || 'areia');
    var corBrilho = cor(el.dataset.brilho || 'ouro');
    var escala = +(el.dataset.escala || 1);
    var s = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none">';
    for (var i = 0; i < n; i++) {
      var x = rnd() * w, y = rnd() * h;
      var r = (1.4 + Math.pow(rnd(), 3) * 3.6) * escala;
      var o = (0.22 + rnd() * 0.6).toFixed(2);
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r.toFixed(2) + '" fill="' + corPonto + '" opacity="' + o + '"/>';
    }
    var nb = Math.max(2, Math.round(n / 14));
    for (var j = 0; j < nb; j++) {
      var bx = rnd() * w, by = rnd() * h, t = (14 + rnd() * 22) * escala;
      var c = rnd() < 0.6 ? corBrilho : corPonto;
      s += '<g transform="translate(' + (bx - t / 2).toFixed(1) + ' ' + (by - t / 2).toFixed(1) + ') scale(' + (t / 100).toFixed(3) + ')" opacity="' + (0.55 + rnd() * 0.4).toFixed(2) + '"><path fill="' + c + '" d="' + D.estrela.d + '"/></g>';
    }
    el.innerHTML = s + '</svg>';
  }

  // Cobogó de estrelas: o tijolo vazado do modernismo brasileiro, com a estrela da marca
  function cobogoURL(c, opacidade, tam) {
    var t = tam || 140;
    var e = t * 0.62, m = (t - e) / 2;
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + t + '" height="' + t + '" viewBox="0 0 ' + t + ' ' + t + '">' +
      '<g fill="' + cor(c) + '" opacity="' + opacidade + '">' +
      '<g transform="translate(' + m + ' ' + m + ') scale(' + (e / 100) + ')"><path d="' + D.estrela.d + '"/></g>' +
      '<circle cx="0" cy="0" r="' + (t * 0.07) + '"/><circle cx="' + t + '" cy="0" r="' + (t * 0.07) + '"/>' +
      '<circle cx="0" cy="' + t + '" r="' + (t * 0.07) + '"/><circle cx="' + t + '" cy="' + t + '" r="' + (t * 0.07) + '"/>' +
      '</g></svg>';
    return 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg) + '")';
  }

  function renderizar(raiz) {
    raiz = raiz || document;
    raiz.querySelectorAll('[data-logo]').forEach(function (el) {
      el.innerHTML = logoSVG(el.dataset.logo, el.dataset.versao);
    });
    raiz.querySelectorAll('[data-estrela]').forEach(function (el) {
      el.innerHTML = estrelaSVG(el.dataset.estrela);
    });
    raiz.querySelectorAll('.ceu').forEach(desenharCeu);
    raiz.querySelectorAll('[data-cobogo]').forEach(function (el) {
      el.style.backgroundImage = cobogoURL(el.dataset.cobogo, el.dataset.cobogoOpacidade || 0.1, +el.dataset.cobogoTamanho || 140);
    });
  }

  window.Marca = { CORES: CORES, VERSOES: VERSOES, logoSVG: logoSVG, estrelaSVG: estrelaSVG, cobogoURL: cobogoURL, renderizar: renderizar };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { renderizar(); });
  else renderizar();
})();
