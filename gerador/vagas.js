// Vagas publicadas no portal de recrutamento (axia.net.br/recrutamento/).
// Para publicar: copie o modelo abaixo para dentro da lista, preencha com os dados
// revisados da vaga e rode: node gerador/gerar.js
// Para encerrar: mude "ativa" para false (ou deixe a validade vencer) e gere de novo;
// a página da vaga sai do ar e da listagem.
//
// Modelo:
// {
//   slug: 'analista-de-seguranca-da-informacao-pleno',  // endereço: /recrutamento/<slug>/
//   codigo: 'AX-001',                // usado no assunto das candidaturas
//   titulo: 'Analista de Segurança da Informação Pleno',
//   empresa: '',                     // nome da empresa; deixe '' para vaga confidencial
//   sobreEmpresa: 'Empresa de tecnologia do setor financeiro, com 200 funcionários.',
//   area: 'Segurança da informação',
//   nivel: 'Pleno',                  // Estágio, Júnior, Pleno, Sênior, Especialista, Gestão
//   contrato: 'CLT',                 // CLT, PJ, Estágio, Temporário
//   modelo: 'Híbrido',               // Presencial, Híbrido ou Remoto
//   cidade: 'São Paulo', uf: 'SP',   // em vaga remota, pode deixar cidade ''
//   salarioMin: 9000, salarioMax: 12000,  // mensal, em reais; use 0 para "a combinar"
//   publicada: '2026-10-29',
//   validade: '2026-12-31',
//   ativa: true,
//   resumo: 'Uma ou duas frases sobre a vaga.',
//   responsabilidades: ['...', '...'],
//   requisitos: ['...', '...'],
//   diferenciais: ['...'],
//   beneficios: ['...'],
// },
const vagas = [
];

module.exports = { vagas };
