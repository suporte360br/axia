// Exibição das vagas (cartão, página completa e JSON-LD do Google Vagas).
// Usado no navegador (window.AXRender) e pelo gerador do site (require), para as duas versões ficarem iguais.
(function (raiz) {
  const EMAIL = 'contato@axia.net.br';
  const FUSO = 'America/Sao_Paulo';
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const comoData = (d) => new Date(String(d).length === 10 ? d + 'T12:00:00-03:00' : d);
  const dataISO = (d) => (d ? comoData(d).toLocaleDateString('en-CA', { timeZone: FUSO }) : '');
  const dataBR = (d) => (d ? comoData(d).toLocaleDateString('pt-BR', { timeZone: FUSO }) : '');
  const dataLonga = (d) => (d ? comoData(d).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: FUSO }) : '');
  const reais = (n) => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

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

  // Endereço da vaga: página fixa (gerada no site) ou, se ainda não gerada, a página dinâmica
  const urlVaga = (slug, estatica) => (estatica ? `/recrutamento/${slug}/` : `/recrutamento/vaga/?v=${encodeURIComponent(slug)}`);

  function cartaoVaga(v, estatica) {
    const d = v.dados, vg = d.vaga || {};
    return `<article class="cartao vaga">
        <div class="corpo">
          <span class="tag">${esc(vg.area)}</span>
          <h3><a href="${urlVaga(v.slug, estatica)}">${esc(v.titulo)}</a></h3>
          <p>${esc(d.empresa?.nome)}</p>
          <ul class="vaga-dados">
            <li>${IC.local}${esc(localTexto(vg))}</li>
            <li>${IC.maleta}${esc(vg.contrato)} · ${esc(vg.nivel)}</li>
            <li>${IC.salario}${esc(salarioTexto(d.remuneracao))}</li>
          </ul>
          <span class="meta">Publicada em <time datetime="${dataISO(v.publicada_em)}">${dataLonga(v.publicada_em)}</time> · ${esc(v.codigo)}</span>
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
      <p class="meta">${esc(e.nome)}${v.publicada_em ? ` · Publicada em <time datetime="${dataISO(v.publicada_em)}">${dataLonga(v.publicada_em)}</time>` : ''}</p>
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
      datePosted: dataISO(v.publicada_em),
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

  // Título e descrição da página da vaga
  const metaVaga = (v) => ({
    titulo: `Vaga: ${v.titulo}`,
    descricao: `${v.titulo} · ${localTexto(v.dados.vaga || {})} · ${v.dados.vaga?.contrato || ''}. ${v.dados.descricao?.resumo || ''}`.slice(0, 160),
  });

  const api = { EMAIL, esc, dataISO, dataBR, dataLonga, reais, salarioTexto, localTexto, urlVaga, cartaoVaga, vagaHTML, jsonLdVaga, metaVaga };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else raiz.AXRender = api;
})(this);
