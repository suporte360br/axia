// Seções extras das matérias do blog (aprofundamento de 04/11/2026) e referências.
// O gerar.js acrescenta as seções antes do aviso final de cada matéria, inclui os itens no sumário
// e lista as referências. Campos: atualizado (data da revisão), secoes [[id, título do sumário, html]],
// referencias [[nome, url]] e servico (slug da página de serviço relacionada).

const ATUALIZADO = '2026-11-04';

exports.aprofundamento = {
  'o-que-e-ciso-como-servico': {
    atualizado: ATUALIZADO,
    servico: 'ciso-como-servico',
    secoes: [
      ['primeiros-90-dias', 'Os primeiros 90 dias', `
<h2 id="primeiros-90-dias">Como costumam ser os primeiros 90 dias</h2>
<p>Um bom começo de CISO como serviço não começa comprando ferramentas. Ele segue mais ou menos esta ordem:</p>
<ol>
<li><strong>Semanas 1 a 3: entender o negócio.</strong> Entrevistas com sócios, TI, financeiro, comercial e atendimento. Que dados a empresa guarda, quais sistemas não podem parar, que exigências chegam de clientes e reguladores.</li>
<li><strong>Semanas 3 a 6: diagnóstico.</strong> Comparação dos controles existentes com um referencial reconhecido. Os mais usados são a ISO/IEC 27001, o NIST Cybersecurity Framework 2.0 e os CIS Controls. O resultado é um retrato honesto: o que já funciona, o que falta e o que é mais arriscado.</li>
<li><strong>Semanas 6 a 8: plano priorizado.</strong> Um plano de 12 meses que começa pelo que reduz mais risco com menos esforço. Exemplos: autenticação em dois fatores em e-mail e sistemas críticos, backup testado, gestão de acessos de quem saiu da empresa e atualização de sistemas expostos à internet.</li>
<li><strong>Semanas 8 a 12: primeiras entregas.</strong> Política de segurança aprovada pela diretoria, plano de resposta a incidentes e respostas-padrão para os questionários de clientes.</li>
</ol>`],
      ['indicadores', 'Como medir o resultado', `
<h2 id="indicadores">Como medir se o programa está funcionando</h2>
<p>Segurança sem indicador vira discussão de opinião. Alguns indicadores simples, que a diretoria entende, já mostram a evolução:</p>
<ul>
<li><strong>Cobertura de autenticação em dois fatores:</strong> percentual de contas e sistemas críticos com MFA ativo.</li>
<li><strong>Tempo de correção de vulnerabilidades críticas:</strong> quantos dias, em média, entre a descoberta e a correção.</li>
<li><strong>Backups testados:</strong> data do último teste de restauração completo e tempo que ele levou.</li>
<li><strong>Acessos revisados:</strong> percentual de sistemas com revisão periódica de quem tem acesso.</li>
<li><strong>Treinamento e phishing:</strong> participação nos treinamentos e taxa de cliques nas simulações.</li>
<li><strong>Questionários de clientes:</strong> tempo médio para responder e quantos exigiram ressalvas.</li>
</ul>
<p>O papel do CISO é escolher poucos indicadores, medir sempre do mesmo jeito e mostrar a tendência, não um número isolado.</p>`],
      ['erros-comuns', 'Erros comuns', `
<h2 id="erros-comuns">Erros comuns ao contratar</h2>
<ul>
<li><strong>Contratar sem ponto focal interno.</strong> O CISO como serviço lidera, mas precisa de alguém na empresa para executar o dia a dia e abrir portas nas áreas.</li>
<li><strong>Escopo só de documentos.</strong> Políticas sem controles implantados não convencem auditor nem cliente atento.</li>
<li><strong>Confundir CISO com fornecedor de ferramenta.</strong> Se a primeira entrega é uma proposta de software, falta estratégia.</li>
<li><strong>Não envolver a diretoria.</strong> Sem patrocínio da liderança, as prioridades do plano perdem para a urgência do dia.</li>
</ul>`],
    ],
    referencias: [
      ['NIST Cybersecurity Framework 2.0', 'https://www.nist.gov/cyberframework'],
      ['ISO/IEC 27001 (página oficial da ISO)', 'https://www.iso.org/standard/27001'],
      ['CIS Critical Security Controls', 'https://www.cisecurity.org/controls'],
      ['Cartilha de Segurança para Internet (CERT.br)', 'https://cartilha.cert.br/'],
    ],
  },

  'lgpd-checklist-para-pequenas-e-medias-empresas': {
    atualizado: ATUALIZADO,
    servico: 'consultoria-lgpd',
    secoes: [
      ['pequeno-porte', 'Regras para pequeno porte', `
<h2 id="pequeno-porte">O que muda para agentes de pequeno porte</h2>
<p>A ANPD publicou um regulamento específico para microempresas, empresas de pequeno porte, startups e outros agentes de tratamento de pequeno porte (Resolução CD/ANPD nº 2/2022). Ele <strong>não dispensa a empresa da LGPD</strong>, mas simplifica algumas obrigações. Entre elas:</p>
<ul>
<li>A empresa pode deixar de indicar um encarregado (DPO), desde que mantenha um canal de comunicação com os titulares.</li>
<li>O registro das atividades de tratamento pode ser feito de forma simplificada.</li>
<li>Há prazos diferenciados para algumas obrigações, como o atendimento a titulares.</li>
</ul>
<p>Atenção: as regras simplificadas não valem para quem faz tratamento de alto risco. Exemplos são o uso de dados sensíveis em larga escala e o monitoramento sistemático de pessoas. Também não valem para quem passa dos limites de faturamento previstos. Vale conferir o texto do regulamento antes de se enquadrar.</p>`],
      ['incidentes', 'Incidentes com dados', `
<h2 id="incidentes">Incidente com dados pessoais: o que fazer</h2>
<p>Quando um incidente pode causar risco ou dano relevante aos titulares, a empresa precisa comunicar a ANPD e os próprios titulares. Exemplos: vazamento de dados de clientes ou acesso indevido a uma base. Pelo Regulamento de Comunicação de Incidente de Segurança (Resolução CD/ANPD nº 15/2024), o prazo é de <strong>três dias úteis</strong> a partir do conhecimento do incidente, com possibilidade de complementar as informações depois.</p>
<p>Por isso o plano precisa existir antes do incidente:</p>
<ol>
<li>Quem é avisado primeiro e quem decide.</li>
<li>Como conter o problema e preservar evidências.</li>
<li>Como avaliar se há risco relevante aos titulares.</li>
<li>Quem redige e envia a comunicação à ANPD e aos titulares.</li>
<li>Como registrar o incidente, mesmo quando não precisa ser comunicado.</li>
</ol>`],
      ['sancoes', 'Sanções', `
<h2 id="sancoes">Quais são as sanções</h2>
<p>O artigo 52 da LGPD prevê, entre outras sanções, advertência, multa simples de até 2% do faturamento no Brasil (limitada a R$ 50 milhões por infração), publicização da infração, bloqueio e eliminação dos dados. A ANPD já aplica sanções desde 2023.</p>
<p>Na prática, para a maioria das empresas, o impacto maior vem antes da multa: cliente que não fecha contrato, parceiro que exige adequação e reputação abalada depois de um vazamento. A adequação bem feita é, antes de tudo, argumento comercial.</p>`],
    ],
    referencias: [
      ['Lei nº 13.709/2018 (LGPD), no Planalto', 'https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm'],
      ['Autoridade Nacional de Proteção de Dados (ANPD)', 'https://www.gov.br/anpd/pt-br'],
      ['ISO/IEC 27701 (gestão de privacidade)', 'https://www.iso.org/standard/27701'],
    ],
  },

  'iso-27001-ou-soc-2': {
    atualizado: ATUALIZADO,
    servico: 'iso-27001-e-soc-2',
    secoes: [
      ['versao-2022', 'A versão 2022 da ISO 27001', `
<h2 id="versao-2022">O que mudou na ISO/IEC 27001:2022</h2>
<p>A versão atual da norma foi publicada em 2022. O Anexo A foi reorganizado em <strong>93 controles</strong>, divididos em quatro temas: organizacionais, de pessoas, físicos e tecnológicos. Entraram controles novos, como inteligência de ameaças, segurança para uso de serviços em nuvem, prontidão de TIC para continuidade, mascaramento de dados e monitoramento de atividades.</p>
<p>O período de transição dos certificados da versão 2013 terminou em outubro de 2025. Quem for certificar agora já trabalha diretamente com a versão 2022.</p>`],
      ['tipo-1-tipo-2', 'SOC 2 Tipo 1 e Tipo 2', `
<h2 id="tipo-1-tipo-2">SOC 2 Tipo 1 ou Tipo 2?</h2>
<p>O relatório SOC 2 tem dois formatos:</p>
<ul>
<li><strong>Tipo 1:</strong> avalia se os controles foram bem desenhados em uma data específica. É mais rápido e serve como primeiro passo.</li>
<li><strong>Tipo 2:</strong> avalia se os controles funcionaram de forma efetiva ao longo de um período, normalmente de 3 a 12 meses. É o que a maioria dos clientes exigentes pede.</li>
</ul>
<p>O critério de segurança (<em>Security</em>) é obrigatório. Disponibilidade, integridade de processamento, confidencialidade e privacidade entram conforme o serviço e o que os clientes esperam.</p>`],
      ['ciclo', 'Ciclo e manutenção', `
<h2 id="ciclo">Depois da auditoria: o ciclo continua</h2>
<p>Nenhum dos dois é um projeto de uma vez só:</p>
<ul>
<li><strong>ISO 27001:</strong> o certificado vale por três anos, com auditorias de manutenção anuais e uma recertificação no fim do ciclo.</li>
<li><strong>SOC 2 Tipo 2:</strong> o relatório cobre um período passado. Os clientes costumam pedir um novo relatório a cada ano.</li>
</ul>
<p>Por isso, o que dá resultado é transformar os controles em rotina: revisão de acessos, gestão de vulnerabilidades, análise de riscos e treinamento acontecendo o ano todo, com evidências guardadas no caminho.</p>`],
      ['passos', 'Passo a passo', `
<h2 id="passos">Passo a passo resumido para começar</h2>
<ol>
<li>Pergunte aos clientes o que eles aceitam: ISO 27001, SOC 2 ou ambos.</li>
<li>Defina o escopo: produto, unidades, sistemas e processos que entram.</li>
<li>Faça uma análise de lacunas em relação à norma ou aos critérios.</li>
<li>Monte a análise de riscos e o plano de tratamento.</li>
<li>Implante os controles e comece a guardar evidências.</li>
<li>Faça a auditoria interna e a análise crítica pela direção.</li>
<li>Contrate o organismo certificador (ISO) ou a firma de auditoria (SOC 2).</li>
</ol>`],
    ],
    referencias: [
      ['ISO/IEC 27001:2022 (página oficial da ISO)', 'https://www.iso.org/standard/27001'],
      ['SOC 2 — AICPA & CIMA', 'https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2'],
      ['ISO/IEC 27701 (extensão para privacidade)', 'https://www.iso.org/standard/27701'],
    ],
  },

  'plano-de-continuidade-de-negocios': {
    atualizado: ATUALIZADO,
    servico: 'continuidade-de-negocios',
    secoes: [
      ['rto-rpo', 'RTO e RPO na prática', `
<h2 id="rto-rpo">RTO e RPO na prática</h2>
<p>Dois números orientam todo o plano:</p>
<ul>
<li><strong>RTO (tempo objetivo de recuperação):</strong> quanto tempo o processo pode ficar parado antes de o prejuízo ficar inaceitável.</li>
<li><strong>RPO (ponto objetivo de recuperação):</strong> quanto de informação a empresa aceita perder, medido em tempo. Um RPO de 24 horas significa aceitar perder o que foi feito no último dia.</li>
</ul>
<p>Exemplo: se o sistema de pedidos tem RTO de 4 horas e RPO de 1 hora, um backup que roda uma vez por noite e leva 12 horas para restaurar não atende. Ou o processo muda, com cópias mais frequentes e um ambiente de contingência pronto, ou a diretoria aceita, de forma consciente, um risco maior. A BIA serve justamente para tornar essa decisão explícita.</p>`],
      ['testes', 'Tipos de teste', `
<h2 id="testes">Tipos de teste, do mais simples ao mais completo</h2>
<ol>
<li><strong>Revisão do plano:</strong> leitura em grupo para conferir contatos, papéis e passos.</li>
<li><strong>Exercício de mesa:</strong> simulação guiada de um cenário, como ransomware ou queda do fornecedor de nuvem, com a liderança discutindo as decisões.</li>
<li><strong>Teste técnico parcial:</strong> restaurar um sistema crítico a partir do backup e medir o tempo.</li>
<li><strong>Teste completo:</strong> ativar a contingência de verdade, em uma janela planejada.</li>
</ol>
<p>Comece pelos mais simples e aumente a complexidade aos poucos. Todo teste gera uma lista de melhorias, e é ela que mantém o plano útil.</p>`],
      ['erros', 'Erros comuns', `
<h2 id="erros">Erros comuns</h2>
<ul>
<li>Plano de 200 páginas que ninguém consegue usar no meio de uma crise.</li>
<li>Lista de contatos desatualizada, ou guardada só no sistema que parou.</li>
<li>Backup no mesmo ambiente que pode ser criptografado por um ataque.</li>
<li>Esquecer fornecedores críticos e pessoas-chave, não só a tecnologia.</li>
<li>Nunca testar.</li>
</ul>`],
    ],
    referencias: [
      ['ISO 22301:2019 — sistemas de gestão de continuidade de negócios', 'https://www.iso.org/standard/75106.html'],
      ['NIST SP 800-34 Rev. 1 — planejamento de contingência', 'https://csrc.nist.gov/pubs/sp/800/34/r1/upd1/final'],
      ['CISA — #StopRansomware Guide', 'https://www.cisa.gov/stopransomware/ransomware-guide'],
    ],
  },

  'cto-como-servico': {
    atualizado: ATUALIZADO,
    servico: 'cto-como-servico',
    secoes: [
      ['custos-nuvem', 'Custos de nuvem', `
<h2 id="custos-nuvem">Custos de nuvem sob controle</h2>
<p>Uma das primeiras entregas de um CTO como serviço costuma ser entender a conta de nuvem. As causas mais comuns de desperdício são:</p>
<ul>
<li>Servidores e bancos dimensionados acima do necessário.</li>
<li>Ambientes de teste ligados 24 horas por dia.</li>
<li>Armazenamento e backups que só crescem.</li>
<li>Falta de etiquetas (<em>tags</em>) para saber qual produto ou cliente gera cada custo.</li>
</ul>
<p>A prática conhecida como FinOps junta tecnologia, financeiro e negócio para acompanhar esses custos de forma contínua, e não apenas quando a fatura assusta.</p>`],
      ['fornecedores', 'Fornecedores e contratos', `
<h2 id="fornecedores">Fábricas de software e fornecedores</h2>
<p>Muitas empresas terceirizam o desenvolvimento, o que funciona bem quando alguém do lado do cliente sabe pedir e cobrar. Alguns pontos que o CTO como serviço observa:</p>
<ul>
<li><strong>Propriedade do código e dos acessos:</strong> o repositório, a conta de nuvem e os domínios devem estar em nome da empresa, não do fornecedor.</li>
<li><strong>Escopo e critérios de aceite claros:</strong> cada entrega precisa ser verificável.</li>
<li><strong>Segurança no desenvolvimento:</strong> revisão de código, atualização de bibliotecas, proteção de segredos e testes antes de publicar.</li>
<li><strong>Plano de saída:</strong> documentação suficiente para trocar de fornecedor sem recomeçar do zero.</li>
</ul>`],
      ['arquitetura', 'Decisões de arquitetura', `
<h2 id="arquitetura">Decisões de arquitetura que custam caro depois</h2>
<p>Algumas escolhas são difíceis de desfazer, por isso merecem uma análise com calma:</p>
<ul>
<li>O provedor de nuvem e o quanto depender de serviços exclusivos dele.</li>
<li>O modelo de dados e onde ficam os dados pessoais, o que tem impacto direto na LGPD.</li>
<li>A estratégia de identidade e de acesso dos usuários.</li>
<li>A forma de integrar com sistemas de clientes e parceiros.</li>
</ul>
<p>Referenciais públicos, como os <em>frameworks</em> de boas práticas de arquitetura dos grandes provedores de nuvem, ajudam a revisar essas escolhas com critérios de segurança, confiabilidade, desempenho e custo.</p>`],
    ],
    referencias: [
      ['FinOps Foundation — o que é FinOps', 'https://www.finops.org/introduction/what-is-finops/'],
      ['AWS Well-Architected Framework', 'https://aws.amazon.com/architecture/well-architected/'],
      ['OWASP Top 10 (segurança de aplicações web)', 'https://owasp.org/www-project-top-ten/'],
    ],
  },

  'ransomware-controles-essenciais': {
    atualizado: ATUALIZADO,
    servico: 'ciso-como-servico',
    secoes: [
      ['backup-3-2-1', 'Backup que resiste a ataque', `
<h2 id="backup-3-2-1">Backup que resiste a um ataque</h2>
<p>Os grupos de ransomware procuram e apagam os backups antes de criptografar os dados. Por isso, a regra clássica do <strong>3-2-1</strong> ganhou um reforço:</p>
<ul>
<li><strong>3</strong> cópias dos dados;</li>
<li>em <strong>2</strong> tipos de mídia ou serviço diferentes;</li>
<li><strong>1</strong> delas fora do ambiente principal;</li>
<li>e pelo menos uma cópia <strong>imutável ou desconectada</strong>, que nem um administrador com a senha roubada consiga apagar.</li>
</ul>
<p>Além disso, teste a restauração completa de sistemas críticos de tempos em tempos e anote quanto tempo leva. Um backup que nunca foi restaurado é uma hipótese, não uma garantia.</p>`],
      ['durante-ataque', 'Durante um ataque', `
<h2 id="durante-ataque">O que fazer nas primeiras horas de um ataque</h2>
<ol>
<li><strong>Isolar:</strong> desconectar da rede as máquinas afetadas, sem desligá-las, para preservar evidências.</li>
<li><strong>Acionar o plano:</strong> avisar o responsável por incidentes, a diretoria e, se houver, o seguro cibernético e a empresa de resposta a incidentes.</li>
<li><strong>Proteger os backups:</strong> confirmar que as cópias estão íntegras e fora do alcance do atacante.</li>
<li><strong>Trocar credenciais:</strong> principalmente as de administradores, a partir de um equipamento limpo.</li>
<li><strong>Avaliar dados pessoais:</strong> se houve acesso ou vazamento, preparar a comunicação à ANPD e aos titulares, em até três dias úteis.</li>
<li><strong>Registrar tudo:</strong> horários, decisões e evidências, para a investigação, a polícia e as autoridades.</li>
</ol>
<p>Órgãos de referência, como a agência americana CISA, recomendam não pagar o resgate. Pagar não garante a recuperação dos dados e financia novos ataques. A decisão, quando aparece, deve envolver a diretoria, o jurídico e especialistas.</p>`],
      ['prioridades', 'Por onde começar', `
<h2 id="prioridades">Se der para fazer só três coisas este mês</h2>
<ol>
<li>Ativar a autenticação em dois fatores no e-mail, no acesso remoto e nos painéis de administração.</li>
<li>Garantir uma cópia de backup imutável ou desconectada e testar a restauração de um sistema crítico.</li>
<li>Atualizar tudo o que fica exposto à internet, como VPN, firewall, servidores de e-mail e sistemas web, e remover o que não é usado.</li>
</ol>`],
    ],
    referencias: [
      ['CISA — #StopRansomware Guide', 'https://www.cisa.gov/stopransomware/ransomware-guide'],
      ['NIST IR 8374 — Ransomware Risk Management', 'https://csrc.nist.gov/pubs/ir/8374/final'],
      ['Cartilha de Segurança para Internet (CERT.br)', 'https://cartilha.cert.br/'],
      ['CIS Critical Security Controls', 'https://www.cisecurity.org/controls'],
    ],
  },
};
