// Gera todas as páginas do site axia.net.br.
// Uso (na pasta axia): node gerador/gerar.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { materias } = require('./conteudo');
const { servicos, areas, diferenciais, porQue, faqComercial } = require('./servicos');

const RAIZ = path.join(__dirname, '..');
const SITE = 'https://axia.net.br';
const NOME = 'AXIA';
const EMAIL = 'contato@axia.net.br';

// Sócios fundadores (seção "Quem conduz" da página Sobre). foto: arquivo em assets/img; sem foto, aparecem as iniciais.
const SOCIOS = [
  {
    id: 'rogerio-gomes', nome: 'Rogério Gomes', iniciais: 'RG', cargo: 'Sócio fundador da AXIA',
    linkedin: 'https://www.linkedin.com/in/rogerig/', foto: 'rogerio-gomes.webp',
    bio: 'Sócio fundador da AXIA, empresa de recrutamento e seleção, alocação de profissionais e squads especializados em tecnologia, segurança da informação e dados.',
  },
  {
    id: 'fabio-marostica', nome: 'Fábio Maróstica', iniciais: 'FM', cargo: 'Sócio fundador da AXIA',
    linkedin: 'https://www.linkedin.com/in/fabiomarostica/', foto: 'fabio-marostica.webp',
    bio: 'Sócio fundador da AXIA, empresa de recrutamento e seleção, alocação de profissionais e squads especializados em tecnologia, segurança da informação e dados.',
  },
];
const socioLD = s => ({ '@type': 'Person', '@id': `${SITE}/sobre/#${s.id}`, name: s.nome, jobTitle: s.cargo, url: `${SITE}/sobre/#${s.id}`, sameAs: [s.linkedin], ...(s.foto ? { image: `${SITE}/assets/img/${s.foto}` } : {}), worksFor: { '@id': SITE + '/#organizacao' } });
// Foto (ou iniciais) com link para o LinkedIn
const fotoSocio = (s, classe = '') => `<a class="autor-foto${classe}" href="${s.linkedin}" target="_blank" rel="noopener" aria-label="${s.nome} no LinkedIn">${s.foto
  ? `<img src="/assets/img/${s.foto}" alt="Foto de ${s.nome}" width="240" height="240" loading="lazy">`
  : `<span class="autor-inicial" aria-hidden="true">${s.iniciais}</span>`}</a>`;

// Autor das matérias do blog
const AUTOR = { ...SOCIOS[0], url: '/sobre/#rogerio-gomes' };
const AUTOR_LD = socioLD(AUTOR);

// Data da última mudança no texto da política de privacidade (fixa, para o site não mudar a cada geração)
const PRIVACIDADE_ATUALIZADA = '2026-11-18';

// Vagas aprovadas no Supabase: buscar-vagas.js atualiza vagas-publicas.json (sem conexão, fica o anterior)
// SEM_BUSCA=1 gera sem consultar o banco (usa o vagas-publicas.json atual; útil para testes)
if (!process.env.SEM_BUSCA) try { require('child_process').execFileSync(process.execPath, [path.join(__dirname, 'buscar-vagas.js')], { stdio: 'inherit' }); } catch { /* segue com o arquivo anterior */ }
const ARQ_VAGAS = path.join(__dirname, 'vagas-publicas.json');
// O slug vira nome de pasta e entra em scripts da página: só aceita o formato gerado pelo banco (a-z, 0-9 e hífen)
const vagasPublicas = (fs.existsSync(ARQ_VAGAS) ? JSON.parse(fs.readFileSync(ARQ_VAGAS, 'utf8')) : [])
  .filter(v => /^[a-z0-9-]{3,200}$/.test(String(v.slug)));

// Versão do arquivo nos links (?v=); ignora CRLF/LF para dar o mesmo valor no Windows e na GitHub Action
const hash = f => { const b = fs.readFileSync(path.join(RAIZ, f)); return crypto.createHash('md5').update(/\.(css|js)$/.test(f) ? b.toString('utf8').replace(/\r\n/g, '\n') : b).digest('hex').slice(0, 8); };
const V_CSS = hash('assets/css/style.css');
const V_JS = hash('assets/js/main.js');
const V_ICO = hash('favicon.ico');

// JSON para dentro de <script>: escapa < > & (e separadores de linha) para que dados enviados por terceiros,
// como o título de uma vaga com "</script>", não consigam fechar o bloco e injetar código na página
const jsonSeguro = o => JSON.stringify(o).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dataBR = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
// Mais recentes primeiro; na mesma data, vale a ordem do conteudo.js
const ordenadas = materias.map((m, i) => ({ ...m, i })).sort((a, b) => b.data.localeCompare(a.data) || a.i - b.i);

const svg = d => `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const icones = {
  escudo: svg('<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>'),
  chip: svg('<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
  cadeado: svg('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  check: svg('<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>'),
  ciclo: svg('<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>'),
  pessoas: svg('<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v2M16 3.1a4 4 0 0 1 0 7.8M22 21v-2a4 4 0 0 0-3-3.9"/>'),
  grafico: svg('<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-6"/><path d="M16 8h4v4"/>'),
  email: svg('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/>'),
  mapa: svg('<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>'),
  relogio: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>'),
  maleta: svg('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M2 13h20"/>'),
  documento: svg('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>'),
  megafone: svg('<path d="m3 11 15-6v14L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>'),
  alvo: svg('<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>'),
  raio: svg('<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>'),
  aperto: svg('<path d="m11 17 2 2a1 1 0 0 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 0 0 3-3l-3.9-3.9a2 2 0 0 0-2.8 0l-.9.9a1 1 0 0 1-3-3l2.8-2.8a5 5 0 0 1 6.2-.7l.5.3a2 2 0 0 0 1.4.3L22 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 0 0 3-3"/><path d="M3 4h8"/>')
};
const ICONES_DIFERENCIAIS = ['chip', 'raio', 'alvo', 'ciclo', 'grafico', 'aperto'];

const MENU = [
  ['/servicos/recrutamento-e-selecao/', 'Recrutamento'],
  ['/servicos/alocacao-de-profissionais/', 'Alocação'],
  ['/servicos/squads-especializados/', 'Squads'],
  ['/recrutamento/', 'Vagas'],
  ['/blog/', 'Blog'],
  ['/sobre/', 'Sobre'],
];

// Cabeçalho e rodapé da área de gestão de vagas (/gestao/)
const topoGestao = () => `  <header class="topo topo-gestao">
    <div class="container">
      <a class="marca" href="/gestao/painel/" aria-label="Gestão de vagas da AXIA">
        <img src="/assets/img/logo.png" alt="AXIA" width="62" height="52"><span class="area-nome">Gestão de vagas</span>
      </a>
      <nav class="menu-gestao" aria-label="Gestão" data-so-logado hidden>
        <a href="/gestao/painel/">Vagas</a>
        <a href="/gestao/gestores/" data-so-admin hidden>Gestores</a>
        <span id="quem"></span>
        <button class="botao botao-contorno botao-pequeno" type="button" id="sair">Sair</button>
      </nav>
    </div>
  </header>
`;
const rodapeGestao = () => `  <footer class="rodape rodape-gestao">
    <div class="container base"><span>AXIA · Área restrita aos gestores</span><a href="/">axia.net.br</a></div>
  </footer>
`;

function pagina({ caminho, titulo, descricao, conteudo, imagem = 'og.jpg', tipo = 'website', jsonld = [], semIndex = false, preload = '', scripts = '', gestao = false, dataPagina = '' }) {
  const url = SITE + caminho;
  const tituloCompleto = caminho === '/' ? titulo : `${titulo} | ${NOME}`;
  const menu = MENU.map(([href, txt]) => {
    const atual = caminho.startsWith(href);
    return `<li><a href="${href}"${atual ? ' aria-current="page"' : ''}>${txt}</a></li>`;
  }).join('\n          ');
  const ld = jsonld.map(o => `<script type="application/ld+json">${jsonSeguro(o)}</script>`).join('\n  ');
  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(tituloCompleto)}</title>
  <meta name="description" content="${esc(descricao)}">
  <link rel="canonical" href="${url}">
  ${semIndex ? '<meta name="robots" content="noindex, follow">' : '<meta name="robots" content="index, follow, max-image-preview:large">'}
  <meta name="theme-color" content="#111318">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="${NOME}">
  <meta property="og:type" content="${tipo}">
  <meta property="og:title" content="${esc(titulo)}">
  <meta property="og:description" content="${esc(descricao)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/img/${imagem}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(titulo)}">
  <meta name="twitter:description" content="${esc(descricao)}">
  <meta name="twitter:image" content="${SITE}/assets/img/${imagem}">
  <link rel="icon" href="/favicon.ico?v=${V_ICO}" sizes="any">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/img/favicon-192.png?v=${V_ICO}">
  <link rel="icon" type="image/png" sizes="96x96" href="/assets/img/favicon-96.png?v=${V_ICO}">
  <link rel="icon" type="image/png" sizes="48x48" href="/assets/img/favicon-48.png?v=${V_ICO}">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png?v=${V_ICO}">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png?v=${V_ICO}">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600&family=Inter:wght@400;500;600;700&display=swap">
  ${preload}<link rel="stylesheet" href="/assets/css/style.css?v=${V_CSS}">
  ${ld}
</head>
<body${dataPagina ? ` data-pagina="${dataPagina}"` : ''}>
  <a class="pular" href="#conteudo">Pular para o conteúdo</a>
${gestao ? topoGestao() : `  <header class="topo">
    <div class="container">
      <a class="marca" href="/" aria-label="${NOME}, página inicial">
        <img src="/assets/img/logo.png" alt="AXIA" width="62" height="52">
      </a>
      <button class="botao-menu" aria-expanded="false" aria-controls="menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18"/></svg> Menu
      </button>
      <nav class="menu" id="menu" aria-label="Principal">
        <ul>
          ${menu}
          <li><a class="cta-menu" href="/empresas/"${caminho.startsWith('/empresas/') ? ' aria-current="page"' : ''}>Para empresas</a></li>
        </ul>
      </nav>
    </div>
  </header>
`}
  <main id="conteudo">
${conteudo}
  </main>

${gestao ? rodapeGestao() : `  <footer class="rodape">
    <div class="container">
      <div class="colunas">
        <div>
          <img class="logo-rodape" src="/assets/img/simbolo-300.webp" alt="Símbolo da AXIA" width="96" height="77" loading="lazy">
          <p>Recrutamento e seleção, alocação de profissionais e squads especializados em tecnologia, segurança da informação e dados. O talento certo, a equipe ideal e o resultado que o seu negócio precisa.</p>
          <iframe class="selo-scorecard" src="https://scores.securityscorecard.io/security-rating/badge/axia.net.br" width="256" height="100" title="Nota de segurança da AXIA no SecurityScorecard" loading="lazy" referrerpolicy="no-referrer"></iframe>
        </div>
        <div>
          <h2>Soluções</h2>
          <ul>
            ${servicos.map(sv => `<li><a href="/servicos/${sv.slug}/">${sv.nome}</a></li>`).join('\n            ')}
            <li><a href="/areas-de-especializacao/">Áreas de especialização</a></li>
            <li><a href="/por-que-a-axia/">Por que a AXIA</a></li>
          </ul>
        </div>
        <div>
          <h2>Empresas e candidatos</h2>
          <ul>
            <li><a href="/empresas/">Para empresas</a></li>
            <li><a href="/recrutamento/">Vagas e carreiras</a></li>
            <li><a href="/recrutamento/#banco-de-talentos">Banco de talentos</a></li>
            <li><a href="/contato/">Contato</a></li>
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li><a href="/privacidade/">Política de privacidade</a></li>
          </ul>
        </div>
      </div>
      <div class="base">
        <span>© <span id="ano">${new Date().getFullYear()}</span> AXIA. Todos os direitos reservados.</span>
        <span>Tecnologia · Segurança · Talentos</span>
      </div>
    </div>
  </footer>
`}  ${scripts}<script src="/assets/js/main.js?v=${V_JS}" defer></script>
</body>
</html>
`;
}

function trilha(itens) {
  const lis = itens.map(([href, txt], i) => i === itens.length - 1
    ? `<li aria-current="page">${esc(txt)}</li>`
    : `<li><a href="${href}">${esc(txt)}</a></li>`).join('');
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: itens.map(([href, txt], i) => ({ '@type': 'ListItem', position: i + 1, name: txt, item: SITE + href }))
  };
  return { html: `<nav class="trilha" aria-label="Você está em"><ol>${lis}</ol></nav>`, ld };
}

function placa(m, classe = '') {
  return `<div class="placa${classe}" aria-hidden="true"><div><small>${esc(m.tema)}</small><strong>${esc(m.titulo.split(':')[0])}</strong></div></div>`;
}

function cartaoMateria(m) {
  return `<article class="cartao" data-tema="${esc(m.tema)}">
        <div class="midia">${placa(m)}</div>
        <div class="corpo">
          <span class="tag">${esc(m.tema)}</span>
          <h3><a href="/blog/${m.slug}/">${esc(m.titulo)}</a></h3>
          <p>${esc(m.descricao)}</p>
          <span class="meta"><time datetime="${m.data}">${dataBR(m.data)}</time></span>
        </div>
      </article>`;
}

const ORG = {
  '@context': 'https://schema.org',
  '@type': 'EmploymentAgency',
  '@id': SITE + '/#organizacao',
  name: NOME,
  alternateName: ['AXIA Talent & Squads', 'AXIA Recrutamento e Seleção'],
  url: SITE + '/',
  logo: SITE + '/assets/img/icon-512.png',
  image: SITE + '/assets/img/og.jpg',
  email: EMAIL,
  description: 'Recrutamento e seleção, alocação de profissionais e squads especializados em tecnologia, segurança da informação e dados.',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
  knowsAbout: ['Recrutamento e seleção', 'Hunting', 'Recrutamento executivo', 'Alocação de profissionais', 'Staff augmentation', 'Squads', 'Tecnologia da informação', 'Segurança da informação', 'Dados e inteligência artificial']
};

// Cartão de serviço (home e /servicos/)
const servicoHTML = sv => `<div class="servico">
            <div class="icone">${icones[sv.icone]}</div>
            <h3><a href="/servicos/${sv.slug}/">${esc(sv.nome)}</a></h3>
            <p>${esc(sv.cartao.texto)}</p>
            <ul>${sv.cartao.itens.map(i => `<li>${esc(i)}</li>`).join('')}</ul>
            <p class="saiba-mais"><a href="/servicos/${sv.slug}/">Saiba mais sobre ${esc(sv.nome)}</a></p>
          </div>`;
const areaHTML = ([ic, nome, texto]) => `<div class="servico"><div class="icone">${icones[ic]}</div><h3>${esc(nome)}</h3><p>${esc(texto)}</p></div>`;
const diferencialHTML = ([nome, texto], i) => `<div class="servico"><div class="icone">${icones[ICONES_DIFERENCIAIS[i]]}</div><h3>${esc(nome)}</h3><p>${esc(texto)}</p></div>`;
const tabelaHTML = ({ colunas, linhas }) => `<div class="rolagem"><table class="tabela tabela-larga">
          <thead><tr>${colunas.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${linhas.map(l => `<tr>${l.map((c, i) => i === 0 ? `<td><strong>${esc(c)}</strong></td>` : `<td>${esc(c)}</td>`).join('')}</tr>`).join('\n          ')}</tbody>
        </table></div>`;
const faqLD = lista => ({
  '@context': 'https://schema.org', '@type': 'FAQPage',
  mainEntity: lista.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
});
const chamadaFinal = (titulo, texto) => `<section class="secao" style="padding-top:0">
      <div class="container">
        <div class="chamada">
          <div>
            <h2>${titulo}</h2>
            <p>${texto}</p>
          </div>
          <div class="acoes-chamada">
            <a class="botao botao-laranja" href="/empresas/#profissional">Solicitar profissionais</a>
            <a class="botao botao-claro" href="/empresas/#squad">Montar meu squad</a>
          </div>
        </div>
      </div>
    </section>`;

// ---------- Páginas ----------
const paginas = {};

// Início
paginas['index.html'] = pagina({
  caminho: '/',
  titulo: 'AXIA | Recrutamento, alocação de profissionais e squads em tecnologia',
  descricao: 'Recrutamento e seleção, alocação de profissionais e squads especializados em tecnologia, segurança da informação e dados. O talento certo para o seu negócio.',
  preload: '<link rel="preload" as="image" href="/assets/img/simbolo.webp" imagesrcset="/assets/img/simbolo-300.webp 300w, /assets/img/simbolo.webp 600w" imagesizes="(max-width: 760px) 70vw, 480px">\n  ',
  jsonld: [ORG, {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE + '/#site', url: SITE + '/', name: NOME, inLanguage: 'pt-BR', publisher: { '@id': SITE + '/#organizacao' }
  }, faqLD(faqComercial)],
  conteudo: `
    <section class="hero hero-axia">
      <div class="grade-fundo" aria-hidden="true"></div>
      <div class="container">
        <div>
          <span class="sobretitulo">Recrutamento · Alocação · Squads</span>
          <h1>O talento certo. A equipe ideal. <span class="destaque">O resultado que o seu negócio precisa.</span></h1>
          <p>A AXIA é parceira estratégica de empresas que precisam contratar profissionais ou formar equipes especializadas em Tecnologia, Segurança da Informação e Dados, com seleção técnica de verdade e modelos flexíveis de contratação.</p>
          <div class="acoes">
            <a class="botao botao-laranja" href="/empresas/#profissional">Solicitar profissionais</a>
            <a class="botao botao-claro" href="/empresas/#squad">Montar meu squad</a>
          </div>
          <ul class="pontos"><li>Especialização</li><li>Agilidade</li><li>Qualidade</li><li>Flexibilidade</li></ul>
        </div>
        <img class="simbolo" src="/assets/img/simbolo.webp" srcset="/assets/img/simbolo-300.webp 300w, /assets/img/simbolo.webp 600w" sizes="(max-width: 760px) 70vw, 480px" alt="" width="600" height="480" fetchpriority="high">
      </div>
    </section>

    <section class="secao" aria-labelledby="servicos-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Soluções</span>
          <h2 id="servicos-titulo">Do profissional certo à equipe completa</h2>
          <p>Mais do que fornecer mão de obra: combinamos conhecimento técnico, seleção criteriosa e modelos de contratação que acompanham o seu negócio.</p>
        </div>
        <div class="grade grade-3">
          ${servicos.map(servicoHTML).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="secao secao-alt" aria-labelledby="areas-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Áreas de especialização</span>
          <h2 id="areas-titulo">Talentos para as áreas em que a avaliação técnica faz diferença</h2>
        </div>
        <div class="grade grade-3">
          ${areas.map(areaHTML).join('\n          ')}
        </div>
        <p style="margin-top:28px"><a class="botao botao-contorno" href="/areas-de-especializacao/">Ver perfis por área</a></p>
      </div>
    </section>

    <section class="secao faixa" aria-labelledby="como-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Como trabalhamos</span>
          <h2 id="como-titulo">Da necessidade ao profissional trabalhando</h2>
          <p>Um processo estruturado, com contato próximo em cada etapa.</p>
        </div>
        <div class="grade grade-4">
          <div class="etapa"><span class="num destaque">01</span><h3>Entendimento</h3><p>Entendemos o negócio, a posição ou o projeto, o prazo e o modelo de contratação mais adequado.</p></div>
          <div class="etapa"><span class="num destaque">02</span><h3>Busca e avaliação</h3><p>Busca ativa e avaliação técnica e comportamental conduzida por quem conhece a função.</p></div>
          <div class="etapa"><span class="num destaque">03</span><h3>Apresentação</h3><p>Shortlist de profissionais avaliados, ou composição do squad, com pareceres objetivos.</p></div>
          <div class="etapa"><span class="num destaque">04</span><h3>Acompanhamento</h3><p>Integração, indicadores e ajustes para garantir que a contratação entregue resultado.</p></div>
        </div>
      </div>
    </section>

    <section class="secao" aria-labelledby="diferenciais-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Diferenciais AXIA</span>
          <h2 id="diferenciais-titulo">Compromissos em cada contratação</h2>
        </div>
        <div class="grade grade-3">
          ${diferenciais.map(diferencialHTML).join('\n          ')}
        </div>
        <p style="margin-top:28px"><a class="botao botao-contorno" href="/por-que-a-axia/">Por que contratar a AXIA</a></p>
      </div>
    </section>

    <section class="secao secao-alt" aria-labelledby="candidatos-titulo">
      <div class="container">
        <div class="faixa-candidatos">
          <div>
            <span class="sobretitulo">Para profissionais</span>
            <h2 id="candidatos-titulo">Procurando uma nova oportunidade?</h2>
            <p>Veja as vagas abertas em tecnologia, segurança e dados ou cadastre seu currículo no banco de talentos da AXIA.</p>
          </div>
          <div class="acoes-chamada">
            <a class="botao botao-primario" href="/recrutamento/#vagas">Ver vagas</a>
            <a class="botao botao-contorno" href="/recrutamento/#banco-de-talentos">Enviar currículo</a>
          </div>
        </div>
      </div>
    </section>

    <section class="secao" aria-labelledby="blog-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Blog</span>
          <h2 id="blog-titulo">Conteúdo sobre contratação e equipes de tecnologia</h2>
          <p>Guias práticos para quem precisa contratar bem em tecnologia, segurança e dados.</p>
        </div>
        <div class="grade grade-3">
      ${ordenadas.slice(0, 3).map(cartaoMateria).join('\n      ')}
        </div>
        <p style="margin-top:28px"><a class="botao botao-contorno" href="/blog/">Ver todas as matérias</a></p>
      </div>
    </section>

    <section class="secao faq secao-alt" aria-labelledby="faq-titulo">
      <div class="container" style="max-width:820px">
        <div class="secao-cabeca">
          <span class="sobretitulo">Dúvidas frequentes</span>
          <h2 id="faq-titulo">Perguntas frequentes</h2>
        </div>
        ${faqComercial.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ')}
      </div>
    </section>

    ${chamadaFinal('Solicite uma proposta', 'Conte o que a sua empresa precisa: um profissional, várias posições ou uma equipe completa. Retornamos em dias úteis.').replace('style="padding-top:0"', '')}`
});

// Soluções (lista de serviços)
{
  const t = trilha([['/', 'Início'], ['/servicos/', 'Soluções']]);
  paginas['servicos/index.html'] = pagina({
    caminho: '/servicos/',
    titulo: 'Soluções: recrutamento e seleção, alocação de profissionais e squads',
    descricao: 'Recrutamento e seleção especializados, alocação de profissionais e squads de tecnologia, segurança da informação, dados e projetos.',
    jsonld: [t.ld, {
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Soluções da AXIA',
      itemListElement: servicos.map((sv, i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Service', name: sv.nome, description: sv.descricao, url: `${SITE}/servicos/${sv.slug}/`, provider: { '@id': SITE + '/#organizacao' } }
      }))
    }],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Soluções</h1>
        <p>Recrutamento, alocação e squads: escolha o modelo que combina com a sua necessidade, o seu prazo e o seu orçamento.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container">
        <div class="grade grade-3">
          ${servicos.map(servicoHTML).join('\n          ')}
        </div>
      </div>
    </section>
    <section class="secao secao-alt">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">Qual escolher</span><h2>Recrutamento, alocação ou squad?</h2></div>
        ${tabelaHTML({
          colunas: ['', 'Recrutamento e Seleção', 'Alocação de Profissionais', 'Squads Especializados'],
          linhas: [
            ['Vínculo do profissional', 'Com a sua empresa', 'Com a AXIA', 'Com a AXIA'],
            ['Indicado para', 'Posições permanentes', 'Demandas por período, projeto ou reforço', 'Objetivos que pedem uma equipe completa'],
            ['Quem gerencia o dia a dia', 'A sua empresa', 'Compartilhado, conforme contrato', 'AXIA ou compartilhado, conforme o modelo'],
            ['Flexibilidade', 'Contratação definitiva', 'Ampliar, reduzir ou substituir', 'Composição ajustável'],
          ],
        })}
      </div>
    </section>
    ${chamadaFinal('Não sabe qual modelo escolher?', 'Conte a necessidade da sua empresa e indicamos o caminho mais adequado.')}`
  });
}

// Página de cada serviço
for (const sv of servicos) {
  const caminho = `/servicos/${sv.slug}/`;
  const t = trilha([['/', 'Início'], ['/servicos/', 'Soluções'], [caminho, sv.nome]]);
  const relacionadas = sv.materias.map(slug => ordenadas.find(m => m.slug === slug)).filter(Boolean);
  const outros = servicos.filter(x => x !== sv);
  const extras = (sv.extras || []).map((x, i) => `<section class="secao${i % 2 ? ' secao-alt' : ''}" id="${x.id}" aria-labelledby="${x.id}-titulo">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">${esc(x.sobretitulo)}</span><h2 id="${x.id}-titulo">${esc(x.titulo)}</h2>${x.texto ? `<p>${esc(x.texto)}</p>` : ''}</div>
        ${x.itens ? `<div class="grade grade-3">
          ${x.itens.map(([nome, texto]) => `<div class="servico"><h3>${esc(nome)}</h3><p>${esc(texto)}</p></div>`).join('\n          ')}
        </div>` : ''}
        ${x.tabela ? tabelaHTML(x.tabela) : ''}
      </div>
    </section>`).join('\n    ');
  paginas[`servicos/${sv.slug}/index.html`] = pagina({
    caminho,
    titulo: sv.titulo,
    descricao: sv.descricao,
    jsonld: [t.ld, {
      '@context': 'https://schema.org', '@type': 'Service', name: sv.nome, serviceType: sv.nome, description: sv.descricao,
      url: SITE + caminho, provider: { '@id': SITE + '/#organizacao' }, areaServed: { '@type': 'Country', name: 'Brasil' },
      hasOfferCatalog: { '@type': 'OfferCatalog', name: sv.entregasTitulo, itemListElement: sv.entregas.map(([nome, texto]) => ({ '@type': 'Offer', itemOffered: { '@type': 'Service', name: nome, description: texto } })) }
    }, faqLD(sv.faq)],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>${esc(sv.nome)}</h1>
        <p>${esc(sv.chamada)}</p>
        <div class="acoes" style="margin-top:24px">
          <a class="botao botao-laranja" href="${sv.cta[1]}">${esc(sv.cta[0])}</a>
          <a class="botao botao-contorno" href="#entregas">${esc(sv.entregasTitulo)}</a>
        </div>
      </div>
    </section>
    <section class="secao">
      <div class="container dupla servico-intro">
        <div class="texto-longo">${sv.intro}</div>
        <aside class="caixa-para-quem">
          <h2>Quando faz sentido</h2>
          <ul>${sv.paraQuem.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </aside>
      </div>
    </section>
    <section class="secao secao-alt" id="entregas" aria-labelledby="entregas-titulo">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">${esc(sv.nome)}</span><h2 id="entregas-titulo">${esc(sv.entregasTitulo)}</h2></div>
        <div class="grade grade-3">
          ${sv.entregas.map(([nome, texto]) => `<div class="servico"><h3>${esc(nome)}</h3><p>${esc(texto)}</p></div>`).join('\n          ')}
        </div>
      </div>
    </section>
    ${extras}
    <section class="secao faixa" aria-labelledby="como-titulo">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">Como funciona</span><h2 id="como-titulo">Do primeiro contato aos resultados</h2><p>${esc(sv.formatos)}</p></div>
        <div class="grade grade-4">
          ${sv.etapas.map(([nome, texto], i) => `<div class="etapa"><span class="num destaque">0${i + 1}</span><h3>${esc(nome)}</h3><p>${esc(texto)}</p></div>`).join('\n          ')}
        </div>
      </div>
    </section>
    <section class="secao faq" aria-labelledby="faq-titulo">
      <div class="container" style="max-width:820px">
        <div class="secao-cabeca"><span class="sobretitulo">Dúvidas frequentes</span><h2 id="faq-titulo">Perguntas sobre ${esc(sv.nome)}</h2></div>
        ${sv.faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ')}
      </div>
    </section>
    ${relacionadas.length ? `<section class="secao secao-alt" aria-labelledby="leia-titulo">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">Blog</span><h2 id="leia-titulo">Para se aprofundar</h2></div>
        <div class="grade grade-3">
      ${relacionadas.map(cartaoMateria).join('\n      ')}
        </div>
      </div>
    </section>` : ''}
    <section class="secao">
      <div class="container">
        <div class="chamada">
          <div><h2>Vamos conversar sobre ${esc(sv.nome)}?</h2><p>Conte a necessidade da sua empresa. Retornamos em dias úteis com uma proposta.</p></div>
          <a class="botao botao-laranja" href="${sv.cta[1]}">${esc(sv.cta[0])}</a>
        </div>
        <p class="outros-servicos"><strong>Outras soluções:</strong> ${outros.map(x => `<a href="/servicos/${x.slug}/">${esc(x.nome)}</a>`).join(' · ')}</p>
      </div>
    </section>`
  });
}

// Áreas de especialização
{
  const t = trilha([['/', 'Início'], ['/areas-de-especializacao/', 'Áreas de especialização']]);
  paginas['areas-de-especializacao/index.html'] = pagina({
    caminho: '/areas-de-especializacao/',
    titulo: 'Áreas de especialização: tecnologia, segurança da informação e dados',
    descricao: 'Profissionais de segurança da informação, desenvolvimento, cloud e DevOps, dados e IA, projetos e privacidade para recrutamento, alocação e squads.',
    jsonld: [t.ld],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Áreas de especialização</h1>
        <p>Atuamos nas áreas em que conhecer a função faz diferença na qualidade da contratação. Em todas elas oferecemos recrutamento e seleção, alocação de profissionais e squads.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container">
        <div class="grade grade-3">
          ${areas.map(areaHTML).join('\n          ')}
        </div>
        <p class="legenda" style="margin-top:20px">Contratações de liderança, como gestores, coordenadores, CISOs e CTOs, são conduzidas como recrutamento executivo, inclusive de forma confidencial.</p>
      </div>
    </section>
    ${chamadaFinal('Precisa de um perfil que não está na lista?', 'Fale com a gente: avaliamos cada necessidade e indicamos o melhor caminho.')}`
  });
}

// Por que a AXIA (diferenciais e motivos para contratar)
{
  const t = trilha([['/', 'Início'], ['/por-que-a-axia/', 'Por que a AXIA']]);
  paginas['por-que-a-axia/index.html'] = pagina({
    caminho: '/por-que-a-axia/',
    titulo: 'Por que contratar a AXIA: especialização, agilidade e flexibilidade',
    descricao: 'Mais do que encontrar profissionais: a AXIA conecta talentos, conhecimento e resultados, com seleção técnica e modelos flexíveis de contratação.',
    jsonld: [t.ld],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Por que contratar a AXIA?</h1>
        <p>Mais do que encontrar profissionais. Conectamos talentos, conhecimento e resultados.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container" style="max-width:860px">
        <p class="texto-destaque">Contratar o profissional certo é uma decisão estratégica. Por isso, a AXIA oferece soluções que vão além do recrutamento tradicional, combinando especialização técnica, visão de negócios e modelos flexíveis de contratação.</p>
        <ol class="lista-motivos">
          ${porQue.map(([nome, texto]) => `<li><strong>${esc(nome)}.</strong> ${esc(texto)}</li>`).join('\n          ')}
        </ol>
      </div>
    </section>
    <section class="secao secao-alt" aria-labelledby="diferenciais-titulo">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">Diferenciais</span><h2 id="diferenciais-titulo">Nossos compromissos</h2></div>
        <div class="grade grade-3">
          ${diferenciais.map(diferencialHTML).join('\n          ')}
        </div>
      </div>
    </section>
    ${chamadaFinal('AXIA. O talento certo. A equipe ideal.', 'Solicite uma proposta e descubra como podemos fortalecer a sua equipe.')}`
  });
}

// Para empresas: solicitar profissional, montar squad, anunciar vaga
{
  const t = trilha([['/', 'Início'], ['/empresas/', 'Para empresas']]);
  const op = (itens, vazio = true) => (vazio ? '<option value="">Selecione</option>' : '') + itens.map(o => `<option>${esc(o)}</option>`).join('');
  const AREAS_NOMES = [...areas.map(a => a[1]), 'Outra área'];
  const NIVEIS = ['Júnior', 'Pleno', 'Sênior', 'Especialista', 'Liderança (coordenação, gerência)', 'Executivo (CISO, CTO, diretoria)'];
  const MODELOS_CONTRATACAO = ['Recrutamento e seleção (contratação direta)', 'Alocação dedicada', 'Alocação parcial', 'Alocação por projeto', 'Staff augmentation', 'Executivo sob demanda', 'Ainda não sei'];
  const MODELO_TRABALHO = ['Presencial', 'Híbrido', 'Remoto'];
  const TIPOS_SQUAD = ['Segurança da Informação', 'Desenvolvimento e Tecnologia', 'Dados e Inteligência Artificial', 'Projetos e Transformação', 'Outro'];
  const MODELOS_SQUAD = ['Squad gerenciado', 'Squad dedicado', 'Squad híbrido', 'Squad por projeto', 'Squad sob demanda', 'Ainda não sei'];
  const contato = `<div class="duas">
              <label>Empresa<input name="Empresa" required autocomplete="organization"></label>
              <label>Seu nome<input name="Nome" required autocomplete="name"></label>
              <label>E-mail<input name="E-mail" type="email" required autocomplete="email"></label>
              <label>Telefone ou WhatsApp<input name="Telefone" type="tel" autocomplete="tel"></label>
            </div>`;
  const aceite = `<label class="confirma"><input type="checkbox" required> <span>Concordo que a AXIA use estes dados para responder à solicitação (veja a <a href="/privacidade/">política de privacidade</a>).</span></label>`;
  paginas['empresas/index.html'] = pagina({
    caminho: '/empresas/',
    titulo: 'Para empresas: solicite profissionais, squads ou anuncie vagas',
    descricao: 'Solicite profissionais especializados, monte um squad ou anuncie uma vaga. A AXIA retorna em dias úteis com uma proposta para a sua empresa.',
    jsonld: [t.ld],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Para empresas</h1>
        <p>Conte o que a sua empresa precisa. Analisamos a solicitação e retornamos em dias úteis com uma proposta.</p>
        <div class="atalhos">
          <a class="atalho" href="#profissional">${icones.pessoas}<span><strong>Solicitar profissional</strong><small>Recrutamento ou alocação</small></span></a>
          <a class="atalho" href="#squad">${icones.grafico}<span><strong>Montar meu squad</strong><small>Equipe completa</small></span></a>
          <a class="atalho" href="/recrutamento/anunciar-vaga/">${icones.megafone}<span><strong>Anunciar vaga</strong><small>Portal de vagas AXIA</small></span></a>
          <a class="atalho" href="/contato/?assunto=${encodeURIComponent('Agendar reunião')}">${icones.relogio}<span><strong>Agendar reunião</strong><small>Conversa com a equipe</small></span></a>
        </div>
      </div>
    </section>
    <section class="secao" id="profissional" aria-labelledby="profissional-titulo">
      <div class="container" style="max-width:880px">
        <div class="secao-cabeca"><span class="sobretitulo">Solicitar profissional</span><h2 id="profissional-titulo">Qual profissional você procura?</h2><p>Para uma ou várias posições, por recrutamento e seleção ou por alocação.</p></div>
        <form class="formulario form-email" data-assunto="Solicitação de profissional" aria-label="Solicitar profissional">
          ${contato}
          <div class="duas">
            <label>Cargo ou perfil<input name="Cargo ou perfil" required placeholder="Ex.: Analista de SOC, Desenvolvedor Java"></label>
            <label>Área<select name="Área" required>${op(AREAS_NOMES)}</select></label>
            <label>Senioridade<select name="Senioridade" required>${op(NIVEIS)}</select></label>
            <label>Quantidade de profissionais<input name="Quantidade" type="number" min="1" value="1"></label>
            <label>Modelo de contratação<select name="Modelo de contratação" required>${op(MODELOS_CONTRATACAO)}</select></label>
            <label>Modelo de trabalho<select name="Modelo de trabalho">${op(MODELO_TRABALHO)}</select></label>
            <label>Cidade e estado<input name="Local" placeholder="Ex.: São Paulo – SP"></label>
            <label>Início desejado<input name="Início desejado" type="date"></label>
            <label>Duração (se alocação)<input name="Duração" placeholder="Ex.: 6 meses, projeto, indefinida"></label>
          </div>
          <label>Principais requisitos e responsabilidades<textarea name="Requisitos e responsabilidades" rows="5" required placeholder="Conhecimentos técnicos, experiência, certificações e o que a pessoa vai fazer."></textarea></label>
          ${aceite}
          <button class="botao botao-primario" type="submit">Enviar solicitação</button>
          <small>Ao enviar, o seu programa de e-mail abre com a solicitação pronta para ${EMAIL}.</small>
        </form>
      </div>
    </section>
    <section class="secao secao-alt" id="squad" aria-labelledby="squad-titulo">
      <div class="container" style="max-width:880px">
        <div class="secao-cabeca"><span class="sobretitulo">Montar meu squad</span><h2 id="squad-titulo">Conte o objetivo da sua equipe</h2><p>Com essas informações, propomos a composição, o modelo de entrega e o prazo do squad.</p></div>
        <form class="formulario form-email" data-assunto="Solicitação de squad" aria-label="Montar squad">
          ${contato}
          <label>Objetivo do projeto ou da equipe<textarea name="Objetivo" rows="4" required placeholder="O que o squad precisa entregar e por quê."></textarea></label>
          <div class="duas">
            <label>Tipo de squad<select name="Tipo de squad" required>${op(TIPOS_SQUAD)}</select></label>
            <label>Modelo de entrega<select name="Modelo de entrega">${op(MODELOS_SQUAD)}</select></label>
            <label>Duração estimada<input name="Duração estimada" placeholder="Ex.: 6 meses, contínuo"></label>
            <label>Início desejado<input name="Início desejado" type="date"></label>
          </div>
          <label>Tecnologias e ferramentas<input name="Tecnologias" placeholder="Ex.: AWS, Java, Splunk, Power BI"></label>
          <label>Composição desejada <small>(se já tiver ideia)</small><textarea name="Composição desejada" rows="3" placeholder="Ex.: 1 líder técnico, 3 desenvolvedores, 1 QA"></textarea></label>
          ${aceite}
          <button class="botao botao-primario" type="submit">Enviar solicitação</button>
          <small>Ao enviar, o seu programa de e-mail abre com a solicitação pronta para ${EMAIL}.</small>
        </form>
      </div>
    </section>
    <section class="secao">
      <div class="container">
        <div class="chamada">
          <div><h2>Tem uma vaga para divulgar?</h2><p>Envie o descritivo no padrão AXIA. Revisamos, aprovamos e publicamos no portal de vagas.</p></div>
          <a class="botao botao-laranja" href="/recrutamento/anunciar-vaga/">Anunciar vaga</a>
        </div>
      </div>
    </section>`
  });
}

// Sobre
{
  const t = trilha([['/', 'Início'], ['/sobre/', 'Sobre']]);
  paginas['sobre/index.html'] = pagina({
    caminho: '/sobre/',
    titulo: 'Sobre a AXIA: recrutamento, alocação e squads em tecnologia',
    descricao: 'Conheça a AXIA, parceira estratégica em recrutamento e seleção, alocação de profissionais e squads especializados em tecnologia, segurança e dados.',
    jsonld: [t.ld, { ...ORG, founder: SOCIOS.map(s => ({ '@id': `${SITE}/sobre/#${s.id}` })) }, ...SOCIOS.map(s => ({ '@context': 'https://schema.org', ...socioLD(s), description: s.bio }))],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Sobre a AXIA</h1>
        <p>AXIA vem de <em>axía</em>, “valor” em grego, e lembra <em>eixo</em>: as pessoas certas como eixo que sustenta o valor do negócio.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container dupla">
        <div>
          <span class="sobretitulo">Quem somos</span>
          <h2>Parceira estratégica em talentos e equipes de tecnologia</h2>
          <p>A AXIA conecta empresas a profissionais e equipes especializadas em <strong>Tecnologia, Segurança da Informação e Dados</strong>. Atuamos com recrutamento e seleção, alocação de profissionais e squads, sempre com avaliação técnica conduzida por quem conhece as funções.</p>
          <p>Nosso propósito é que cada contratação gere resultado: o profissional certo, no modelo certo, pelo tempo que o negócio precisar.</p>
          <a class="botao botao-primario" href="/empresas/">Solicitar uma proposta</a>
        </div>
        <img src="/assets/img/simbolo.webp" srcset="/assets/img/simbolo-300.webp 300w, /assets/img/simbolo.webp 600w" sizes="(max-width: 760px) 70vw, 420px" alt="Símbolo da AXIA: a letra A em prata cortada por um arco laranja" width="600" height="480" loading="lazy" style="box-shadow:none;max-width:420px;justify-self:center">
      </div>
    </section>
    <section class="secao" id="quem-conduz" style="padding-top:0" aria-labelledby="socios-titulo">
      <div class="container">
        <span class="sobretitulo">Quem conduz</span>
        <h2 id="socios-titulo" class="visualmente-oculto">Sócios fundadores</h2>
        <div class="socios">
          ${SOCIOS.map(s => `<div class="autor autor-grande" id="${s.id}">
            ${fotoSocio(s)}
            <div>
              <h3 style="margin:0"><a href="${s.linkedin}" target="_blank" rel="noopener">${s.nome}</a></h3>
              <p class="meta" style="margin:2px 0 8px">${s.cargo}</p>
              <p>${s.bio}</p>
              <p><a class="link-linkedin" href="${s.linkedin}" target="_blank" rel="noopener">Ver perfil no LinkedIn</a></p>
            </div>
          </div>`).join('\n          ')}
        </div>
      </div>
    </section>
    <section class="secao secao-alt">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">No que acreditamos</span><h2>Nossos valores</h2></div>
        <div class="grade grade-3">
          <div class="servico"><div class="icone">${icones.escudo}</div><h3>Confiança</h3><p>Sigilo e ética no trato de empresas, candidatos e informações sensíveis.</p></div>
          <div class="servico"><div class="icone">${icones.alvo}</div><h3>Precisão</h3><p>Avaliamos de verdade: competências técnicas, comportamento e aderência ao negócio.</p></div>
          <div class="servico"><div class="icone">${icones.aperto}</div><h3>Parceria</h3><p>Relacionamento de longo prazo, próximo das empresas e dos profissionais.</p></div>
        </div>
      </div>
    </section>`
  });
}

// Contato
{
  const t = trilha([['/', 'Início'], ['/contato/', 'Contato']]);
  paginas['contato/index.html'] = pagina({
    caminho: '/contato/',
    titulo: 'Fale com a AXIA: recrutamento, alocação de profissionais e squads',
    descricao: 'Fale com a AXIA sobre recrutamento e seleção, alocação de profissionais, squads especializados ou vagas. E-mail: contato@axia.net.br.',
    jsonld: [t.ld, { '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE + '/contato/', about: { '@id': SITE + '/#organizacao' } }],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Contato</h1>
        <p>Conte o que a sua empresa precisa ou tire suas dúvidas. Retornamos em dias úteis.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container grade grade-2">
        <form class="formulario" id="form-contato" aria-label="Formulário de contato">
          <label>Nome<input name="nome" required autocomplete="name"></label>
          <label>E-mail<input name="email" type="email" required autocomplete="email"></label>
          <label>Empresa <small>(opcional)</small><input name="empresa" autocomplete="organization"></label>
          <label>Assunto
            <select name="assunto">
              <option>Recrutamento e seleção</option>
              <option>Alocação de profissionais</option>
              <option>Squads especializados</option>
              <option>Agendar reunião</option>
              <option>Anunciar uma vaga</option>
              <option>Sou candidato</option>
              <option>Outro assunto</option>
            </select>
          </label>
          <label>Mensagem<textarea name="mensagem" required></textarea></label>
          <button class="botao botao-primario" type="submit">Enviar mensagem</button>
          <small>Ao enviar, o seu programa de e-mail abre com a mensagem pronta. Seus dados são usados apenas para responder ao contato (veja a <a href="/privacidade/">política de privacidade</a>).</small>
        </form>
        <div class="contato-info">
          <div class="item"><div class="icone">${icones.maleta}</div><div><h3>Para empresas</h3><p><a href="/empresas/#profissional">Solicitar profissionais</a> · <a href="/empresas/#squad">Montar squad</a></p></div></div>
          <div class="item"><div class="icone">${icones.pessoas}</div><div><h3>Para candidatos</h3><p><a href="/recrutamento/#vagas">Ver vagas</a> · <a href="/recrutamento/#banco-de-talentos">Enviar currículo</a></p></div></div>
          <div class="item"><div class="icone">${icones.email}</div><div><h3>E-mail</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></div>
          <div class="item"><div class="icone">${icones.mapa}</div><div><h3>Onde estamos</h3><p>São Paulo – SP<br>Atendimento em todo o Brasil, presencial ou on-line.</p></div></div>
        </div>
      </div>
    </section>`
  });
}

// Vagas e carreiras (portal público) e área de gestão: ver recrutamento.js
Object.assign(paginas, require('./recrutamento')({ pagina, trilha, esc, icones, SITE, NOME, EMAIL, vagas: vagasPublicas }));

// Blog (listagem)
{
  const t = trilha([['/', 'Início'], ['/blog/', 'Blog']]);
  const temas = [...new Set(ordenadas.map(m => m.tema))];
  paginas['blog/index.html'] = pagina({
    caminho: '/blog/',
    titulo: 'Blog: recrutamento, alocação e equipes de tecnologia',
    descricao: 'Guias práticos sobre como contratar profissionais de tecnologia e segurança, alocação de profissionais, squads, recrutamento executivo e LGPD no RH.',
    jsonld: [t.ld, {
      '@context': 'https://schema.org', '@type': 'Blog', name: 'Blog AXIA', url: SITE + '/blog/', inLanguage: 'pt-BR',
      publisher: { '@id': SITE + '/#organizacao' },
      blogPost: ordenadas.map(m => ({ '@type': 'BlogPosting', headline: m.titulo, url: `${SITE}/blog/${m.slug}/`, datePublished: m.data }))
    }],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Blog</h1>
        <p>Conteúdo prático para quem precisa contratar bem e montar equipes em tecnologia, segurança da informação e dados.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container">
        <div class="filtros" role="group" aria-label="Filtrar por tema">
          <button data-filtro="todos" aria-pressed="true">Todos</button>
          ${temas.map(tm => `<button data-filtro="${esc(tm)}" aria-pressed="false">${esc(tm)}</button>`).join('\n          ')}
        </div>
        <div class="grade grade-3">
      ${ordenadas.map(cartaoMateria).join('\n      ')}
        </div>
      </div>
    </section>`
  });
}

// Corpo da matéria com as referências antes do aviso final
function corpoCompleto(m) {
  let corpo = m.corpo.trim();
  if (!m.referencias?.length) return corpo;
  const refs = `<h2 id="referencias">Referências</h2>\n<ul class="referencias">${m.referencias.map(([nome, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(nome)}</a></li>`).join('')}</ul>`;
  const aviso = corpo.lastIndexOf('<p class="aviso">');
  return aviso >= 0 ? corpo.slice(0, aviso) + refs + '\n' + corpo.slice(aviso) : corpo + '\n' + refs;
}

// Matérias
for (const m of ordenadas) {
  const t = trilha([['/', 'Início'], ['/blog/', 'Blog'], [`/blog/${m.slug}/`, m.titulo]]);
  const relacionadas = [...ordenadas.filter(x => x !== m && x.tema === m.tema), ...ordenadas.filter(x => x !== m && x.tema !== m.tema)].slice(0, 3);
  const sv = servicos.find(x => x.slug === m.servico);
  paginas[`blog/${m.slug}/index.html`] = pagina({
    caminho: `/blog/${m.slug}/`,
    titulo: m.titulo,
    descricao: m.descricao,
    tipo: 'article',
    jsonld: [t.ld, {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: m.titulo, description: m.descricao, inLanguage: 'pt-BR',
      image: `${SITE}/assets/img/og.jpg`,
      datePublished: m.data, dateModified: m.atualizado || m.data,
      mainEntityOfPage: `${SITE}/blog/${m.slug}/`,
      author: AUTOR_LD,
      publisher: { '@id': SITE + '/#organizacao' },
      articleSection: m.tema
    }],
    conteudo: `
    <article class="artigo">
      ${t.html}
      <span class="tag">${esc(m.tema)}</span>
      <h1 style="margin-top:12px">${esc(m.titulo)}</h1>
      <p class="meta">Por <a href="${AUTOR.url}">${AUTOR.nome}</a> · Publicado em <time datetime="${m.data}">${dataBR(m.data)}</time>${m.atualizado ? ` · Atualizado em <time datetime="${m.atualizado}">${dataBR(m.atualizado)}</time>` : ''}</p>
      ${placa(m, ' capa')}
      ${corpoCompleto(m)}
      <aside class="autor" aria-label="Sobre o autor">
        ${fotoSocio(AUTOR)}
        <div><strong><a href="${AUTOR.url}">${AUTOR.nome}</a></strong> <span>· ${AUTOR.cargo}</span><p>${AUTOR.bio}</p></div>
      </aside>
      <div class="chamada" style="margin-top:40px;padding:32px">
        <div><h2 style="font-size:1.4rem">${sv ? `Conheça a solução de ${esc(sv.nome)}` : 'Precisa contratar ou montar uma equipe?'}</h2><p>${sv ? esc(sv.chamada) : 'Fale com a AXIA sobre recrutamento, alocação de profissionais e squads.'}</p></div>
        <a class="botao botao-laranja" href="${sv ? `/servicos/${sv.slug}/` : '/empresas/'}">${sv ? 'Ver a solução' : 'Para empresas'}</a>
      </div>
      <section class="leia-tambem" aria-labelledby="leia-tambem">
        <h2 id="leia-tambem" style="margin-top:0">Leia também</h2>
        <div class="grade grade-3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
      ${relacionadas.map(cartaoMateria).join('\n      ')}
        </div>
      </section>
    </article>`
  });
}

// Privacidade
{
  const t = trilha([['/', 'Início'], ['/privacidade/', 'Política de privacidade']]);
  paginas['privacidade/index.html'] = pagina({
    caminho: '/privacidade/',
    titulo: 'Política de privacidade',
    descricao: 'Como a AXIA trata os dados pessoais de empresas e candidatos enviados pelo site, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    jsonld: [t.ld],
    conteudo: `
    <article class="artigo">
      ${t.html}
      <h1>Política de privacidade</h1>
      <p class="meta">Atualizada em ${dataBR(PRIVACIDADE_ATUALIZADA)}</p>
      <p>Esta política explica como a AXIA trata os dados pessoais de quem visita o site axia.net.br, de empresas que solicitam nossos serviços e de candidatos, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
      <h2>Navegação</h2>
      <p>O site não usa cookies de rastreamento nem ferramentas de publicidade.</p>
      <h2>Contato e solicitações de empresas</h2>
      <p>Os formulários de contato, de solicitação de profissionais e de squads não gravam dados em servidor: eles abrem o seu programa de e-mail com a mensagem pronta. Recebemos somente o que você decidir enviar e usamos esses dados apenas para responder e, se houver contratação, para prestar os serviços combinados.</p>
      <h2>Anúncio de vagas</h2>
      <p>O formulário de anúncio de vagas grava o descritivo da vaga e os dados do responsável (nome, cargo, e-mail e telefone) em um banco de dados protegido, acessível só aos gestores da AXIA, para revisar, aprovar, publicar e divulgar a vaga. Os dados de contato do responsável nunca aparecem no anúncio público. Se a empresa escolher vaga confidencial, o nome dela também não é publicado. O formulário guarda um rascunho apenas no seu navegador até o envio.</p>
      <h2>Candidatos e banco de talentos</h2>
      <p>Currículos enviados para uma vaga são usados no processo seletivo dessa vaga e compartilhados somente com a empresa contratante. Currículos enviados ao banco de talentos são usados para indicar o candidato a oportunidades compatíveis com o seu perfil, inclusive de alocação e squads. Pedimos que o currículo não traga dados como documentos, estado civil ou informações de saúde. Quem estiver no banco de talentos pode pedir a atualização ou a exclusão a qualquer momento.</p>
      <h2>Compartilhamento</h2>
      <p>Não vendemos nem compartilhamos dados com terceiros para fins de marketing. Eles podem ser compartilhados apenas quando necessário para o serviço, como com a empresa contratante de um processo seletivo, ou por obrigação legal.</p>
      <h2>Seus direitos</h2>
      <p>Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados, escrevendo para <a href="mailto:${EMAIL}">${EMAIL}</a>.</p>
      <h2>Fontes externas</h2>
      <p>As fontes tipográficas do site são carregadas do Google Fonts, que pode registrar o endereço IP do visitante conforme a política do Google.</p>
    </article>`
  });
}

// 404
paginas['404.html'] = pagina({
  caminho: '/404.html',
  titulo: 'Página não encontrada',
  descricao: 'A página que você procurou não existe ou mudou de endereço.',
  semIndex: true,
  conteudo: `
    <section class="secao">
      <div class="container" style="max-width:640px;text-align:center">
        <h1>Página não encontrada</h1>
        <p>O endereço pode ter mudado. Que tal começar por aqui?</p>
        <p style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:24px">
          <a class="botao botao-primario" href="/">Página inicial</a>
          <a class="botao botao-contorno" href="/servicos/">Soluções</a>
          <a class="botao botao-contorno" href="/recrutamento/">Vagas</a>
        </p>
      </div>
    </section>`
});

// Redirecionamentos de endereços antigos
function redirecionar(destino) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Redirecionando…</title><link rel="canonical" href="${SITE}${destino}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${destino}"></head><body><p><a href="${destino}">Clique aqui se não for redirecionado.</a></p></body></html>\n`;
}
const REDIRECIONAMENTOS = {
  // Site antigo da UOL
  'privacy': '/privacidade/',
  'legal-notice': '/privacidade/',
  'blog-single-page-layout': '/blog/',
  // Serviços de consultoria encerrados em 18/11/2026
  'servicos/ciso-como-servico': '/servicos/alocacao-de-profissionais/',
  'servicos/cto-como-servico': '/servicos/alocacao-de-profissionais/',
  'servicos/consultoria-lgpd': '/servicos/',
  'servicos/iso-27001-e-soc-2': '/servicos/',
  'servicos/continuidade-de-negocios': '/servicos/',
  'servicos/conscientizacao-em-seguranca': '/servicos/',
  // Matérias antigas, substituídas pelas do novo foco
  'blog/o-que-e-ciso-como-servico': '/blog/como-contratar-ciso-ou-cto/',
  'blog/cto-como-servico': '/blog/como-contratar-ciso-ou-cto/',
  'blog/lgpd-checklist-para-pequenas-e-medias-empresas': '/blog/lgpd-no-recrutamento-dados-de-candidatos/',
  'blog/iso-27001-ou-soc-2': '/blog/como-contratar-profissionais-de-seguranca-da-informacao/',
  'blog/ransomware-controles-essenciais': '/blog/como-contratar-profissionais-de-seguranca-da-informacao/',
  'blog/plano-de-continuidade-de-negocios': '/blog/',
};
for (const [de, para] of Object.entries(REDIRECIONAMENTOS)) paginas[`${de}/index.html`] = redirecionar(para);
// Posts do blog do site antigo (o Search Console mostrou blog-post-1 e blog-post-3 dando 404)
for (let n = 1; n <= 10; n++) paginas[`blog-single-page-layout/blog-post-${n}/index.html`] = redirecionar('/blog/');

// ---------- Gravação ----------
for (const [arq, html] of Object.entries(paginas)) {
  const destino = path.join(RAIZ, arq);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}

// Remove as páginas fixas de vagas que saíram do ar (encerradas, vencidas ou reprovadas)
const dirRecrutamento = path.join(RAIZ, 'recrutamento');
if (fs.existsSync(dirRecrutamento)) {
  for (const d of fs.readdirSync(dirRecrutamento, { withFileTypes: true })) {
    if (d.isDirectory() && !paginas[`recrutamento/${d.name}/index.html`]) fs.rmSync(path.join(dirRecrutamento, d.name), { recursive: true });
  }
}

const urls = [
  ...vagasPublicas.map(v => [`/recrutamento/${v.slug}/`, '0.7', String(v.publicada_em).slice(0, 10)]),
  ['/', '1.0'], ['/servicos/', '0.9'],
  ...servicos.map(sv => [`/servicos/${sv.slug}/`, '0.9']),
  ['/empresas/', '0.9'], ['/areas-de-especializacao/', '0.7'], ['/por-que-a-axia/', '0.7'],
  ['/recrutamento/', '0.8'], ['/recrutamento/anunciar-vaga/', '0.6'],
  ['/blog/', '0.7'], ['/sobre/', '0.6'], ['/contato/', '0.6'], ['/privacidade/', '0.2'],
  ...ordenadas.map(m => [`/blog/${m.slug}/`, '0.7', m.atualizado || m.data])
];
fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, p, d]) => `  <url><loc>${SITE}${u}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}<priority>${p}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(RAIZ, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /gerador/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(RAIZ, 'site.webmanifest'), JSON.stringify({
  name: NOME, short_name: NOME, start_url: '/', display: 'standalone', background_color: '#111318', theme_color: '#111318',
  icons: [{ src: '/assets/img/favicon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },{ src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 2) + '\n');

console.log(`${Object.keys(paginas).length} páginas geradas (css v=${V_CSS}, js v=${V_JS}).`);
