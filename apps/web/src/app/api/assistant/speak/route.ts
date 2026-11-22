import { rateLimit } from '@/lib/server/ai';
import { failure, HttpError, requireSession, sameOrigin, readJson } from '@/lib/server/session';
import { generateGeminiSpeech } from '@/lib/server/ai-provider';
import type { Language } from '@/lib/domain/model';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { view } = await requireSession();
    rateLimit(view.namespace);

    const body = await readJson(request);
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    if (body.namespace !== view.namespace) throw new HttpError(409, 'Profile changed. Retry speech.');
    const language = String(body.language || 'en') as Language;

    if (!text || text.length > 2000) {
      throw new HttpError(400, 'Invalid speech text.');
    }
    if (!['en', 'hi', 'te'].includes(language)) {
      throw new HttpError(400, 'Unsupported speech language.');
    }

    const speech = await generateGeminiSpeech(text, language, request.signal);
    if (!speech) {
      throw new HttpError(503, 'Gemini speech synthesis is currently unavailable. Try a device voice or read the response.');
    }

    const audioBuffer = Buffer.from(speech.audioBase64, 'base64');
    return new Response(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': speech.mimeType,
        'Content-Length': String(audioBuffer.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (e) {
    return failure(e);
  }
}
