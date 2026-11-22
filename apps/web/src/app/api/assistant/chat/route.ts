import { ASSISTANT_COPY, baseAnswer, conversationScheme, validateExplanation } from '@/lib/domain/assistant';
import { failure, HttpError, readJson, requireSession, sameOrigin } from '@/lib/server/session';
import { apiKey, officialDocument, rateLimit } from '@/lib/server/ai';
import { generateCivicExplanation } from '@/lib/server/ai-provider';
import type { Language } from '@/lib/domain/model';

export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { view } = await requireSession();
    rateLimit(view.namespace);
    const body = await readJson(request);
    if (body.namespace !== view.namespace || body.revision !== view.revision)
      throw new HttpError(409, 'Your profile changed. Retry with the current profile.');
    if (
      typeof body.message !== 'string' ||
      !body.message.trim() ||
      body.message.length > 2000 ||
      !['en', 'hi', 'te'].includes(String(body.language))
    )
      throw new HttpError(400, 'Provide a question of at most 2,000 characters and a supported language.');

    const language = body.language as Language,
      scheme = conversationScheme(body.message, typeof body.schemeId === 'string' ? body.schemeId : undefined, typeof body.previousSchemeId === 'string' ? body.previousSchemeId : undefined);
    const answer = baseAnswer(language, view.workspace.profile, scheme?.id, view.role === 'DEMO_USER');
    if (view.role === 'DEMO_USER') return Response.json(answer);

    apiKey();
    if (!scheme) return Response.json(answer);

    let source;
    try {
      source = await officialDocument(scheme.id, request.signal);
    } catch {
      return Response.json({
        ...answer,
        responseText: language === 'en' ? 'The official source could not be retrieved. I cannot verify further details right now. Please check the linked authority and retry.' : language === 'hi' ? 'आधिकारिक स्रोत अभी उपलब्ध नहीं है। विवरण की पुष्टि के लिए संबंधित आधिकारिक लिंक देखें।' : 'అధికారిక మూలం ప్రస్తుతం అందుబాటులో లేదు. వివరాల నిర్ధారణ కోసం అధికారిక లింకును చూడండి।',
        verificationStatus: 'UNVERIFIED',
      });
    }

    const parsed = await generateCivicExplanation(
      {
        question: body.message,
        language,
        programme: scheme.name,
        deterministicResult: answer.eligibility?.status,
        untrustedOfficialEvidence: source.text,
      },
      request.signal,
    );

    const explanation = validateExplanation(parsed, source.text, language);
    // Generative explanation cannot replace the deterministic result, canonical conditions or source URLs.
    return Response.json({
      ...answer,
      responseText: explanation || ASSISTANT_COPY[language].fallback,
      citations: [source.citation],
      verificationStatus: explanation ? 'SOURCE_GROUNDED' : 'UNVERIFIED',
    });
  } catch (e) {
    return failure(e);
  }
}
