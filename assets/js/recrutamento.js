// Recrutamento AXIA: dados (Supabase ou modo demonstração), formulário no padrão AXIA e portal público.
// A área de gestão (gestao.js) usa o que este arquivo deixa em window.AXR.
(() => {
  const cfg = window.AXIA_CONFIG || {};
  const DEMO = !cfg.supabaseUrl || !cfg.supabaseAnonKey;
  const sb = DEMO || !window.supabase ? null : window.supabase.createClient(cfg.supabaseUrl, cfg.supabaseAnonKey);
  const $ = (s) => document.querySelector(s);
  const qs = (k) => new URLSearchParams(location.search).get(k);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const hoje = () => new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' });
  const comoData = (d) => new Date(String(d).length === 10 ? d + 'T12:00:00' : d);
  const dataBR = (d) => (d ? comoData(d).toLocaleDateString('pt-BR') : '');
  const dataLonga = (d) => (d ? comoData(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }) : '');
  const reais = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const EMAIL = 'contato@axia.net.br';

  // ---------------- Padrão AXIA (mesmas regras do conferir_padrao no banco) ----------------
  const texto = (v, min, max) => { const n = String(v ?? '').trim().length; return n >= min && n <= max; };
  const qtd = (v) => (Array.isArray(v) ? v.length : 0);
  function conferirPadrao(d) {
    const p = [], e = d.empresa || {}, v = d.vaga || {}, r = d.remuneracao || {}, ds = d.descricao || {}, rq = d.requisitos || {}, pr = d.processo || {};
    if (!texto(e.nome, 2, 150)) p.push('Informe o nome da empresa.');
    if (!texto(v.titulo, 3, 120)) p.push('Informe o título do cargo.');
    if (!v.area) p.push('Escolha a área.');
    if (!v.nivel) p.push('Escolha o nível.');
    if (!v.contrato) p.push('Escolha o tipo de contratação.');
    if (!['Presencial', 'Híbrido', 'Remoto'].includes(v.modelo)) p.push('Escolha o modelo de trabalho.');
    if (['Presencial', 'Híbrido'].includes(v.modelo) && !texto(v.cidade, 2, 80)) p.push('Informe a cidade do local de trabalho.');
    if (!(Number(r.salario_min) > 0)) p.push('Informe a faixa salarial (pode escolher não publicar).');
    if (Number(r.salario_max) > 0 && Number(r.salario_max) < Number(r.salario_min)) p.push('O salário máximo é menor que o mínimo.');
    if (!texto(ds.resumo, 30, 1500)) p.push('Escreva o resumo da vaga (mínimo de 30 caracteres).');
    if (qtd(ds.responsabilidades) < 3) p.push('Liste ao menos 3 responsabilidades.');
    if (qtd(rq.hard_skills) < 3) p.push('Liste ao menos 3 hard skills.');
    if (qtd(rq.soft_skills) < 2) p.push('Escolha ao menos 2 soft skills.');
    if (rq.experiencia_anos === null || rq.experiencia_anos === undefined) p.push('Informe o tempo mínimo de experiência (pode ser 0).');
    if (!rq.escolaridade) p.push('Informe a escolaridade mínima.');
    if (qtd(pr.etapas) < 1) p.push('Informe as etapas do processo seletivo.');
    if (JSON.stringify(d).length > 40000) p.push('O descritivo está grande demais.');
    return p;
  }
  const conferirContato = (c) => {
    const p = [];
    if (!texto(c.nome, 3, 120)) p.push('Informe o nome do responsável.');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(String(c.email || '').trim())) p.push('E-mail do responsável inválido.');
    if (!c.consentimento) p.push('É preciso confirmar o aceite no fim do formulário.');
    return p;
  };
  const gerarSlug = (titulo, codigo) => `${titulo} ${codigo}`.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  // O que pode aparecer no portal (mesma regra do dados_publicos no banco)
  function dadosPublicos(d) {
    const e = d.empresa || {}, r = d.remuneracao || {};
    return {
      ...d,
      empresa: e.confidencial ? { nome: 'Empresa confidencial', confidencial: true, sobre: e.sobre, segmento: e.segmento } : (({ cnpj, ...resto }) => resto)(e),
      remuneracao: r.publicar_salario === false ? { beneficios: r.beneficios } : r,
    };
  }

  // ---------------- Modo demonstração ----------------
  const CHAVE = 'axia-recrutamento-demo';
  const demo = {
    ler: () => { try { return JSON.parse(localStorage.getItem(CHAVE) || '{}'); } catch { return {}; } },
    salvar: (d) => { try { localStorage.setItem(CHAVE, JSON.stringify(d)); } catch { /* sem armazenamento */ } },
  };
  const demoBase = () => {
    const d = demo.ler();
    if (!d.gestores) {
      d.gestores = [{ id: 'g1', nome: 'Gestor (demonstração)', email: 'gestor@axia.net.br', celular: '5511900000000', papel: 'admin', ativo: true, primeiro_acesso: null, ultimo_acesso: null }];
      d.vagas = []; d.seq = 0;
      demo.salvar(d);
    }
    return d;
  };
  const demoPublicas = () => demoBase().vagas
    .filter((v) => v.status === 'aprovada' && (!v.validade || v.validade >= hoje()))
    .sort((a, b) => b.publicada_em.localeCompare(a.publicada_em))
    .map((v) => ({ codigo: v.codigo, slug: v.slug, titulo: v.titulo, dados: dadosPublicos(v.dados), publicada_em: v.publicada_em, validade: v.validade }));
  const demoVaga = (d, id) => { const v = d.vagas.find((x) => x.id === id); if (!v) throw new Error('Vaga não encontrada.'); return v; };
  const ACOES = { aprovada: 'Aprovada e publicada', reprovada: 'Reprovada', encerrada: 'Encerrada', em_revisao: 'Em revisão', pendente: 'Voltou para pendente' };

  const normalizarCelular = (v) => { let n = String(v).replace(/\D/g, ''); if (n.length === 10 || n.length === 11) n = '55' + n; return n; };
  const rpc = async (nome, args) => { const { data, error } = await sb.rpc(nome, args); if (error) throw error; return data; };

  // ---------------- Camada de dados ----------------
  const api = {
    async enviarVaga(dados, contato) {
      if (!DEMO) return rpc('enviar_vaga', { p_dados: dados, p_contato: contato });
      const problemas = [...conferirPadrao(dados), ...conferirContato(contato)];
      if (problemas.length) throw new Error(problemas.join(' '));
      const d = demoBase(), agora = new Date().toISOString();
      d.seq += 1;
      const v = {
        id: 'v' + Date.now(), codigo: 'AX-' + String(d.seq).padStart(4, '0'), slug: null, status: 'pendente',
        titulo: dados.vaga.titulo.trim(), empresa_nome: dados.empresa.nome.trim(), responsavel: contato.nome.trim(), responsavel_cargo: contato.cargo || null,
        email: contato.email.trim().toLowerCase(), telefone: contato.telefone || null, dados, motivo: null, notas_internas: null,
        validade: dados.processo?.validade || null, enviada_em: agora, atualizada_em: agora, publicada_em: null, revisada_por: null,
        historico: [{ quando: agora, quem: contato.nome.trim() + ' (empresa)', acao: 'Vaga enviada para aprovação' }],
      };
      d.vagas.push(v); demo.salvar(d);
      return v.codigo;
    },
    async vagasPublicas() { return DEMO ? demoPublicas() : rpc('vagas_publicas'); },
    async vagaPublica(slug) { return DEMO ? demoPublicas().find((v) => v.slug === slug) || null : (await rpc('vaga_publica', { p_slug: slug }))[0] || null; },

    // Login dos gestores
    async enviarCodigo(celular, canal) {
      if (DEMO) return;
      const { error } = await sb.auth.signInWithOtp({ phone: '+' + celular, options: { channel: canal, shouldCreateUser: true } });
      if (error) throw error;
    },
    async confirmarCodigo(celular, codigo) {
      if (DEMO) {
        if (codigo !== '123456') throw new Error('Código inválido. No modo demonstração, use 123456.');
        const d = demoBase(); d.logado = true; demo.salvar(d); return;
      }
      const { error } = await sb.auth.verifyOtp({ phone: '+' + celular, token: codigo, type: 'sms' });
      if (error) throw error;
    },
    async sessao() {
      if (DEMO) return demo.ler().logado ? { demo: true } : null;
      const { data } = await sb.auth.getSession();
      return data.session;
    },
    async sair() {
      if (DEMO) { const d = demoBase(); d.logado = false; demo.salvar(d); return; }
      await sb.auth.signOut();
    },
    // { id, nome, papel } do gestor logado; null se não é gestor ativo
    async acesso() {
      if (DEMO) { const g = demoBase().gestores.find((x) => x.papel === 'admin' && x.ativo); return g ? { id: g.id, nome: g.nome, papel: g.papel } : null; }
      return (await rpc('meu_acesso'))[0] || null;
    },
    async registrarAcesso() {
      if (DEMO) { const d = demoBase(), g = d.gestores.find((x) => x.papel === 'admin'); const agora = new Date().toISOString(); g.ultimo_acesso = agora; g.primeiro_acesso ||= agora; demo.salvar(d); return; }
      await rpc('registrar_acesso');
    },

    // Revisão das vagas
    async listarVagas() {
      if (!DEMO) return rpc('gestor_listar_vagas');
      return demoBase().vagas.slice().sort((a, b) => b.enviada_em.localeCompare(a.enviada_em))
        .map(({ dados, historico, ...v }) => ({ ...v, problemas: conferirPadrao(dados).length }));
    },
    async obterVaga(id) {
      if (!DEMO) return rpc('gestor_obter_vaga', { p_id: id });
      const v = demoVaga(demoBase(), id);
      return { ...v, problemas: conferirPadrao(v.dados), historico: v.historico.slice().reverse() };
    },
    async salvarVaga(id, dados, notas) {
      if (!DEMO) return rpc('gestor_salvar_vaga', { p_id: id, p_dados: dados, p_notas: notas });
      const d = demoBase(), v = demoVaga(d, id), g = await api.acesso();
      Object.assign(v, {
        dados, titulo: dados.vaga?.titulo?.trim() || v.titulo, empresa_nome: dados.empresa?.nome?.trim() || v.empresa_nome,
        validade: dados.processo?.validade || null, notas_internas: (notas || '').trim() || null,
        status: v.status === 'pendente' ? 'em_revisao' : v.status, atualizada_em: new Date().toISOString(),
      });
      v.historico.push({ quando: v.atualizada_em, quem: g.nome, acao: 'Descritivo revisado' });
      demo.salvar(d);
    },
    async mudarStatus(id, status, motivo) {
      if (!DEMO) return rpc('gestor_mudar_status', { p_id: id, p_status: status, p_motivo: motivo || null });
      const d = demoBase(), v = demoVaga(d, id), g = await api.acesso(), agora = new Date().toISOString();
      if (status === 'aprovada') {
        const p = conferirPadrao(v.dados);
        if (p.length) throw new Error('A vaga ainda não segue o padrão: ' + p.join(' '));
        if (v.validade && v.validade < hoje()) throw new Error('A data "publicar até" já passou. Ajuste a validade antes de aprovar.');
        v.slug ||= gerarSlug(v.titulo, v.codigo);
        if (!v.validade) { const dt = new Date(); dt.setDate(dt.getDate() + 60); v.validade = dt.toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }); }
        v.publicada_em ||= agora;
      }
      if (status === 'reprovada') {
        if (!texto(motivo, 5, 2000)) throw new Error('Escreva o motivo da reprovação (ele é usado na resposta à empresa).');
        v.motivo = motivo.trim();
      }
      Object.assign(v, { status, revisada_por: g.nome, atualizada_em: agora });
      v.historico.push({ quando: agora, quem: g.nome, acao: ACOES[status], detalhe: (motivo || '').trim() || null });
      demo.salvar(d);
      return v.slug;
    },

    // Cadastro de gestores (admin)
    async listarGestores() { return DEMO ? demoBase().gestores : rpc('admin_listar_gestores'); },
    async salvarGestor(g) {
      if (!DEMO) return rpc('admin_salvar_gestor', { p_id: g.id || null, p_nome: g.nome, p_email: g.email, p_celular: g.celular, p_papel: g.papel, p_ativo: g.ativo });
      const d = demoBase(), cel = normalizarCelular(g.celular);
      if (!texto(g.nome, 3, 120)) throw new Error('Informe o nome completo.');
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.email.trim())) throw new Error('E-mail inválido.');
      if (!/^55\d{10,11}$/.test(cel)) throw new Error('Celular inválido: use DDD + número.');
      if (g.id === 'g1' && (g.papel !== 'admin' || !g.ativo)) throw new Error('Você não pode tirar o seu próprio acesso de administrador.');
      if (d.gestores.some((x) => x.celular === cel && x.id !== g.id)) throw new Error('Já existe um gestor com este celular.');
      const dados = { nome: g.nome.trim(), email: g.email.trim().toLowerCase(), celular: cel, papel: g.papel, ativo: g.ativo };
      if (g.id) Object.assign(d.gestores.find((x) => x.id === g.id), dados);
      else d.gestores.push({ id: 'g' + Date.now(), ...dados, primeiro_acesso: null, ultimo_acesso: null });
      demo.salvar(d);
    },
    async excluirGestor(id) {
      if (!DEMO) return rpc('admin_excluir_gestor', { p_id: id });
      if (id === 'g1') throw new Error('Você não pode excluir o seu próprio cadastro.');
      const d = demoBase(); d.gestores = d.gestores.filter((x) => x.id !== id); demo.salvar(d);
    },
  };

  // Mensagens de erro do Supabase em português
  const traduzErro = (e) => {
    const m = (e && e.message) || String(e);
    if ((e && e.code === 'sms_send_failed') || /sending|provider/i.test(m)) return `Não foi possível enviar o código agora. Tente de novo em alguns minutos ou escreva para ${EMAIL}.`;
    if (/not.*(allowed|cadastrado)|signups not allowed|403/i.test(m)) return 'Este celular não está cadastrado como gestor da AXIA.';
    if (/expired|invalid.*(otp|token)|token/i.test(m)) return 'Código inválido ou expirado. Peça um novo código.';
    if (/rate|too many|seconds/i.test(m)) return 'Muitas tentativas. Aguarde um minuto e tente de novo.';
    if (/Failed to fetch|NetworkError/i.test(m)) return 'Sem conexão com o servidor. Confira a internet e tente de novo.';
    return m;
  };

  // ---------------- Formulário (envio e revisão usam o mesmo) ----------------
  const definir = (obj, caminho, v) => { const [a, b] = caminho.split('.'); (obj[a] ||= {})[b] = v; };
  const lerCampo = (el) => {
    const t = el.dataset.tipo, v = el.value.trim();
    if (t === 'num') return v === '' ? null : Number(v);
    if (t === 'bool') return v === 'true';
    if (t === 'bool-check') return el.checked;
    if (t === 'lista') return v.split('\n').map((x) => x.replace(/^[-•*\d.)\s]+/, '').trim()).filter(Boolean);
    return v;
  };
  function novaLinha(box, valores = {}) {
    const itens = box.querySelector('.linhas-itens');
    if (itens.children.length >= 20) return;
    const linha = box.querySelector('template').content.firstElementChild.cloneNode(true);
    linha.querySelectorAll('[data-campo]').forEach((c) => {
      const v = valores[c.dataset.campo];
      if (v !== undefined && v !== null) c.value = String(v);
    });
    itens.appendChild(linha);
    return linha;
  }
  function iniciarFormulario(form, aoMudar) {
    form.querySelectorAll('[data-linhas]').forEach((box) => {
      for (let i = 0; i < Math.max(Number(box.dataset.minimo), 1); i++) novaLinha(box);
      box.addEventListener('click', (e) => {
        if (e.target.closest('[data-adicionar]')) { novaLinha(box).querySelector('input, select').focus(); aoMudar?.(); }
        if (e.target.closest('[data-remover]')) { e.target.closest('.linha').remove(); aoMudar?.(); }
      });
    });
    if (aoMudar) { form.addEventListener('input', aoMudar); form.addEventListener('change', aoMudar); }
  }
  function serializar(form) {
    const out = {};
    form.querySelectorAll('[name*="."]').forEach((el) => definir(out, el.name, lerCampo(el)));
    form.querySelectorAll('[data-multi]').forEach((box) => {
      const marcados = [...box.querySelectorAll('input:checked')].map((i) => i.value);
      const extra = form.querySelector(`[data-extra="${box.dataset.multi}"]`);
      const extras = extra ? extra.value.split(',').map((s) => s.trim()).filter(Boolean) : [];
      definir(out, box.dataset.multi, [...new Set([...marcados, ...extras])]);
    });
    form.querySelectorAll('[data-linhas]').forEach((box) => {
      const itens = [...box.querySelectorAll('.linhas-itens .linha')].map((l) => {
        const o = {};
        l.querySelectorAll('[data-campo]').forEach((c) => { o[c.dataset.campo] = lerCampo(c); });
        return o;
      }).filter((o) => String(Object.values(o)[0] ?? '').trim());
      definir(out, box.dataset.linhas, itens);
    });
    const { contato = {}, ...dados } = out;
    return { dados, contato };
  }
  function preencher(form, d, contato) {
    const fonte = { ...d, contato: contato || {} };
    form.querySelectorAll('[name*="."]').forEach((el) => {
      const [a, b] = el.name.split('.'), v = fonte[a]?.[b], t = el.dataset.tipo;
      if (t === 'lista') el.value = (v || []).join('\n');
      else if (t === 'bool') { if (v !== undefined) el.value = String(!!v); }
      else if (t === 'bool-check') el.checked = !!v;
      else if (v !== undefined && v !== null) el.value = String(v);
    });
    form.querySelectorAll('[data-multi]').forEach((box) => {
      const [a, b] = box.dataset.multi.split('.'), lista = fonte[a]?.[b] || [];
      const opcoes = [...box.querySelectorAll('input')].map((i) => { i.checked = lista.includes(i.value); return i.value; });
      const extra = form.querySelector(`[data-extra="${box.dataset.multi}"]`);
      if (extra) extra.value = lista.filter((s) => !opcoes.includes(s)).join(', ');
    });
    form.querySelectorAll('[data-linhas]').forEach((box) => {
      const [a, b] = box.dataset.linhas.split('.'), lista = fonte[a]?.[b] || [];
      box.querySelector('.linhas-itens').replaceChildren();
      lista.forEach((item) => novaLinha(box, item));
      for (let i = lista.length; i < Math.max(Number(box.dataset.minimo), 1); i++) novaLinha(box);
    });
  }

  // ---------------- Exibição da vaga ----------------
  const salarioTexto = (r) => (!r || !(r.salario_min > 0) ? 'A combinar'
    : r.salario_max > r.salario_min ? `${reais(r.salario_min)} a ${reais(r.salario_max)}` : reais(r.salario_min));
  const localTexto = (v) => (v.cidade ? `${v.cidade}${v.uf ? ' – ' + v.uf : ''} · ${v.modelo}` : v.modelo || '');
  const lista = (itens) => (itens && itens.length ? `<ul>${itens.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '');
  const ICONE = (d) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    local: ICONE('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
    maleta: ICONE('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>'),
    salario: ICONE('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/>'),
  };

  function cartaoVaga(v) {
    const d = v.dados, vg = d.vaga || {};
    return `<article class="cartao vaga">
        <div class="corpo">
          <span class="tag">${esc(vg.area)}</span>
          <h3><a href="/recrutamento/vaga/?v=${encodeURIComponent(v.slug)}">${esc(v.titulo)}</a></h3>
          <p>${esc(d.empresa?.nome)}</p>
          <ul class="vaga-dados">
            <li>${IC.local}${esc(localTexto(vg))}</li>
            <li>${IC.maleta}${esc(vg.contrato)} · ${esc(vg.nivel)}</li>
            <li>${IC.salario}${esc(salarioTexto(d.remuneracao))}</li>
          </ul>
          <span class="meta">Publicada em <time datetime="${esc(String(v.publicada_em).slice(0, 10))}">${dataLonga(v.publicada_em)}</time> · ${esc(v.codigo)}</span>
        </div>
      </article>`;
  }

  // Corpo completo da vaga, no padrão AXIA
  function vagaHTML(v) {
    const d = v.dados, e = d.empresa || {}, vg = d.vaga || {}, r = d.remuneracao || {}, ds = d.descricao || {}, rq = d.requisitos || {}, pr = d.processo || {};
    const skills = (rq.hard_skills || []).map((s) => `<tr><td>${esc(s.nome)}</td><td>${esc(s.nivel)}</td><td>${s.obrigatorio === false ? 'Desejável' : '<strong>Obrigatória</strong>'}</td></tr>`).join('');
    const certs = (rq.certificacoes || []).map((c) => `${esc(c.nome)} <small>(${c.obrigatorio === false ? 'desejável' : 'obrigatória'})</small>`);
    const idiomas = (rq.idiomas || []).map((i) => `${esc(i.idioma)}: ${esc(i.nivel)}`);
    const ficha = [
      ['Código', v.codigo], ['Local', localTexto(vg)], vg.dias_presenciais && vg.modelo === 'Híbrido' ? ['Presencial', vg.dias_presenciais] : null,
      ['Contratação', vg.contrato], ['Nível', vg.nivel], ['Salário', salarioTexto(r)], vg.quantidade > 1 ? ['Vagas', vg.quantidade] : null,
      vg.jornada ? ['Jornada', vg.jornada] : null, vg.viagens && vg.viagens !== 'Não' ? ['Viagens', vg.viagens] : null,
      v.validade ? ['Inscrições até', dataBR(v.validade)] : null,
    ].filter(Boolean);
    const site = pr.candidaturas === 'site_empresa' && /^https:\/\//i.test(pr.link || '');
    const assunto = encodeURIComponent(`Candidatura ${v.codigo} — ${v.titulo}`);
    return `
      <span class="tag">${esc(vg.area)}</span>
      ${vg.afirmativa && vg.afirmativa !== 'Não' ? `<span class="tag tag-afirmativa">Vaga afirmativa: ${esc(vg.afirmativa)}</span>` : ''}
      <h1 style="margin-top:12px">${esc(v.titulo)}</h1>
      <p class="meta">${esc(e.nome)}${v.publicada_em ? ` · Publicada em <time datetime="${esc(String(v.publicada_em).slice(0, 10))}">${dataLonga(v.publicada_em)}</time>` : ''}</p>
      <dl class="ficha">${ficha.map(([t, x]) => `<div><dt>${t}</dt><dd>${esc(x)}</dd></div>`).join('')}</dl>
      <h2>Sobre a vaga</h2>
      <p>${esc(ds.resumo)}</p>
      ${e.sobre ? `<h2>Sobre a empresa</h2><p>${esc(e.sobre)}</p>` : ''}
      <h2>Responsabilidades</h2>${lista(ds.responsabilidades)}
      <h2>Hard skills</h2>
      <div class="tabela-rolagem"><table class="tabela-skills"><thead><tr><th>Conhecimento</th><th>Nível</th><th>Exigência</th></tr></thead><tbody>${skills}</tbody></table></div>
      <h2>Soft skills</h2>
      <p class="chips-leitura">${(rq.soft_skills || []).map((s) => `<span class="tag">${esc(s)}</span>`).join(' ')}</p>
      <h2>Experiência e formação</h2>
      <ul>
        <li>Experiência mínima: <strong>${rq.experiencia_anos > 0 ? `${rq.experiencia_anos} ${rq.experiencia_anos === 1 ? 'ano' : 'anos'}` : 'não exigida'}</strong></li>
        ${(rq.experiencias || []).map((x) => `<li>${esc(x)}</li>`).join('')}
        <li>Escolaridade mínima: ${esc(rq.escolaridade)}${rq.formacao ? ` (${esc(rq.formacao)})` : ''}</li>
        ${certs.length ? `<li>Certificações: ${certs.join('; ')}</li>` : ''}
        ${idiomas.length ? `<li>Idiomas: ${idiomas.map(esc).join('; ')}</li>` : ''}
      </ul>
      ${(rq.desejaveis || []).length ? `<h2>Conhecimentos desejáveis</h2>${lista(rq.desejaveis)}` : ''}
      ${(r.beneficios || []).length ? `<h2>Benefícios</h2>${lista(r.beneficios)}` : ''}
      <h2>Processo seletivo</h2>
      ${(pr.etapas || []).length ? `<ol>${pr.etapas.map((x) => `<li>${esc(x)}</li>`).join('')}</ol>` : ''}
      <div class="chamada" style="margin-top:40px;padding:32px">
        <div><h2 style="font-size:1.4rem;margin-top:0">Quer se candidatar?</h2>
          <p>${site ? 'A inscrição é feita no site da empresa.' : `Envie o currículo em PDF com o código <strong>${esc(v.codigo)}</strong> no assunto.`}</p></div>
        ${site ? `<a class="botao botao-laranja" href="${esc(pr.link)}" target="_blank" rel="noopener nofollow">Candidatar-se</a>`
          : `<a class="botao botao-laranja" href="mailto:${EMAIL}?subject=${assunto}">Candidatar-se</a>`}
      </div>`;
  }

  // Dados estruturados para o Google Vagas
  function jsonLdVaga(v) {
    const d = v.dados, vg = d.vaga || {}, r = d.remuneracao || {};
    const TIPOS = { CLT: 'FULL_TIME', PJ: 'CONTRACTOR', 'Estágio': 'INTERN', 'Temporário': 'TEMPORARY', Freelancer: 'CONTRACTOR' };
    const o = {
      '@context': 'https://schema.org', '@type': 'JobPosting',
      title: v.titulo,
      description: `<p>${esc(d.descricao?.resumo)}</p>` + [['Responsabilidades', d.descricao?.responsabilidades], ['Requisitos', (d.requisitos?.hard_skills || []).map((s) => `${s.nome} (${s.nivel})`)], ['Benefícios', r.beneficios]]
        .filter(([, l]) => l && l.length).map(([h, l]) => `<h3>${h}</h3>${lista(l)}`).join(''),
      identifier: { '@type': 'PropertyValue', name: 'AXIA', value: v.codigo },
      datePosted: String(v.publicada_em).slice(0, 10),
      employmentType: TIPOS[vg.contrato] || 'OTHER',
      hiringOrganization: d.empresa?.confidencial
        ? { '@type': 'Organization', name: 'AXIA', sameAs: 'https://axia.net.br/', logo: 'https://axia.net.br/assets/img/icon-512.png' }
        : { '@type': 'Organization', name: d.empresa?.nome, ...(d.empresa?.site ? { sameAs: d.empresa.site } : {}) },
      directApply: false,
      industry: vg.area,
    };
    if (v.validade) o.validThrough = `${v.validade}T23:59:59-03:00`;
    if (vg.cidade) o.jobLocation = { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: vg.cidade, addressRegion: vg.uf || undefined, addressCountry: 'BR' } };
    if (vg.modelo === 'Remoto') { o.jobLocationType = 'TELECOMMUTE'; o.applicantLocationRequirements = { '@type': 'Country', name: 'Brasil' }; }
    if (r.salario_min > 0) o.baseSalary = { '@type': 'MonetaryAmount', currency: 'BRL', value: { '@type': 'QuantitativeValue', minValue: r.salario_min, maxValue: r.salario_max || r.salario_min, unitText: 'MONTH' } };
    if (d.requisitos?.experiencia_anos > 0) o.experienceRequirements = { '@type': 'OccupationalExperienceRequirements', monthsOfExperience: d.requisitos.experiencia_anos * 12 };
    return o;
  }

  // Descritivo em texto, para o envio por e-mail
  function textoVaga(d, c) {
    const fmt = (v) => (Array.isArray(v) ? v.map((x) => (typeof x === 'object' ? Object.values(x).map((y) => (y === true ? 'obrigatória' : y === false ? 'desejável' : y)).join(' · ') : x)).join('; ') : v === true ? 'sim' : v === false ? 'não' : v);
    const secao = (titulo, o) => `== ${titulo} ==\n` + Object.entries(o || {}).filter(([, v]) => v !== '' && v !== null && v !== undefined && !(Array.isArray(v) && !v.length)).map(([k, v]) => `${k.replace(/_/g, ' ')}: ${fmt(v)}`).join('\n');
    return [secao('RESPONSÁVEL', { nome: c.nome, cargo: c.cargo, email: c.email, telefone: c.telefone }), secao('EMPRESA', d.empresa), secao('VAGA', d.vaga),
      secao('REMUNERAÇÃO', d.remuneracao), secao('DESCRIÇÃO', d.descricao), secao('REQUISITOS', d.requisitos), secao('PROCESSO SELETIVO', d.processo)].join('\n\n');
  }

  // ---------------- Páginas públicas ----------------
  const paginas = {
    async vagas() {
      const box = $('#lista-vagas');
      try {
        const vs = await api.vagasPublicas();
        if (!vs.length) { box.replaceChildren($('#sem-vagas').content.cloneNode(true)); return; }
        box.innerHTML = `<div class="grade grade-3">${vs.map(cartaoVaga).join('')}</div>`;
      } catch (e) {
        box.innerHTML = `<p class="msg erro">Não foi possível carregar as vagas agora. Tente de novo mais tarde ou escreva para <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>`;
      }
    },

    async vaga() {
      const box = $('#vaga'), slug = qs('v') || '';
      const naoEncontrada = () => { box.innerHTML = '<h1>Vaga não encontrada</h1><p>Ela pode ter sido encerrada ou o endereço está incompleto.</p>'; document.title = 'Vaga não encontrada | AXIA'; };
      if (!/^[a-z0-9-]{3,200}$/.test(slug)) return naoEncontrada();
      try {
        const v = await api.vagaPublica(slug);
        if (!v) return naoEncontrada();
        box.innerHTML = vagaHTML(v);
        const titulo = `Vaga: ${v.titulo}`, descricao = `${v.titulo} · ${localTexto(v.dados.vaga)} · ${v.dados.vaga.contrato}. ${v.dados.descricao.resumo}`.slice(0, 160);
        document.title = `${titulo} | AXIA`;
        document.querySelectorAll('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').forEach((m) => m.setAttribute('content', descricao));
        document.querySelectorAll('meta[property="og:title"], meta[name="twitter:title"]').forEach((m) => m.setAttribute('content', titulo));
        const url = `https://axia.net.br/recrutamento/vaga/?v=${slug}`;
        document.querySelector('link[rel="canonical"]')?.setAttribute('href', url);
        document.querySelector('meta[property="og:url"]')?.setAttribute('content', url);
        const trilhaAtual = document.querySelector('.trilha li[aria-current]');
        if (trilhaAtual) trilhaAtual.textContent = v.titulo;
        const ld = document.createElement('script');
        ld.type = 'application/ld+json';
        ld.textContent = JSON.stringify(jsonLdVaga(v));
        document.head.appendChild(ld);
      } catch (e) {
        box.innerHTML = `<p class="msg erro">Não foi possível carregar a vaga agora. Tente de novo mais tarde.</p>`;
      }
    },

    anunciar() {
      const form = $('#form-vaga'), caixa = $('#problemas'), RASCUNHO = 'axia-rascunho-vaga';
      let pausa;
      const guardar = () => { clearTimeout(pausa); pausa = setTimeout(() => { try { localStorage.setItem(RASCUNHO, JSON.stringify(serializar(form))); } catch { /* sem armazenamento */ } }, 400); };
      iniciarFormulario(form, guardar);
      try {
        const r = JSON.parse(localStorage.getItem(RASCUNHO) || 'null');
        if (r && r.dados) {
          preencher(form, r.dados, { ...r.contato, consentimento: false });
          const nota = document.createElement('p');
          nota.className = 'msg info';
          nota.innerHTML = 'Recuperamos o rascunho que você começou neste navegador. <button type="button" class="link-botao">Começar do zero</button>';
          nota.querySelector('button').addEventListener('click', () => { localStorage.removeItem(RASCUNHO); location.reload(); });
          form.prepend(nota);
        }
      } catch { /* sem rascunho */ }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const botao = form.querySelector('button[type=submit]');
        const mostrar = (msgs) => {
          caixa.innerHTML = `<strong>Antes de enviar, ajuste:</strong><ul>${msgs.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>`;
          caixa.hidden = false; caixa.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };
        // Campo isca: robôs preenchem, pessoas não veem
        if (form.elements.site_empresa_confirmacao.value) { form.hidden = true; $('#enviado').hidden = false; return; }
        const { dados, contato } = serializar(form);
        const problemas = [...conferirPadrao(dados), ...conferirContato(contato)];
        if (problemas.length) return mostrar(problemas);
        caixa.hidden = true;
        // Sem banco configurado no site publicado, o descritivo segue por e-mail para não se perder
        if (DEMO && !/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
          const assunto = `Nova vaga para aprovação — ${dados.vaga.titulo} — ${dados.empresa.nome}`;
          location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(textoVaga(dados, contato))}`;
          $('#codigo-vaga').textContent = 'enviado pelo seu e-mail';
          form.hidden = true; $('#enviado').hidden = false;
          return;
        }
        botao.disabled = true; botao.textContent = 'Enviando…';
        try {
          const codigo = await api.enviarVaga(dados, contato);
          try { localStorage.removeItem(RASCUNHO); } catch { /* sem armazenamento */ }
          $('#codigo-vaga').textContent = codigo;
          form.hidden = true;
          const ok = $('#enviado'); ok.hidden = false; ok.focus(); ok.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
          mostrar([traduzErro(err)]);
        } finally { botao.disabled = false; botao.textContent = 'Enviar vaga para aprovação'; }
      });
    },
  };

  window.AXR = { DEMO, cfg, api, esc, qs, dataBR, dataLonga, traduzErro, normalizarCelular, conferirPadrao, serializar, preencher, iniciarFormulario, salarioTexto, localTexto };
  const pagina = document.body.dataset.pagina;
  if (paginas[pagina]) paginas[pagina]();
})();
