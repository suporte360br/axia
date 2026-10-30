// Páginas do recrutamento e seleção: portal público (/recrutamento/) e área de gestão (/gestao/).
// O conteúdo das vagas vem do Supabase pelo navegador (assets/js/recrutamento.js e gestao.js);
// aqui ficam só as páginas e o formulário no padrão AXIA de descritivo de vaga.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const RAIZ = path.join(__dirname, '..');
const hash = f => crypto.createHash('md5').update(fs.readFileSync(path.join(RAIZ, f))).digest('hex').slice(0, 8);

// Opções do padrão AXIA (as mesmas listas valem para o formulário e para a revisão)
const PORTES = ['Até 50 funcionários', '51 a 200 funcionários', '201 a 1.000 funcionários', 'Mais de 1.000 funcionários'];
const AREAS = ['Segurança da informação', 'Governança, riscos e conformidade (GRC)', 'Privacidade e LGPD', 'Infraestrutura e nuvem', 'Desenvolvimento de software', 'Dados e BI', 'Gestão de tecnologia', 'Suporte e service desk', 'Outra área'];
const NIVEIS = ['Estágio', 'Júnior', 'Pleno', 'Sênior', 'Especialista', 'Coordenação ou gerência', 'Diretoria'];
const CONTRATOS = ['CLT', 'PJ', 'Estágio', 'Temporário', 'Freelancer'];
const MODELOS = ['Presencial', 'Híbrido', 'Remoto'];
const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
const VIAGENS = ['Não', 'Eventuais', 'Frequentes'];
const AFIRMATIVA = ['Não', 'Pessoas com deficiência (PcD)', 'Mulheres', 'Pessoas negras', 'Pessoas 50+', 'Pessoas LGBTQIA+'];
const NIVEL_SKILL = ['Básico', 'Intermediário', 'Avançado', 'Especialista'];
const SOFT_SKILLS = ['Comunicação clara', 'Trabalho em equipe', 'Resolução de problemas', 'Pensamento analítico', 'Organização', 'Proatividade', 'Aprendizado contínuo', 'Gestão do tempo', 'Negociação', 'Liderança', 'Ética e confidencialidade', 'Atenção aos detalhes', 'Calma sob pressão', 'Visão de negócio', 'Adaptabilidade'];
const ESCOLARIDADE = ['Ensino médio', 'Ensino técnico', 'Superior em andamento', 'Superior completo', 'Pós-graduação', 'Mestrado ou doutorado'];
const NIVEL_IDIOMA = ['Básico', 'Intermediário', 'Avançado', 'Fluente'];
const CANDIDATURAS = [['triagem_axia', 'A AXIA faz a triagem e envia os melhores perfis'], ['todos', 'Encaminhar todos os currículos para a empresa'], ['site_empresa', 'Candidatos se inscrevem no site da empresa']];

// Padrão AXIA de descritivo de vaga: mostrado às empresas e conferido no envio e na aprovação
const PADRAO = [
  ['Identificação', 'Título do cargo sem gênero, área, nível e quantidade de vagas.'],
  ['Tipo de trabalho', 'Contratação (CLT, PJ…), modelo (presencial, híbrido ou remoto), local, jornada e viagens.'],
  ['Remuneração', 'Faixa salarial mensal (obrigatória para a análise; a publicação é opcional) e benefícios.'],
  ['Missão e responsabilidades', 'Resumo do objetivo do cargo e pelo menos 3 responsabilidades.'],
  ['Hard skills', 'Pelo menos 3 conhecimentos técnicos, cada um com nível exigido e se é obrigatório ou desejável.'],
  ['Soft skills', 'De 2 a 6 competências comportamentais que fazem diferença no cargo.'],
  ['Experiência', 'Tempo mínimo de experiência e as experiências indispensáveis.'],
  ['Formação, certificações e idiomas', 'Escolaridade mínima, certificações (obrigatórias ou desejáveis) e idiomas com nível.'],
  ['Conhecimentos desejáveis', 'Diferenciais que contam pontos, mas não eliminam candidatos.'],
  ['Processo seletivo', 'Etapas, forma de candidatura, prazo para contratação e até quando publicar.'],
];

const AVISO_GOLPE = 'A AXIA não cobra taxas de candidatos em nenhuma etapa do processo seletivo. Desconfie de qualquer pedido de pagamento em nosso nome.';

module.exports = ({ pagina, trilha, esc, icones, SITE, NOME, EMAIL }) => {
  const p = {};
  const SCRIPTS = `<script src="/assets/js/config.js?v=${hash('assets/js/config.js')}"></script>
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/dist/umd/supabase.js"></script>
  <script src="/assets/js/recrutamento.js?v=${hash('assets/js/recrutamento.js')}" defer></script>
  `;
  const SCRIPTS_GESTAO = SCRIPTS + `<script src="/assets/js/gestao.js?v=${hash('assets/js/gestao.js')}" defer></script>
  `;

  const op = (itens, vazio) => (vazio ? '<option value="">Selecione</option>' : '') +
    itens.map(o => Array.isArray(o) ? `<option value="${esc(o[0])}">${esc(o[1])}</option>` : `<option>${esc(o)}</option>`).join('');
  const campo = (rotulo, controle, dica = '') => `<label>${rotulo}${dica ? ` <small>${dica}</small>` : ''}${controle}</label>`;
  const opcional = '(opcional)';

  // Lista de linhas repetidas (hard skills, certificações, idiomas)
  const linhas = (nome, minimo, botao, campos) => `<div class="linhas" data-linhas="${nome}" data-minimo="${minimo}">
              <div class="linhas-itens"></div>
              <button type="button" class="botao-linha" data-adicionar>+ ${botao}</button>
              <template><div class="linha">${campos}<button type="button" class="remover" data-remover aria-label="Remover linha">×</button></div></template>
            </div>`;
  const obrigatoria = (rotulo) => `<select data-campo="obrigatorio" data-tipo="bool" aria-label="${rotulo}"><option value="true">Obrigatória</option><option value="false">Desejável</option></select>`;

  // Formulário no padrão AXIA. Na gestão, sem os dados de contato e sem o aceite (já vêm do envio).
  function formVaga({ gestao = false } = {}) {
    const n = (i, t) => `<legend><span class="num-secao">${i}</span>${t}</legend>`;
    let i = 0;
    return `<form class="formulario form-vaga" id="form-vaga"${gestao ? ' novalidate' : ''} aria-label="Descritivo da vaga">
          <fieldset>
            ${n(++i, 'Empresa')}
            <div class="duas">
              ${campo('Nome da empresa', '<input name="empresa.nome" required maxlength="150" autocomplete="organization">')}
              ${campo('CNPJ', '<input name="empresa.cnpj" inputmode="numeric" maxlength="20">', opcional)}
              ${campo('Site', '<input name="empresa.site" type="url" maxlength="200" placeholder="https://">', opcional)}
              ${campo('Segmento', '<input name="empresa.segmento" maxlength="80" placeholder="Ex.: banco digital, saúde, varejo">')}
              ${campo('Porte', `<select name="empresa.porte">${op(PORTES, true)}</select>`)}
              ${campo('Divulgar o nome da empresa?', '<select name="empresa.confidencial" data-tipo="bool"><option value="false">Sim, pode divulgar</option><option value="true">Não, vaga confidencial</option></select>')}
            </div>
            ${campo('Sobre a empresa', '<textarea name="empresa.sobre" rows="3" maxlength="1500" placeholder="O que o candidato precisa saber sobre a empresa e o time."></textarea>')}
          </fieldset>
${gestao ? '' : `
          <fieldset>
            ${n(++i, 'Responsável pela vaga')}
            <p class="dica-secao">Usamos estes dados só para falar com você sobre a vaga. Eles não aparecem no anúncio.</p>
            <div class="duas">
              ${campo('Nome', '<input name="contato.nome" required maxlength="120" autocomplete="name">')}
              ${campo('Cargo', '<input name="contato.cargo" maxlength="120" autocomplete="organization-title">')}
              ${campo('E-mail', '<input name="contato.email" type="email" required maxlength="150" autocomplete="email">')}
              ${campo('Telefone ou WhatsApp', '<input name="contato.telefone" type="tel" maxlength="30" autocomplete="tel">')}
            </div>
          </fieldset>
`}
          <fieldset>
            ${n(++i, 'A vaga e o tipo de trabalho')}
            <div class="duas">
              ${campo('Título do cargo', '<input name="vaga.titulo" required maxlength="120" placeholder="Ex.: Analista de Segurança da Informação Pleno">', 'sem gênero')}
              ${campo('Área', `<select name="vaga.area" required>${op(AREAS, true)}</select>`)}
              ${campo('Nível', `<select name="vaga.nivel" required>${op(NIVEIS, true)}</select>`)}
              ${campo('Quantidade de vagas', '<input name="vaga.quantidade" data-tipo="num" type="number" min="1" max="99" value="1">')}
              ${campo('Tipo de contratação', `<select name="vaga.contrato" required>${op(CONTRATOS, true)}</select>`)}
              ${campo('Modelo de trabalho', `<select name="vaga.modelo" required>${op(MODELOS, true)}</select>`)}
              ${campo('Dias presenciais', '<input name="vaga.dias_presenciais" maxlength="60" placeholder="Ex.: 2 dias por semana">', 'se híbrido')}
              ${campo('Cidade', '<input name="vaga.cidade" maxlength="80" placeholder="Ex.: São Paulo">')}
              ${campo('Estado', `<select name="vaga.uf">${op(UFS, true)}</select>`)}
              ${campo('Jornada e horário', '<input name="vaga.jornada" maxlength="120" placeholder="Ex.: 40 h semanais, 9h às 18h">')}
              ${campo('Viagens', `<select name="vaga.viagens">${op(VIAGENS)}</select>`)}
              ${campo('Vaga afirmativa', `<select name="vaga.afirmativa">${op(AFIRMATIVA)}</select>`, opcional)}
            </div>
          </fieldset>

          <fieldset>
            ${n(++i, 'Remuneração e benefícios')}
            <div class="duas">
              ${campo('Salário mensal mínimo (R$)', '<input name="remuneracao.salario_min" data-tipo="num" type="number" min="1" step="1" required placeholder="Ex.: 9000">')}
              ${campo('Salário mensal máximo (R$)', '<input name="remuneracao.salario_max" data-tipo="num" type="number" min="1" step="1" placeholder="Ex.: 12000">')}
              ${campo('Publicar a faixa salarial?', '<select name="remuneracao.publicar_salario" data-tipo="bool"><option value="true">Sim, publicar</option><option value="false">Não, informar só aos selecionados</option></select>')}
            </div>
            ${campo('Benefícios', '<textarea name="remuneracao.beneficios" data-tipo="lista" rows="4" maxlength="2000" placeholder="Um por linha. Ex.:\nVale-refeição\nPlano de saúde\nAuxílio home office"></textarea>', 'um por linha')}
          </fieldset>

          <fieldset>
            ${n(++i, 'Missão e responsabilidades')}
            ${campo('Resumo da vaga', '<textarea name="descricao.resumo" rows="3" required minlength="30" maxlength="1500" placeholder="Em poucas frases: o objetivo do cargo, o time e o contexto."></textarea>')}
            ${campo('Principais responsabilidades', '<textarea name="descricao.responsabilidades" data-tipo="lista" data-minimo="3" rows="5" required maxlength="4000" placeholder="Uma por linha, começando por verbo. Ex.:\nMonitorar e tratar alertas do SIEM\nConduzir a gestão de vulnerabilidades"></textarea>', 'pelo menos 3, uma por linha')}
          </fieldset>

          <fieldset>
            ${n(++i, 'Hard skills')}
            <p class="dica-secao">Conhecimentos técnicos: ferramentas, tecnologias, normas e métodos. Informe pelo menos 3, com o nível exigido.</p>
            ${linhas('requisitos.hard_skills', 3, 'Adicionar hard skill',
              `<input data-campo="nome" maxlength="80" placeholder="Ex.: SIEM (Splunk ou QRadar)" aria-label="Hard skill"><select data-campo="nivel" aria-label="Nível exigido">${op(NIVEL_SKILL)}</select>${obrigatoria('Obrigatória ou desejável')}`)}
          </fieldset>

          <fieldset>
            ${n(++i, 'Soft skills')}
            <p class="dica-secao">Competências comportamentais. Escolha de 2 a 6 que realmente fazem diferença no cargo.</p>
            <div class="chips" data-multi="requisitos.soft_skills">
              ${SOFT_SKILLS.map(s => `<label class="chip"><input type="checkbox" value="${esc(s)}"> ${esc(s)}</label>`).join('\n              ')}
            </div>
            ${campo('Outras soft skills', '<input data-extra="requisitos.soft_skills" maxlength="200" placeholder="Separe por vírgula">', opcional)}
          </fieldset>

          <fieldset>
            ${n(++i, 'Experiência, formação e idiomas')}
            <div class="duas">
              ${campo('Experiência mínima (anos)', '<input name="requisitos.experiencia_anos" data-tipo="num" type="number" min="0" max="40" required placeholder="0 se não exige">')}
              ${campo('Escolaridade mínima', `<select name="requisitos.escolaridade" required>${op(ESCOLARIDADE, true)}</select>`)}
            </div>
            ${campo('Experiências indispensáveis', '<textarea name="requisitos.experiencias" data-tipo="lista" rows="3" maxlength="2000" placeholder="Uma por linha. Ex.:\nAtuação em SOC ou time de resposta a incidentes"></textarea>', 'uma por linha')}
            ${campo('Área de formação', '<input name="requisitos.formacao" maxlength="150" placeholder="Ex.: Ciência da Computação, Sistemas de Informação ou áreas afins">', opcional)}
            <div class="sublinha"><strong>Certificações</strong> <small>(opcional)</small></div>
            ${linhas('requisitos.certificacoes', 0, 'Adicionar certificação',
              `<input data-campo="nome" maxlength="80" placeholder="Ex.: CompTIA Security+" aria-label="Certificação">${obrigatoria('Obrigatória ou desejável')}`)}
            <div class="sublinha"><strong>Idiomas</strong> <small>(opcional)</small></div>
            ${linhas('requisitos.idiomas', 0, 'Adicionar idioma',
              `<input data-campo="idioma" maxlength="40" placeholder="Ex.: Inglês" aria-label="Idioma"><select data-campo="nivel" aria-label="Nível do idioma">${op(NIVEL_IDIOMA)}</select>`)}
          </fieldset>

          <fieldset>
            ${n(++i, 'Conhecimentos desejáveis')}
            ${campo('Diferenciais', '<textarea name="requisitos.desejaveis" data-tipo="lista" rows="3" maxlength="2000" placeholder="Um por linha. Contam pontos, mas não eliminam ninguém."></textarea>', 'um por linha')}
          </fieldset>

          <fieldset>
            ${n(++i, 'Processo seletivo')}
            <div class="duas">
              ${campo('Como receber as candidaturas', `<select name="processo.candidaturas">${op(CANDIDATURAS)}</select>`)}
              ${campo('Link de inscrição', '<input name="processo.link" type="url" maxlength="300" placeholder="https://">', 'se for no site da empresa')}
              ${campo('Data desejada para contratação', '<input name="processo.prazo" type="date">', opcional)}
              ${campo('Publicar a vaga até', '<input name="processo.validade" type="date">', 'se vazio, 60 dias')}
            </div>
            ${campo('Etapas do processo', '<textarea name="processo.etapas" data-tipo="lista" rows="4" required maxlength="1500" placeholder="Uma por linha. Ex.:\nTriagem de currículos\nEntrevista com RH\nTeste técnico\nEntrevista com o gestor"></textarea>', 'uma por linha')}
          </fieldset>
${gestao ? '' : `
          <label class="confirma"><input type="checkbox" name="contato.consentimento" data-tipo="bool-check" required> <span>Confirmo que posso compartilhar estas informações com a AXIA e que a vaga não traz exigências discriminatórias (como idade, gênero, estado civil ou aparência).</span></label>
          <input class="campo-isca" name="site_empresa_confirmacao" tabindex="-1" autocomplete="off" aria-hidden="true">
          <div class="problemas" id="problemas" hidden role="alert"></div>
          <button class="botao botao-primario" type="submit">Enviar vaga para aprovação</button>
          <small>A vaga só é publicada depois da revisão e aprovação da AXIA. Veja como tratamos os dados na <a href="/privacidade/">política de privacidade</a>.</small>`}
        </form>`;
  }

  // ---------- Portal público ----------
  {
    const t = trilha([['/', 'Início'], ['/recrutamento/', 'Recrutamento e seleção']]);
    p['recrutamento/index.html'] = pagina({
      caminho: '/recrutamento/',
      titulo: 'Recrutamento e seleção: vagas em segurança e tecnologia',
      descricao: 'Vagas em segurança da informação e tecnologia selecionadas pela AXIA. Empresas enviam o descritivo da vaga para revisão, aprovação e divulgação.',
      jsonld: [t.ld],
      scripts: SCRIPTS,
      dataPagina: 'vagas',
      conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Recrutamento e seleção</h1>
        <p>Vagas em segurança da informação, tecnologia e conformidade. Empresas enviam o descritivo da vaga, a AXIA revisa, aprova, publica e divulga para os profissionais certos.</p>
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
          <p>Abra a vaga para ver os requisitos completos e se candidatar.</p>
        </div>
        <div id="lista-vagas" aria-live="polite"><p class="carregando">Carregando vagas…</p></div>
        <noscript><p>Para ver as vagas, ative o JavaScript do navegador ou escreva para <a href="mailto:${EMAIL}">${EMAIL}</a>.</p></noscript>
        <template id="sem-vagas">
          <div class="vazio">
            <div class="icone">${icones.maleta}</div>
            <h3>Nenhuma vaga aberta no momento</h3>
            <p>Novas oportunidades em segurança da informação e tecnologia são publicadas aqui. Se quiser, envie seu currículo para o nosso banco de talentos.</p>
            <a class="botao botao-contorno" href="mailto:${EMAIL}?subject=${encodeURIComponent('Banco de talentos')}">Enviar currículo</a>
          </div>
        </template>
        <p class="aviso">${AVISO_GOLPE}</p>
      </div>
    </section>

    <section class="secao faixa" aria-labelledby="empresas-titulo">
      <div class="container">
        <div class="secao-cabeca">
          <span class="sobretitulo">Para empresas</span>
          <h2 id="empresas-titulo">Anuncie sua vaga com a AXIA</h2>
          <p>Você envia o descritivo completo da vaga. Nós cuidamos do restante até os candidatos chegarem.</p>
        </div>
        <div class="grade grade-4">
          <div class="etapa"><span class="num destaque">01</span><h3>Envie o descritivo</h3><p>Preencha o formulário no padrão AXIA: tipo de trabalho, remuneração, hard e soft skills, experiência e processo seletivo.</p></div>
          <div class="etapa"><span class="num destaque">02</span><h3>Revisamos</h3><p>A vaga entra para aprovação. Ajustamos o texto, conferimos requisitos e certificações e alinhamos dúvidas com você.</p></div>
          <div class="etapa"><span class="num destaque">03</span><h3>Publicamos</h3><p>Aprovada, a vaga ganha uma página própria neste portal, preparada para as buscas de vagas do Google.</p></div>
          <div class="etapa"><span class="num destaque">04</span><h3>Divulgamos</h3><p>Compartilhamos com a nossa rede de profissionais e, se combinado, fazemos a triagem dos currículos.</p></div>
        </div>
        <p style="margin-top:32px"><a class="botao botao-laranja" href="/recrutamento/anunciar-vaga/">Enviar o descritivo da vaga</a></p>
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
          <div class="servico"><div class="icone">${icones.documento}</div><h3>Vagas claras e atrativas</h3><p>O padrão AXIA de descritivo deixa claros os requisitos, a faixa salarial e o tipo de trabalho, e atrai candidatos mais alinhados.</p></div>
          <div class="servico"><div class="icone">${icones.cadeado}</div><h3>Sigilo quando precisar</h3><p>A vaga pode ser publicada como confidencial, sem revelar o nome da empresa até as etapas finais.</p></div>
        </div>
      </div>
    </section>`
    });
  }

  // Página de cada vaga aprovada: /recrutamento/vaga/?v=<slug>
  {
    const t = trilha([['/', 'Início'], ['/recrutamento/', 'Recrutamento e seleção'], ['/recrutamento/vaga/', 'Vaga']]);
    p['recrutamento/vaga/index.html'] = pagina({
      caminho: '/recrutamento/vaga/',
      titulo: 'Vaga',
      descricao: 'Vaga em segurança da informação e tecnologia publicada pela AXIA.',
      scripts: SCRIPTS,
      dataPagina: 'vaga',
      conteudo: `
    <article class="artigo vaga-publica">
      ${t.html}
      <div id="vaga" aria-live="polite"><p class="carregando">Carregando a vaga…</p></div>
      <p class="aviso">${AVISO_GOLPE}</p>
      <p><a href="/recrutamento/">← Ver todas as vagas</a></p>
    </article>`
    });
  }

  // Formulário para as empresas
  {
    const t = trilha([['/', 'Início'], ['/recrutamento/', 'Recrutamento e seleção'], ['/recrutamento/anunciar-vaga/', 'Anunciar uma vaga']]);
    p['recrutamento/anunciar-vaga/index.html'] = pagina({
      caminho: '/recrutamento/anunciar-vaga/',
      titulo: 'Anunciar uma vaga',
      descricao: 'Envie o descritivo completo da vaga no padrão AXIA. A vaga entra para aprovação e, depois de revisada, é publicada e divulgada.',
      jsonld: [t.ld],
      scripts: SCRIPTS,
      dataPagina: 'anunciar',
      conteudo: `
    <section class="cabecalho-pagina">
      <div class="container">
        ${t.html}
        <h1>Anunciar uma vaga</h1>
        <p>Preencha o descritivo completo. Ao enviar, a vaga entra para aprovação da AXIA: revisamos, falamos com você se precisar de ajustes e, aprovada, publicamos e divulgamos.</p>
      </div>
    </section>
    <section class="secao">
      <div class="container layout-vaga">
        <aside class="padrao" aria-labelledby="padrao-titulo">
          <h2 id="padrao-titulo">Padrão AXIA de descritivo de vaga</h2>
          <p>Toda vaga publicada no portal precisa ter:</p>
          <ol>
            ${PADRAO.map(([titulo, texto]) => `<li><strong>${titulo}.</strong> ${texto}</li>`).join('\n            ')}
          </ol>
          <p class="legenda">Requisitos discriminatórios (idade, gênero, estado civil, aparência) não são aceitos. Vagas afirmativas são bem-vindas.</p>
        </aside>
        <div>
          ${formVaga()}
          <div class="enviado" id="enviado" hidden tabindex="-1">
            <div class="icone">${icones.check}</div>
            <h2>Vaga enviada para aprovação</h2>
            <p>Código da vaga: <strong id="codigo-vaga"></strong></p>
            <p>A equipe da AXIA vai revisar o descritivo e falar com você pelo e-mail informado. Guarde o código para acompanhar o pedido.</p>
            <p><a class="botao botao-contorno" href="/recrutamento/anunciar-vaga/">Enviar outra vaga</a></p>
          </div>
        </div>
      </div>
    </section>`
    });
  }

  // ---------- Área de gestão (login por código no celular, como a Cultura do cybersec360) ----------
  const gestao = (arq, caminho, titulo, dataPagina, conteudo) => {
    p[arq] = pagina({ caminho, titulo: `${titulo} · Gestão`, descricao: 'Área restrita aos gestores da AXIA.', semIndex: true, gestao: true, scripts: SCRIPTS_GESTAO, dataPagina, conteudo });
  };

  gestao('gestao/index.html', '/gestao/', 'Entrar', 'login', `
    <div class="faixa-demo" id="faixa-demo" hidden>Modo demonstração: nada é gravado no servidor. Celular qualquer e código <strong>123456</strong>.</div>
    <section class="login-wrap">
      <div class="login-card">
        <span class="sobretitulo">Área restrita</span>
        <h1>Gestão de vagas</h1>
        <p>Revisão e aprovação das vagas enviadas pelas empresas. Acesso somente para gestores da AXIA cadastrados.</p>
        <form id="passo-celular" class="formulario login-form">
          <label>Celular cadastrado<input id="celular" type="tel" inputmode="numeric" autocomplete="tel-national" placeholder="(11) 99999-8888" required></label>
          <fieldset class="canal">
            <legend>Receber o código por</legend>
            <label><input type="radio" name="canal" value="whatsapp"> WhatsApp</label>
            <label><input type="radio" name="canal" value="sms" checked> SMS</label>
          </fieldset>
          <button class="botao botao-primario" type="submit">Receber código</button>
        </form>
        <form id="passo-codigo" class="formulario login-form" hidden>
          <p>Enviamos um código de 6 dígitos por <strong id="destino"></strong>.</p>
          <label>Código de acesso<input id="codigo" type="text" inputmode="numeric" autocomplete="one-time-code" pattern="[0-9]{6}" maxlength="6" placeholder="000000" required></label>
          <button class="botao botao-primario" type="submit">Entrar</button>
          <button class="link-botao" type="button" id="voltar-celular">Trocar celular ou reenviar código</button>
        </form>
        <p id="msg" class="msg" hidden role="alert"></p>
      </div>
    </section>`);

  gestao('gestao/painel/index.html', '/gestao/painel/', 'Vagas', 'painel', `
    <div class="faixa-demo" id="faixa-demo" hidden>Modo demonstração: as vagas ficam só neste navegador.</div>
    <section class="secao secao-gestao">
      <div class="container">
        <div class="cabeca-gestao">
          <div><h1>Vagas</h1><p>Vagas enviadas pelas empresas, da mais recente para a mais antiga.</p></div>
          <a class="botao botao-contorno" href="/recrutamento/" target="_blank" rel="noopener">Ver o portal público</a>
        </div>
        <div class="abas" role="tablist" id="abas">
          <button role="tab" data-status="pendente" aria-selected="true">Aguardando aprovação <span></span></button>
          <button role="tab" data-status="em_revisao" aria-selected="false">Em revisão <span></span></button>
          <button role="tab" data-status="aprovada" aria-selected="false">Publicadas <span></span></button>
          <button role="tab" data-status="reprovada" aria-selected="false">Reprovadas <span></span></button>
          <button role="tab" data-status="encerrada" aria-selected="false">Encerradas <span></span></button>
          <button role="tab" data-status="" aria-selected="false">Todas <span></span></button>
        </div>
        <label class="busca">Buscar<input id="busca" type="search" placeholder="Cargo, empresa, código ou e-mail"></label>
        <div id="tabela-vagas" aria-live="polite"><p class="carregando">Carregando…</p></div>
      </div>
    </section>`);

  gestao('gestao/vaga/index.html', '/gestao/vaga/', 'Revisar vaga', 'revisao', `
    <div class="faixa-demo" id="faixa-demo" hidden>Modo demonstração: as vagas ficam só neste navegador.</div>
    <section class="secao secao-gestao">
      <div class="container">
        <p><a href="/gestao/painel/">← Voltar para as vagas</a></p>
        <div id="carregando-vaga"><p class="carregando">Carregando…</p></div>
        <div id="revisao" hidden>
          <div class="cabeca-gestao">
            <div>
              <span class="status" id="status-vaga"></span>
              <h1 id="titulo-vaga"></h1>
              <p id="meta-vaga"></p>
            </div>
            <div class="acoes-revisao">
              <button class="botao botao-contorno" type="button" data-acao="salvar">Salvar revisão</button>
              <button class="botao botao-laranja" type="button" data-acao="aprovada">Aprovar e publicar</button>
              <button class="botao botao-contorno" type="button" data-acao="reprovada">Reprovar</button>
              <button class="botao botao-contorno" type="button" data-acao="encerrada">Encerrar</button>
              <button class="botao botao-contorno" type="button" data-acao="pendente">Voltar para aprovação</button>
            </div>
          </div>
          <p id="msg" class="msg" hidden role="alert"></p>
          <div class="revisao-grade">
            <div>
              <div class="caixa" id="caixa-padrao">
                <h2>Conferência do padrão AXIA</h2>
                <ul class="checklist" id="checklist"></ul>
              </div>
              <h2 class="titulo-form">Descritivo <small>(edite o que for preciso e salve)</small></h2>
              ${formVaga({ gestao: true })}
            </div>
            <aside class="lateral-revisao">
              <div class="caixa">
                <h2>Contato da empresa</h2>
                <dl class="contato" id="contato"></dl>
                <p class="acoes"><a class="botao botao-contorno botao-pequeno" id="email-ajustes" href="#">Pedir ajustes por e-mail</a></p>
              </div>
              <div class="caixa" id="caixa-publica" hidden>
                <h2>Publicação</h2>
                <p>Publicada em <span id="publicada-em"></span>, até <span id="validade-pub"></span>.</p>
                <p><a id="link-publico" href="#" target="_blank" rel="noopener">Abrir a página da vaga</a></p>
              </div>
              <div class="caixa">
                <h2>Motivo / ajustes pedidos</h2>
                <textarea id="motivo" rows="3" maxlength="2000" placeholder="Obrigatório para reprovar. Vai no e-mail para a empresa."></textarea>
              </div>
              <div class="caixa">
                <h2>Notas internas</h2>
                <textarea id="notas" rows="4" maxlength="4000" placeholder="Só os gestores veem."></textarea>
              </div>
              <div class="caixa">
                <h2>Histórico</h2>
                <ol class="historico" id="historico"></ol>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>`);

  gestao('gestao/gestores/index.html', '/gestao/gestores/', 'Gestores', 'gestores', `
    <div class="faixa-demo" id="faixa-demo" hidden>Modo demonstração: os cadastros ficam só neste navegador.</div>
    <section class="secao secao-gestao">
      <div class="container">
        <div class="cabeca-gestao">
          <div><h1>Gestores</h1><p>Quem pode entrar na área de gestão. O acesso é pelo celular cadastrado; desativar corta o acesso na hora.</p></div>
          <button class="botao botao-laranja" type="button" id="novo-gestor">Novo gestor</button>
        </div>
        <p id="msg" class="msg" hidden role="alert"></p>
        <div id="tabela-gestores"><p class="carregando">Carregando…</p></div>
        <dialog id="dialogo-gestor">
          <form class="formulario" id="form-gestor" method="dialog">
            <h2 id="titulo-dialogo">Novo gestor</h2>
            <input type="hidden" name="id">
            <label>Nome completo<input name="nome" required maxlength="120"></label>
            <label>E-mail<input name="email" type="email" required maxlength="150"></label>
            <label>Celular<input name="celular" type="tel" required placeholder="(11) 99999-8888"></label>
            <label>Papel<select name="papel"><option value="gestor">Gestor: revisa e aprova vagas</option><option value="admin">Administrador: também cadastra gestores</option></select></label>
            <label class="confirma"><input type="checkbox" name="ativo" checked> <span>Acesso ativo</span></label>
            <p id="msg-dialogo" class="msg" hidden role="alert"></p>
            <div class="acoes"><button class="botao botao-primario" type="submit" value="salvar">Salvar</button><button class="botao botao-contorno" type="button" id="cancelar-gestor">Cancelar</button></div>
          </form>
        </dialog>
      </div>
    </section>`);

  return p;
};
