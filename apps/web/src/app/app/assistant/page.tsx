'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  BookOpen,
  Mic,
  Send,
  Square,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  MessagesSquare,
  X,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { SCHEMES } from '@/lib/domain/catalog';
import { ASSISTANT_COPY, safeCitation, type AssistantResponse } from '@/lib/domain/assistant';
import type { Language } from '@/lib/domain/model';
import { useConversation } from '@/components/assistant/conversation';
import { RecordingDebug } from '@/components/assistant/recording-review';
import { useVoice } from '@/components/assistant/use-voice';

export default function AssistantPage() {
  const { session, isDemoUser } = useAuth();
  const { messages, setMessages } = useConversation();
  const [languageOverride, setLanguage] = useState<Language | null>(null);
  const language = languageOverride ?? session?.workspace.settings.language ?? 'en';
  const params = useSearchParams();
  const [input, setInput] = useState(params.get('question') || '');
  const [schemeId, setSchemeId] = useState(params.get('scheme') || '');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [review, setReview] = useState(false);


  const copy = ASSISTANT_COPY[language] || ASSISTANT_COPY.en;
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const busy = useRef(false);
  const scroll = useRef<HTMLDivElement>(null);

  const voice = useVoice(language, session?.namespace || '', (text) => {
    setInput(text);
    setReview(true);
  });

  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, pending, voice.caption]);

  useEffect(() => () => {
    requestId.current++;
    controller.current?.abort();
  }, []);

  const speakMessage = useCallback(
    (msgId: string, answer: AssistantResponse) => {
      const parts = [
        answer.responseText,
        ...(answer.conditions.length ? [`Key conditions: ${answer.conditions.join('. ')}`] : []),
        ...(answer.documents.length ? [`Required documents: ${answer.documents.join('. ')}`] : []),
        ...(answer.suggestedNextSteps.length ? [`Next step: ${answer.suggestedNextSteps[0]}`] : []),
      ];
      voice.speak(msgId, parts.join('. '), answer.language);
    },
    [voice],
  );

  async function send(question = input, retry = false) {
    const text = question.trim();
    if (!text || busy.current || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing') return;
    voice.cancel();
    busy.current = true;
    setPending(true);
    setError('');
    setLastQuestion(text);
    setInput('');
    setReview(false);
    const id = ++requestId.current;
    const abort = new AbortController();
    controller.current = abort;

    if (!retry) {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: 'user', text, time: new Date().toISOString() },
      ]);
    }

    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          language,
          schemeId: schemeId || undefined,
          previousSchemeId: [...messages].reverse().find(m => m.answer?.schemeId)?.answer?.schemeId,
          namespace: session!.namespace,
          revision: session!.revision,
        }),
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(50000)]),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(language === 'en' ? data.error : copy.service);

      if (requestId.current === id) {
        const newMsgId = crypto.randomUUID();
        const assistantAnswer = data as AssistantResponse;
        setMessages((prev) => [
          ...prev,
          {
            id: newMsgId,
            role: 'assistant',
            text: data.responseText,
            time: new Date().toISOString(),
            answer: assistantAnswer,
          },
        ]);

        if (voice.autoPlay) {
          speakMessage(newMsgId, assistantAnswer);
        }
      }
    } catch (e) {
      if (requestId.current === id && !abort.signal.aborted) {
        setError(e instanceof Error ? e.message : copy.service);
        setInput(text);
      }
    } finally {
      if (requestId.current === id) {
        busy.current = false;
        setPending(false);
      }
    }
  }

  function cancel() {
    requestId.current++;
    controller.current?.abort();
    busy.current = false;
    setPending(false);
    setInput(lastQuestion);
    voice.cancel();
  }

  const sources = [...messages].reverse().find((m) => m.answer?.citations.length)?.answer?.citations || [];
  const status = pending ? 'responding' : voice.status;

  return (
    <div className="assistant-workspace" lang={language}>
      {/* ── Page Header ── */}
      <header className="assistant-header">
        <div>
          <p className="eyebrow">ADHIKAAR GUIDE</p>
          <h1>{copy.title}</h1>
          <p className="muted">{copy.intro}</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Rate Button */}
          <button
            type="button"
            className="action-link outline text-xs font-mono font-bold"
            onClick={voice.cycleRate}
            title={`${copy.speed}: ${voice.rate}x`}
            aria-label={`${copy.speed}: ${voice.rate}x`}
          >
            {voice.rate}x
          </button>

          {/* Auto-Play Toggle */}
          <button
            type="button"
            className={`action-link ${voice.autoPlay ? 'gold' : 'outline'} text-xs`}
            onClick={voice.toggleAutoPlay}
            title={copy.autoPlay}
            aria-label={copy.autoPlay}
            aria-pressed={voice.autoPlay}
          >
            {voice.autoPlay ? <Volume2 size={16} /> : <VolumeX size={16} />}
            <span className="hidden sm:inline">{copy.autoPlay}</span>
          </button>

          {/* Language Selector */}
          <label className="assistant-language">
            <span className="sr-only">Language / भाषा / భాష</span>
            <select
              aria-label="Language / भाषा / భాష"
              value={language}
              disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'}
              onChange={(e) => {
                voice.cancel();
                setLanguage(e.target.value as Language);
              }}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
              <option value="te">తెలుగు</option>
            </select>
          </label>
        </div>
      </header>

      {/* ── Live Caption Banner ── */}
      {voice.status === 'speaking' && voice.caption && (
        <div className="fc-caption-banner surface px-4 py-2 flex items-center gap-3 border-l-4 border-l-[#BC9059]" role="status" aria-live="polite">
          <Volume2 size={18} className="animate-pulse text-[#BC9059] shrink-0" />
          <p className="text-sm text-[#172943] font-medium">{voice.caption}</p>
        </div>
      )}

      {/* ── Main Conversation Grid ── */}
      <div className="conversation-layout">
        <section className="conversation-panel" aria-label={copy.guide}>
          <div className="conversation-status">
            <span>
              <MessagesSquare size={16} />
              {copy.guide}
            </span>
            <span role="status" aria-live="polite">
              {copy[status]}
            </span>
          </div>

          <div
            className="conversation-messages"
            ref={scroll}
            role="log"
            aria-live="polite"
            aria-relevant="additions"
          >
            {!messages.length && (
              <div className="conversation-welcome">
                <div className="guide-mark">
                  <BookOpen size={28} />
                </div>
                <h2>{copy.intro}</h2>
                <p className="muted">{isDemoUser ? copy.demo : copy.disclaimer}</p>
                <div className="question-chips">
                  {SCHEMES.map((s) => (
                    <button
                      key={s.id}
                      disabled={pending}
                      onClick={() => {
                        setSchemeId(s.id);
                        setInput(
                          language === 'en'
                            ? `Help me prepare for ${s.name}.`
                            : language === 'hi'
                              ? `${s.name} के लिए तैयारी कैसे करूँ?`
                              : `${s.name} కోసం ఎలా సిద్ధం కావాలి?`,
                        );
                      }}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => {
              const c = ASSISTANT_COPY[m.answer?.language || language];
              return (
                <article
                  className={`chat-message ${m.role}`}
                  key={m.id}
                  lang={m.answer?.language || language}
                >
                  <div className="message-meta">
                    <strong>{m.role === 'user' ? copy.you : c.guide}</strong>
                    <time dateTime={m.time}>
                      {new Date(m.time).toLocaleTimeString(
                        language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'te-IN',
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </time>
                  </div>

                  {m.answer && (
                    <span className="message-verification">
                      {m.answer.verificationStatus === 'DEMO'
                        ? c.demo
                        : m.answer.verificationStatus === 'SOURCE_GROUNDED'
                          ? c.grounded
                          : c.unverified}
                    </span>
                  )}

                  <p className="message-text">{m.text}</p>

                  {m.answer && (
                    <>
                      {m.answer.eligibility && (
                        <p className="assessment-note">
                          {c.statuses[m.answer.eligibility.status]} · {c.disclaimer}
                        </p>
                      )}

                      {(
                        [
                          [c.conditions, m.answer.conditions],
                          [c.documents, m.answer.documents],
                          [c.next, m.answer.suggestedNextSteps],
                        ] as [string, string[]][]
                      ).map(
                        ([title, items]) =>
                          Array.isArray(items) &&
                          items.length > 0 && (
                            <div className="answer-section" key={String(title)}>
                              <h3>{title}</h3>
                              <ul>
                                {items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ),
                      )}

                      {m.answer.citations.filter((s) => safeCitation(s.url)).map((s) => (
                        <a
                          className="message-source"
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <BookOpen size={16} />
                          <span>
                            {s.title}
                            <small>
                              {s.authority} · {s.lastChecked}
                            </small>
                          </span>
                        </a>
                      ))}

                      {/* Playback Controls */}
                      <div className="playback-controls">
                        <button
                          type="button"
                          onClick={() => speakMessage(m.id, m.answer!)}
                          disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'}
                        >
                          <Play size={15} />
                          {c.play}
                        </button>
                        <button
                          type="button"
                          disabled={voice.speakingId !== m.id}
                          onClick={voice.pause}
                        >
                          <Pause size={15} />
                          {voice.paused ? c.resume : c.pause}
                        </button>
                        <button
                          type="button"
                          onClick={() => voice.speak(m.id, m.text, m.answer!.language)}
                          disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'}
                        >
                          <RotateCcw size={15} />
                          {c.replay}
                        </button>
                        <button
                          type="button"
                          disabled={voice.speakingId !== m.id}
                          onClick={voice.cancel}
                        >
                          <Square size={15} />
                          {c.stop}
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}

            {pending && (
              <div className="assistant-pending" role="status">
                <span className="loading-dot" />
                {copy.responding}
              </div>
            )}
          </div>

          {(error || voice.error) && (
            <div className="error-banner mx-4" role="alert">
              {error || voice.error}
              {error && (
                <button type="button" onClick={() => send(lastQuestion, true)} disabled={pending}>
                  {copy.retry}
                </button>
              )}
            </div>
          )}

          {voice.status === 'listening' && (
            <div className="recording-strip">
              <Mic size={18} className="text-[#A95D49] animate-pulse" />
              <span>
                {copy.record} · {secondsFormat(voice.seconds)}
              </span>
              <div className="voice-meter" aria-hidden="true">
                {[0.3, 0.6, 1, 0.7, 0.4, 0.8, 0.5, 0.9, 0.4].map((n, i) => (
                  <i key={i} style={{ height: `${6 + n * voice.level * 30}px` }} />
                ))}
              </div>
              <button type="button" onClick={voice.stopRecording}>
                <Square size={16} />
                {copy.stop}
              </button>
              <button type="button" onClick={voice.cancel}>
                <X size={16} />
                {copy.cancel}
              </button>
            </div>
          )}

          {review && <div className="transcript-note" role="status"><p>{copy.review}</p><div className="flex flex-wrap gap-3 mt-1">
            <button type="button" className="underline" onClick={() => document.querySelector<HTMLTextAreaElement>('#chat-input')?.focus()}>{copy.editTranscript}</button>
            <button type="button" className="underline" onClick={() => { setReview(false); setInput(''); void voice.start(); }}>{copy.retryRecording}</button>
          </div></div>}
          {voice.error && <div className="transcript-note"><button type="button" className="underline" onClick={() => { setReview(false); void voice.start(); }}>{copy.retryRecording}</button></div>}
          <RecordingDebug recording={voice.debugAudio} />

          <form
            className="chat-composer"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <label className="sr-only" htmlFor="chat-input">
              {copy.question}
            </label>
            <textarea
              id="chat-input"
              rows={2}
              maxLength={2000}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={copy.question}
              disabled={pending}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <div className="composer-actions">
              {/* Fully functional microphone for all users */}
              <button
                type="button"
                className={`icon-button ${voice.status === 'listening' ? 'bg-[#A95D49]/15 text-[#A95D49]' : ''}`}
                aria-label={copy.mic}
                title={copy.mic}
                disabled={pending || voice.status === 'requesting' || voice.status === 'transcribing'}
                onClick={voice.status === 'listening' ? voice.stopRecording : () => { setReview(false); void voice.start(); }}
              >
                <Mic size={20} />
              </button>

              <span className="metadata">{input.length}/2000</span>

              {pending || voice.status === 'requesting' || voice.status === 'transcribing' ? (
                <button type="button" className="action-link ml-auto" onClick={cancel}>
                  {copy.cancel}
                </button>
              ) : (
                <button
                  type="submit"
                  className="action-link ml-auto"
                  disabled={!input.trim() || voice.status === 'listening'}
                >
                  <Send size={17} />
                  {copy.send}
                </button>
              )}
            </div>
            <label className="metadata flex items-center gap-1"><input type="checkbox" checked={voice.languageMode === 'auto'} disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'} onChange={e => voice.setLanguageMode(e.target.checked ? 'auto' : 'hint')} />{copy.detectLanguages}</label>
            <p className="metadata mt-2">{copy.voiceNote}</p>
          </form>
        </section>

        {/* ── Context Sidebar ── */}
        <aside className="context-rail">
          <div className="surface p-5">
            <BookOpen size={23} />
            <h2>{copy.sources}</h2>
            <label className="sr-only" htmlFor="scheme-context">
              {copy.conditions}
            </label>
            <select
              id="scheme-context"
              value={schemeId}
              disabled={pending}
              onChange={(e) => setSchemeId(e.target.value)}
            >
              <option value="">
                {language === 'en'
                  ? 'Choose a programme (optional)'
                  : language === 'hi'
                    ? 'योजना चुनें (वैकल्पिक)'
                    : 'పథకాన్ని ఎంచుకోండి (ఐచ్ఛికం)'}
              </option>
              {SCHEMES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {sources.filter((s) => safeCitation(s.url)).map((s) => (
              <div className="source-card mt-4" key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer">
                  {s.title}
                </a>
                <p>{s.authority}</p>
                <p>{s.lastChecked}</p>
              </div>
            ))}
            <p className="muted">{copy.disclaimer}</p>
          </div>

          <div className="surface p-5">
            <Volume2 size={22} className="text-[#BC9059]" />
            <p className="muted mt-3">{copy.voiceNote}</p>
            <p className="metadata mt-3">{copy.reviewHint}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function secondsFormat(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}
