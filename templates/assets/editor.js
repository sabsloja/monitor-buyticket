/* =====================================================================
   A PROMESSA DE ABRAÃO — editor dos templates
   ---------------------------------------------------------------------
   Faz o template virar uma "mini ferramenta" no navegador:
     • clicar num texto com contorno tracejado → edita o texto
     • clicar na área da foto → escolhe uma foto do computador/celular
     • botão "Baixar PNG" → baixa a imagem no tamanho exato (ex.: 1080×1920)
   Os textos editados ficam guardados neste navegador até você clicar
   em "Restaurar textos originais".
   Não precisa editar nada aqui.
   ===================================================================== */
(function () {
  'use strict';

  var params = new URLSearchParams(location.search);
  var PREVIEW = params.has('preview');
  var body = document.body;
  var artes = Array.prototype.slice.call(document.querySelectorAll('.arte'));
  var MULTI = artes.length > 1;
  var NOME = body.dataset.template || (location.pathname.split('/').pop() || 'arte').replace(/\.html?$/, '');
  var CHAVE = 'promessa-de-abraao:' + NOME + ':';
  var palco = document.querySelector('.palco');
  var fontCSS = null;

  body.classList.add('editor');
  if (PREVIEW) body.classList.add('preview');

  function medidas(arte) { return { w: arte.offsetWidth, h: arte.offsetHeight }; }

  /* ---------- 1. Molduras e escala de visualização ---------- */
  artes.forEach(function (arte, i) {
    var moldura = document.createElement('div');
    moldura.className = 'moldura';
    arte.parentNode.insertBefore(moldura, arte);
    moldura.appendChild(arte);
    if (MULTI) {
      var cartao = document.createElement('div');
      cartao.className = 'cartao';
      moldura.parentNode.insertBefore(cartao, moldura);
      cartao.appendChild(moldura);
      var rot = document.createElement('div');
      rot.className = 'rotulo';
      rot.textContent = arte.dataset.nome || ('Arte ' + (i + 1));
      cartao.appendChild(rot);
      if (!PREVIEW) {
        var b = document.createElement('button');
        b.textContent = 'Baixar PNG';
        b.addEventListener('click', function () { baixar(arte); });
        cartao.appendChild(b);
      }
    }
    if (arte.classList.contains('story')) {
      var z = document.createElement('div');
      z.className = 'zonas-seguras nao-exportar';
      z.innerHTML = '<div class="topo">Área coberta pelo Instagram</div><div class="base">Área coberta pelo Instagram</div>';
      arte.appendChild(z);
    }
  });
  if (MULTI) palco.classList.add('grade');

  function ajustarEscala() {
    artes.forEach(function (arte) {
      var m = medidas(arte), moldura = arte.parentNode, escala;
      if (MULTI && !PREVIEW) {
        escala = 260 / m.w;
      } else if (MULTI && PREVIEW) {
        var col = Math.ceil(Math.sqrt(artes.length));
        escala = Math.min((innerWidth / col - 16) / m.w, 1);
      } else {
        var pad = PREVIEW ? 0 : 64;
        escala = Math.min((palco.clientWidth - pad) / m.w, (palco.clientHeight - pad) / m.h, 1);
      }
      arte.style.transform = 'scale(' + escala + ')';
      moldura.style.width = (m.w * escala) + 'px';
      moldura.style.height = (m.h * escala) + 'px';
    });
  }

  /* ---------- 2. Textos editáveis ---------- */
  var editaveis = Array.prototype.slice.call(document.querySelectorAll('[data-editavel]'));
  editaveis.forEach(function (el, i) {
    // normaliza quebras de linha do código (indentação) para não virarem linhas em branco
    el.innerHTML = el.innerHTML.trim().replace(/\s*\n\s*/g, ' ').replace(/\s*<br\s*\/?>\s*/gi, '<br>');
    el.dataset.original = el.innerHTML;
    if (PREVIEW) return;
    try {
      var salvo = localStorage.getItem(CHAVE + i);
      if (salvo !== null) el.innerText = salvo;
    } catch (e) { /* navegador sem armazenamento: segue sem guardar */ }
    el.setAttribute('contenteditable', 'plaintext-only');
    if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true');
    el.setAttribute('spellcheck', 'false');
    el.addEventListener('input', function () {
      try { localStorage.setItem(CHAVE + i, el.innerText); } catch (e) {}
      ajustarTexto(el);
    });
    el.addEventListener('paste', function (ev) { // cola só o texto, sem formatação
      ev.preventDefault();
      var t = (ev.clipboardData || window.clipboardData).getData('text/plain');
      document.execCommand('insertText', false, t);
    });
  });

  /* Textos com data-ajustar diminuem sozinhos se não couberem no espaço */
  function ajustarTexto(el) {
    if (!el.hasAttribute('data-ajustar')) return;
    if (!el.dataset.fonteOriginal) el.dataset.fonteOriginal = parseFloat(getComputedStyle(el).fontSize);
    var max = +el.dataset.fonteOriginal, min = max * (+(el.dataset.ajustar) || 0.5);
    var alturaMax = parseFloat(el.dataset.alturaMax || 0) || el.clientHeight;
    var t = max;
    el.style.fontSize = t + 'px';
    var guarda = 80;
    while (guarda-- > 0 && t > min && (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > alturaMax + 1)) {
      t -= Math.max(1, t * 0.03);
      el.style.fontSize = t + 'px';
    }
  }
  function ajustarTodos() { editaveis.forEach(ajustarTexto); }

  /* ---------- 3. Fotos ---------- */
  var fotos = Array.prototype.slice.call(document.querySelectorAll('[data-foto]'));
  fotos.forEach(function (foto) {
    var img = foto.querySelector('img');
    if (!img) return;
    function verificar() {
      foto.classList.toggle('tem-foto', !!img.getAttribute('src') && img.complete && img.naturalWidth > 0);
    }
    img.addEventListener('load', verificar);
    img.addEventListener('error', function () { foto.classList.remove('tem-foto'); });
    verificar();
    if (PREVIEW) return;
    var input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*'; input.hidden = true;
    document.body.appendChild(input);
    foto._input = input;
    foto.addEventListener('click', function () { input.click(); });
    input.addEventListener('change', function () {
      var f = input.files && input.files[0];
      if (!f) return;
      var leitor = new FileReader();
      leitor.onload = function () { img.src = leitor.result; status('Foto colocada! Ajuste o zoom e a posição no painel, se precisar.'); };
      leitor.readAsDataURL(f);
      input.value = '';
    });
  });

  /* ---------- 4. Painel lateral ---------- */
  var elStatus;
  function status(msg, erro) {
    if (!elStatus) return;
    elStatus.textContent = msg || '';
    elStatus.classList.toggle('erro', !!erro);
  }

  function criarPainel() {
    var p = document.createElement('aside');
    p.className = 'painel';
    var m = medidas(artes[0]);
    var h = '';
    h += '<a class="voltar" href="../index.html">← Voltar à visão geral</a>';
    h += '<h1>' + (body.dataset.titulo || document.title) + '</h1>';
    h += '<div class="tamanho">' + m.w + ' × ' + m.h + ' px' + (MULTI ? ' · ' + artes.length + ' peças' : '') + '</div>';
    h += '<h2>Como editar</h2><ol>';
    if (editaveis.length) h += '<li>Clique em qualquer texto da arte (aparece um contorno tracejado) e digite.</li>';
    if (body.dataset.temas) h += '<li>Escolha a cor de fundo logo abaixo.</li>';
    if (fotos.length) h += '<li>Clique na área tracejada da foto para escolher uma imagem.</li>';
    h += '<li>Clique em <b>Baixar PNG</b>. Pronto para postar.</li></ol>';

    fotos.forEach(function (foto, i) {
      var nome = foto.dataset.foto || 'Foto';
      h += '<h2>' + nome + '</h2>';
      if (foto.hasAttribute('data-opcional')) h += '<label class="check"><input type="checkbox" data-usar-foto="' + i + '" checked> Usar foto nesta arte</label>';
      h += '<button data-escolher="' + i + '">Escolher foto…</button>';
      h += '<label>Zoom</label><input type="range" min="100" max="250" value="100" data-ajuste="zoom" data-i="' + i + '">';
      h += '<label>Posição horizontal</label><input type="range" min="0" max="100" value="50" data-ajuste="pos-x" data-i="' + i + '">';
      h += '<label>Posição vertical</label><input type="range" min="0" max="100" value="' + (parseFloat(getComputedStyle(foto).getPropertyValue('--pos-y')) || 30) + '" data-ajuste="pos-y" data-i="' + i + '">';
      h += '<button data-remover="' + i + '">Remover foto</button>';
    });

    if (body.dataset.temas) {
      h += '<h2>Cor de fundo</h2><select data-tema>';
      body.dataset.temas.split(',').forEach(function (par) {
        var t = par.split(':');
        h += '<option value="' + t[0].trim() + '">' + (t[1] || t[0]).trim() + '</option>';
      });
      h += '</select>';
    }

    h += '<h2>Exportar</h2>';
    h += '<button class="principal" data-baixar>' + (MULTI ? 'Baixar todas (PNG)' : 'Baixar PNG') + '</button>';
    h += '<div class="status" role="status"></div>';
    if (artes[0].classList.contains('story')) h += '<label class="check"><input type="checkbox" data-zonas> Mostrar áreas cobertas pelo Instagram</label>';
    h += '<button data-tela-cheia>Tela cheia (para tirar print)</button>';
    h += '<button data-imprimir>Salvar PDF para gráfica (Ctrl+P)</button>';
    if (editaveis.length) {
      h += '<button data-restaurar>Restaurar textos originais</button>';
      h += '<div class="dica">Os textos que você digita ficam guardados neste navegador. ' +
        'Para trocar pelo código, procure no arquivo <code>' + NOME + '.html</code> os comentários <code>TROQUE AQUI</code>. ' +
        'Se o botão de baixar não funcionar, veja o <code>README.md</code> (método do print).</div>';
    } else {
      h += '<div class="dica">Se o botão de baixar não funcionar, veja o <code>README.md</code> (método do print).</div>';
    }
    p.innerHTML = h;
    body.insertBefore(p, body.firstChild);
    elStatus = p.querySelector('.status');

    p.querySelectorAll('[data-escolher]').forEach(function (b) {
      b.addEventListener('click', function () { fotos[+b.dataset.escolher]._input.click(); });
    });
    p.querySelectorAll('[data-remover]').forEach(function (b) {
      b.addEventListener('click', function () {
        var f = fotos[+b.dataset.remover], img = f.querySelector('img');
        img.removeAttribute('src'); f.classList.remove('tem-foto');
      });
    });
    p.querySelectorAll('[data-ajuste]').forEach(function (r) {
      r.addEventListener('input', function () {
        var f = fotos[+r.dataset.i];
        f.style.setProperty('--' + r.dataset.ajuste, r.dataset.ajuste === 'zoom' ? (r.value / 100) : (r.value + '%'));
      });
    });
    p.querySelectorAll('[data-usar-foto]').forEach(function (c) {
      c.addEventListener('change', function () {
        artes.forEach(function (a) { a.classList.toggle('sem-foto', !c.checked); });
        ajustarTodos();
      });
    });
    var sel = p.querySelector('[data-tema]');
    if (sel) {
      var temas = body.dataset.temas.split(',').map(function (x) { return 'tema-' + x.split(':')[0].trim(); });
      sel.addEventListener('change', function () {
        artes.forEach(function (a) {
          temas.forEach(function (t) { a.classList.remove(t); });
          a.classList.add('tema-' + sel.value);
        });
        if (window.Marca) Marca.renderizar();
      });
    }
    p.querySelector('[data-baixar]').addEventListener('click', function () {
      if (MULTI) {
        artes.reduce(function (pr, a) { return pr.then(function () { return baixar(a); }); }, Promise.resolve());
      } else baixar(artes[0]);
    });
    var z = p.querySelector('[data-zonas]');
    if (z) z.addEventListener('change', function () { body.classList.toggle('mostrar-zonas', z.checked); });
    p.querySelector('[data-tela-cheia]').addEventListener('click', telaCheia);
    p.querySelector('[data-imprimir]').addEventListener('click', function () { window.print(); });
    var restaurar = p.querySelector('[data-restaurar]');
    if (restaurar) restaurar.addEventListener('click', function () {
      if (!confirm('Voltar todos os textos para o modelo original?')) return;
      editaveis.forEach(function (el, i) {
        try { localStorage.removeItem(CHAVE + i); } catch (e) {}
        el.innerHTML = el.dataset.original;
        el.style.fontSize = '';
      });
      ajustarTodos();
      status('Textos restaurados.');
    });
  }

  /* ---------- 5. Exportar PNG ---------- */
  function nomeArquivo(arte) {
    var base = arte.dataset.arquivo || NOME;
    return base.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]+/g, '-') + '.png';
  }

  /* O exportador não copia algumas propriedades (ex.: o eixo SOFT da Fraunces e o
     equilíbrio de linhas). Marcamos os elementos e mandamos as regras junto com as fontes. */
  var PROPS_EXTRAS = ['font-variation-settings', 'text-wrap-style', 'text-wrap'];
  function regrasVariacao(arte) {
    var mapa = {}, n = 0, css = '';
    [arte].concat(Array.prototype.slice.call(arte.querySelectorAll('*'))).forEach(function (el) {
      var cs = getComputedStyle(el), regra = '';
      PROPS_EXTRAS.forEach(function (p) {
        var v = cs.getPropertyValue(p);
        if (v && v !== 'normal' && v !== 'wrap' && v !== 'auto') regra += p + ':' + v + ' !important;';
      });
      if (regra) {
        if (!(regra in mapa)) { mapa[regra] = ++n; css += '\n[data-fvs="' + n + '"]{' + regra + '}'; }
        el.setAttribute('data-fvs', mapa[regra]);
      }
    });
    return css;
  }

  function baixar(arte) {
    if (!window.htmlToImage) { status('O exportador não carregou. Use o método do print (README).', true); return Promise.resolve(); }
    var m = medidas(arte);
    status('Gerando a imagem… (alguns segundos)');
    body.classList.add('exportando');
    if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
    var fotoPeloCodigo = Array.prototype.some.call(arte.querySelectorAll('[data-foto] img'), function (img) {
      var src = img.getAttribute('src');
      return location.protocol === 'file:' && !!src && !/^data:/.test(src);
    });
    // garante uma folha de estilo interna para o exportador copiar as fontes do Google Fonts
    if (!document.getElementById('estilo-exportacao')) {
      var st = document.createElement('style'); st.id = 'estilo-exportacao'; document.head.appendChild(st);
    }
    var pronto = document.fonts ? document.fonts.ready : Promise.resolve();
    return pronto.then(function () {
      if (fontCSS !== null) return fontCSS;
      return htmlToImage.getFontEmbedCSS(arte).then(function (css) { fontCSS = css; return css; }, function () { fontCSS = ''; return ''; });
    }).then(function (css) {
      return htmlToImage.toPng(arte, {
        width: m.w, height: m.h, pixelRatio: 1, fontEmbedCSS: css + regrasVariacao(arte),
        style: { transform: 'none', left: '0', top: '0', margin: '0' },
        filter: function (n) {
          if (n.classList && n.classList.contains('nao-exportar')) return false;
          if (n.tagName === 'IMG' && !n.getAttribute('src')) return false; // área de foto ainda vazia
          return true;
        }
      });
    }).then(function (url) {
      var a = document.createElement('a');
      a.href = url; a.download = nomeArquivo(arte);
      document.body.appendChild(a); a.click(); a.remove();
      status(fotoPeloCodigo
        ? 'Imagem baixada — mas a foto colocada pelo código pode ter ficado de fora. Use “Escolher foto…” no painel.'
        : 'Pronto! Imagem baixada (' + m.w + '×' + m.h + ').', fotoPeloCodigo);
    }).catch(function (e) {
      console.error(e);
      status('Não consegui gerar a imagem neste navegador. Use o Chrome ou o método do print (README).', true);
    }).then(function () { body.classList.remove('exportando'); });
  }

  /* ---------- 6. Tela cheia para print ---------- */
  function telaCheia() {
    body.classList.add('modo-print');
    if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(function () {});
    setTimeout(ajustarEscala, 120);
  }
  function sairTelaCheia() {
    if (!body.classList.contains('modo-print')) return;
    body.classList.remove('modo-print');
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(function () {});
    setTimeout(ajustarEscala, 120);
  }
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') sairTelaCheia(); });
  document.addEventListener('fullscreenchange', function () { if (!document.fullscreenElement) sairTelaCheia(); });

  /* Tamanho da página na impressão = tamanho da arte */
  var m0 = medidas(artes[0]);
  var pg = document.createElement('style');
  pg.textContent = '@page { size: ' + m0.w + 'px ' + m0.h + 'px; margin: 0; }';
  document.head.appendChild(pg);

  /* ---------- Início ---------- */
  if (!PREVIEW) criarPainel();
  ajustarEscala();
  window.addEventListener('resize', ajustarEscala);
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(function () {
    ajustarTodos();
    if (window.Marca) Marca.renderizar();
  });

  window.EditorPromessa = { baixar: baixar, ajustarEscala: ajustarEscala };
})();
