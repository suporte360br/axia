// Menu móvel
(function () {
  var botao = document.querySelector('.botao-menu');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = menu.classList.toggle('aberto');
      botao.setAttribute('aria-expanded', aberto ? 'true' : 'false');
    });
  }
})();

// Filtro de temas do blog
(function () {
  var filtros = document.querySelectorAll('.filtros button');
  if (!filtros.length) return;
  var cartoes = document.querySelectorAll('[data-tema]');
  filtros.forEach(function (b) {
    b.addEventListener('click', function () {
      var tema = b.getAttribute('data-filtro');
      filtros.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      cartoes.forEach(function (c) {
        c.classList.toggle('oculto', tema !== 'todos' && c.getAttribute('data-tema') !== tema);
      });
    });
  });
})();

// Formulário de contato: monta um e-mail com os dados preenchidos
(function () {
  var form = document.getElementById('form-contato');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(form);
    var assunto = (d.get('assunto') || 'Contato pelo site') + ' — ' + (d.get('nome') || '');
    var corpo = 'Nome: ' + d.get('nome') + '\n' +
      'E-mail: ' + d.get('email') + '\n' +
      (d.get('empresa') ? 'Empresa: ' + d.get('empresa') + '\n' : '') +
      'Assunto: ' + d.get('assunto') + '\n\n' + d.get('mensagem');
    window.location.href = 'mailto:contato@axia.net.br?subject=' +
      encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
  });
  // Pré-seleciona o assunto vindo de um link (?assunto=...)
  var p = new URLSearchParams(location.search).get('assunto');
  if (p) {
    var sel = form.querySelector('[name=assunto]');
    if (sel) {
      var ok = Array.prototype.some.call(sel.options, function (o) { return o.value === p; });
      if (ok) sel.value = p;
    }
  }
})();

// Anunciar vaga: monta um e-mail com o perfil completo, separado por seções
(function () {
  var form = document.getElementById('form-vaga');
  if (!form) return;
  var resultado = document.getElementById('resultado-vaga');
  var texto = document.getElementById('texto-vaga');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var linhas = [];
    form.querySelectorAll('fieldset').forEach(function (fs) {
      linhas.push('== ' + fs.querySelector('legend').textContent.trim().toUpperCase() + ' ==');
      fs.querySelectorAll('label').forEach(function (l) {
        var campo = l.querySelector('input, select, textarea');
        var valor = campo && campo.value.trim();
        if (!valor) return;
        var rotulo = l.firstChild.textContent.trim();
        linhas.push(campo.tagName === 'TEXTAREA' ? rotulo + ':\n' + valor : rotulo + ': ' + valor);
      });
      linhas.push('');
    });
    linhas.push('O responsável confirmou que pode compartilhar estas informações e que a vaga não traz exigências discriminatórias.');
    var d = new FormData(form);
    var assunto = 'Nova vaga para revisão — ' + d.get('titulo') + ' — ' + d.get('empresa');
    var corpo = linhas.join('\n');
    document.getElementById('assunto-vaga').textContent = assunto;
    texto.value = corpo;
    resultado.hidden = false;
    resultado.focus();
    window.location.href = 'mailto:contato@axia.net.br?subject=' +
      encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
  });
  document.getElementById('copiar-vaga').addEventListener('click', function () {
    var aviso = document.getElementById('copiado');
    texto.select();
    var ok = function () { aviso.textContent = 'Texto copiado.'; };
    if (navigator.clipboard) navigator.clipboard.writeText(texto.value).then(ok, function () { document.execCommand('copy'); ok(); });
    else { document.execCommand('copy'); ok(); }
  });
})();

// Ano no rodapé
(function () {
  var el = document.getElementById('ano');
  if (el) el.textContent = new Date().getFullYear();
})();
