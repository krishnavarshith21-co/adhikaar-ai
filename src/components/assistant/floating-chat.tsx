'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  ChevronDown,
  Mic,
  Send,
  Square,
  X,
  Sparkles,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { SCHEMES } from '@/lib/domain/catalog';
import { ASSISTANT_COPY, safeCitation, type AssistantResponse } from '@/lib/domain/assistant';
import type { Language } from '@/lib/domain/model';
import { RecordingDebug } from '@/components/assistant/recording-review';
import { useVoice } from './use-voice';

/* ─────────────────── types ─────────────────── */
interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  time: string;
  answer?: AssistantResponse;
}
type PanelState = 'closed' | 'open' | 'minimized';

/* ─────────────────── SVG icons (no emoji) ─────────────────── */
function ChatSparkleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      <path d="M12 7l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z" fill="#BC9059" stroke="#BC9059" strokeWidth="0.5" />
    </svg>
  );
}

/* ─────────────────── routes where widget is hidden ─────────────────── */
const HIDDEN_ROUTES = ['/app/assistant'];


/* ─────────────────── component ─────────────────── */
export function FloatingChat() {
  const { session, epoch } = useAuth();
  const pathname = usePathname();
  if (HIDDEN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'))) return null;
  return <FloatingChatSession key={`${session?.namespace ?? "guest"}:${epoch}`} />;
}

function FloatingChatSession() {
  const { session, isAuthenticated, isDemoUser, loginDemo } = useAuth();
  const router = useRouter();

  const [panel, setPanel] = useState<PanelState>('closed');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [languageOverride, setLanguageOverride] = useState<Language | null>(null);
  const language: Language = languageOverride ?? session?.workspace.settings.language ?? 'en';
  const setLanguage = setLanguageOverride;

  const [schemeId, setSchemeId] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [review, setReview] = useState(false);
  const [isDemoStarting, setIsDemoStarting] = useState(false);

  const copy = ASSISTANT_COPY[language];
  const controller = useRef<AbortController | null>(null);
  const requestId = useRef(0);
  const busy = useRef(false);
  const scroll = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const voice = useVoice(language, session?.namespace ?? 'guest', (text) => {
    setInput(text);
    setReview(true);
  });

  useEffect(() => {
    try { sessionStorage.removeItem('adhikaar_guide_chat_history'); } catch { /* Storage may be unavailable. */ }
  }, []);

  /* ─── auto-scroll ─── */
  useEffect(() => {
    if (scroll.current) scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [messages, pending, voice.caption]);

  /* ─── cleanup on unmount ─── */
  useEffect(() => () => {
    requestId.current++;
    controller.current?.abort();
  }, []);


  /* ─── Auto-play incoming message if enabled ─── */
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

  /* ─── send message ─── */
  const send = useCallback(
    async (question = input, retry = false) => {
      const text = question.trim();
      if (!text || busy.current || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing') return;

      // If user is guest, start demo session first
      if (!isAuthenticated || !session) {
        setIsDemoStarting(true);
        try {
          await loginDemo('aarohi-rao');
        } catch {
          setIsDemoStarting(false);
          setError(copy.service);
          return;
        }
        setIsDemoStarting(false);
      }

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
            namespace: session?.namespace ?? 'demo:default',
            revision: session?.revision ?? 1,
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
    },
    [input, isAuthenticated, session, voice, copy, loginDemo, language, schemeId, speakMessage, messages],
  );

  const cancel = useCallback(() => {
    requestId.current++;
    controller.current?.abort();
    busy.current = false;
    setPending(false);
    setInput(lastQuestion);
    voice.cancel();
  }, [lastQuestion, voice]);

  /* ─── close on Escape ─── */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && panel === 'open') { cancel(); setPanel('minimized'); }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [panel, cancel]);

  const handleStartDemoAndAsk = async (schemeName: string, query: string) => {
    setIsDemoStarting(true);
    try {
      await loginDemo('aarohi-rao', `/app/assistant?question=${encodeURIComponent(query)}`);
    } catch {
      setIsDemoStarting(false);
      setError(copy.service);
    }
  };

  /* ─── Don't render on full-page assistant route ─── */

  const status = pending ? 'responding' : voice.status;
  const unread = panel !== 'open' && messages.length > 0 ? messages.filter((m) => m.role === 'assistant').length : 0;

  return (
    <>
      {/* ─── Persistent Launcher Button ─── */}
      {panel !== 'open' && (
        <button
          className="floating-chat-launcher"
          onClick={() => setPanel('open')}
          aria-label="Open ADHIKAAR Guide"
          title="ADHIKAAR Guide — Civic Assistant"
        >
          {panel === 'minimized' ? <ChevronDown size={22} /> : <ChatSparkleIcon />}
          {panel === 'minimized' && <Sparkles size={14} className="launcher-sparkle" />}
          {unread > 0 && (
            <span className="launcher-badge" aria-label={`${unread} new messages`}>
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>
      )}

      {/* ─── Floating Chat Panel ─── */}
      {panel === 'open' && (
        <div className="floating-chat-panel" ref={panelRef} role="dialog" aria-label="ADHIKAAR Guide">
          {/* ── Header ── */}
          <header className="fc-header">
            <div className="fc-header-left">
              <div className="fc-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <strong className="fc-title">ADHIKAAR Guide</strong>
                <span className="fc-status" role="status">
                  {copy[status]}
                </span>
              </div>
            </div>

            <div className="fc-header-actions">
              {/* Language Selector */}
              <select
                className="fc-language"
                value={language}
                onChange={(e) => {
                  voice.cancel();
                  setLanguage(e.target.value as Language);
                }}
                disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'}
                aria-label="Select language"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="te">తెలుగు</option>
              </select>

              {/* Speed Button (0.8x / 1.0x / 1.2x) */}
              <button
                type="button"
                className="fc-icon-btn text-xs font-mono font-bold"
                onClick={voice.cycleRate}
                title={`${copy.speed}: ${voice.rate}x`}
                aria-label={`${copy.speed}: ${voice.rate}x`}
              >
                {voice.rate}x
              </button>

              {/* Auto-Play Voice Toggle */}
              <button
                type="button"
                className={`fc-icon-btn ${voice.autoPlay ? 'text-[#BC9059]' : 'text-linen/60'}`}
                onClick={voice.toggleAutoPlay}
                title={copy.autoPlay}
                aria-label={copy.autoPlay}
                aria-pressed={voice.autoPlay}
              >
                {voice.autoPlay ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              {/* Minimize & Close */}
              <button
                type="button"
                onClick={() => { cancel(); setPanel('minimized'); }}
                aria-label="Minimize ADHIKAAR Guide"
                className="fc-icon-btn"
              >
                <Minus size={16} />
              </button>
              <button
                type="button"
                onClick={() => { cancel(); setPanel('closed'); }}
                aria-label="Close ADHIKAAR Guide"
                className="fc-icon-btn"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          {/* ── Live Speaking Caption Banner ── */}
          {voice.status === 'speaking' && voice.caption && (
            <div className="fc-caption-banner" role="status" aria-live="polite">
              <Volume2 size={14} className="animate-pulse text-[#BC9059] shrink-0" />
              <p className="fc-caption-text">{voice.caption}</p>
            </div>
          )}

          {/* ── Messages List ── */}
          <div className="fc-messages" ref={scroll} role="log" aria-live="polite" aria-relevant="additions">
            {/* Guest / Unauthenticated Prompt */}
            {!isAuthenticated && (
              <div className="fc-guest-banner">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#BC9059] shrink-0" />
                  <span className="font-semibold text-xs text-[#172943]">Independent Civic Companion</span>
                </div>
                <p className="text-xs text-muted mt-1 leading-relaxed">{copy.guestNote}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    type="button"
                    className="fc-demo-btn"
                    disabled={isDemoStarting}
                    onClick={() => loginDemo('aarohi-rao')}
                  >
                    <Sparkles size={13} />
                    <span>{isDemoStarting ? 'Loading demo...' : copy.exploreDemoCta}</span>
                  </button>
                  <button
                    type="button"
                    className="fc-signin-btn"
                    onClick={() => router.push('/sign-in')}
                  >
                    {copy.signInCta}
                  </button>
                </div>
              </div>
            )}

            {/* Welcome State when no messages */}
            {!messages.length && (
              <div className="fc-welcome">
                <div className="fc-welcome-icon">
                  <BookOpen size={20} />
                </div>
                <p className="fc-welcome-title">{copy.intro}</p>
                <p className="fc-welcome-muted">{isDemoUser ? copy.demo : copy.disclaimer}</p>

                <div className="w-full mt-2">
                  <p className="text-[11px] font-bold text-[#836137] uppercase tracking-wider mb-2">
                    {language === 'en' ? 'Quick Questions' : language === 'hi' ? 'त्वरित प्रश्न' : 'త్వరిత ప్రశ్నలు'}
                  </p>
                  <div className="fc-chips">
                    {SCHEMES.map((s) => {
                      const q =
                        language === 'en'
                          ? `Help me prepare for ${s.name}.`
                          : language === 'hi'
                            ? `${s.name} के लिए आवश्यक दस्तावेज़ और शर्तें क्या हैं?`
                            : `${s.name} కోసం ఏ పత్రాలు సిద్ధం చేసుకోవాలి?`;
                      return (
                        <button
                          key={s.id}
                          disabled={pending || isDemoStarting}
                          onClick={() => {
                            setSchemeId(s.id);
                            if (!isAuthenticated) {
                              void handleStartDemoAndAsk(s.name, q);
                            } else {
                              setInput(q);
                              void send(q);
                            }
                          }}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((m) => {
              const c = ASSISTANT_COPY[m.answer?.language || language];
              return (
                <article
                  className={`fc-message fc-${m.role}`}
                  key={m.id}
                  lang={m.answer?.language || language}
                >
                  <div className="fc-message-meta">
                    <strong>{m.role === 'user' ? copy.you : c.guide}</strong>
                    <time dateTime={m.time}>
                      {new Date(m.time).toLocaleTimeString(
                        language === 'en' ? 'en-IN' : language === 'hi' ? 'hi-IN' : 'te-IN',
                        { hour: '2-digit', minute: '2-digit' },
                      )}
                    </time>
                  </div>

                  {m.answer && (
                    <span className="fc-verification">
                      {m.answer.verificationStatus === 'DEMO'
                        ? c.demo
                        : m.answer.verificationStatus === 'SOURCE_GROUNDED'
                          ? c.grounded
                          : c.unverified}
                    </span>
                  )}

                  <p className="fc-text">{m.text}</p>

                  {m.answer && (
                    <>
                      {m.answer.eligibility && (
                        <p className="fc-assessment">
                          {c.statuses[m.answer.eligibility.status]} · {c.disclaimer}
                        </p>
                      )}

                      {/* Conditions, Documents, Next Steps */}
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
                            <div className="fc-section" key={title}>
                              <h4>{title}</h4>
                              <ul>
                                {items.map((item) => (
                                  <li key={item}>{item}</li>
                                ))}
                              </ul>
                            </div>
                          ),
                      )}

                      {/* Official Source Links */}
                      {m.answer.citations.filter((s) => safeCitation(s.url)).map((s) => (
                        <a
                          className="fc-source"
                          key={s.url}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <BookOpen size={13} />
                          <span>
                            {s.title}
                            <small>{s.authority} · Official Portal</small>
                          </span>
                        </a>
                      ))}

                      {/* Audio Playback Controls */}
                      <div className="fc-playback">
                        <button
                          type="button"
                          onClick={() => speakMessage(m.id, m.answer!)}
                          disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'}
                          title={c.play}
                          aria-label={c.play}
                        >
                          <Play size={13} />
                          <span className="text-[11px] font-semibold">{c.play}</span>
                        </button>
                        <button
                          type="button"
                          disabled={voice.speakingId !== m.id}
                          onClick={voice.pause}
                          title={voice.paused ? c.resume : c.pause}
                          aria-label={voice.paused ? c.resume : c.pause}
                        >
                          <Pause size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => voice.speak(m.id, m.text, m.answer!.language)}
                          disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'}
                          title={c.replay}
                          aria-label={c.replay}
                        >
                          <RotateCcw size={13} />
                        </button>
                        <button
                          type="button"
                          disabled={voice.speakingId !== m.id}
                          onClick={voice.cancel}
                          title={c.stop}
                          aria-label={c.stop}
                        >
                          <Square size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </article>
              );
            })}

            {/* Loading Indicator */}
            {pending && (
              <div className="fc-pending" role="status">
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="text-xs text-muted ml-2">{copy.responding}</span>
              </div>
            )}
          </div>

          {/* ── Error Banner ── */}
          {(error || voice.error) && (
            <div className="fc-error" role="alert">
              <span>{error || voice.error}</span>
              {error && (
                <button type="button" onClick={() => void send(lastQuestion, true)} disabled={pending}>
                  {copy.retry}
                </button>
              )}
            </div>
          )}

          {/* ── Recording Strip with Audio Meter ── */}
          {voice.status === 'listening' && (
            <div className="fc-recording">
              <Mic size={15} className="text-[#A95D49] animate-pulse" />
              <span>
                {copy.record} · {Math.floor(voice.seconds / 60)}:
                {String(voice.seconds % 60).padStart(2, '0')}
              </span>
              <div className="fc-meter" aria-hidden="true">
                {[0.3, 0.6, 1, 0.7, 0.4, 0.8, 0.5, 0.9, 0.3].map((n, i) => (
                  <i key={i} style={{ height: `${4 + n * voice.level * 22}px` }} />
                ))}
              </div>
              <button type="button" onClick={voice.stopRecording} className="fc-record-btn">
                <Square size={12} />
                <span>{copy.stop}</span>
              </button>
              <button type="button" onClick={voice.cancel} className="fc-record-btn">
                <X size={12} />
              </button>
            </div>
          )}

          {/* ── Transcript Review Note ── */}
          {review && <div className="fc-review" role="status"><p>{copy.review}</p><div className="flex flex-wrap gap-3 mt-1">
            <button type="button" className="underline" onClick={() => document.querySelector<HTMLTextAreaElement>('.fc-composer textarea')?.focus()}>{copy.editTranscript}</button>
            <button type="button" className="underline" onClick={() => { setReview(false); setInput(''); void voice.start(); }}>{copy.retryRecording}</button>
          </div></div>}
          {voice.error && <div className="fc-review"><button type="button" className="underline" onClick={() => { setReview(false); void voice.start(); }}>{copy.retryRecording}</button></div>}
          <RecordingDebug recording={voice.debugAudio} />

          {/* ── Chat Composer ── */}
          <form
            className="fc-composer"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <textarea
              rows={1}
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
              aria-label={copy.question}
            />
            <div className="fc-actions">
              {/* Working Microphone Button */}
              <button
                type="button"
                className={`fc-mic-btn ${voice.status === 'listening' ? 'recording' : ''}`}
                aria-label={copy.mic}
                title={copy.mic}
                disabled={pending || voice.status === 'requesting' || voice.status === 'transcribing'}
                onClick={voice.status === 'listening' ? voice.stopRecording : () => { setReview(false); void voice.start(); }}
              >
                <Mic size={17} />
              </button>

              <span className="text-[10px] text-muted">{input.length}/2000</span>

              {pending || voice.status === 'requesting' || voice.status === 'transcribing' ? (
                <button type="button" className="fc-cancel" onClick={cancel}>
                  {copy.cancel}
                </button>
              ) : (
                <button
                  type="submit"
                  className="fc-send"
                  disabled={!input.trim() || voice.status === 'listening'}
                  aria-label={copy.send}
                >
                  <Send size={15} />
                </button>
              )}
            </div>
<label className="metadata flex items-center gap-1"><input type="checkbox" checked={voice.languageMode === 'auto'} disabled={pending || voice.status === 'requesting' || voice.status === 'listening' || voice.status === 'transcribing'} onChange={e => voice.setLanguageMode(e.target.checked ? 'auto' : 'hint')} />{copy.detectLanguages}</label>
          </form>
        </div>
      )}
    </>
  );
}
