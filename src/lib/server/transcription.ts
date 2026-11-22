import { inspectPcmWav, languageHint } from '../domain/speech-audio';

export class TranscriptionError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

interface Options {
  apiKey?: string;
  provider?: 'gemini' | 'openai';
  model?: string;
  language: string;
  languageMode?: 'hint' | 'auto';
  signal: AbortSignal;
  fetcher?: typeof fetch;
  debug?: boolean;
}

export async function transcribeAudio(audio: File, options: Options) {
  if (!['audio/wav', 'audio/x-wav'].includes(audio.type.split(';')[0]))
    throw new TranscriptionError(415, 'INVALID_AUDIO', 'The audio could not be decoded. Please record again.');

  const audioBytes = await audio.arrayBuffer();
  let metrics: ReturnType<typeof inspectPcmWav>;
  try {
    metrics = inspectPcmWav(audioBytes);
  } catch {
    throw new TranscriptionError(422, 'INVALID_AUDIO', 'The recording is incomplete or unreadable. Please record again.');
  }

  if (metrics.silent)
    throw new TranscriptionError(422, 'NO_SPEECH', 'No clear speech was detected. Please record again.');

  const hint = languageHint(options.language);
  if (!hint) throw new TranscriptionError(400, 'INVALID_LANGUAGE', 'Choose English, Hindi or Telugu.');

  const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey)
    throw new TranscriptionError(
      503,
      'NOT_CONFIGURED',
      'Speech transcription is not configured. Set the server-side GEMINI_API_KEY or type your question.',
    );

  const isGeminiKey = apiKey.startsWith('AIza') || Boolean(process.env.GEMINI_API_KEY && !options.model?.includes('whisper'));
  const isExplicitOpenAi = options.model === 'whisper-1' || options.model?.startsWith('gpt-4o-transcribe') || options.provider === 'openai';
  const useGemini = !isExplicitOpenAi && (options.provider === 'gemini' || isGeminiKey);

  const automatic = options.languageMode === 'auto' || metrics.duration >= 12;

  // ────────────────────────────
  // GEMINI MULTIMODAL AUDIO TRANSCRIPTION
  // ────────────────────────────
  if (useGemini) {
    const model = options.model || process.env.GEMINI_TRANSCRIBE_MODEL || 'gemini-2.5-flash';
    if (!model.startsWith('gemini-')) {
      throw new TranscriptionError(503, 'INVALID_MODEL', 'The configured transcription model is not supported by this adapter.');
    }

    const base64Data = Buffer.from(audioBytes).toString('base64');
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const langInstruction =
      automatic ? 'Detect the spoken language or languages from the audio. Transcribe verbatim in the original scripts without translating.' : hint === 'hi'
        ? 'The audio contains Hindi speech. Transcribe verbatim in Devanagari script.'
        : hint === 'te'
          ? 'The audio contains Telugu speech. Transcribe verbatim in Telugu script.'
          : 'The audio contains English or Indian civic speech. Transcribe verbatim.';

    const promptText = `${langInstruction} Output only the exact transcribed words. Do not add quotes, notes, commentary, or translation. If the audio is completely silent or contains only static noise without intelligible spoken words, output exactly: [NO_SPEECH]`;

    let res: Response;
    try {
      res = await (options.fetcher || fetch)(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
        signal: AbortSignal.any([options.signal, AbortSignal.timeout(45000)]),
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { inlineData: { mimeType: 'audio/wav', data: base64Data } },
                { text: promptText },
              ],
            },
          ],
          generationConfig: {
            temperature: 0,
          },
        }),
      });
    } catch {
      throw new TranscriptionError(
        502,
        'PROVIDER_UNAVAILABLE',
        'Transcription could not finish. Please record again or type your question.',
      );
    }

    const data = await res.json().catch(() => null);

    if (process.env.NODE_ENV === 'development' && options.debug) {
      console.debug('[speech:gemini]', {
        model,
        languageHint: automatic ? 'auto' : hint,
        duration: metrics.duration,
        bytes: audio.size,
        status: res.status,
      });
    }

    if (!res.ok) {
      if (res.status === 429) {
        throw new TranscriptionError(
          503,
          'PROVIDER_QUOTA_EXHAUSTED',
          'Speech transcription is unavailable because the Gemini API account has exhausted its rate limit or quota. Please retry shortly or type your question.',
        );
      }
      throw new TranscriptionError(
        502,
        'PROVIDER_UNAVAILABLE',
        'The transcription provider rejected the request. Please retry or type your question.',
      );
    }

    const rawTranscript = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    // Requirement 5: Never return fake transcripts or unrelated text when recognition fails
    if (
      !rawTranscript ||
      rawTranscript === '[NO_SPEECH]' ||
      rawTranscript.includes('[NO_SPEECH]') ||
      rawTranscript.length > 2000 ||
      !/[\p{L}\p{N}]/u.test(rawTranscript)
    ) {
      throw new TranscriptionError(422, 'UNCLEAR_SPEECH', 'No speech was detected. Please record again.');
    }

    return {
      transcript: rawTranscript,
      language: automatic ? 'auto' : hint,
      requestedLanguage: hint,
      languageMode: automatic ? 'auto' : 'hint',
      provider: 'gemini',
      model,
    };
  }

  // ────────────────────────────
  // OPENAI ADAPTER (Whisper & GPT-4o Transcribe)
  // ────────────────────────────
  const model = options.model || 'whisper-1';
  const whisper = model === 'whisper-1';
  if (!whisper && !['gpt-4o-transcribe', 'gpt-4o-mini-transcribe', 'gpt-4o-mini-transcribe-2025-12-15'].includes(model))
    throw new TranscriptionError(503, 'INVALID_MODEL', 'The configured transcription model is not supported by this adapter.');

  const form = new FormData();
  form.set('file', audio, 'recording.wav');
  form.set('model', model);
  form.set('response_format', whisper ? 'verbose_json' : 'json');
  if (!automatic) form.set('language', hint);
  if (!whisper) form.append('include[]', 'logprobs');

  let res: Response;
  try {
    res = await (options.fetcher || fetch)('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}` },
      body: form,
      signal: AbortSignal.any([options.signal, AbortSignal.timeout(45000)]),
    });
  } catch {
    throw new TranscriptionError(502, 'PROVIDER_UNAVAILABLE', 'Transcription could not finish. Please record again or type your question.');
  }

  const data = await res.json().catch(() => null);
  if (process.env.NODE_ENV === 'development' && options.debug)
    console.debug('[speech:provider]', { model, languageHint: automatic ? 'auto' : hint, duration: metrics.duration, mime: audio.type, bytes: audio.size, status: res.status, response: data });

  if (!res.ok) {
    if (res.status === 429 && (data?.error?.type === 'insufficient_quota' || ['insufficient_quota', 'credit_balance_exhausted'].includes(data?.error?.code)))
      throw new TranscriptionError(503, 'PROVIDER_QUOTA_EXHAUSTED', 'Speech transcription is unavailable because the OpenAI API account has exhausted its credits or quota. The app owner must restore API billing or quota before recording can work. You can still type your question.');
    throw new TranscriptionError(502, 'PROVIDER_UNAVAILABLE', 'The transcription provider rejected the request. Please retry or type your question.');
  }

  if (!data || typeof data.text !== 'string' || !data.text.trim() || data.text.length > 2000 || !/[\p{L}\p{N}]/u.test(data.text))
    throw new TranscriptionError(422, 'UNCLEAR_SPEECH', 'Speech was unclear. Please record again.');

  if (whisper) {
    const segments = Array.isArray(data.segments) ? data.segments.filter((s: { text?: unknown }) => typeof s.text === 'string' && s.text.trim()) : [];
    if (!segments.length || segments.some((s: { no_speech_prob?: number; avg_logprob?: number; compression_ratio?: number }) =>
      !Number.isFinite(s.avg_logprob) || !Number.isFinite(s.no_speech_prob) || s.no_speech_prob! > 0.6 || s.avg_logprob! < -1 || (s.compression_ratio ?? 0) > 2.4))
      throw new TranscriptionError(422, 'UNCLEAR_SPEECH', 'Speech confidence was too low. Please record again.');
  } else {
    const probabilities = Array.isArray(data.logprobs) ? data.logprobs.map((p: { logprob?: number }) => p.logprob) : [];
    if (!probabilities.length || probabilities.some((p: unknown) => typeof p !== 'number' || !Number.isFinite(p)) || probabilities.reduce((n: number, p: number) => n + p, 0) / probabilities.length < -1)
      throw new TranscriptionError(422, 'UNCLEAR_SPEECH', 'Speech confidence was too low. Please record again.');
  }

  return { transcript: data.text.trim(), language: typeof data.language === 'string' ? data.language : automatic ? 'auto' : hint, requestedLanguage: hint, languageMode: automatic ? 'auto' : 'hint', provider: 'openai', model };
}
