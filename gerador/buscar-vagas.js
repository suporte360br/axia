// Busca no Supabase as vagas aprovadas (só os dados públicos) e grava em gerador/vagas-publicas.json.
// O gerar.js chama este arquivo antes de montar o site; a GitHub Action roda tudo a cada 30 minutos.
// Sem conexão, mantém o arquivo anterior para o site não perder as vagas publicadas.
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const DESTINO = path.join(__dirname, 'vagas-publicas.json');

// Lê a URL e a chave pública do mesmo config.js usado pelo navegador
const config = fs.readFileSync(path.join(RAIZ, 'assets/js/config.js'), 'utf8');
const url = (config.match(/supabaseUrl:\s*'([^']*)'/) || [])[1];
const chave = (config.match(/supabaseAnonKey:\s*'([^']*)'/) || [])[1];

(async () => {
  if (!url || !chave) { console.log('vagas: config.js sem Supabase, nada a buscar'); return; }
  try {
    const r = await fetch(`${url}/rest/v1/rpc/vagas_publicas`, {
      method: 'POST',
      headers: { apikey: chave, 'Content-Type': 'application/json' },
      body: '{}',
      signal: AbortSignal.timeout(20000),
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
    const vagas = await r.json();
    if (!Array.isArray(vagas)) throw new Error('resposta inesperada');
    fs.writeFileSync(DESTINO, JSON.stringify(vagas, null, 2) + '\n');
    console.log(`vagas: ${vagas.length} publicada(s)`);
  } catch (e) {
    console.error(`vagas: não foi possível buscar (${e.message}); mantendo o arquivo anterior`);
    process.exitCode = 2;
  }
})();
