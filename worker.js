// Joga Audio — Cloudflare Worker (proxy seguro para OpenAI)
// Pega este código en el editor de tu Worker en Cloudflare Dashboard
// Luego agrega la variable de entorno: OPENAI_API_KEY = tu key
//
// v1 (Nico, 5-sep): la version original tenia CORS "*" (cualquier sitio del
// mundo podia llamar este Worker directo, sin pasar por joga-audio) y sin
// ningun tope de tamano de entrada — el mismo tipo de agujero que ya se
// encontro y se cerro en el worker.js de Joga Books. Cerrado aqui el lado
// gratis (origen + tamano); el freno de gasto por dia/mes con KV, como tiene
// Joga Books, es un paso aparte que requiere crear un namespace KV nuevo en
// Cloudflare — decision de Jose, no lo agrego solo.

var ORIGENES_PERMITIDOS = [
  'https://joga4live.github.io'
];

function esOrigenPermitido(origen) {
  if (ORIGENES_PERMITIDOS.indexOf(origen) !== -1) return true;
  return /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origen || '');
}

function cors(origen) {
  var permitido = esOrigenPermitido(origen) ? origen : ORIGENES_PERMITIDOS[0];
  return {
    'Access-Control-Allow-Origin': permitido,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

// v1: topes de entrada — sin esto, un solo mensaje larguisimo o una historia
// con cientos de turnos se manda entero a OpenAI y se cobra completo.
var MAX_MENSAJES = 20;       // turnos de conversacion permitidos por peticion
var MAX_CHARS_MENSAJE = 2000; // caracteres por mensaje individual

const SYSTEM_PROMPT = `Eres el asistente de Joga Audio, una plataforma de audiobooks de crecimiento personal fundada por Joga. Tu misión es ayudar a los visitantes a encontrar el audiobook ideal y resolver sus dudas con calidez y claridad.

AUDIOBOOKS DISPONIBLES (6):
1. Claridad Mental — Técnicas para enfocar la mente y eliminar el ruido mental
2. Tiempo Consciente — Gestión del tiempo y productividad real
3. Hábitos que Transforman — Cómo construir hábitos que duran
4. Tu Propósito — Encontrar tu dirección y vivir con intención
5. Capital Inteligente — Fundamentos de finanzas personales y riqueza
6. El Arte de Vender — Ventas con autenticidad y sin presión

PRECIOS:
- Gratis: Capítulo 1 de cualquier audiobook (sin tarjeta de crédito)
- $19 USD: Un audiobook completo, acceso de por vida
- $79 USD/año: Biblioteca completa (6 libros actuales + todos los futuros), garantía 7 días

REGLAS:
- Responde en español por defecto; en inglés si el usuario escribe en inglés
- Sé conciso (máximo 3-4 oraciones), cálido y motivador
- Si no sabes algo, sugiere que escriban a través del sitio
- Nunca inventes precios ni funciones que no existen
- Guía naturalmente hacia escuchar el capítulo 1 gratis o ver los planes de precios`;
// v1 (Nico, 5-sep): "Domina tu Tiempo", "Propósito de Vida" e "Inteligencia
// Financiera" no son los titulos reales del catalogo (catalog.js): son
// "Tiempo Consciente", "Tu Propósito" y "Capital Inteligente". El bot le
// habria dado a los visitantes 3 de 6 titulos equivocados con toda confianza.

export default {
  async fetch(request, env) {
    var origen = request.headers.get('Origin') || '';

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: cors(origen) });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: cors(origen) });
    }

    if (!esOrigenPermitido(origen)) {
      return new Response(JSON.stringify({ error: 'origen_no_permitido' }), { status: 403, headers: cors(origen) });
    }

    if (!env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: 'missing_api_key' }), { status: 500, headers: cors(origen) });
    }

    let messages;
    try {
      const body = await request.json();
      messages = Array.isArray(body.messages) ? body.messages : [];
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: cors(origen) });
    }

    if (messages.length > MAX_MENSAJES) {
      return new Response(JSON.stringify({ error: 'conversacion_demasiado_larga' }), { status: 400, headers: cors(origen) });
    }
    for (const m of messages) {
      if (typeof m.content !== 'string' || m.content.length > MAX_CHARS_MENSAJE) {
        return new Response(JSON.stringify({ error: 'mensaje_demasiado_largo' }), { status: 400, headers: cors(origen) });
      }
    }

    let response;
    try {
      response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
          max_tokens: 250,
          temperature: 0.7,
        }),
      });
    } catch (e) {
      return new Response(JSON.stringify({ error: 'openai_unreachable' }), { status: 502, headers: cors(origen) });
    }

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'openai_error', status: response.status }), { status: 502, headers: cors(origen) });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Ocurrió un error. Intenta de nuevo.';

    return new Response(JSON.stringify({ reply }), {
      headers: Object.assign({ 'Content-Type': 'application/json' }, cors(origen)),
    });
  },
};
