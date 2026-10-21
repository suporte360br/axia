// Conteúdo do site AXIA: matérias do blog.
// Depois de editar, rode: node gerador/gerar.js
// Os cartões e capas usam a placa gráfica da marca (sem foto).

const AVISO = `<p class="aviso">Este conteúdo é informativo e não substitui a análise do caso concreto da sua empresa. Normas e exigências regulatórias mudam: confira a versão em vigor antes de decidir.</p>`;

exports.materias = [
  {
    slug: 'o-que-e-ciso-como-servico',
    titulo: 'CISO como Serviço: o que é e quando faz sentido',
    tema: 'Gestão de segurança',
    data: '2026-10-21',
    descricao: 'Entenda o que faz um CISO como serviço, quanto da semana ele dedica à empresa e em que momento esse modelo compensa mais do que contratar um executivo.',
    corpo: `
<p>O CISO (<em>Chief Information Security Officer</em>) é o executivo responsável pelo programa de segurança da informação. Em empresas grandes, é um cargo em tempo integral com equipe própria. Na maioria das pequenas e médias empresas, porém, ninguém ocupa esse papel: a segurança fica dividida entre o time de TI, um fornecedor e boa vontade.</p>
<p>O <strong>CISO como Serviço</strong> (ou <em>vCISO</em>, CISO virtual) resolve esse vazio: um profissional experiente assume a liderança da segurança por algumas horas por semana ou por mês, com metas e entregas definidas.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#o-que-faz">O que um CISO como serviço faz</a></li>
<li><a href="#quando">Sinais de que a empresa precisa</a></li>
<li><a href="#comparacao">Comparação com outras opções</a></li>
<li><a href="#como-escolher">Como escolher</a></li>
</ol></nav>

<h2 id="o-que-faz">O que um CISO como serviço faz</h2>
<ul>
<li><strong>Diagnóstico e plano:</strong> avalia a maturidade atual, identifica os maiores riscos e monta um plano priorizado, normalmente de 12 meses.</li>
<li><strong>Governança:</strong> escreve ou revisa políticas, define responsabilidades e cria indicadores para a diretoria.</li>
<li><strong>Relação com clientes e auditores:</strong> responde questionários de segurança, participa de auditorias e conduz projetos de certificação, como ISO 27001 ou SOC 2.</li>
<li><strong>Gestão de fornecedores:</strong> avalia riscos de terceiros e ajuda a escolher ferramentas sem desperdício.</li>
<li><strong>Incidentes:</strong> prepara o plano de resposta e coordena a reação quando algo acontece.</li>
</ul>

<h2 id="quando">Sinais de que a empresa precisa</h2>
<ul>
<li>Clientes grandes começaram a mandar questionários de segurança e ninguém sabe responder.</li>
<li>Um investidor ou parceiro pediu evidências de segurança ou adequação à LGPD.</li>
<li>A empresa sofreu um incidente (ou passou perto) e percebeu que não tinha plano.</li>
<li>O time de TI está sobrecarregado e a segurança fica sempre para depois.</li>
<li>Há gastos com ferramentas de segurança, mas sem clareza do que elas protegem.</li>
</ul>

<h2 id="comparacao">Comparação com outras opções</h2>
<div class="rolagem"><table class="tabela">
<thead><tr><th>Opção</th><th>Vantagens</th><th>Limites</th></tr></thead>
<tbody>
<tr><td>CISO em tempo integral</td><td>Dedicação total, presença diária</td><td>Custo alto e difícil de contratar; costuma compensar só em empresas maiores ou reguladas</td></tr>
<tr><td>CISO como serviço</td><td>Experiência sênior por uma fração do custo; escopo ajustável</td><td>Precisa de um ponto focal interno para executar o dia a dia</td></tr>
<tr><td>Só fornecedores de ferramentas</td><td>Tecnologia pronta</td><td>Sem estratégia nem governança; risco de comprar o que não precisa</td></tr>
</tbody></table></div>

<h2 id="como-escolher">Como escolher</h2>
<p>Peça um plano com entregas mensais visíveis, pergunte como o profissional reporta à diretoria e verifique a experiência com o tipo de exigência que a sua empresa enfrenta (clientes corporativos, setor financeiro, saúde, LGPD). Desconfie de quem começa vendendo ferramenta antes de entender o negócio.</p>
${AVISO}`
  },
  {
    slug: 'lgpd-checklist-para-pequenas-e-medias-empresas',
    titulo: 'LGPD na prática: checklist para pequenas e médias empresas',
    tema: 'Privacidade e LGPD',
    data: '2026-10-21',
    descricao: 'Os passos essenciais para adequar uma pequena ou média empresa à LGPD sem burocracia: mapeamento, bases legais, avisos, contratos, segurança e incidentes.',
    corpo: `
<p>A Lei Geral de Proteção de Dados (Lei 13.709/2018) vale para empresas de todos os tamanhos. Para agentes de pequeno porte, a ANPD simplificou algumas obrigações, mas o núcleo continua o mesmo: saber quais dados pessoais a empresa trata, por quê, e protegê-los.</p>
<p>Este checklist resume o que costuma ter mais impacto, na ordem em que recomendamos atacar.</p>

<nav class="sumario" aria-label="Nesta matéria"><strong>Nesta matéria</strong><ol>
<li><a href="#mapear">Mapear os dados</a></li>
<li><a href="#bases">Definir bases legais</a></li>
<li><a href="#transparencia">Transparência e direitos</a></li>
<li><a href="#terceiros">Contratos com terceiros</a></li>
<li><a href="#seguranca">Segurança e incidentes</a></li>
</ol></nav>

<h2 id="mapear">1. Mapear os dados</h2>
<p>Liste os processos que usam dados pessoais (vendas, RH, atendimento, marketing, financeiro) e, para cada um, registre: quais dados, de quem, para quê, onde ficam, quem acessa e por quanto tempo são guardados. Uma planilha bem feita já resolve na maioria das PMEs.</p>

<h2 id="bases">2. Definir as bases legais</h2>
<p>Cada tratamento precisa de uma base legal: execução de contrato, obrigação legal, legítimo interesse, consentimento, entre outras. Consentimento não é a resposta para tudo; muitas vezes ele é a base mais frágil, porque pode ser revogado a qualquer momento.</p>

<h2 id="transparencia">3. Transparência e direitos dos titulares</h2>
<ul>
<li>Publique um aviso de privacidade claro no site, em linguagem simples.</li>
<li>Crie um canal para o titular pedir acesso, correção ou exclusão (um e-mail dedicado já atende).</li>
<li>Indique o encarregado (DPO) ou o canal de comunicação, conforme o porte da empresa.</li>
</ul>

<h2 id="terceiros">4. Contratos com fornecedores</h2>
<p>Sistemas na nuvem, contabilidade, agência de marketing e folha de pagamento recebem dados pessoais da empresa. Os contratos devem prever confidencialidade, segurança, uso restrito à finalidade e aviso em caso de incidente.</p>

<h2 id="seguranca">5. Segurança e resposta a incidentes</h2>
<ul>
<li>Autenticação em dois fatores no e-mail e nos sistemas principais.</li>
<li>Acesso por função: cada pessoa vê apenas o que precisa.</li>
<li>Backups testados e cópia fora do ambiente principal.</li>
<li>Um roteiro simples de resposta a incidentes, incluindo a avaliação sobre comunicar a ANPD e os titulares quando houver risco relevante.</li>
</ul>

<p>Adequação à LGPD não é um projeto com data para acabar: é uma rotina. Revise o mapeamento sempre que um processo ou sistema novo entrar na empresa.</p>
${AVISO}`
  },
  {
    slug: 'iso-27001-ou-soc-2',
    titulo: 'ISO 27001 ou SOC 2: qual a sua empresa precisa?',
    tema: 'Conformidade',
    data: '2026-10-20',
    descricao: 'As diferenças entre a certificação ISO/IEC 27001 e o relatório SOC 2, quem pede cada um e como decidir por onde começar.',
    corpo: `
<p>Quando uma empresa começa a vender para clientes maiores, cedo ou tarde aparece a pergunta: <em>“vocês têm ISO 27001 ou SOC 2?”</em>. Os dois provam que a empresa leva segurança a sério, mas funcionam de jeitos diferentes.</p>

<h2>ISO/IEC 27001</h2>
<p>É uma norma internacional que define um <strong>Sistema de Gestão de Segurança da Informação (SGSI)</strong>. A empresa define o escopo, avalia riscos, escolhe controles (o Anexo A traz uma lista de referência) e demonstra que o sistema funciona e melhora continuamente. Um organismo certificador acreditado faz a auditoria e emite um certificado válido por três anos, com auditorias de manutenção anuais.</p>

<h2>SOC 2</h2>
<p>É um relatório de auditoria baseado nos critérios de serviços de confiança do AICPA (segurança, disponibilidade, integridade de processamento, confidencialidade e privacidade). Não é um certificado: é a opinião de um auditor independente sobre os controles da empresa. O <strong>Tipo I</strong> avalia o desenho dos controles em uma data; o <strong>Tipo II</strong> avalia se funcionaram ao longo de um período, normalmente de 3 a 12 meses.</p>

<h2>Comparação rápida</h2>
<div class="rolagem"><table class="tabela">
<thead><tr><th></th><th>ISO 27001</th><th>SOC 2</th></tr></thead>
<tbody>
<tr><td>Formato</td><td>Certificado público</td><td>Relatório confidencial, compartilhado sob acordo de sigilo</td></tr>
<tr><td>Mais pedido por</td><td>Clientes na Europa, América Latina e setor público</td><td>Clientes nos Estados Unidos e empresas de tecnologia (SaaS)</td></tr>
<tr><td>Foco</td><td>Sistema de gestão e riscos</td><td>Operação efetiva dos controles no período</td></tr>
<tr><td>Validade</td><td>3 anos, com auditorias anuais</td><td>Relatório renovado a cada ciclo, normalmente anual</td></tr>
</tbody></table></div>

<h2>Como decidir</h2>
<ul>
<li><strong>Olhe para os clientes:</strong> qual dos dois eles pedem nos contratos e questionários?</li>
<li><strong>Olhe para o mercado-alvo:</strong> empresas que vendem para os Estados Unidos tendem ao SOC 2; no Brasil e na Europa, a ISO 27001 é mais reconhecida.</li>
<li><strong>Aproveite a sobreposição:</strong> boa parte dos controles é comum. Quem estrutura bem um, chega ao outro com muito menos esforço.</li>
</ul>
<p>Em qualquer caso, o caminho começa igual: definir escopo, mapear riscos, documentar políticas e gerar evidências de que os controles funcionam no dia a dia.</p>
${AVISO}`
  },
  {
    slug: 'plano-de-continuidade-de-negocios',
    titulo: 'Plano de continuidade de negócios: como montar o seu',
    tema: 'Continuidade',
    data: '2026-10-19',
    descricao: 'Passo a passo para criar um plano de continuidade de negócios: análise de impacto, estratégias de recuperação, papéis, comunicação e testes.',
    corpo: `
<p>Um ataque de ransomware, uma queda do provedor de nuvem, um incêndio ou a saída repentina de uma pessoa-chave: qualquer um desses eventos pode parar a operação. O <strong>plano de continuidade de negócios (PCN)</strong> define como a empresa continua funcionando, mesmo em modo reduzido, até tudo voltar ao normal.</p>

<h2>1. Análise de impacto no negócio (BIA)</h2>
<p>Liste os processos críticos e responda para cada um: quanto tempo a empresa aguenta sem ele (o <strong>RTO</strong>, tempo objetivo de recuperação) e quanto de dado pode perder (o <strong>RPO</strong>, ponto objetivo de recuperação). Faturamento e atendimento ao cliente costumam tolerar horas; uma rotina interna pode tolerar dias.</p>

<h2>2. Estratégias de recuperação</h2>
<ul>
<li><strong>Dados:</strong> backups automáticos, com cópia isolada (offline ou imutável) e restauração testada.</li>
<li><strong>Sistemas:</strong> ambientes alternativos ou procedimentos manuais temporários.</li>
<li><strong>Pessoas:</strong> substitutos definidos e conhecimento documentado.</li>
<li><strong>Fornecedores:</strong> alternativas para os serviços dos quais a operação depende.</li>
</ul>

<h2>3. Papéis e acionamento</h2>
<p>Defina quem declara a crise, quem coordena e quem executa cada tarefa. Deixe os contatos fora dos sistemas que podem cair: uma cópia impressa ou em um canal alternativo evita a situação clássica de o plano estar num servidor que foi criptografado.</p>

<h2>4. Comunicação</h2>
<p>Prepare modelos de mensagem para colaboradores, clientes, fornecedores e, se for o caso, autoridades. Em incidentes com dados pessoais, lembre-se da avaliação de comunicação à ANPD prevista na LGPD.</p>

<h2>5. Testes</h2>
<p>Plano que nunca foi testado é só uma intenção. Faça ao menos um <strong>exercício de mesa</strong> por ano, simulando um cenário realista, e teste a restauração de backups com regularidade. Cada teste revela ajustes que tornam o plano mais confiável.</p>
${AVISO}`
  },
  {
    slug: 'cto-como-servico',
    titulo: 'CTO como Serviço: liderança técnica sob demanda',
    tema: 'Tecnologia',
    data: '2026-10-18',
    descricao: 'O que faz um CTO como serviço, quando contratar esse modelo e como ele ajuda empresas e startups a tomar boas decisões de tecnologia.',
    corpo: `
<p>Muitas empresas dependem de tecnologia, mas não têm alguém com visão técnica e de negócio para decidir arquitetura, contratar fornecedores e organizar o time. O <strong>CTO como Serviço</strong> traz essa liderança em regime parcial, pelo tempo necessário.</p>

<h2>Quando faz sentido</h2>
<ul>
<li><strong>Startups em fase inicial</strong> que ainda não têm um CTO sócio ou precisam de apoio para estruturar o produto.</li>
<li><strong>Empresas tradicionais</strong> em transformação digital, que terceirizam o desenvolvimento e precisam de alguém do seu lado da mesa.</li>
<li><strong>Momentos de transição</strong>, como a saída de um líder técnico, uma migração para a nuvem ou a escolha de um sistema de gestão.</li>
<li><strong>Preparação para investimento</strong>, quando a diligência técnica vai avaliar código, arquitetura e segurança.</li>
</ul>

<h2>O que entrega</h2>
<ul>
<li>Roadmap técnico alinhado às metas do negócio.</li>
<li>Decisões de arquitetura, nuvem e custos, documentadas.</li>
<li>Seleção e gestão de fornecedores e fábricas de software.</li>
<li>Processos de desenvolvimento com segurança desde o início.</li>
<li>Contratação e mentoria de quem vai liderar o time no futuro.</li>
</ul>

<h2>Segurança desde a arquitetura</h2>
<p>Corrigir uma falha de segurança depois que o sistema está em produção custa muito mais do que evitá-la no desenho. Por isso, na AXIA, o trabalho de CTO e de CISO caminha junto: controle de acesso, criptografia, registros de auditoria e backups entram no projeto desde a primeira versão.</p>
${AVISO}`
  },
  {
    slug: 'ransomware-controles-essenciais',
    titulo: 'Ransomware: 10 controles essenciais para proteger sua empresa',
    tema: 'Gestão de segurança',
    data: '2026-10-17',
    descricao: 'Dez controles práticos que reduzem muito o risco e o impacto de um ataque de ransomware, do MFA ao backup imutável e ao plano de resposta.',
    corpo: `
<p>O ransomware sequestra dados e sistemas e cobra resgate para devolvê-los, muitas vezes ameaçando também vazar as informações. Pequenas e médias empresas são alvos frequentes justamente por terem menos defesas. A boa notícia: um conjunto pequeno de controles bloqueia a maior parte dos ataques.</p>

<ol>
<li><strong>Autenticação em dois fatores (MFA)</strong> em e-mail, acesso remoto, VPN e painéis de administração da nuvem.</li>
<li><strong>Backups 3-2-1</strong>: três cópias, em dois tipos de mídia, uma fora do ambiente principal e protegida contra alteração (imutável ou offline).</li>
<li><strong>Teste de restauração</strong> periódico. Backup que nunca foi restaurado é uma aposta.</li>
<li><strong>Atualizações em dia</strong>, com prioridade para sistemas expostos à internet, como VPN, firewall e servidores de e-mail.</li>
<li><strong>Menor privilégio</strong>: ninguém usa conta de administrador no dia a dia; acessos revistos periodicamente.</li>
<li><strong>Proteção de estações</strong> com antivírus moderno (EDR) e monitoramento de alertas.</li>
<li><strong>Acesso remoto seguro</strong>: nada de área de trabalho remota (RDP) aberta direto para a internet.</li>
<li><strong>Filtro de e-mail</strong> e treinamento contínuo contra phishing, a porta de entrada mais comum.</li>
<li><strong>Segmentação de rede</strong> para que uma máquina comprometida não alcance tudo.</li>
<li><strong>Plano de resposta</strong> escrito e ensaiado: quem isola o quê, quem comunica quem e como restaurar.</li>
</ol>

<h2>Por onde começar</h2>
<p>Se a empresa ainda não tem nada disso, comece por MFA e backups isolados: são os dois controles com maior efeito pelo menor esforço. Em seguida, faça um inventário do que está exposto à internet e corrija o que estiver desatualizado.</p>
${AVISO}`
  },
];
