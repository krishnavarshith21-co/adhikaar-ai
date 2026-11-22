import { rateLimit } from '@/lib/server/ai';
import { failure, HttpError, requireSession, sameOrigin, readLimitedBody } from '@/lib/server/session';
import { transcribeAudio, TranscriptionError } from '@/lib/server/transcription';
import { getAiConfig } from '@/lib/server/ai-provider';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { view } = await requireSession();
    rateLimit(view.namespace);
    if (!request.headers.get('content-type')?.startsWith('multipart/form-data;'))
      throw new HttpError(400, 'Upload a recorded audio file.');
    const bytes = await readLimitedBody(request, 8 * 1024 * 1024);
    let form: FormData;
    try {
      form = await new Response(bytes, {
        headers: { 'Content-Type': request.headers.get('content-type')! },
      }).formData();
    } catch {
      throw new HttpError(400, 'Invalid recording upload. Please record again.');
    }
    if (form.get('namespace') !== view.namespace) throw new HttpError(409, 'Profile changed. Record again.');
    const audio = form.get('audio');
    if (!(audio instanceof File) || audio.size > 8 * 1024 * 1024)
      throw new HttpError(400, 'Empty, oversized or invalid recording.');
    const mode = form.get('languageMode');
    if (mode !== null && mode !== 'hint' && mode !== 'auto')
      throw new HttpError(400, 'Invalid speech language mode.');

    const config = getAiConfig();
    const result = await transcribeAudio(audio, {
      apiKey: config.apiKey,
      provider: config.provider,
      model:
        config.provider === 'gemini'
          ? process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-2.5-flash'
          : process.env.OPENAI_TRANSCRIPTION_MODEL,
      language: String(form.get('language')),
      languageMode: mode === 'auto' ? 'auto' : 'hint',
      signal: request.signal,
      debug: process.env.SPEECH_DEBUG === 'true',
    });
    return Response.json(result, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    if (e instanceof TranscriptionError)
      return Response.json(
        { error: e.message, code: e.code },
        { status: e.status, headers: { 'Cache-Control': 'no-store' } },
      );
    return failure(e);
  }
}
