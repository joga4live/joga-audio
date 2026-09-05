// Joga Audio — Cloudflare Worker (proxy seguro para OpenAI)
// Pega este código en el editor de tu Worker en Cloudflare Dashboard
// Luego agrega la variable de entorno: OPENAI_API_KEY = tu key

const SYSTEM_PROMPT = `Eres el asistente de Joga Audio, una plataforma de audiobooks de crecimiento personal fundada por Joga. Tu misión es ayudar a los visitantes a encontrar el audiobook ideal y resolver sus dudas con calidez y claridad.

AUDIOBOOKS DISPONIBLES (6):
1. Claridad Mental — Técnicas para enfocar la mente y eliminar el ruido mental
2. Domina tu Tiempo — Gestión del tiempo y productividad real
3. Hábitos que Transforman — Cómo construir hábitos que duran
4. Propósito de Vida — Encontrar tu dirección y vivir con intención
5. Inteligencia Financiera — Fundamentos de finanzas personales y riqueza
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

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    let messages;
    try {
      const body = await request.json();
      messages = body.messages || [];
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Ocurrió un error. Intenta de nuevo.';

    return new Response(JSON.stringify({ reply }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};
