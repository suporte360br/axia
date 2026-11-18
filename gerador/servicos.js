// Oferta da AXIA: recrutamento e seleção, alocação de profissionais e squads especializados.
// Depois de editar, rode: node gerador/gerar.js
//
// servicos: uma página por serviço em /servicos/<slug>/. Campos: icone (nome em icones do gerar.js), nome, titulo
// (aba do navegador e Google), descricao (até ~155 caracteres), chamada (frase sob o H1), cartao (texto e itens do
// cartão na home), intro (HTML), paraQuem, entregasTitulo, entregas [titulo, texto], extras (blocos opcionais:
// { id, sobretitulo, titulo, texto, itens: [[titulo, texto]], tabela: { colunas, linhas } }), etapas, formatos,
// faq [pergunta, resposta], materias (slugs do blog) e cta [texto do botão, link].

exports.servicos = [
  {
    slug: 'recrutamento-e-selecao',
    icone: 'pessoas',
    nome: 'Recrutamento e Seleção',
    titulo: 'Recrutamento e seleção especializados em tecnologia, segurança e dados',
    descricao: 'Recrutamento e seleção especializados: hunting, avaliação técnica e comportamental e shortlist qualificada de profissionais de tecnologia, segurança e dados.',
    chamada: 'Encontramos os profissionais certos para os desafios do seu negócio.',
    cartao: {
      texto: 'Busca, avaliação e seleção de profissionais especializados, com avaliação técnica e comportamental e shortlist qualificada.',
      itens: ['Hunting e busca ativa', 'Seleção técnica e comportamental', 'Recrutamento executivo e confidencial'],
    },
    intro: `<p>A AXIA conecta empresas a profissionais qualificados por meio de um processo de recrutamento e seleção especializado, que combina conhecimento técnico, avaliação de competências e alinhamento cultural.</p>
<p>Mais do que divulgar vagas, conduzimos a contratação de ponta a ponta: entendemos a posição, buscamos ativamente quem tem o perfil, inclusive profissionais que não estão procurando emprego, avaliamos o conhecimento técnico e o comportamento e apresentamos uma shortlist enxuta, com parecer objetivo sobre cada candidato. O resultado é menos tempo em entrevistas improdutivas, mais precisão na escolha e menor risco de uma contratação inadequada.</p>`,
    paraQuem: [
      'A vaga é técnica e o RH tem dificuldade de avaliar se o candidato realmente sabe o que diz saber.',
      'A posição está aberta há meses e os anúncios não atraem os perfis certos.',
      'A empresa precisa contratar uma liderança, como gestor, coordenador, CISO ou CTO.',
      'A contratação é estratégica e precisa ser feita com sigilo.',
      'O time interno não tem tempo para triar dezenas de currículos e conduzir entrevistas.',
    ],
    entregasTitulo: 'O que o recrutamento AXIA inclui',
    entregas: [
      ['Recrutamento especializado', 'Identificação e atração de talentos em Tecnologia, Segurança da Informação, Privacidade, Dados e Gestão.'],
      ['Hunting e busca ativa', 'Abordagem direta de profissionais, inclusive daqueles que não estão buscando novas oportunidades.'],
      ['Seleção técnica', 'Avaliação de conhecimentos, experiência prática, certificações e competências específicas da posição.'],
      ['Avaliação comportamental', 'Análise de comunicação, colaboração, liderança e compatibilidade com a cultura da empresa.'],
      ['Shortlist qualificada', 'Apresentação de poucos candidatos, já avaliados, com pareceres objetivos para apoiar a decisão.'],
      ['Recrutamento executivo', 'Busca de gestores, coordenadores, especialistas e lideranças como CISOs e CTOs.'],
      ['Processos confidenciais', 'Recrutamento para posições estratégicas, com preservação de informações sensíveis.'],
      ['Acompanhamento da contratação', 'Apoio durante as entrevistas finais, a escolha e a integração do profissional.'],
    ],
    etapas: [
      ['Entendimento da posição', 'Alinhamos responsabilidades, requisitos, faixa salarial, modelo de trabalho e cultura do time.'],
      ['Busca e atração', 'Divulgação qualificada e busca ativa nas redes profissionais e na nossa base de talentos.'],
      ['Avaliação', 'Entrevistas técnicas e comportamentais, validação de experiências e certificações.'],
      ['Shortlist e decisão', 'Apresentamos os finalistas com parecer e apoiamos a escolha e a integração.'],
    ],
    formatos: 'Recrutamento por posição, recrutamento de várias posições para um mesmo time ou busca executiva confidencial. A condição comercial é definida na proposta, conforme a complexidade da posição.',
    faq: [
      ['Qual a diferença entre anunciar uma vaga e contratar o recrutamento da AXIA?', 'Ao anunciar no portal, a vaga é revisada e divulgada para a nossa rede. No recrutamento e seleção, a AXIA conduz o processo inteiro: busca ativa, entrevistas técnicas e comportamentais e uma shortlist de candidatos avaliados.'],
      ['Vocês fazem recrutamento para quais áreas?', 'Nosso foco é Tecnologia, Segurança da Informação, Privacidade, Dados, Projetos e Gestão de TI, onde a avaliação técnica faz diferença. Para outras áreas, fale com a gente.'],
      ['Como funciona o recrutamento confidencial?', 'A posição é divulgada sem o nome da empresa, e os detalhes só são compartilhados com os candidatos finalistas, mediante compromisso de sigilo.'],
      ['Quanto tempo leva um processo seletivo?', 'Depende da senioridade e da raridade do perfil. Combinamos um cronograma realista no início do processo e informamos o andamento em cada etapa.'],
    ],
    materias: ['como-contratar-profissionais-de-seguranca-da-informacao', 'descritivo-de-vaga-de-ti', 'como-contratar-ciso-ou-cto'],
    cta: ['Encontrar talentos', '/empresas/#profissional'],
  },
  {
    slug: 'alocacao-de-profissionais',
    icone: 'maleta',
    nome: 'Alocação de Profissionais',
    titulo: 'Alocação de profissionais especializados e staff augmentation em TI',
    descricao: 'Alocação de profissionais de tecnologia, segurança e dados: dedicada, parcial, por projeto, staff augmentation e executivos sob demanda.',
    chamada: 'O talento que sua empresa precisa, pelo tempo que precisar.',
    cartao: {
      texto: 'Profissionais especializados integrados à sua operação, com flexibilidade para ampliar, reduzir ou substituir.',
      itens: ['Alocação dedicada ou parcial', 'Staff augmentation', 'Executivos sob demanda'],
    },
    intro: `<p>A AXIA disponibiliza profissionais especializados para integrar as operações dos clientes, com conhecimento técnico, flexibilidade e capacidade de adaptação às necessidades de cada projeto.</p>
<p>Em vez de abrir um processo de contratação para cada necessidade, a empresa conta com profissionais selecionados e acompanhados pela AXIA, no modelo e pelo período que fizerem sentido. Quando a demanda muda, a equipe pode ser ampliada, reduzida ou ter profissionais substituídos, sem que o cliente precise aumentar o próprio quadro.</p>`,
    paraQuem: [
      'Um projeto vai começar e falta gente com a especialidade necessária.',
      'A demanda é temporária ou sazonal e não justifica uma contratação definitiva.',
      'A equipe interna está sobrecarregada e precisa de reforço rápido.',
      'A empresa precisa de uma liderança experiente, como CISO, CTO ou gerente de projetos, por um período.',
      'É preciso cobrir uma ausência, como licença ou saída de um profissional-chave.',
    ],
    entregasTitulo: 'Modelos de alocação',
    entregas: [
      ['Alocação dedicada', 'Profissional com dedicação integral à operação do cliente, atuando conforme o escopo e os níveis de serviço contratados.'],
      ['Alocação parcial', 'Especialistas disponíveis por horas, dias ou períodos previamente definidos, conforme a necessidade.'],
      ['Alocação por projeto', 'Profissionais contratados para iniciativas com objetivos, entregas e prazos definidos.'],
      ['Staff augmentation', 'Ampliação da equipe interna com profissionais especializados, sem necessidade de aumentar o quadro próprio.'],
      ['Executivos sob demanda', 'Alocação de lideranças experientes, como CISO, CTO, gerentes de projetos e especialistas estratégicos.'],
    ],
    extras: [
      {
        id: 'diferenciais-alocacao',
        sobretitulo: 'Por que alocar com a AXIA',
        titulo: 'Flexibilidade com acompanhamento',
        itens: [
          ['Acompanhamento da performance', 'Pontos de controle periódicos com o cliente e com o profissional sobre entregas e adaptação.'],
          ['Ampliação ou redução da equipe', 'A quantidade de profissionais acompanha a demanda do projeto.'],
          ['Substituição de profissionais', 'Se o encaixe não for o esperado, conduzimos a substituição conforme o combinado em contrato.'],
          ['Gestão de continuidade', 'Planejamento de férias, ausências e transição de conhecimento para a operação não parar.'],
          ['Alinhamento às políticas do cliente', 'Os profissionais seguem as normas de segurança, acesso e conduta da empresa contratante.'],
        ],
      },
      {
        id: 'responsabilidades',
        sobretitulo: 'Transparência',
        titulo: 'Quem cuida do quê',
        texto: 'As responsabilidades são definidas em contrato antes do início. Esta é a divisão mais comum, que pode ser ajustada caso a caso:',
        tabela: {
          colunas: ['Tema', 'AXIA', 'Cliente'],
          linhas: [
            ['Seleção e vínculo do profissional', 'Seleciona, contrata e responde pelo vínculo', 'Aprova o profissional indicado'],
            ['Gestão técnica das atividades', 'Acompanha o desempenho e a adaptação', 'Define prioridades e o escopo das entregas'],
            ['Equipamentos', 'Conforme combinado em contrato', 'Conforme combinado em contrato'],
            ['Acessos a sistemas', 'Orienta o profissional sobre as regras', 'Concede, revisa e revoga os acessos'],
            ['Confidencialidade', 'Termo de sigilo assinado pelo profissional', 'Informa as políticas e dados sensíveis'],
          ],
        },
      },
    ],
    etapas: [
      ['Necessidade', 'Entendemos o perfil, o escopo, o modelo de alocação e o prazo de início.'],
      ['Seleção', 'Indicamos profissionais avaliados técnica e comportamentalmente para aprovação do cliente.'],
      ['Mobilização', 'Onboarding, acessos, alinhamento de políticas e início das atividades.'],
      ['Acompanhamento', 'Gestão da alocação, indicadores, ajustes de equipe e continuidade.'],
    ],
    formatos: 'Contratos por período, por projeto ou por horas, com possibilidade de ampliação, redução e substituição de profissionais conforme as condições combinadas.',
    faq: [
      ['Qual a diferença entre alocação e contratar diretamente?', 'Na alocação, o profissional é selecionado, contratado e acompanhado pela AXIA e presta serviço para o cliente pelo período combinado. É indicado para demandas temporárias, projetos ou quando a empresa não quer aumentar o quadro próprio.'],
      ['O que é staff augmentation?', 'É o reforço da equipe interna com profissionais especializados de um parceiro, que trabalham junto com o time do cliente nas prioridades definidas por ele.'],
      ['E se o profissional não se adaptar?', 'Acompanhamos a adaptação desde o início e, se o encaixe não for o esperado, conduzimos a substituição conforme as condições do contrato.'],
      ['Vocês alocam lideranças, como CISO e CTO?', 'Sim. A alocação de executivos sob demanda permite contar com uma liderança experiente por um período ou em regime parcial.'],
    ],
    materias: ['alocacao-de-profissionais-ou-contratacao-direta', 'como-contratar-ciso-ou-cto', 'squad-dedicado-como-montar'],
    cta: ['Solicitar profissionais', '/empresas/#profissional'],
  },
  {
    slug: 'squads-especializados',
    icone: 'grafico',
    nome: 'Squads Especializados',
    titulo: 'Squads especializados: equipes de tecnologia, segurança e dados sob medida',
    descricao: 'Squads de segurança da informação, desenvolvimento, dados e projetos: equipes multidisciplinares, escaláveis e orientadas a resultados.',
    chamada: 'Equipes completas, integradas e prontas para transformar desafios em resultados.',
    cartao: {
      texto: 'Equipes multidisciplinares, escaláveis e orientadas a resultados, organizadas em torno dos seus objetivos.',
      itens: ['Squads gerenciados ou dedicados', 'Segurança, desenvolvimento, dados e projetos', 'Governança e indicadores'],
    },
    intro: `<p>Em vez de contratar profissionais isoladamente, a empresa pode contar com uma equipe multidisciplinar organizada em torno de objetivos, projetos e entregas específicas.</p>
<p>A AXIA monta squads com a combinação certa de perfis e de senioridade, cuida do onboarding e da governança e acompanha os indicadores de entrega. O squad pode trabalhar de forma autônoma, sob gestão da AXIA, ou integrado à equipe interna do cliente.</p>`,
    paraQuem: [
      'A empresa tem um projeto com prazo e precisa de uma equipe completa, não de uma pessoa.',
      'Montar um time do zero levaria meses de recrutamento.',
      'O produto digital precisa evoluir mais rápido do que a equipe atual consegue.',
      'A operação de segurança ou de dados precisa de várias especialidades ao mesmo tempo.',
    ],
    entregasTitulo: 'Tipos de squad',
    entregas: [
      ['Squad de Segurança da Informação', 'Especialistas em SOC, GRC, IAM, gestão de vulnerabilidades, resposta a incidentes e engenharia de segurança.'],
      ['Squad de Desenvolvimento e Tecnologia', 'Desenvolvedores, arquitetos, DevOps, QA, analistas de sistemas e líderes técnicos.'],
      ['Squad de Dados e Inteligência Artificial', 'Engenheiros de dados, analistas de BI, cientistas de dados e especialistas em IA.'],
      ['Squad de Projetos e Transformação', 'Gerentes de projetos, Scrum Masters, Product Owners, analistas de negócios e especialistas em processos.'],
    ],
    extras: [
      {
        id: 'modelos',
        sobretitulo: 'Modelos de entrega',
        titulo: 'Escolha como o squad vai trabalhar',
        tabela: {
          colunas: ['Modelo', 'Como funciona'],
          linhas: [
            ['Squad gerenciado', 'A AXIA assume a gestão da equipe e das entregas contratadas.'],
            ['Squad dedicado', 'Equipe exclusiva para as necessidades do cliente.'],
            ['Squad híbrido', 'Profissionais da AXIA trabalhando com a equipe interna do cliente.'],
            ['Squad por projeto', 'Equipe estruturada para uma iniciativa com prazo e escopo definidos.'],
            ['Squad sob demanda', 'Equipe ajustável conforme prioridades e volume de trabalho.'],
          ],
        },
      },
    ],
    etapas: [
      ['Objetivos', 'Definimos com o cliente o que o squad precisa entregar, em que prazo e com quais indicadores.'],
      ['Composição', 'Montamos a equipe com os perfis, a senioridade e a quantidade adequados.'],
      ['Onboarding e governança', 'Integração ao ambiente do cliente, rituais, papéis e canais de reporte.'],
      ['Indicadores e evolução', 'Acompanhamento das entregas e ajuste da composição conforme o andamento.'],
    ],
    formatos: 'Squads por projeto, com prazo e escopo definidos, ou contínuos, com composição ajustável ao longo do tempo.',
    faq: [
      ['O que é um squad?', 'É uma equipe pequena e multidisciplinar, com os perfis necessários para entregar um objetivo de ponta a ponta, sem depender de várias áreas separadas.'],
      ['Quem gerencia o squad?', 'Depende do modelo. No squad gerenciado, a AXIA assume a gestão da equipe e das entregas; nos modelos dedicado e híbrido, a gestão do dia a dia é compartilhada com o cliente.'],
      ['Dá para mudar a composição do squad depois?', 'Sim. A composição pode ser ajustada conforme as prioridades e o volume de trabalho, nas condições combinadas em contrato.'],
      ['Como acompanho os resultados?', 'Cada squad tem indicadores combinados no início, como entregas, prazos e qualidade, e reportes periódicos.'],
    ],
    materias: ['squad-dedicado-como-montar', 'alocacao-de-profissionais-ou-contratacao-direta', 'como-contratar-profissionais-de-seguranca-da-informacao'],
    cta: ['Montar meu squad', '/empresas/#squad'],
  },
];

// Áreas de especialização (página /areas-de-especializacao/ e home)
exports.areas = [
  ['escudo', 'Segurança da Informação', 'Analistas de SOC, especialistas em GRC, IAM, gestão de vulnerabilidades, resposta a incidentes, engenharia de segurança e lideranças como CISO.'],
  ['chip', 'Desenvolvimento e Tecnologia', 'Desenvolvedores back-end, front-end e mobile, arquitetos de software, QA, analistas de sistemas e líderes técnicos.'],
  ['ciclo', 'Infraestrutura, Cloud e DevOps', 'Engenheiros de cloud, DevOps e SRE, administradores de sistemas, redes e bancos de dados.'],
  ['grafico', 'Dados e Inteligência Artificial', 'Engenheiros e analistas de dados, analistas de BI, cientistas de dados e especialistas em IA.'],
  ['documento', 'Projetos e Transformação', 'Gerentes de projetos, PMOs, Scrum Masters, Product Owners, analistas de negócios e de processos.'],
  ['cadeado', 'Privacidade e GRC', 'Encarregados (DPO), analistas de privacidade, auditores e especialistas em riscos e conformidade.'],
];

// Diferenciais (compromissos, sem números que ainda não podem ser comprovados)
exports.diferenciais = [
  ['Especialização técnica', 'Seleção conduzida com conhecimento real das funções e tecnologias.'],
  ['Agilidade', 'Processos objetivos para reduzir o tempo de contratação e de mobilização.'],
  ['Precisão na seleção', 'Avaliação das competências técnicas e comportamentais exigidas.'],
  ['Flexibilidade', 'Modelos ajustáveis à demanda, ao prazo e ao orçamento.'],
  ['Acompanhamento', 'Gestão de desempenho, indicadores e evolução das entregas.'],
  ['Parceria estratégica', 'Relacionamento próximo e alinhamento aos objetivos do negócio.'],
];

// Por que contratar a AXIA
exports.porQue = [
  ['Conhecimento de quem entende de tecnologia', 'Compreendemos as competências, os desafios e as exigências das posições que buscamos.'],
  ['Foco na qualidade das contratações', 'Valorizamos a experiência, as habilidades técnicas, o perfil comportamental e a aderência às necessidades do cliente.'],
  ['Agilidade e eficiência', 'Processos estruturados para simplificar a contratação e acelerar a composição de equipes.'],
  ['Flexibilidade para crescer', 'Alternativas de recrutamento, alocação individual e squads, conforme a necessidade.'],
  ['Redução da complexidade operacional', 'Apoiamos a busca, a seleção, a mobilização e o acompanhamento dos profissionais.'],
  ['Relacionamento de longo prazo', 'Buscamos compreender o negócio e construir soluções alinhadas aos objetivos de cada organização.'],
];

// Perguntas frequentes comerciais (home)
exports.faqComercial = [
  ['Qual a diferença entre recrutamento, alocação e squad?', 'No recrutamento e seleção, a AXIA encontra e avalia o profissional, que é contratado diretamente pela sua empresa. Na alocação, o profissional é contratado pela AXIA e presta serviço para você pelo período combinado. No squad, a AXIA fornece uma equipe completa, organizada em torno de um objetivo.'],
  ['Em quais áreas a AXIA atua?', 'Tecnologia, Segurança da Informação, Infraestrutura e Cloud, Dados e IA, Projetos e Privacidade/GRC, áreas em que a avaliação técnica faz diferença na qualidade da contratação.'],
  ['Quanto custa?', 'Depende do serviço, da senioridade e do prazo. Depois de entender a necessidade, enviamos uma proposta com o modelo e as condições comerciais.'],
  ['Como começar?', 'Envie a solicitação de profissional ou de squad pela página Para Empresas, ou agende uma conversa. Retornamos em dias úteis para entender a necessidade.'],
];
