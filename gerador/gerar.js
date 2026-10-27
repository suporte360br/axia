// Gera todas as páginas do site axia.net.br.
// Uso (na pasta axia): node gerador/gerar.js
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { materias } = require('./conteudo');

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
  relogio: svg('<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>')
};

const MENU = [
  ['/', 'Início'],
  ['/servicos/', 'Serviços'],
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
for (const [arq, html] of Object.entries(paginas)) {
  const destino = path.join(RAIZ, arq);
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, html);
}

const urls = [
  ['/', '1.0'], ['/servicos/', '0.9'], ['/blog/', '0.8'], ['/sobre/', '0.6'], ['/contato/', '0.6'], ['/privacidade/', '0.2'],
  ...ordenadas.map(m => [`/blog/${m.slug}/`, '0.7', m.data])
];
fs.writeFileSync(path.join(RAIZ, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls.map(([u, p, d]) => `  <url><loc>${SITE}${u}</loc><lastmod>${d || HOJE}</lastmod><priority>${p}</priority></url>`).join('\n') +
  `\n</urlset>\n`);
fs.writeFileSync(path.join(RAIZ, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /gerador/\n\nSitemap: ${SITE}/sitemap.xml\n`);
fs.writeFileSync(path.join(RAIZ, 'site.webmanifest'), JSON.stringify({
  name: NOME, short_name: NOME, start_url: '/', display: 'standalone', background_color: '#111318', theme_color: '#111318',
  icons: [{ src: '/assets/img/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }, { src: '/assets/img/icon-512.png', sizes: '512x512', type: 'image/png' }]
}, null, 2) + '\n');

console.log(`${Object.keys(paginas).length} páginas geradas (css v=${V_CSS}, js v=${V_JS}).`);
