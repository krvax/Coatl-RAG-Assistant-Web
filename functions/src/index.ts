import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { setGlobalOptions } from 'firebase-functions/v2';

import { ai } from './ai';
import { db } from './firebase';

/**
 * Configuración global de las funciones v2.
 */
setGlobalOptions({
  region: 'us-central1',
  maxInstances: 10,
});

/**
 * Secreto con la API key de Gemini.
 * El valor se gestiona con: firebase functions:secrets:set GOOGLE_GENAI_API_KEY
 */
const geminiApiKey = defineSecret('GOOGLE_GENAI_API_KEY');

/**
 * Respuesta amigable para el cliente.
 */
interface FriendlyError {
  status: number;
  code: string;
  message: string;
  retryAfterSeconds?: number;
}

/**
 * Convierte cualquier error en una respuesta amigable y accionable.
 */
function mapErrorToFriendly(error: unknown): FriendlyError {

  const rawMessage = error instanceof Error ? error.message : String(error);
  const errorStatus = (error as { status?: number })?.status;

  if (
    errorStatus === 429 ||
    /too many requests|quota|rate limit/i.test(rawMessage)
  ) {

    const retryMatch = rawMessage.match(/retry in (\d+(?:\.\d+)?)\s*s/i);
    const retryAfterSeconds = retryMatch
      ? Math.ceil(parseFloat(retryMatch[1]))
      : undefined;

    return {
      status: 429,
      code: 'QUOTA_EXCEEDED',
      message: retryAfterSeconds
        ? `Se alcanzó el límite de uso del asistente. Intenta de nuevo en ${retryAfterSeconds} segundos.`
        : 'Se alcanzó el límite de uso del asistente. Intenta de nuevo más tarde.',
      retryAfterSeconds,
    };
  }

  if (
    errorStatus === 401 ||
    errorStatus === 403 ||
    /api key not valid|api key (is )?missing|unauthenticated|permission denied/i.test(rawMessage)
  ) {
    return {
      status: 401,
      code: 'AUTH_ERROR',
      message: 'No se pudo autenticar con el servicio de IA. Revisa la configuración del servidor.',
    };
  }

  if (errorStatus === 404 || /model.*not found/i.test(rawMessage)) {
    return {
      status: 404,
      code: 'MODEL_NOT_FOUND',
      message: 'El modelo de IA solicitado no está disponible.',
    };
  }

  if (errorStatus === 400 || /invalid argument|bad request/i.test(rawMessage)) {
    return {
      status: 400,
      code: 'BAD_REQUEST',
      message: 'La solicitud enviada no es válida.',
    };
  }

  if (errorStatus && errorStatus >= 500 && errorStatus < 600) {
    return {
      status: 503,
      code: 'AI_SERVICE_UNAVAILABLE',
      message: 'El servicio de IA no está disponible en este momento. Intenta de nuevo en unos segundos.',
    };
  }

  if (/fetch failed|enotfound|econnrefused|timeout/i.test(rawMessage)) {
    return {
      status: 503,
      code: 'NETWORK_ERROR',
      message: 'No se pudo contactar con el servicio de IA. Verifica tu conexión e intenta de nuevo.',
    };
  }

  return {
    status: 500,
    code: 'INTERNAL_ERROR',
    message: 'Ocurrió un error procesando tu solicitud. Intenta de nuevo.',
  };
}

/**
 * Función principal RAG. Recibe una pregunta, busca menús en Firestore
 * y pide a Gemini una recomendación basada en ese contexto.
 */
export const askAI = onRequest(
  {
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
    memory: '512MiB',
    cors: true,
  },
  async (req, res) => {

    try {

      /**
       * Pregunta usuario
       */
      const question = req.body?.question;

      /**
       * Validación
       */
      if (!question) {
        res.status(400).json({
          error: 'La pregunta es obligatoria.',
          code: 'QUESTION_REQUIRED',
        });
        return;
      }

      /**
       * Obtener datos Firestore
       */
      const snapshot = await db.collection('menus').get();

      /**
       * Convertir documentos a texto
       */
      const menus = snapshot.docs.map((doc) => doc.data());

      /**
       * Sin datos no podemos hacer RAG: respondemos claro al cliente.
       */
      if (menus.length === 0) {
        res.status(503).json({
          error: 'No hay menús disponibles en este momento.',
          code: 'NO_CONTEXT',
        });
        return;
      }

      /**
       * Crear contexto dinámico
       */
      const context = menus
        .map((menu) => {
          return `
        Nombre: ${menu.name}
        Precio: ${menu.price}
        Categoría: ${menu.category}
        Descripción: ${menu.description}
      `;
        })
        .join('\n');

      /**
       * Prompt RAG
       */
      const prompt = `
Eres un asistente gastronómico inteligente.

Tu trabajo es recomendar platos usando únicamente
el contexto proporcionado.

REGLAS:
- No inventes platos
- No inventes precios
- Sé amigable
- Responde corto y claro
- Recomienda opciones útiles

Contexto:
${context}

Pregunta usuario:
${question}
`;

      /**
       * Generar respuesta IA
       */
      const response = await ai.generate(prompt);

      res.json({
        answer: response.text,
        context,
      });

    } catch (error) {

      console.error(error);

      const friendly = mapErrorToFriendly(error);
      const isProduction = process.env.NODE_ENV === 'production';

      if (friendly.retryAfterSeconds !== undefined) {
        res.setHeader('Retry-After', String(friendly.retryAfterSeconds));
      }

      res.status(friendly.status).json({
        error: friendly.message,
        code: friendly.code,
        ...(friendly.retryAfterSeconds !== undefined && {
          retryAfterSeconds: friendly.retryAfterSeconds,
        }),
        ...(isProduction
          ? {}
          : {
              debug: {
                rawMessage: error instanceof Error ? error.message : String(error),
                name: error instanceof Error ? error.name : undefined,
                stack: error instanceof Error ? error.stack : undefined,
                details: (error as { errorDetails?: unknown })?.errorDetails,
              },
            }),
      });
    }
  }
);
