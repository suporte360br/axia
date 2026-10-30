// Configuração do recrutamento (portal de vagas e área de gestão).
// Preencha com os dados do projeto no Supabase (Project Settings > API).
// A chave "publishable" (ou anon) é pública por natureza: a proteção vem das funções e permissões do banco.
// Enquanto estes campos estiverem vazios, tudo funciona em MODO DEMONSTRAÇÃO (dados só no navegador).
window.AXIA_CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',

  // Canais para receber o código de login dos gestores, na ordem de preferência.
  canais: ['sms'],
};
