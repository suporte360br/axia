// Conteúdo do site AXIA: matérias do blog (foco em recrutamento, alocação e squads).
// Depois de editar, rode: node gerador/gerar.js
// Os cartões e capas usam a placa gráfica da marca (sem foto).
// Campos: slug, titulo, tema, data, descricao, corpo (HTML), servico (slug em servicos.js para a chamada no fim),
// referencias [[nome, url]] (opcional) e atualizado (opcional, data da última revisão).

const AVISO = `<p class="aviso">Este conteúdo é informativo e não substitui a orientação jurídica ou trabalhista para o caso concreto da sua empresa.</p>`;

exports.materias = [
  {
    slug: 'como-contratar-profissionais-de-seguranca-da-informacao',
    titulo: 'Como contratar profissionais de segurança da informação',
    tema: 'Recrutamento',
    data: '2026-11-18',
    servico: 'recrutamento-e-selecao',
    descricao: 'Perfis, certificações e formas de avaliar candidatos em segurança da informação: um guia para não errar na contratação de analistas, especialistas e líderes.',
    referencias: [
      ['NICE Framework (NIST): papéis e competências em cibersegurança', 'https://niccs.cisa.gov/workforce-development/nice-framework'],
      ['ISC2: certificações em segurança da informação', 'https://www.isc2.org/certifications'],
    ],
    corpo: `
<p>Contratar em segurança da informação é difícil por dois motivos. O primeiro é a escassez: há mais vagas do que profissionais experientes. O segundo é que "segurança" reúne funções muito diferentes, e um currículo cheio de siglas não garante que a pessoa saiba fazer o que a sua empresa precisa.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#perfis">Os principais perfis</a></li>
<li><a href="#certificacoes">O peso das certificações</a></li>
<li><a href="#avaliar">Como avaliar na prática</a></li>
<li><a href="#erros">Erros comuns</a></li>
</ol></nav>

<h2 id="perfis">Os principais perfis</h2>
<p>Antes de abrir a vaga, defina qual problema a pessoa vai resolver. Os perfis mais comuns são:</p>
<div class="rolagem"><table class="tabela">
<thead><tr><th>Perfil</th><th>O que faz no dia a dia</th></tr></thead>
<tbody>
<tr><td>Analista de SOC</td><td>Monitora alertas, investiga eventos suspeitos e trata incidentes, normalmente com ferramentas de SIEM.</td></tr>
<tr><td>Especialista em GRC</td><td>Cuida de políticas, análise de riscos, auditorias e frameworks como ISO 27001.</td></tr>
<tr><td>Especialista em IAM</td><td>Gerencia identidades e acessos: contas, perfis, autenticação forte e revisões de acesso.</td></tr>
<tr><td>Analista de vulnerabilidades / pentester</td><td>Encontra falhas em sistemas e aplicações e acompanha a correção.</td></tr>
<tr><td>Engenheiro de segurança</td><td>Implanta e mantém controles técnicos, como firewalls, EDR e segurança em nuvem.</td></tr>
<tr><td>Gestor de segurança / CISO</td><td>Lidera o programa de segurança, define prioridades e responde à diretoria.</td></tr>
</tbody></table></div>
<p>Uma vaga que pede tudo isso em uma pessoa só costuma ficar aberta por meses. Se a empresa precisa de várias dessas competências, vale considerar um time ou um squad.</p>

<h2 id="certificacoes">O peso das certificações</h2>
<p>Certificações mostram que a pessoa estudou um conjunto de conhecimentos e passou numa prova. Algumas, como a CISSP, também exigem anos de experiência comprovada. Elas ajudam a filtrar, mas não substituem a avaliação prática:</p>
<ul>
<li><strong>De entrada:</strong> CompTIA Security+ e certificações introdutórias de fornecedores.</li>
<li><strong>Técnicas:</strong> certificações de nuvem, de ferramentas específicas e de testes de invasão.</li>
<li><strong>De gestão e governança:</strong> CISSP, CISM e auditor líder ISO 27001.</li>
</ul>
<p>Na descrição da vaga, separe as certificações <strong>obrigatórias</strong> (raramente necessárias) das <strong>desejáveis</strong>. Exigir certificação demais afasta bons profissionais que aprenderam na prática.</p>

<h2 id="avaliar">Como avaliar na prática</h2>
<ol>
<li><strong>Entrevista técnica com quem entende do assunto:</strong> perguntas sobre situações reais. Por exemplo: "como você investigaria um login suspeito de madrugada?"</li>
<li><strong>Estudo de caso curto:</strong> um cenário simples, como um alerta, uma política ou uma análise de risco, discutido em conjunto. Prefira casos de até uma hora, sem trabalho gratuito extenso.</li>
<li><strong>Validação de experiência:</strong> conversa sobre projetos anteriores, com detalhes do que a pessoa fez e do que o time fez.</li>
<li><strong>Avaliação comportamental:</strong> segurança exige comunicação com áreas de negócio, calma em incidentes e ética no trato de informações sensíveis.</li>
<li><strong>Referências:</strong> sempre com autorização do candidato.</li>
</ol>

<h2 id="erros">Erros comuns</h2>
<ul>
<li>Copiar a descrição de vaga de outra empresa, sem adaptar à realidade da sua.</li>
<li>Pedir dez anos de experiência para uma vaga de analista pleno.</li>
<li>Não informar a faixa salarial, o que atrai candidatos desalinhados.</li>
<li>Deixar a entrevista técnica só com o RH, sem apoio de alguém da área.</li>
<li>Demorar semanas entre as etapas: bons profissionais recebem outras propostas nesse meio-tempo.</li>
</ul>
${AVISO}`
  },
  {
    slug: 'descritivo-de-vaga-de-ti',
    titulo: 'Descritivo de vaga de TI: o que não pode faltar',
    tema: 'Recrutamento',
    data: '2026-11-18',
    servico: 'recrutamento-e-selecao',
    descricao: 'Um bom descritivo atrai os candidatos certos e afasta os desalinhados. Veja o que incluir em uma vaga de tecnologia: hard skills, soft skills, modelo de trabalho e salário.',
    corpo: `
<p>O descritivo da vaga é o primeiro filtro do processo seletivo. Quando ele é vago, chegam centenas de currículos desalinhados. Quando pede requisitos irreais, ninguém se candidata. Um descritivo claro economiza semanas de triagem e entrevistas.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#estrutura">A estrutura de um bom descritivo</a></li>
<li><a href="#hard-soft">Hard skills e soft skills</a></li>
<li><a href="#salario">Salário e modelo de trabalho</a></li>
<li><a href="#cuidados">Cuidados legais e de linguagem</a></li>
</ol></nav>

<h2 id="estrutura">A estrutura de um bom descritivo</h2>
<p>O padrão que a AXIA usa no <a href="/recrutamento/anunciar-vaga/">portal de vagas</a> organiza o descritivo em blocos:</p>
<ol>
<li><strong>Identificação:</strong> título do cargo sem gênero, área, nível e quantidade de vagas.</li>
<li><strong>Tipo de trabalho:</strong> forma de contratação, modelo (presencial, híbrido ou remoto), local, jornada e viagens.</li>
<li><strong>Remuneração e benefícios:</strong> faixa salarial e benefícios.</li>
<li><strong>Missão e responsabilidades:</strong> para que o cargo existe e o que a pessoa vai fazer, em pelo menos três itens concretos.</li>
<li><strong>Requisitos:</strong> hard skills com o nível exigido, soft skills, experiência, formação, certificações e idiomas.</li>
<li><strong>Conhecimentos desejáveis:</strong> o que conta pontos, mas não elimina.</li>
<li><strong>Processo seletivo:</strong> etapas e prazo.</li>
</ol>

<h2 id="hard-soft">Hard skills e soft skills</h2>
<p><strong>Hard skills</strong> são conhecimentos técnicos: linguagens, ferramentas, normas, métodos. Para cada uma, informe o nível exigido (básico, intermediário, avançado) e se é obrigatória ou desejável. Exemplo: "SIEM (Splunk ou QRadar), nível avançado, obrigatório".</p>
<p><strong>Soft skills</strong> são competências comportamentais. Evite a lista genérica ("proativo, dinâmico, comunicativo") e escolha de duas a seis que realmente fazem diferença no cargo. Para uma posição de resposta a incidentes, por exemplo, "calma sob pressão" e "comunicação clara" importam mais do que "criatividade".</p>
<p>Uma regra útil: se a lista de requisitos obrigatórios tem mais de oito itens, provavelmente há desejáveis disfarçados de obrigatórios.</p>

<h2 id="salario">Salário e modelo de trabalho</h2>
<p>Informar a faixa salarial aumenta a qualidade das candidaturas, porque quem está fora da faixa não se candidata. Se a empresa preferir não publicar, ao menos tenha a faixa definida antes de começar e informe na primeira conversa.</p>
<p>O modelo de trabalho também é decisivo em tecnologia. Seja específico: "híbrido, 2 dias por semana no escritório da Avenida Paulista" é muito melhor do que só "híbrido".</p>

<h2 id="cuidados">Cuidados legais e de linguagem</h2>
<ul>
<li>Não use requisitos discriminatórios, como idade, gênero, estado civil, aparência ou "boa aparência".</li>
<li>Use títulos neutros: "Pessoa Desenvolvedora" ou "Analista (todos os gêneros)".</li>
<li>Vagas afirmativas, como as exclusivas para pessoas com deficiência ou para mulheres em tecnologia, são permitidas e bem-vindas, desde que identificadas como tal.</li>
<li>Cuidado com os dados pessoais dos candidatos: veja a matéria sobre <a href="/blog/lgpd-no-recrutamento-dados-de-candidatos/">LGPD no recrutamento</a>.</li>
</ul>
${AVISO}`
  },
  {
    slug: 'alocacao-de-profissionais-ou-contratacao-direta',
    titulo: 'Alocação de profissionais ou contratação direta: como escolher',
    tema: 'Alocação',
    data: '2026-11-18',
    servico: 'alocacao-de-profissionais',
    descricao: 'Quando vale contratar diretamente e quando faz mais sentido alocar profissionais de um parceiro. Compare prazos, custos, flexibilidade e responsabilidades.',
    referencias: [
      ['Lei nº 6.019/1974, com as alterações da Lei nº 13.429/2017 (Planalto)', 'https://www.planalto.gov.br/ccivil_03/leis/l6019.htm'],
    ],
    corpo: `
<p>Toda empresa que precisa de um profissional de tecnologia enfrenta a mesma pergunta: contratar diretamente ou contar com um profissional alocado por um parceiro? A resposta depende de quanto tempo a necessidade vai durar, da urgência e do quanto a função é central para o negócio.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#comparacao">Comparação lado a lado</a></li>
<li><a href="#quando-alocar">Quando a alocação faz mais sentido</a></li>
<li><a href="#quando-contratar">Quando contratar diretamente</a></li>
<li><a href="#cuidados">Cuidados no contrato</a></li>
</ol></nav>

<h2 id="comparacao">Comparação lado a lado</h2>
<div class="rolagem"><table class="tabela">
<thead><tr><th>Critério</th><th>Contratação direta</th><th>Alocação</th></tr></thead>
<tbody>
<tr><td>Tempo até começar</td><td>Depende do processo seletivo interno</td><td>Costuma ser menor, porque o parceiro já tem processo e base de talentos</td></tr>
<tr><td>Duração</td><td>Indeterminada</td><td>Pelo período, projeto ou horas combinados</td></tr>
<tr><td>Flexibilidade</td><td>Ajustar o time exige novas contratações ou desligamentos</td><td>Equipe pode ser ampliada, reduzida ou substituída conforme o contrato</td></tr>
<tr><td>Vínculo e encargos</td><td>Da empresa</td><td>Do parceiro, que responde pelo vínculo com o profissional</td></tr>
<tr><td>Conhecimento</td><td>Fica na empresa</td><td>Exige plano de documentação e transição</td></tr>
</tbody></table></div>

<h2 id="quando-alocar">Quando a alocação faz mais sentido</h2>
<ul>
<li><strong>Projetos com início e fim:</strong> uma migração para a nuvem, a implantação de um sistema, um projeto de adequação.</li>
<li><strong>Demandas sazonais ou picos:</strong> períodos em que a equipe interna não dá conta.</li>
<li><strong>Especialidades raras:</strong> quando a empresa precisa de um conhecimento específico por alguns meses, sem justificar uma vaga fixa.</li>
<li><strong>Cobertura de ausências:</strong> licenças, saídas inesperadas ou transição entre profissionais.</li>
<li><strong>Lideranças por período:</strong> um CISO, CTO ou gerente de projetos para estruturar uma área antes da contratação definitiva.</li>
</ul>

<h2 id="quando-contratar">Quando contratar diretamente</h2>
<ul>
<li>A função é permanente e central para o negócio.</li>
<li>O conhecimento acumulado pela pessoa é estratégico e precisa ficar na empresa.</li>
<li>A empresa quer formar uma carreira interna para aquela posição.</li>
</ul>
<p>Mesmo nesses casos, um parceiro de recrutamento pode encurtar o processo seletivo e aumentar a precisão da escolha. Muitas empresas combinam os dois modelos: alocam enquanto recrutam a posição definitiva.</p>

<h2 id="cuidados">Cuidados no contrato</h2>
<p>A terceirização de serviços, inclusive da atividade principal da empresa, é permitida no Brasil desde as mudanças trazidas pela Lei 13.429/2017, que alterou a Lei 6.019/1974. Ainda assim, alguns cuidados são essenciais:</p>
<ul>
<li>Deixe claro em contrato o escopo, os níveis de serviço e quem cuida de equipamentos, acessos e confidencialidade.</li>
<li>Prefira parceiros que respondam efetivamente pelo vínculo, pelos encargos e pelo acompanhamento dos profissionais.</li>
<li>Combine regras de substituição, ampliação e redução da equipe.</li>
<li>Peça orientação jurídica para estruturar o contrato no seu caso, especialmente quanto à forma de gestão do dia a dia dos profissionais.</li>
</ul>
${AVISO}`
  },
  {
    slug: 'squad-dedicado-como-montar',
    titulo: 'Squad dedicado: o que é e como montar uma equipe que entrega',
    tema: 'Squads',
    data: '2026-11-18',
    servico: 'squads-especializados',
    descricao: 'O que é um squad, quais perfis compõem uma equipe de tecnologia, segurança ou dados e como garantir governança e resultados com um squad dedicado.',
    corpo: `
<p>"Squad" virou palavra comum em tecnologia, mas nem toda equipe com esse nome funciona como um squad de verdade. Um squad é uma equipe pequena, multidisciplinar e estável, com os perfis necessários para entregar um objetivo de ponta a ponta, sem depender de várias áreas separadas.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#composicao">Exemplos de composição</a></li>
<li><a href="#modelos">Modelos de squad</a></li>
<li><a href="#montar">Como montar, passo a passo</a></li>
<li><a href="#indicadores">Indicadores que importam</a></li>
</ol></nav>

<h2 id="composicao">Exemplos de composição</h2>
<p>A composição depende do objetivo. Alguns exemplos típicos:</p>
<ul>
<li><strong>Produto digital:</strong> um líder técnico, de dois a quatro desenvolvedores, um QA e um Product Owner, com apoio de DevOps.</li>
<li><strong>Segurança da informação:</strong> analistas de SOC, um especialista em vulnerabilidades, um especialista em IAM e um coordenador.</li>
<li><strong>Dados:</strong> engenheiros de dados, um analista de BI e, conforme o caso, um cientista de dados.</li>
<li><strong>Projetos e transformação:</strong> gerente de projetos, analistas de negócios e especialistas em processos.</li>
</ul>
<p>Squads funcionam melhor com até oito ou nove pessoas. Acima disso, a comunicação fica mais lenta e vale dividir em dois.</p>

<h2 id="modelos">Modelos de squad</h2>
<div class="rolagem"><table class="tabela">
<thead><tr><th>Modelo</th><th>Quando usar</th></tr></thead>
<tbody>
<tr><td>Squad gerenciado</td><td>A empresa quer contratar a entrega, e não gerenciar a equipe.</td></tr>
<tr><td>Squad dedicado</td><td>Há demanda contínua e a empresa quer uma equipe exclusiva.</td></tr>
<tr><td>Squad híbrido</td><td>A equipe interna existe, mas precisa de reforço de especialidades.</td></tr>
<tr><td>Squad por projeto</td><td>Há um objetivo com prazo e escopo definidos.</td></tr>
<tr><td>Squad sob demanda</td><td>O volume de trabalho varia e a equipe precisa acompanhar.</td></tr>
</tbody></table></div>

<h2 id="montar">Como montar, passo a passo</h2>
<ol>
<li><strong>Defina o objetivo:</strong> o que o squad precisa entregar e em quanto tempo.</li>
<li><strong>Desenhe a composição:</strong> perfis, senioridade e quantidade, começando enxuto.</li>
<li><strong>Escolha o modelo:</strong> quem gerencia, quem prioriza e como a equipe se integra ao time interno.</li>
<li><strong>Faça o onboarding:</strong> acessos, ferramentas, documentação, rituais e canais de comunicação.</li>
<li><strong>Estabeleça a governança:</strong> quem define prioridades, como as entregas são aceitas e com que frequência há reporte.</li>
<li><strong>Acompanhe e ajuste:</strong> revise a composição quando as prioridades mudarem.</li>
</ol>

<h2 id="indicadores">Indicadores que importam</h2>
<ul>
<li><strong>Entregas concluídas</strong> em relação ao planejado no período.</li>
<li><strong>Prazo:</strong> tempo entre o início de uma demanda e a entrega.</li>
<li><strong>Qualidade:</strong> defeitos ou retrabalho após a entrega.</li>
<li><strong>Satisfação do cliente interno</strong> com o resultado.</li>
<li><strong>Estabilidade da equipe:</strong> trocas frequentes de pessoas costumam derrubar a produtividade.</li>
</ul>
${AVISO}`
  },
  {
    slug: 'como-contratar-ciso-ou-cto',
    titulo: 'Como contratar um CISO ou CTO: recrutamento executivo em tecnologia',
    tema: 'Recrutamento executivo',
    data: '2026-11-18',
    servico: 'recrutamento-e-selecao',
    descricao: 'O que avaliar ao contratar um CISO ou CTO, quando faz sentido um executivo sob demanda e como conduzir um processo seletivo confidencial.',
    corpo: `
<p>Contratar um CISO (diretor de segurança da informação) ou um CTO (diretor de tecnologia) é uma das decisões mais importantes que uma empresa toma em tecnologia. O erro custa caro: projetos atrasados, equipes desmotivadas e riscos que só aparecem depois. E o mercado de executivos experientes é pequeno.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#perfil">Defina o perfil antes de buscar</a></li>
<li><a href="#avaliar">O que avaliar</a></li>
<li><a href="#sob-demanda">Executivo em tempo integral ou sob demanda</a></li>
<li><a href="#confidencial">Processo confidencial</a></li>
</ol></nav>

<h2 id="perfil">Defina o perfil antes de buscar</h2>
<p>"CISO" e "CTO" significam coisas diferentes em empresas diferentes. Antes de começar, responda:</p>
<ul>
<li>A pessoa vai <strong>construir</strong> uma área do zero ou <strong>evoluir</strong> uma área que já existe?</li>
<li>Quantas pessoas vai liderar, diretamente e por meio de fornecedores?</li>
<li>A quem vai responder: CEO, conselho ou outra diretoria?</li>
<li>Quais são as três principais entregas esperadas no primeiro ano?</li>
<li>Há exigências específicas, como regulação do setor financeiro ou de saúde, certificações ou clientes internacionais?</li>
</ul>

<h2 id="avaliar">O que avaliar</h2>
<div class="rolagem"><table class="tabela">
<thead><tr><th>Dimensão</th><th>CISO</th><th>CTO</th></tr></thead>
<tbody>
<tr><td>Técnica</td><td>Gestão de riscos, frameworks (ISO 27001, NIST), resposta a incidentes</td><td>Arquitetura, nuvem, engenharia de software, segurança e custos</td></tr>
<tr><td>Negócio</td><td>Traduzir riscos em decisões para a diretoria</td><td>Alinhar tecnologia à estratégia e ao orçamento</td></tr>
<tr><td>Liderança</td><td>Influenciar áreas que não estão sob seu comando</td><td>Formar e reter times técnicos</td></tr>
<tr><td>Relacionamento</td><td>Clientes, auditores e reguladores</td><td>Fornecedores, parceiros e investidores</td></tr>
</tbody></table></div>
<p>Peça exemplos concretos: um incidente que a pessoa conduziu, uma decisão de arquitetura que precisou reverter, um time que montou. Converse com quem trabalhou com ela, sempre com autorização.</p>

<h2 id="sob-demanda">Executivo em tempo integral ou sob demanda</h2>
<p>Nem toda empresa precisa, ou consegue pagar, um executivo em tempo integral. Um <strong>executivo sob demanda</strong>, alocado por algumas horas por semana ou por um período, pode estruturar a área, contratar o time e preparar a empresa para, mais adiante, ter um executivo próprio. Esse modelo faz sentido especialmente para empresas em crescimento ou em transição.</p>

<h2 id="confidencial">Processo confidencial</h2>
<p>Muitas buscas executivas precisam de sigilo: o executivo atual ainda está no cargo, há uma reestruturação em curso ou o mercado não pode saber da mudança. Nesses casos:</p>
<ul>
<li>A vaga é divulgada sem o nome da empresa, ou nem é divulgada, e a busca é feita por abordagem direta.</li>
<li>Os detalhes só são compartilhados com os finalistas, mediante compromisso de sigilo.</li>
<li>O parceiro de recrutamento faz a ponte entre a empresa e os candidatos.</li>
</ul>
${AVISO}`
  },
  {
    slug: 'lgpd-no-recrutamento-dados-de-candidatos',
    titulo: 'LGPD no recrutamento: cuidados com os dados de candidatos',
    tema: 'Privacidade no RH',
    data: '2026-11-18',
    servico: 'recrutamento-e-selecao',
    descricao: 'Currículos são dados pessoais. Veja como a LGPD se aplica ao recrutamento: o que pedir, por quanto tempo guardar, banco de talentos e direitos dos candidatos.',
    referencias: [
      ['Lei nº 13.709/2018 (LGPD), no Planalto', 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'],
      ['Autoridade Nacional de Proteção de Dados (ANPD)', 'https://www.gov.br/anpd/pt-br'],
    ],
    corpo: `
<p>Todo processo seletivo trata dados pessoais: nome, contato, histórico profissional, às vezes até informações sensíveis. A Lei Geral de Proteção de Dados (LGPD) se aplica a esses dados desde o primeiro currículo recebido, e o cuidado com eles também diz muito sobre a empresa para quem está se candidatando.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#pedir">Peça só o necessário</a></li>
<li><a href="#sensiveis">Dados sensíveis</a></li>
<li><a href="#guardar">Por quanto tempo guardar e banco de talentos</a></li>
<li><a href="#direitos">Direitos dos candidatos</a></li>
<li><a href="#parceiros">Quando há um parceiro de recrutamento</a></li>
</ol></nav>

<h2 id="pedir">Peça só o necessário</h2>
<p>A LGPD tem como princípio a <strong>necessidade</strong>: tratar apenas os dados indispensáveis para a finalidade. No recrutamento, isso significa:</p>
<ul>
<li>Na candidatura, pedir só o que serve para avaliar o perfil: contato, experiência, formação e competências.</li>
<li>Deixar documentos pessoais, como RG, CPF e dados bancários, para a etapa de admissão.</li>
<li>Evitar perguntas sobre estado civil, filhos, religião ou opinião política, que além de desnecessárias podem levar a discriminação.</li>
</ul>

<h2 id="sensiveis">Dados sensíveis</h2>
<p>Dados de saúde, origem racial ou étnica, religião, orientação sexual, filiação sindical e biometria são <strong>dados sensíveis</strong> e têm regras mais rígidas. No recrutamento, eles aparecem principalmente em <strong>vagas afirmativas</strong> e em vagas para pessoas com deficiência. Nesses casos:</p>
<ul>
<li>Explique por que a informação é pedida e como será usada.</li>
<li>Restrinja o acesso a quem realmente precisa.</li>
<li>Não use a informação para nenhuma outra finalidade.</li>
</ul>

<h2 id="guardar">Por quanto tempo guardar e banco de talentos</h2>
<p>A lei não fixa um prazo para guardar currículos, mas exige que os dados sejam eliminados quando a finalidade terminar. Boas práticas:</p>
<ul>
<li>Defina um prazo de retenção para os currículos de cada processo e cumpra esse prazo.</li>
<li>Para manter o currículo em um <strong>banco de talentos</strong>, informe o candidato com clareza, preferencialmente com o consentimento dele, e permita a exclusão a qualquer momento.</li>
<li>Não deixe currículos espalhados em e-mails, planilhas e pastas compartilhadas: centralize e controle o acesso.</li>
</ul>

<h2 id="direitos">Direitos dos candidatos</h2>
<p>O candidato pode pedir acesso aos dados, correção, exclusão e informações sobre com quem eles foram compartilhados. Tenha um canal simples para esses pedidos, como um e-mail informado no aviso de privacidade, e responda dentro do prazo.</p>

<h2 id="parceiros">Quando há um parceiro de recrutamento</h2>
<p>Quando a empresa contrata uma consultoria de recrutamento, os dados dos candidatos passam por mais de uma organização. Combine em contrato:</p>
<ul>
<li>Para que finalidade os dados podem ser usados e com quem podem ser compartilhados.</li>
<li>Medidas de segurança para guardar e transmitir os currículos.</li>
<li>O que acontece com os dados ao fim do processo.</li>
<li>Como serão comunicados incidentes, como vazamentos, que precisam ser avaliados e, quando houver risco relevante, comunicados à ANPD e aos titulares.</li>
</ul>
${AVISO}`
  },
];
