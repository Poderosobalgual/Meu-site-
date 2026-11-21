// Limite simples por IP, em memória: 5 envios a cada 10 minutos.
// Em produção com muito tráfego, troque por Upstash Redis (@upstash/ratelimit),
// porque cada instância serverless tem a própria memória.
const janelas = new Map<string, number[]>();
const LIMITE = 5;
const JANELA_MS = 10 * 60 * 1000;

export function rateLimit(chave: string): { ok: boolean; restante: number } {
  const agora = Date.now();
  const lista = (janelas.get(chave) ?? []).filter((t) => agora - t < JANELA_MS);
  if (lista.length >= LIMITE) {
    janelas.set(chave, lista);
    return { ok: false, restante: 0 };
  }
  lista.push(agora);
  janelas.set(chave, lista);
  if (janelas.size > 5000) janelas.clear();
  return { ok: true, restante: LIMITE - lista.length };
}
