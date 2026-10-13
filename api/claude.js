// Funzione serverless (Vercel) che fa da ponte tra l'app e l'API di Claude.
// La chiave API resta sul server: non finisce mai nel telefono.
const MODELS = { quick: 'claude-haiku-5-5', default: 'claude-sonnet-5-5', complex: 'claude-opus-5-5' };

function buildMessages(messages, images) {
  const out = [];
  (Array.isArray(messages) ? messages : []).forEach((m) => {
    const role = m && m.role === 'assistant' ? 'assistant' : 'user';
    const text = String((m && m.content) || '').slice(0, 200000);
    if (!text) return;
    const last = out[out.length - 1];
    if (last && last.role === role) last.content += '\n\n' + text; // l'API vuole turni alternati
    else out.push({ role, content: text });
  });
  if (!out.length || out[0].role !== 'user') return null;
  if (out[out.length - 1].role !== 'user') return null;
  const imgs = (Array.isArray(images) ? images : []).slice(0, 3).filter((i) => i && i.data);
  if (imgs.length) {
    const last = out[out.length - 1];
    last.content = imgs
      .map((i) => ({ type: 'image', source: { type: 'base64', media_type: i.media_type || 'image/jpeg', data: i.data } }))
      .concat([{ type: 'text', text: last.content }]);
  }
  return out;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'method' });
  const pass = process.env.APP_PASSCODE;
  if (!pass || req.headers['x-passcode'] !== pass) return res.status(401).json({ error: 'unauthorized' });
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'missing_key' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = null; } }
  if (!body) return res.status(400).json({ error: 'bad_request' });
  const messages = buildMessages(body.messages, body.images);
  if (!messages) return res.status(400).json({ error: 'bad_messages' });
  const model = MODELS[body.tier] || MODELS.default;
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'x-api-key': process.env.ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' },
      body: JSON.stringify({ model, max_tokens: 4096, messages }),
    });
    if (r.status === 429) return res.status(429).json({ error: 'rate_limited' });
    if (!r.ok) return res.status(502).json({ error: 'upstream', status: r.status });
    const j = await r.json();
    const text = (j.content || []).filter((c) => c.type === 'text').map((c) => c.text).join('');
    if (!text.trim()) return res.status(502).json({ error: 'empty' });
    return res.status(200).json({ text, truncated: j.stop_reason === 'max_tokens' });
  } catch (e) {
    return res.status(502).json({ error: 'network' });
  }
};
module.exports.buildMessages = buildMessages;
