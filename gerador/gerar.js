// Gera todas as páginas do site axia.net.br.
// Uso (na pasta axia): node gerador/gerar.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { materias } = require('./conteudo');
const { vagas } = require('./vagas');

const RAIZ = path.join(__dirname, '..');
const SITE = 'https://axia.net.br';
const NOME = 'AXIA';
const EMAIL = 'contato@axia.net.br';
const HOJE = new Date().toISOString().slice(0, 10);

const hash = f => crypto.createHash('md5').update(fs.readFileSync(path.join(RAIZ, f))).digest('hex').slice(0, 8);
const V_CSS = hash('assets/css/style.css');
const V_JS = hash('assets/js/main.js');
const V_ICO = hash('favicon.ico');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const dataBR = d => new Date(d + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
// Mais recentes primeiro; na mesma data, vale a ordem do conteudo.js
const ordenadas = materias.map((m, i) => ({ ...m, i })).sort((a, b) => b.data.localeCompare(a.data) || a.i - b.i);
// Vagas abertas: ativas e dentro da validade, mais recentes primeiro
const abertas = vagas.filter(v => v.ativa && v.validade >= HOJE).sort((a, b) => b.publicada.localeCompare(a.publicada));

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
  megafone: svg('<path d="m3 11 15-6v14L3 13z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>')
};

const MENU = [
  ['/', 'Início'],
  ['/servicos/', 'Serviços'],
  ['/recrutamento/', 'Recrutamento'],
  ['/sobre/', 'Sobre'],
  ['/blog/', 'Blog'],
];

function pagina({ caminho, titulo, descricao, conteudo, imagem = 'og.jpg', tipo = 'website', jsonld = [], semIndex = false, preload = '' }) {
  const url = SITE + caminho;
  const tituloCompleto = caminho === '/' ? titulo : `${titulo} | ${NOME}`;
  const menu = MENU.map(([href, txt]) => {
    const atual = href === '/' ? caminho === '/' : caminho.startsWith(href);
    return `<li><a href="${href}"${atual ? ' aria-current="page"' : ''}>${txt}</a></li>`;
  }).join('\n          ');
  const ld = jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n  ');
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
<body>
  <a class="pular" href="#conteudo">Pular para o conteúdo</a>
  <header class="topo">
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
          <li><a class="cta-menu" href="/contato/"${caminho.startsWith('/contato/') ? ' aria-current="page"' : ''}>Fale conosco</a></li>
        </ul>
      </nav>
    </div>
  </header>

  <main id="conteudo">
${conteudo}
  </main>

  <footer class="rodape">
    <div class="container">
      <div class="colunas">
        <div>
          <img class="logo-rodape" src="/assets/img/simbolo.png" alt="Símbolo da AXIA" width="96" height="77" loading="lazy">
          <p>Consultoria em segurança da informação, tecnologia, privacidade e conformidade. CISO e CTO como serviço para empresas que precisam de liderança experiente sem o custo de um executivo em tempo integral.</p>
        </div>
        <div>
          <h2>Navegação</h2>
          <ul>
            <li><a href="/servicos/">Serviços</a></li>
            <li><a href="/recrutamento/">Recrutamento e seleção</a></li>
            <li><a href="/sobre/">Sobre a AXIA</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/contato/">Contato</a></li>
          </ul>
        </div>
        <div>
          <h2>Contato</h2>
          <ul>
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li>São Paulo – SP</li>
            <li><a href="/privacidade/">Política de privacidade</a></li>
          </ul>
        </div>
      </div>
      <div class="base">
        <span>© <span id="ano">${new Date().getFullYear()}</span> AXIA. Todos os direitos reservados.</span>
        <span>Segurança, tecnologia e conformidade</span>
      </div>
    </div>
  </footer>
  <script src="/assets/js/main.js?v=${V_JS}" defer></script>
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
  '@type': 'ProfessionalService',
  '@id': SITE + '/#organizacao',
  name: NOME,
  url: SITE + '/',
  logo: SITE + '/assets/img/icon-512.png',
  image: SITE + '/assets/img/og.jpg',
  email: EMAIL,
  description: 'Consultoria em segurança da informação, tecnologia, privacidade e conformidade: CISO como serviço, CTO como serviço, LGPD, ISO 27001, SOC 2 e continuidade de negócios.',
  areaServed: { '@type': 'Country', name: 'Brasil' },
  address: { '@type': 'PostalAddress', addressLocality: 'São Paulo', addressRegion: 'SP', addressCountry: 'BR' },
  knowsAbout: ['Segurança da informação', 'CISO as a Service', 'CTO as a Service', 'LGPD', 'ISO 27001', 'SOC 2', 'Continuidade de negócios', 'Gestão de riscos']
};

const SERVICOS = [
  ['escudo', 'CISO como Serviço', 'Um executivo de segurança experiente que se integra à sua equipe por algumas horas por semana, com responsabilidade sobre o programa de segurança.',
    ['Diagnóstico de maturidade e plano de 12 meses', 'Políticas, gestão de riscos e indicadores', 'Resposta a questionários de clientes e auditorias']],
  ['chip', 'CTO como Serviço', 'Liderança técnica sob demanda para conduzir projetos, decidir arquitetura e organizar o time de tecnologia.',
    ['Arquitetura, nuvem e escolha de fornecedores', 'Roadmap técnico alinhado ao negócio', 'Mentoria de líderes e organização do time']],
  ['cadeado', 'Privacidade e LGPD', 'Adequação prática à Lei Geral de Proteção de Dados, sem papelada que ninguém usa.',
    ['Mapeamento de dados e bases legais', 'Avisos, contratos e atendimento a titulares', 'Apoio ao encarregado (DPO)']],
  ['check', 'Conformidade e certificações', 'Preparação para frameworks e auditorias exigidos por clientes, investidores e reguladores.',
    ['ISO/IEC 27001 e 27701', 'SOC 2 e questionários de segurança', 'Avaliações de fornecedores e terceiros']],
  ['ciclo', 'Continuidade de negócios', 'Planos para a empresa seguir operando quando algo dá errado, testados antes que seja preciso usá-los.',
    ['Análise de impacto no negócio (BIA)', 'Plano de continuidade e de resposta a incidentes', 'Exercícios de mesa e testes de backup']],
  ['pessoas', 'Conscientização e mentoria', 'Pessoas preparadas são a melhor defesa. Treinamentos objetivos e acompanhamento de lideranças.',
    ['Treinamentos sobre golpes e phishing', 'Simulações de engenharia social', 'Mentoria para gestores de TI e segurança']],
];

const servicoHTML = ([ic, titulo, texto, itens], comLista) => `<div class="servico">
            <div class="icone">${icones[ic]}</div>
            <h3>${titulo}</h3>
            <p>${texto}</p>${comLista ? `\n            <ul>${itens.map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
          </div>`;

const FAQ = [
  ['O que é CISO como Serviço?', 'É ter um diretor de segurança da informação experiente em regime parcial: ele assume o programa de segurança da empresa, define prioridades e responde a clientes e auditores, por uma fração do custo de um executivo em tempo integral.'],
  ['Para que porte de empresa faz sentido?', 'Para empresas que já precisam provar segurança a clientes ou investidores, mas ainda não justificam um executivo dedicado: startups, empresas de tecnologia, prestadores de serviço e médias empresas em crescimento.'],
  ['Vocês ajudam a conseguir ISO 27001 ou SOC 2?', 'Sim. Preparamos a empresa para a auditoria: escopo, análise de riscos, políticas, controles e evidências. A certificação ou o relatório são emitidos por um auditor independente.'],
  ['Como começar?', 'Envie uma mensagem pela página de contato contando o contexto da empresa e o que motivou a busca. Marcamos uma conversa inicial, sem compromisso, para entender a necessidade.'],
];

// ---------- Páginas ----------
const paginas = {};

// Início
paginas['index.html'] = pagina({
  caminho: '/',
  titulo: 'AXIA | CISO e CTO como Serviço, segurança da informação e LGPD',
  descricao: 'Consultoria em segurança da informação e tecnologia: CISO como serviço, CTO como serviço, LGPD, ISO 27001, SOC 2 e continuidade de negócios.',
  preload: '<link rel="preload" as="image" href="/assets/img/simbolo.png">\n  ',
  jsonld: [ORG, {
    '@context': 'https://schema.org', '@type': 'WebSite', '@id': SITE + '/#site', url: SITE + '/', name: NOME, inLanguage: 'pt-BR', publisher: { '@id': SITE + '/#organizacao' }
  }, {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  }],
  conteudo: `
    <section class="hero hero-axia">
      <div class="grade-fundo" aria-hidden="true"></div>
      <div class="container">
        <div>
          <span class="sobretitulo">Segurança · Tecnologia · Conformidade</span>
          <h1>Liderança em segurança e tecnologia, <span class="destaque">sem o custo de um executivo em tempo integral</span></h1>
          <p>A AXIA oferece CISO e CTO como serviço, adequação à LGPD e preparação para ISO 27001 e SOC 2. Transformamos desafios de segurança em vantagem para o seu negócio.</p>
          <div class="acoes">
            <a class="botao botao-laranja" href="/contato/">Agendar uma conversa</a>
            <a class="botao botao-claro" href="/servicos/">Conhecer os serviços</a>
          </div>
          <ul class="pontos"><li>CISO como Serviço</li><li>CTO como Serviço</li><li>LGPD e conformidade</li></ul>
        </div>
        <img class="simbolo" src="/assets/img/simbolo.png" alt="" width="600" height="480" fetchpriority="high">
      </div>
    </section>

    <section class="secao" aria-labelledby="servicos-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">O que fazemos</span>
          <h2 id="servicos-titulo">Segurança e tecnologia conduzidas por quem já esteve na cadeira</h2>
          <p>Apoio executivo e prático para proteger informações, cumprir exigências de clientes e levar projetos de tecnologia adiante.</p>
        </div>
        <div class="grade grade-3">
          ${SERVICOS.slice(0, 3).map(s => servicoHTML(s, true)).join('\n          ')}
        </div>
        <p style="margin-top:28px"><a class="botao botao-contorno" href="/servicos/">Ver todos os serviços</a></p>
      </div>
    </section>

    <section class="secao faixa" aria-labelledby="como-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Como trabalhamos</span>
          <h2 id="como-titulo">Do diagnóstico ao programa funcionando</h2>
          <p>Um método simples, com entregas visíveis desde o primeiro mês.</p>
        </div>
        <div class="grade grade-4">
          <div class="etapa"><span class="num destaque">01</span><h3>Diagnóstico</h3><p>Entendemos o negócio, os dados que importam, os riscos e as exigências de clientes e reguladores.</p></div>
          <div class="etapa"><span class="num destaque">02</span><h3>Plano</h3><p>Priorizamos o que reduz mais risco por real investido, em um plano claro de 12 meses.</p></div>
          <div class="etapa"><span class="num destaque">03</span><h3>Execução</h3><p>Implantamos controles, políticas e processos junto com o seu time e seus fornecedores.</p></div>
          <div class="etapa"><span class="num destaque">04</span><h3>Evolução</h3><p>Medimos, reportamos à diretoria e ajustamos o programa conforme a empresa cresce.</p></div>
        </div>
      </div>
    </section>

    <section class="secao" aria-labelledby="por-que-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Por que a AXIA</span>
          <h2 id="por-que-titulo">Segurança que ajuda a vender, não que trava a operação</h2>
        </div>
        <div class="numeros">
          <div><strong>Visão executiva</strong><span>Riscos traduzidos em decisões de negócio para sócios e diretoria.</span></div>
          <div><strong>Mão na massa</strong><span>Entregamos políticas, controles e evidências, não só recomendações.</span></div>
          <div><strong>Sob medida</strong><span>Horas e escopo ajustados ao momento e ao orçamento da empresa.</span></div>
          <div><strong>Independência</strong><span>Sem revenda de ferramentas: indicamos só o que faz sentido.</span></div>
        </div>
      </div>
    </section>

    <section class="secao secao-alt" aria-labelledby="blog-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Blog</span>
          <h2 id="blog-titulo">Conteúdo sobre segurança, privacidade e tecnologia</h2>
          <p>Guias práticos para gestores que precisam decidir sobre segurança sem jargão.</p>
        </div>
        <div class="grade grade-3">
      ${ordenadas.slice(0, 3).map(cartaoMateria).join('\n      ')}
        </div>
        <p style="margin-top:28px"><a class="botao botao-contorno" href="/blog/">Ver todas as matérias</a></p>
      </div>
    </section>

    <section class="secao faq" aria-labelledby="faq-titulo">
      <div class="container" style="max-width:820px">
        <div class="secao-cabeca">
          <span class="sobretitulo">Dúvidas frequentes</span>
          <h2 id="faq-titulo">Perguntas frequentes</h2>
        </div>
        ${FAQ.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('\n        ')}
      </div>
    </section>

    <section class="secao" style="padding-top:0">
      <div class="container">
        <div class="chamada">
          <div>
            <h2>Comece a transformar seus desafios em oportunidades</h2>
            <p>Conte o contexto da sua empresa. Retornamos para marcar uma conversa inicial.</p>
          </div>
          <a class="botao botao-laranja" href="/contato/">Fale conosco</a>
        </div>
      </div>
    </section>`
});

// Serviços
{
  const t = trilha([['/', 'Início'], ['/servicos/', 'Serviços']]);
  paginas['servicos/index.html'] = pagina({
    caminho: '/servicos/',
    titulo: 'Serviços: CISO e CTO como Serviço, LGPD, ISO 27001 e continuidade',
    descricao: 'CISO como serviço, CTO como serviço, adequação à LGPD, preparação para ISO 27001 e SOC 2, continuidade de negócios e conscientização em segurança.',
    jsonld: [t.ld, {
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Serviços da AXIA',
      itemListElement: SERVICOS.map(([, nome, texto], i) => ({
        '@type': 'ListItem', position: i + 1,
        item: { '@type': 'Service', name: nome, description: texto, provider: { '@id': SITE + '/#organizacao' } }
      }))
    }],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Serviços</h1>
        <p>Liderança, método e execução para proteger informações, cumprir exigências e conduzir a tecnologia da empresa com segurança.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container">
        <div class="grade grade-3">
          ${SERVICOS.map(s => servicoHTML(s, true)).join('\n          ')}
        </div>
        <p class="legenda" style="margin-top:20px">Certificações e relatórios de auditoria são emitidos por organismos e auditores independentes; a AXIA prepara a empresa para o processo.</p>
      </div>
    </section>
    <section class="secao secao-alt">
      <div class="container">
        <div class="chamada">
          <div>
            <h2>Não sabe por onde começar?</h2>
            <p>Um diagnóstico inicial mostra onde estão os maiores riscos e o que resolver primeiro.</p>
          </div>
          <a class="botao botao-laranja" href="/contato/?assunto=Diagnóstico de segurança">Pedir um diagnóstico</a>
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
    titulo: 'Sobre a AXIA',
    descricao: 'Conheça a AXIA, consultoria em segurança da informação, tecnologia, privacidade e continuidade de negócios, com CISO e CTO como serviço.',
    jsonld: [t.ld, ORG],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Sobre a AXIA</h1>
        <p>AXIA vem de <em>axía</em>, “valor” em grego, e lembra <em>eixo</em>: a segurança e a tecnologia como eixo que sustenta o valor do negócio.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container dupla">
        <div>
          <span class="sobretitulo">Quem somos</span>
          <h2>Consultoria para empresas que querem crescer com segurança</h2>
          <p>A AXIA oferece consultoria e orientação executiva em <strong>segurança da informação, tecnologia, privacidade e continuidade de negócios</strong>. Nosso modelo de CISO e CTO como serviço coloca liderança experiente ao lado da sua equipe, no ritmo e no orçamento que a empresa precisa.</p>
          <p>Trabalhamos de forma personalizada: entendemos o negócio, priorizamos o que mais reduz risco e ajudamos a empresa a provar segurança para clientes, parceiros e reguladores.</p>
          <a class="botao botao-primario" href="/contato/">Fale conosco</a>
        </div>
        <img src="/assets/img/simbolo.png" alt="Símbolo da AXIA: a letra A em prata cortada por um arco laranja" width="600" height="480" loading="lazy" style="box-shadow:none;max-width:420px;justify-self:center">
      </div>
    </section>
    <section class="secao secao-alt">
      <div class="container">
        <div class="secao-cabeca"><span class="sobretitulo">No que acreditamos</span><h2>Nossos valores</h2></div>
        <div class="grade grade-3">
          <div class="servico"><div class="icone">${icones.escudo}</div><h3>Confiança</h3><p>Lidamos com informações sensíveis com sigilo, ética e transparência em cada recomendação.</p></div>
          <div class="servico"><div class="icone">${icones.grafico}</div><h3>Pragmatismo</h3><p>Segurança proporcional ao risco: o controle certo, no momento certo, pelo custo certo.</p></div>
          <div class="servico"><div class="icone">${icones.pessoas}</div><h3>Parceria</h3><p>Trabalhamos lado a lado com o seu time e deixamos conhecimento na casa.</p></div>
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
    titulo: 'Contato',
    descricao: 'Fale com a AXIA sobre CISO ou CTO como serviço, LGPD, ISO 27001, SOC 2 ou continuidade de negócios. E-mail: contato@axia.net.br.',
    jsonld: [t.ld, { '@context': 'https://schema.org', '@type': 'ContactPage', url: SITE + '/contato/', about: { '@id': SITE + '/#organizacao' } }],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Contato</h1>
        <p>Conte o contexto da sua empresa e o que motivou a busca. Retornamos para marcar uma conversa.</p>
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
              <option>CISO como Serviço</option>
              <option>CTO como Serviço</option>
              <option>Privacidade e LGPD</option>
              <option>ISO 27001 / SOC 2</option>
              <option>Continuidade de negócios</option>
              <option>Diagnóstico de segurança</option>
              <option>Outro assunto</option>
            </select>
          </label>
          <label>Mensagem<textarea name="mensagem" required></textarea></label>
          <button class="botao botao-primario" type="submit">Enviar mensagem</button>
          <small>Ao enviar, o seu programa de e-mail abre com a mensagem pronta. Seus dados são usados apenas para responder ao contato (veja a <a href="/privacidade/">política de privacidade</a>).</small>
        </form>
        <div class="contato-info">
          <div class="item"><div class="icone">${icones.email}</div><div><h3>E-mail</h3><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div></div>
          <div class="item"><div class="icone">${icones.mapa}</div><div><h3>Onde estamos</h3><p>São Paulo – SP<br>Atendimento em todo o Brasil, presencial ou on-line.</p></div></div>
          <div class="item"><div class="icone">${icones.relogio}</div><div><h3>Retorno</h3><p>Respondemos as mensagens em dias úteis.</p></div></div>
        </div>
      </div>
    </section>`
  });
}

// ---------- Recrutamento e seleção ----------
const reais = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const salarioTexto = v => !v.salarioMin ? 'A combinar'
  : v.salarioMax && v.salarioMax !== v.salarioMin ? `${reais(v.salarioMin)} a ${reais(v.salarioMax)}` : reais(v.salarioMin);
const localTexto = v => v.cidade ? `${v.cidade} – ${v.uf} · ${v.modelo}` : v.modelo;
const empresaTexto = v => v.empresa || 'Empresa confidencial';
const listaHTML = itens => itens && itens.length ? `<ul>${itens.map(i => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
const TIPO_CONTRATO = { CLT: 'FULL_TIME', PJ: 'CONTRACTOR', 'Estágio': 'INTERN', 'Temporário': 'TEMPORARY' };
const AVISO_GOLPE = 'A AXIA não cobra taxas de candidatos em nenhuma etapa do processo seletivo. Desconfie de qualquer pedido de pagamento em nosso nome.';

function cartaoVaga(v) {
  return `<article class="cartao vaga">
        <div class="corpo">
          <span class="tag">${esc(v.area)}</span>
          <h3><a href="/recrutamento/${v.slug}/">${esc(v.titulo)}</a></h3>
          <p>${esc(empresaTexto(v))}</p>
          <ul class="vaga-dados">
            <li>${icones.mapa}${esc(localTexto(v))}</li>
            <li>${icones.maleta}${esc(v.contrato)} · ${esc(v.nivel)}</li>
            <li>${icones.grafico}${esc(salarioTexto(v))}</li>
          </ul>
          <span class="meta">Publicada em <time datetime="${v.publicada}">${dataBR(v.publicada)}</time> · ${esc(v.codigo)}</span>
        </div>
      </article>`;
}

// Recrutamento (portal)
{
  const t = trilha([['/', 'Início'], ['/recrutamento/', 'Recrutamento e seleção']]);
  const jsonld = [t.ld];
  if (abertas.length) jsonld.push({
    '@context': 'https://schema.org', '@type': 'ItemList', name: 'Vagas abertas',
    itemListElement: abertas.map((v, i) => ({ '@type': 'ListItem', position: i + 1, url: `${SITE}/recrutamento/${v.slug}/` }))
  });
  const listagem = abertas.length
    ? `<div class="grade grade-3">
      ${abertas.map(cartaoVaga).join('\n      ')}
        </div>`
    : `<div class="vazio">
          <div class="icone">${icones.maleta}</div>
          <h3>Nenhuma vaga aberta no momento</h3>
          <p>Novas oportunidades em segurança da informação e tecnologia são publicadas aqui. Se quiser, envie seu currículo para o nosso banco de talentos.</p>
          <a class="botao botao-contorno" href="mailto:${EMAIL}?subject=${encodeURIComponent('Banco de talentos')}">Enviar currículo</a>
        </div>`;
  paginas['recrutamento/index.html'] = pagina({
    caminho: '/recrutamento/',
    titulo: 'Recrutamento e seleção: vagas em segurança e tecnologia',
    descricao: 'Vagas em segurança da informação e tecnologia selecionadas pela AXIA. Empresas podem enviar o perfil da vaga para revisão, publicação e divulgação.',
    jsonld,
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Recrutamento e seleção</h1>
        <p>Vagas em segurança da informação, tecnologia e conformidade. Empresas enviam o perfil da vaga, a AXIA revisa, publica e divulga para os profissionais certos.</p>
        <div class="acoes" style="margin-top:24px">
          <a class="botao botao-laranja" href="/recrutamento/anunciar-vaga/">Anunciar uma vaga</a>
          <a class="botao botao-contorno" href="#vagas">Ver vagas abertas</a>
        </div>
      </div>
    </section>

    <section class="secao" id="vagas" aria-labelledby="vagas-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Para profissionais</span>
          <h2 id="vagas-titulo">Vagas abertas</h2>
          <p>Para se candidatar, abra a vaga e envie o currículo pelo botão de candidatura, informando o código da vaga.</p>
        </div>
        ${listagem}
        <p class="aviso">${AVISO_GOLPE}</p>
      </div>
    </section>

    <section class="secao faixa" aria-labelledby="empresas-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Para empresas</span>
          <h2 id="empresas-titulo">Anuncie sua vaga com a AXIA</h2>
          <p>Você envia o perfil completo da vaga. Nós cuidamos do restante até os candidatos chegarem.</p>
        </div>
        <div class="grade grade-4">
          <div class="etapa"><span class="num destaque">01</span><h3>Envie o perfil</h3><p>Preencha o formulário com a empresa, a vaga, os requisitos, a remuneração e as etapas do processo.</p></div>
          <div class="etapa"><span class="num destaque">02</span><h3>Revisamos</h3><p>Ajustamos o texto, conferimos requisitos técnicos e certificações e alinhamos dúvidas com você.</p></div>
          <div class="etapa"><span class="num destaque">03</span><h3>Publicamos</h3><p>A vaga ganha uma página própria neste portal, preparada para aparecer nas buscas de vagas do Google.</p></div>
          <div class="etapa"><span class="num destaque">04</span><h3>Divulgamos</h3><p>Compartilhamos com a nossa rede de profissionais e, se combinado, fazemos a triagem dos currículos.</p></div>
        </div>
        <p style="margin-top:32px"><a class="botao botao-laranja" href="/recrutamento/anunciar-vaga/">Enviar o perfil da vaga</a></p>
      </div>
    </section>

    <section class="secao" aria-labelledby="porque-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Por que a AXIA</span>
          <h2 id="porque-titulo">Seleção feita por quem entende da área</h2>
        </div>
        <div class="grade grade-3">
          <div class="servico"><div class="icone">${icones.escudo}</div><h3>Especialistas em segurança e tecnologia</h3><p>Sabemos diferenciar um analista de SOC de um especialista em GRC e o que cada certificação realmente indica.</p></div>
          <div class="servico"><div class="icone">${icones.documento}</div><h3>Vagas claras e atrativas</h3><p>Descrições objetivas, com requisitos realistas e faixa salarial, atraem candidatos mais alinhados.</p></div>
          <div class="servico"><div class="icone">${icones.cadeado}</div><h3>Sigilo quando precisar</h3><p>A vaga pode ser publicada como confidencial, sem revelar o nome da empresa até as etapas finais.</p></div>
        </div>
      </div>
    </section>

    <section class="secao" style="padding-top:0">
      <div class="container">
        <div class="chamada">
          <div>
            <h2>Tem uma vaga para preencher?</h2>
            <p>Envie o perfil completo. Retornamos em dias úteis com a revisão e a proposta de divulgação.</p>
          </div>
          <a class="botao botao-laranja" href="/recrutamento/anunciar-vaga/">Anunciar uma vaga</a>
        </div>
      </div>
    </section>`
  });
}

// Recrutamento: formulário para empresas enviarem o perfil da vaga
{
  const t = trilha([['/', 'Início'], ['/recrutamento/', 'Recrutamento e seleção'], ['/recrutamento/anunciar-vaga/', 'Anunciar uma vaga']]);
  const opcoes = itens => itens.map(o => `<option>${o}</option>`).join('');
  const escolha = itens => '<option value="">Selecione</option>' + opcoes(itens);
  paginas['recrutamento/anunciar-vaga/index.html'] = pagina({
    caminho: '/recrutamento/anunciar-vaga/',
    titulo: 'Anunciar uma vaga',
    descricao: 'Envie o perfil completo da vaga para a AXIA revisar, publicar no portal de recrutamento e divulgar para profissionais de segurança e tecnologia.',
    jsonld: [t.ld],
    conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Anunciar uma vaga</h1>
        <p>Preencha o perfil completo da vaga. A AXIA revisa as informações, entra em contato para alinhar os detalhes e, com a sua aprovação, publica e divulga.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container" style="max-width:880px">
        <form class="formulario form-vaga" id="form-vaga" aria-label="Perfil da vaga">
          <fieldset>
            <legend>1. Empresa</legend>
            <div class="duas">
              <label>Nome da empresa<input name="empresa" required autocomplete="organization"></label>
              <label>CNPJ <small>(opcional)</small><input name="cnpj" inputmode="numeric"></label>
              <label>Site <small>(opcional)</small><input name="site" type="url" placeholder="https://"></label>
              <label>Segmento<input name="segmento" placeholder="Ex.: tecnologia, saúde, varejo"></label>
              <label>Porte
                <select name="porte">${opcoes(['Até 50 funcionários', '51 a 200 funcionários', '201 a 1.000 funcionários', 'Mais de 1.000 funcionários'])}</select>
              </label>
              <label>Divulgar o nome da empresa?
                <select name="divulgacao">${opcoes(['Sim, pode divulgar', 'Não, vaga confidencial'])}</select>
              </label>
            </div>
            <label>Sobre a empresa <small>(o que o candidato deve saber)</small><textarea name="sobre" rows="3"></textarea></label>
          </fieldset>

          <fieldset>
            <legend>2. Responsável pela vaga</legend>
            <div class="duas">
              <label>Nome<input name="responsavel" required autocomplete="name"></label>
              <label>Cargo<input name="cargo_responsavel" autocomplete="organization-title"></label>
              <label>E-mail<input name="email" type="email" required autocomplete="email"></label>
              <label>Telefone ou WhatsApp<input name="telefone" type="tel" autocomplete="tel"></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>3. A vaga</legend>
            <div class="duas">
              <label>Título do cargo<input name="titulo" required placeholder="Ex.: Analista de Segurança da Informação Pleno"></label>
              <label>Área
                <select name="area" required>${escolha(['Segurança da informação', 'Governança, riscos e conformidade (GRC)', 'Privacidade e LGPD', 'Infraestrutura e nuvem', 'Desenvolvimento de software', 'Dados e BI', 'Gestão de tecnologia', 'Suporte e service desk', 'Outra área'])}</select>
              </label>
              <label>Nível
                <select name="nivel" required>${escolha(['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Coordenação ou gerência', 'Diretoria'])}</select>
              </label>
              <label>Quantidade de vagas<input name="quantidade" type="number" min="1" value="1"></label>
              <label>Tipo de contratação
                <select name="contrato" required>${escolha(['CLT', 'PJ', 'Estágio', 'Temporário', 'A definir'])}</select>
              </label>
              <label>Modelo de trabalho
                <select name="modelo" required>${escolha(['Presencial', 'Híbrido', 'Remoto'])}</select>
              </label>
              <label>Cidade e estado<input name="local" placeholder="Ex.: São Paulo – SP"></label>
              <label>Jornada e horário<input name="jornada" placeholder="Ex.: 40 h semanais, 9h às 18h"></label>
              <label>Faixa salarial mensal<input name="salario" placeholder="Ex.: R$ 9.000 a R$ 12.000"></label>
              <label>Publicar a faixa salarial?
                <select name="publicar_salario">${opcoes(['Sim', 'Não, informar só aos candidatos selecionados'])}</select>
              </label>
            </div>
            <label>Benefícios<textarea name="beneficios" rows="3" placeholder="Vale-refeição, plano de saúde, auxílio home office, bônus…"></textarea></label>
          </fieldset>

          <fieldset>
            <legend>4. Descrição</legend>
            <label>Resumo da vaga<textarea name="resumo" rows="3" required placeholder="Em poucas frases: o objetivo do cargo e o contexto do time."></textarea></label>
            <label>Principais responsabilidades<textarea name="responsabilidades" rows="5" required placeholder="Uma por linha"></textarea></label>
            <label>Requisitos obrigatórios<textarea name="requisitos" rows="5" required placeholder="Experiência, conhecimentos técnicos, ferramentas. Um por linha."></textarea></label>
            <label>Diferenciais <small>(opcional)</small><textarea name="diferenciais" rows="3" placeholder="Um por linha"></textarea></label>
            <div class="duas">
              <label>Formação e certificações<input name="formacao" placeholder="Ex.: superior em TI; CISSP, ISO 27001 LA"></label>
              <label>Idiomas<input name="idiomas" placeholder="Ex.: inglês intermediário"></label>
            </div>
          </fieldset>

          <fieldset>
            <legend>5. Processo seletivo</legend>
            <div class="duas">
              <label>Como receber as candidaturas
                <select name="candidaturas">${opcoes(['A AXIA faz a triagem e envia os melhores perfis', 'Encaminhar todos os currículos para a empresa', 'Candidatos se inscrevem no site da empresa'])}</select>
              </label>
              <label>Link de inscrição <small>(se houver)</small><input name="link_inscricao" type="url" placeholder="https://"></label>
              <label>Data desejada para contratação<input name="prazo" type="date"></label>
              <label>Publicar a vaga até<input name="validade" type="date"></label>
            </div>
            <label>Etapas do processo<textarea name="etapas" rows="3" placeholder="Ex.: triagem, entrevista com RH, teste técnico, entrevista com o gestor"></textarea></label>
            <label>Observações <small>(opcional)</small><textarea name="observacoes" rows="3"></textarea></label>
          </fieldset>

          <label class="confirma"><input type="checkbox" name="consentimento" required> <span>Confirmo que posso compartilhar estas informações com a AXIA e que a vaga não traz exigências discriminatórias (como idade, gênero, estado civil ou aparência).</span></label>
          <button class="botao botao-primario" type="submit">Enviar vaga para revisão</button>
          <small>Ao enviar, o seu programa de e-mail abre com o perfil da vaga pronto para ${EMAIL}. Nada é gravado neste site (veja a <a href="/privacidade/">política de privacidade</a>).</small>
        </form>

        <div class="resultado-vaga" id="resultado-vaga" hidden tabindex="-1">
          <h2>Quase lá: confirme o envio no seu e-mail</h2>
          <p>Se o programa de e-mail não abriu, ou se o texto chegou cortado, copie o perfil abaixo e envie para <a href="mailto:${EMAIL}">${EMAIL}</a> com o assunto <strong id="assunto-vaga"></strong>.</p>
          <textarea id="texto-vaga" rows="12" readonly aria-label="Perfil da vaga em texto"></textarea>
          <p><button class="botao botao-primario" type="button" id="copiar-vaga">Copiar o texto</button> <span id="copiado" role="status"></span></p>
        </div>
      </div>
    </section>`
  });
}

// Recrutamento: páginas das vagas abertas
for (const v of abertas) {
  const t = trilha([['/', 'Início'], ['/recrutamento/', 'Recrutamento e seleção'], [`/recrutamento/${v.slug}/`, v.titulo]]);
  const blocos = [
    ['Responsabilidades', v.responsabilidades], ['Requisitos', v.requisitos], ['Diferenciais', v.diferenciais], ['Benefícios', v.beneficios]
  ].filter(([, itens]) => itens && itens.length);
  const descricaoHTML = `<p>${esc(v.resumo)}</p>` + (v.sobreEmpresa ? `<p>${esc(v.sobreEmpresa)}</p>` : '') +
    blocos.map(([h, itens]) => `<h3>${h}</h3>${listaHTML(itens)}`).join('');
  const vaga = {
    '@context': 'https://schema.org', '@type': 'JobPosting',
    title: v.titulo, description: descricaoHTML,
    identifier: { '@type': 'PropertyValue', name: NOME, value: v.codigo },
    datePosted: v.publicada, validThrough: `${v.validade}T23:59:59-03:00`,
    employmentType: TIPO_CONTRATO[v.contrato] || 'OTHER',
    hiringOrganization: v.empresa ? { '@type': 'Organization', name: v.empresa } : { '@type': 'Organization', name: NOME, sameAs: SITE + '/', logo: SITE + '/assets/img/icon-512.png' },
    directApply: false,
    industry: v.area
  };
  if (v.cidade) vaga.jobLocation = { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: v.cidade, addressRegion: v.uf, addressCountry: 'BR' } };
  if (v.modelo === 'Remoto') {
    vaga.jobLocationType = 'TELECOMMUTE';
    vaga.applicantLocationRequirements = { '@type': 'Country', name: 'Brasil' };
  }
  if (v.salarioMin) vaga.baseSalary = {
    '@type': 'MonetaryAmount', currency: 'BRL',
    value: { '@type': 'QuantitativeValue', minValue: v.salarioMin, maxValue: v.salarioMax || v.salarioMin, unitText: 'MONTH' }
  };
  const assunto = encodeURIComponent(`Candidatura ${v.codigo} — ${v.titulo}`);
  paginas[`recrutamento/${v.slug}/index.html`] = pagina({
    caminho: `/recrutamento/${v.slug}/`,
    titulo: `Vaga: ${v.titulo}`,
    descricao: `${v.titulo} · ${localTexto(v)} · ${v.contrato}. ${v.resumo}`.slice(0, 160),
    jsonld: [t.ld, vaga],
    conteudo: `
    <article class="artigo">
      ${t.html}
      <span class="tag">${esc(v.area)}</span>
      <h1 style="margin-top:12px">${esc(v.titulo)}</h1>
      <p class="meta">${esc(empresaTexto(v))} · Publicada em <time datetime="${v.publicada}">${dataBR(v.publicada)}</time></p>
      <dl class="ficha">
        <div><dt>Código</dt><dd>${esc(v.codigo)}</dd></div>
        <div><dt>Local</dt><dd>${esc(localTexto(v))}</dd></div>
        <div><dt>Contratação</dt><dd>${esc(v.contrato)}</dd></div>
        <div><dt>Nível</dt><dd>${esc(v.nivel)}</dd></div>
        <div><dt>Salário</dt><dd>${esc(salarioTexto(v))}</dd></div>
        <div><dt>Inscrições até</dt><dd>${dataBR(v.validade)}</dd></div>
      </dl>
      <h2>Sobre a vaga</h2>
      <p>${esc(v.resumo)}</p>
      ${v.sobreEmpresa ? `<h2>Sobre a empresa</h2>\n      <p>${esc(v.sobreEmpresa)}</p>` : ''}
      ${blocos.map(([h, itens]) => `<h2>${h}</h2>\n      ${listaHTML(itens)}`).join('\n      ')}
      <div class="chamada" style="margin-top:40px;padding:32px">
        <div><h2 style="font-size:1.4rem">Quer se candidatar?</h2><p>Envie o currículo em PDF com o código <strong>${esc(v.codigo)}</strong> no assunto.</p></div>
        <a class="botao botao-laranja" href="mailto:${EMAIL}?subject=${assunto}">Candidatar-se</a>
      </div>
      <p class="aviso">${AVISO_GOLPE}</p>
      <p><a href="/recrutamento/">← Ver todas as vagas</a></p>
    </article>`
  });
}

// Blog (listagem)
{
  const t = trilha([['/', 'Início'], ['/blog/', 'Blog']]);
  const temas = [...new Set(ordenadas.map(m => m.tema))];
  paginas['blog/index.html'] = pagina({
    caminho: '/blog/',
    titulo: 'Blog: segurança da informação, LGPD e tecnologia',
    descricao: 'Guias práticos sobre CISO como serviço, LGPD, ISO 27001, SOC 2, ransomware, continuidade de negócios e liderança de tecnologia.',
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
        <p>Conteúdo prático sobre segurança da informação, privacidade, conformidade e gestão de tecnologia.</p>
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

// Matérias
for (const m of ordenadas) {
  const t = trilha([['/', 'Início'], ['/blog/', 'Blog'], [`/blog/${m.slug}/`, m.titulo]]);
  const relacionadas = [...ordenadas.filter(x => x !== m && x.tema === m.tema), ...ordenadas.filter(x => x !== m && x.tema !== m.tema)].slice(0, 3);
  paginas[`blog/${m.slug}/index.html`] = pagina({
    caminho: `/blog/${m.slug}/`,
    titulo: m.titulo,
    descricao: m.descricao,
    tipo: 'article',
    jsonld: [t.ld, {
      '@context': 'https://schema.org', '@type': 'BlogPosting',
      headline: m.titulo, description: m.descricao, inLanguage: 'pt-BR',
      image: `${SITE}/assets/img/og.jpg`,
      datePublished: m.data, dateModified: m.data,
      mainEntityOfPage: `${SITE}/blog/${m.slug}/`,
      author: { '@type': 'Organization', name: NOME, url: SITE + '/' },
      publisher: { '@id': SITE + '/#organizacao' },
      articleSection: m.tema
    }],
    conteudo: `
    <article class="artigo">
      ${t.html}
      <span class="tag">${esc(m.tema)}</span>
      <h1 style="margin-top:12px">${esc(m.titulo)}</h1>
      <p class="meta">Publicado em <time datetime="${m.data}">${dataBR(m.data)}</time> · por ${NOME}</p>
      ${placa(m, ' capa')}
      ${m.corpo.trim()}
      <div class="chamada" style="margin-top:40px;padding:32px">
        <div><h2 style="font-size:1.4rem">Precisa de ajuda com segurança ou tecnologia?</h2><p>Converse com a AXIA sobre CISO e CTO como serviço, LGPD e conformidade.</p></div>
        <a class="botao botao-laranja" href="/contato/">Fale conosco</a>
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
    descricao: 'Como a AXIA trata os dados pessoais enviados pelo site, em conformidade com a Lei Geral de Proteção de Dados (LGPD).',
    jsonld: [t.ld],
    conteudo: `
    <article class="artigo">
      ${t.html}
      <h1>Política de privacidade</h1>
      <p class="meta">Atualizada em ${dataBR(HOJE)}</p>
      <p>Esta política explica como a AXIA trata os dados pessoais de quem visita o site axia.net.br, de acordo com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
      <h2>Quais dados coletamos</h2>
      <p>O site não usa cookies de rastreamento nem ferramentas de publicidade. O formulário de contato não grava dados em servidor: ele apenas abre o seu programa de e-mail com a mensagem pronta. Recebemos somente o que você decidir enviar por e-mail (nome, e-mail, empresa e mensagem).</p>
      <h2>Para que usamos</h2>
      <p>Usamos os dados apenas para responder ao seu contato e, se houver contratação, para prestar os serviços combinados.</p>
      <h2>Recrutamento e seleção</h2>
      <p>O formulário de anúncio de vagas também só abre o seu programa de e-mail; recebemos o perfil da vaga e os dados do responsável apenas para revisar, publicar e divulgar a vaga combinada. Currículos enviados por candidatos são usados no processo seletivo da vaga indicada e compartilhados somente com a empresa contratante dessa vaga. Quem enviar currículo ao banco de talentos pode pedir a exclusão a qualquer momento.</p>
      <h2>Compartilhamento</h2>
      <p>Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing. Eles podem ser compartilhados apenas quando necessário para o serviço ou por obrigação legal.</p>
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
          <a class="botao botao-contorno" href="/servicos/">Serviços</a>
          <a class="botao botao-contorno" href="/blog/">Blog</a>
        </p>
      </div>
    </section>`
});

// Redirecionamentos dos endereços do site antigo da UOL
function redirecionar(destino) {
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Redirecionando…</title><link rel="canonical" href="${SITE}${destino}"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0; url=${destino}"></head><body><p><a href="${destino}">Clique aqui se não for redirecionado.</a></p></body></html>\n`;
}
paginas['privacy/index.html'] = redirecionar('/privacidade/');
paginas['legal-notice/index.html'] = redirecionar('/privacidade/');
paginas['blog-single-page-layout/index.html'] = redirecionar('/blog/');

// ---------- Gravação ----------
// Remove as páginas de vagas encerradas
const dirVagas = path.join(RAIZ, 'recrutamento');
if (fs.existsSync(dirVagas)) {
  for (const d of fs.readdirSync(dirVagas, { withFileTypes: true })) {
    if (d.isDirectory() && !paginas[`recrutamento/${d.name}/index.html`]) fs.rmSync(path.join(dirVagas, d.name), { recursive: true });
  }
}
for (const [arq, html] of Object.entries(paginas)) {
  const destino = path.join(RAIZ, arq);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}

const urls = [
  ['/', '1.0'], ['/servicos/', '0.9'], ['/blog/', '0.8'], ['/sobre/', '0.6'], ['/contato/', '0.6'], ['/privacidade/', '0.2'],
  ['/recrutamento/', '0.8'], ['/recrutamento/anunciar-vaga/', '0.6'],
  ...abertas.map(v => [`/recrutamento/${v.slug}/`, '0.7', v.publicada]),
  ...ordenadas.map(m => [`/blog/${m.slug}/`, '0.7', m.data])
];
fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, p, d]) => `  <url><loc>${SITE}${u}</loc><lastmod>${d || HOJE}</lastmod><priority>${p}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(RAIZ, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /gerador/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(RAIZ, 'site.webmanifest'), JSON.stringify({
  name: NOME, short_name: NOME, start_url: '/', display: 'standalone', background_color: '#111318', theme_color: '#111318',
  icons: [{ src: '/assets/img/favicon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },{ src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 2) + '\n');

console.log(`${Object.keys(paginas).length} páginas geradas (css v=${V_CSS}, js v=${V_JS}).`);
