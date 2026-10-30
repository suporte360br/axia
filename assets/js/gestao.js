// Área de gestão de vagas (/gestao/): login por código no celular, painel, revisão e cadastro de gestores.
// Usa os dados e o formulário de recrutamento.js (window.AXR).
(() => {
  const { DEMO, cfg, api, esc, qs, dataBR, traduzErro, normalizarCelular, conferirPadrao, serializar, preencher, iniciarFormulario } = window.AXR;
  const $ = (s) => document.querySelector(s);
  const aviso = (el, msg, tipo = 'erro') => { el.textContent = msg; el.className = 'msg ' + tipo; el.hidden = !msg; };
  const dataHora = (d) => (d ? new Date(d).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—');
  const celularBR = (c) => { const n = String(c || '').replace(/^55/, ''); return n.length >= 10 ? `(${n.slice(0, 2)}) ${n.slice(2, -4)}-${n.slice(-4)}` : c; };
  const STATUS = { pendente: 'Aguardando aprovação', em_revisao: 'Em revisão', aprovada: 'Publicada', reprovada: 'Reprovada', encerrada: 'Encerrada' };
  // Só volta para páginas da própria área
  const destinoSeguro = () => { const v = qs('voltar') || ''; return /^\/gestao\/(painel|vaga|gestores)\/(\?id=[\w-]+)?$/.test(v) ? v : '/gestao/painel/'; };
  if (DEMO) document.querySelectorAll('#faixa-demo').forEach((el) => { el.hidden = false; });

  // Devolve o gestor logado ({ id, nome, papel }) ou false (já redirecionou para o login)
  async function exigirLogin({ admin = false } = {}) {
    if (!(await api.sessao())) { location.replace('/gestao/?voltar=' + encodeURIComponent(location.pathname + location.search)); return false; }
    const g = await api.acesso().catch(() => undefined);
    if (!g) { await api.sair(); location.replace('/gestao/?bloqueado=1'); return false; }
    if (admin && g.papel !== 'admin') { location.replace('/gestao/painel/'); return false; }
    $('#quem').textContent = g.nome;
    document.querySelectorAll('[data-so-logado]').forEach((el) => { el.hidden = false; });
    document.querySelectorAll('[data-so-admin]').forEach((el) => { el.hidden = g.papel !== 'admin'; });
    $('#sair').addEventListener('click', async () => { await api.sair(); location.replace('/gestao/'); });
    return g;
  }

  const paginas = {
    async login() {
      if (await api.sessao()) {
        if (await api.acesso().catch(() => null)) { location.replace(destinoSeguro()); return; }
        await api.sair();
      }
      const passo1 = $('#passo-celular'), passo2 = $('#passo-codigo'), msg = $('#msg');
      if (qs('bloqueado')) aviso(msg, 'Este celular não está cadastrado como gestor ativo da AXIA.');
      const canais = (cfg.canais || []).filter((c) => c === 'whatsapp' || c === 'sms');
      if (!canais.length) canais.push('sms');
      passo1.querySelectorAll('.canal input').forEach((i) => { i.closest('label').hidden = !canais.includes(i.value); i.checked = i.value === canais[0]; });
      passo1.querySelector('.canal').hidden = canais.length < 2;
      let celular = '', canal = canais[0];
      $('#celular').addEventListener('input', (e) => {
        const n = e.target.value.replace(/\D/g, '').slice(0, 11);
        e.target.value = n.length > 6 ? `(${n.slice(0, 2)}) ${n.slice(2, n.length - 4)}-${n.slice(-4)}` : n.length > 2 ? `(${n.slice(0, 2)}) ${n.slice(2)}` : n;
      });
      passo1.addEventListener('submit', async (e) => {
        e.preventDefault();
        celular = normalizarCelular($('#celular').value);
        canal = new FormData(passo1).get('canal') || canais[0];
        if (!/^55\d{10,11}$/.test(celular)) return aviso(msg, 'Informe o celular com DDD.');
        const btn = passo1.querySelector('button'); btn.disabled = true; aviso(msg, '');
        try {
          await api.enviarCodigo(celular, canal);
          passo1.hidden = true; passo2.hidden = false;
          $('#destino').textContent = `${canal === 'whatsapp' ? 'WhatsApp' : 'SMS'} para o final ${celular.slice(-4)}`;
          $('#codigo').focus();
        } catch (err) { aviso(msg, traduzErro(err)); } finally { btn.disabled = false; }
      });
      passo2.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = passo2.querySelector('button[type=submit]'); btn.disabled = true; aviso(msg, '');
        try { await api.confirmarCodigo(celular, $('#codigo').value.trim()); location.replace(destinoSeguro()); }
        catch (err) { aviso(msg, traduzErro(err)); btn.disabled = false; }
      });
      $('#voltar-celular').addEventListener('click', () => { passo2.hidden = true; passo1.hidden = false; aviso(msg, ''); });
    },

    async painel() {
      if (!(await exigirLogin())) return;
      api.registrarAcesso().catch(() => {});
      const box = $('#tabela-vagas'), abas = [...document.querySelectorAll('#abas [data-status]')];
      let vagas = [], filtro = sessionStorage.getItem('axia-aba') ?? 'pendente';
      const desenhar = () => {
        abas.forEach((b) => {
          b.setAttribute('aria-selected', String(b.dataset.status === filtro));
          b.querySelector('span').textContent = (b.dataset.status ? vagas.filter((v) => v.status === b.dataset.status) : vagas).length;
        });
        const busca = $('#busca').value.trim().toLowerCase();
        const lista = vagas.filter((v) => (!filtro || v.status === filtro) &&
          (!busca || [v.codigo, v.titulo, v.empresa_nome, v.email, v.responsavel].join(' ').toLowerCase().includes(busca)));
        if (!lista.length) { box.innerHTML = '<p class="vazio-simples">Nenhuma vaga aqui.</p>'; return; }
        box.innerHTML = `<div class="tabela-rolagem"><table class="tabela">
          <thead><tr><th>Código</th><th>Cargo</th><th>Empresa</th><th>Enviada em</th><th>Status</th><th>Padrão</th><th></th></tr></thead>
          <tbody>${lista.map((v) => `<tr>
            <td>${esc(v.codigo)}</td>
            <td><strong>${esc(v.titulo)}</strong><br><small>${esc(v.responsavel)} · ${esc(v.email)}</small></td>
            <td>${esc(v.empresa_nome)}</td>
            <td>${dataHora(v.enviada_em)}</td>
            <td><span class="status status-${v.status}">${STATUS[v.status]}</span>${v.status === 'aprovada' && v.validade ? `<br><small>até ${dataBR(v.validade)}</small>` : ''}</td>
            <td>${v.problemas ? `<span class="falta">${v.problemas} ${v.problemas === 1 ? 'pendência' : 'pendências'}</span>` : '<span class="ok">Completo</span>'}</td>
            <td><a class="botao botao-contorno botao-pequeno" href="/gestao/vaga/?id=${encodeURIComponent(v.id)}">Revisar</a></td>
          </tr>`).join('')}</tbody></table></div>`;
      };
      abas.forEach((b) => b.addEventListener('click', () => { filtro = b.dataset.status; sessionStorage.setItem('axia-aba', filtro); desenhar(); }));
      $('#busca').addEventListener('input', desenhar);
      try { vagas = await api.listarVagas(); desenhar(); }
      catch (err) { box.innerHTML = `<p class="msg erro">${esc(traduzErro(err))}</p>`; }
    },

    async revisao() {
      if (!(await exigirLogin())) return;
      const id = qs('id'), form = $('#form-vaga'), msg = $('#msg');
      let v;
      const conferir = () => {
        const p = conferirPadrao(serializar(form).dados);
        $('#checklist').innerHTML = p.length
          ? p.map((x) => `<li class="falta">${esc(x)}</li>`).join('')
          : '<li class="ok">Tudo conforme o padrão AXIA. A vaga pode ser aprovada.</li>';
        $('#caixa-padrao').classList.toggle('caixa-ok', !p.length);
        return p;
      };
      const linkEmail = () => {
        const motivo = $('#motivo').value.trim();
        const publica = v.slug ? `https://axia.net.br/recrutamento/vaga/?v=${v.slug}` : '';
        const [rotulo, corpo] = v.status === 'aprovada'
          ? ['Avisar a empresa da publicação', `Olá, ${v.responsavel}.\n\nA vaga ${v.titulo} (${v.codigo}) foi aprovada e já está publicada no portal da AXIA:\n${publica}\n\nAtenciosamente,\nAXIA`]
          : v.status === 'reprovada'
            ? ['Enviar o motivo à empresa', `Olá, ${v.responsavel}.\n\nAnalisamos a vaga ${v.titulo} (${v.codigo}) e, neste momento, ela não será publicada.\n\nMotivo: ${motivo || v.motivo || ''}\n\nFicamos à disposição.\nAXIA`]
            : ['Pedir ajustes por e-mail', `Olá, ${v.responsavel}.\n\nRecebemos a vaga ${v.titulo} (${v.codigo}). Para publicá-la, precisamos de alguns ajustes:\n\n${motivo || '- '}\n\nAtenciosamente,\nAXIA`];
        const a = $('#email-ajustes');
        a.textContent = rotulo;
        a.href = `mailto:${v.email}?subject=${encodeURIComponent(`Vaga ${v.codigo} — ${v.titulo}`)}&body=${encodeURIComponent(corpo)}`;
      };
      const desenhar = () => {
        $('#status-vaga').textContent = STATUS[v.status];
        $('#status-vaga').className = 'status status-' + v.status;
        $('#titulo-vaga').textContent = v.titulo;
        $('#meta-vaga').textContent = `${v.codigo} · ${v.empresa_nome} · enviada em ${dataHora(v.enviada_em)}${v.revisada_por ? ` · última ação de ${v.revisada_por}` : ''}`;
        document.title = `${v.codigo} · Revisar vaga · Gestão | AXIA`;
        const pode = { salvar: v.status !== 'reprovada' && v.status !== 'encerrada', aprovada: ['pendente', 'em_revisao'].includes(v.status),
          reprovada: ['pendente', 'em_revisao'].includes(v.status), encerrada: v.status === 'aprovada', pendente: ['reprovada', 'encerrada'].includes(v.status) };
        document.querySelectorAll('[data-acao]').forEach((b) => { b.hidden = !pode[b.dataset.acao]; });
        form.querySelectorAll('input, select, textarea, button').forEach((el) => { el.disabled = !pode.salvar; });
        $('#contato').innerHTML = [['Responsável', v.responsavel], ['Cargo', v.responsavel_cargo], ['E-mail', v.email], ['Telefone', v.telefone]]
          .filter(([, x]) => x).map(([t, x]) => `<div><dt>${t}</dt><dd>${t === 'E-mail' ? `<a href="mailto:${esc(x)}">${esc(x)}</a>` : esc(x)}</dd></div>`).join('');
        $('#caixa-publica').hidden = v.status !== 'aprovada';
        if (v.status === 'aprovada') {
          $('#publicada-em').textContent = dataBR(v.publicada_em);
          $('#validade-pub').textContent = dataBR(v.validade);
          $('#link-publico').href = `/recrutamento/vaga/?v=${encodeURIComponent(v.slug)}`;
        }
        $('#notas').value = v.notas_internas || '';
        $('#motivo').value = v.motivo || '';
        $('#historico').innerHTML = (v.historico || []).map((h) => `<li><strong>${esc(h.acao)}</strong><br><small>${dataHora(h.quando)} · ${esc(h.quem)}</small>${h.detalhe ? `<p>${esc(h.detalhe)}</p>` : ''}</li>`).join('');
        linkEmail();
        conferir();
      };
      const carregar = async () => {
        v = await api.obterVaga(id);
        preencher(form, v.dados);
        desenhar();
        $('#carregando-vaga').hidden = true; $('#revisao').hidden = false;
      };

      iniciarFormulario(form, conferir);
      $('#motivo').addEventListener('input', linkEmail);
      document.querySelectorAll('[data-acao]').forEach((b) => b.addEventListener('click', async () => {
        const acao = b.dataset.acao, motivo = $('#motivo').value.trim();
        aviso(msg, '');
        try {
          if (acao === 'salvar' || acao === 'aprovada') {
            const p = conferir();
            if (acao === 'aprovada' && p.length) { aviso(msg, 'Antes de aprovar, resolva as pendências da conferência do padrão.'); $('#caixa-padrao').scrollIntoView({ behavior: 'smooth' }); return; }
            if (v.status === 'aprovada' && p.length) { aviso(msg, 'A vaga está publicada: as alterações precisam manter o padrão AXIA.'); return; }
            if (acao === 'aprovada' && !confirm('Aprovar e publicar esta vaga no portal?')) return;
            await api.salvarVaga(v.id, serializar(form).dados, $('#notas').value);
          }
          if (acao === 'reprovada') {
            if (motivo.length < 5) { aviso(msg, 'Escreva o motivo da reprovação no quadro "Motivo / ajustes pedidos".'); $('#motivo').focus(); return; }
            if (!confirm('Reprovar esta vaga? Depois use o botão de e-mail para avisar a empresa.')) return;
          }
          if (acao === 'encerrada' && !confirm('Encerrar a vaga? Ela sai do portal público na hora.')) return;
          if (acao !== 'salvar') await api.mudarStatus(v.id, acao, acao === 'reprovada' ? motivo : null);
          await carregar();
          aviso(msg, { salvar: 'Revisão salva.', aprovada: 'Vaga aprovada e publicada no portal.', reprovada: 'Vaga reprovada. Use o botão de e-mail para avisar a empresa.',
            encerrada: 'Vaga encerrada e retirada do portal.', pendente: 'A vaga voltou para aprovação.' }[acao], 'info');
          msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } catch (err) { aviso(msg, traduzErro(err)); msg.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
      }));
      try { await carregar(); }
      catch (err) { $('#carregando-vaga').innerHTML = `<p class="msg erro">${esc(traduzErro(err))}</p>`; }
    },

    async gestores() {
      const eu = await exigirLogin({ admin: true });
      if (!eu) return;
      const box = $('#tabela-gestores'), dialogo = $('#dialogo-gestor'), f = $('#form-gestor'), msg = $('#msg'), msgD = $('#msg-dialogo');
      let lista = [];
      const desenhar = () => {
        box.innerHTML = `<div class="tabela-rolagem"><table class="tabela">
          <thead><tr><th>Nome</th><th>Celular</th><th>E-mail</th><th>Papel</th><th>Situação</th><th>Último acesso</th><th></th></tr></thead>
          <tbody>${lista.map((g) => `<tr>
            <td><strong>${esc(g.nome)}</strong>${g.id === eu.id ? ' <small>(você)</small>' : ''}</td>
            <td>${esc(celularBR(g.celular))}</td><td>${esc(g.email)}</td>
            <td>${g.papel === 'admin' ? 'Administrador' : 'Gestor'}</td>
            <td>${g.ativo ? '<span class="ok">Ativo</span>' : '<span class="falta">Desativado</span>'}</td>
            <td>${g.ultimo_acesso ? dataHora(g.ultimo_acesso) : '<small>Nunca entrou</small>'}</td>
            <td class="acoes-linha"><button class="botao botao-contorno botao-pequeno" data-editar="${esc(g.id)}">Editar</button>${g.id === eu.id ? '' : ` <button class="botao botao-contorno botao-pequeno" data-excluir="${esc(g.id)}">Excluir</button>`}</td>
          </tr>`).join('')}</tbody></table></div>`;
      };
      const carregar = async () => { lista = await api.listarGestores(); desenhar(); };
      const abrir = (g) => {
        f.reset(); aviso(msgD, '');
        $('#titulo-dialogo').textContent = g ? 'Editar gestor' : 'Novo gestor';
        f.elements.id.value = g?.id || '';
        if (g) { f.elements.nome.value = g.nome; f.elements.email.value = g.email; f.elements.celular.value = celularBR(g.celular); f.elements.papel.value = g.papel; f.elements.ativo.checked = g.ativo; }
        dialogo.showModal();
      };
      $('#novo-gestor').addEventListener('click', () => abrir(null));
      $('#cancelar-gestor').addEventListener('click', () => dialogo.close());
      box.addEventListener('click', async (e) => {
        const ed = e.target.closest('[data-editar]'), ex = e.target.closest('[data-excluir]');
        if (ed) abrir(lista.find((g) => g.id === ed.dataset.editar));
        if (ex) {
          const g = lista.find((x) => x.id === ex.dataset.excluir);
          if (!confirm(`Excluir ${g.nome}? Para só suspender o acesso, prefira desativar.`)) return;
          try { await api.excluirGestor(g.id); await carregar(); aviso(msg, 'Gestor excluído.', 'info'); } catch (err) { aviso(msg, traduzErro(err)); }
        }
      });
      f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = f.querySelector('button[type=submit]'); btn.disabled = true;
        try {
          await api.salvarGestor({ id: f.elements.id.value || null, nome: f.elements.nome.value, email: f.elements.email.value, celular: f.elements.celular.value, papel: f.elements.papel.value, ativo: f.elements.ativo.checked });
          dialogo.close(); await carregar(); aviso(msg, 'Cadastro salvo.', 'info');
        } catch (err) { aviso(msgD, traduzErro(err)); } finally { btn.disabled = false; }
      });
      try { await carregar(); } catch (err) { box.innerHTML = `<p class="msg erro">${esc(traduzErro(err))}</p>`; }
    },
  };

  const pagina = document.body.dataset.pagina;
  if (paginas[pagina]) paginas[pagina]();
})();
