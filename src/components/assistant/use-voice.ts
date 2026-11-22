'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ASSISTANT_COPY, normalizeIndianSpeech } from '@/lib/domain/assistant';
import type { Language } from '@/lib/domain/model';
import { captureType, encodeMonoWav, inspectPcmWav, SPEECH_SAMPLE_RATE } from '@/lib/domain/speech-audio';

export type SpeechStatus = 'ready' | 'requesting' | 'listening' | 'transcribing' | 'reviewing' | 'responding' | 'speaking' | 'error';
export type SpeechRate = 0.8 | 1.0 | 1.2;
export interface DebugRecording {
  originalUrl: string;
  uploadUrl: string;
  mime: string;
  bytes: number;
  uploadBytes: number;
  duration: number;
  sampleRate: number;
}

async function prepareUpload(blob: Blob) {
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) throw new Error('Audio decoding is not supported. Please use text chat.');
  const decoder = new AudioCtx();
  try {
    const decoded = await decoder.decodeAudioData(await blob.arrayBuffer());
    if (!Number.isFinite(decoded.duration) || decoded.duration < 0.15 || decoded.duration > 60.5) {
      throw new Error('Record between 0.15 and 60 seconds.');
    }
    // Native resampling/downmixing preserves speed and pitch; never relabel encoded bytes.
    const offline = new OfflineAudioContext(
      1,
      Math.ceil(decoded.duration * SPEECH_SAMPLE_RATE),
      SPEECH_SAMPLE_RATE,
    );
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    const wav = encodeMonoWav(rendered.getChannelData(0));
    return { audio: new Blob([wav], { type: 'audio/wav' }), metrics: inspectPcmWav(wav) };
  } finally {
    await decoder.close().catch(() => {});
  }
}

export function useVoice(
  language: Language,
  namespace: string,
  onTranscript: (text: string) => void,
) {
  const copy = ASSISTANT_COPY[language];
  const [status, setStatus] = useState<SpeechStatus>('ready');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [level, setLevel] = useState(0);
  const [paused, setPaused] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [rate, setRate] = useState<SpeechRate>(1.0);
  const [caption, setCaption] = useState('');
  const [autoPlay, setAutoPlay] = useState(false);
  const [debugAudio, setDebugAudio] = useState<DebugRecording | null>(null);
  const [languageMode, setLanguageMode] = useState<'hint' | 'auto'>('hint');

  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const context = useRef<AudioContext | null>(null);
  const animation = useRef(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const request = useRef<AbortController | null>(null);
  const generation = useRef(0);
  const alive = useRef(true);
  const voiceList = useRef<SpeechSynthesisVoice[]>([]);
  const urls = useRef<string[]>([]);
  const recording = useRef(false);
  const callback = useRef(onTranscript);

  // Neural TTS element ref
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrl = useRef<string | null>(null);

  useEffect(() => {
    callback.current = onTranscript;
  }, [onTranscript]);

  const stopAudioPlayback = useCallback(() => {
    if (audioElement.current) {
      audioElement.current.onplay = null;
      audioElement.current.onended = null;
      audioElement.current.onerror = null;
      audioElement.current.pause();
      audioElement.current.currentTime = 0;
      audioElement.current = null;
    }
    if (audioBlobUrl.current) {
      URL.revokeObjectURL(audioBlobUrl.current);
      audioBlobUrl.current = null;
    }
  }, []);

  const release = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
    cancelAnimationFrame(animation.current);
    stream.current?.getTracks().forEach((t) => {
      t.onended = null;
      t.stop();
    });
    stream.current = null;
    if (context.current && context.current.state !== 'closed') {
      void context.current.close().catch(() => {});
    }
    context.current = null;
    stopAudioPlayback();
  }, [stopAudioPlayback]);

  const cleanup = useCallback(() => {
    generation.current++;
    recording.current = false;
    request.current?.abort();
    request.current = null;
    const media = recorder.current;
    if (media) {
      media.onstop = null;
      media.ondataavailable = null;
      media.onerror = null;
      media.onstart = null;
      if (media.state !== 'inactive') media.stop();
    }
    recorder.current = null;
    release();
    urls.current.forEach((url) => URL.revokeObjectURL(url));
    urls.current = [];
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  }, [release]);

  useEffect(() => {
    alive.current = true;
    const loadVoices = () => {
      if ('speechSynthesis' in window) voiceList.current = window.speechSynthesis.getVoices();
    };
    loadVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
    }
    const hidden = () => {
      if (document.hidden) {
        cleanup();
        setStatus('ready');
        setSpeakingId(null);
        setPaused(false);
        setCaption('');
        setDebugAudio(null);
      }
    };
    document.addEventListener('visibilitychange', hidden);
    return () => {
      alive.current = false;
      cleanup();
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      }
      document.removeEventListener('visibilitychange', hidden);
    };
  }, [cleanup, language, namespace]);

  function cancel() {
    cleanup();
    setStatus('ready');
    setError('');
    setLevel(0);
    setSpeakingId(null);
    setPaused(false);
    setCaption('');
    setDebugAudio(null);
  }

  async function start() {
    if (recording.current) return;
    cancel();
    const gen = generation.current;
    recording.current = true;
    const current = () => alive.current && generation.current === gen;
    const debug =
      process.env.NODE_ENV === 'development' &&
      (process.env.NEXT_PUBLIC_SPEECH_DEBUG === 'true' ||
        new URLSearchParams(window.location.search).get('speechDebug') === '1');

    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      recording.current = false;
      setError(copy.unsupported);
      setStatus('error');
      return;
    }

    setStatus('requesting');
    setSeconds(0);

    try {
      const tracks = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          channelCount: { ideal: 1 },
        },
      });
      if (!current()) {
        tracks.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = tracks;
      const mime = captureType((type) => MediaRecorder.isTypeSupported(type));
      const media = new MediaRecorder(tracks, {
        ...(mime ? { mimeType: mime } : {}),
        audioBitsPerSecond: 128000,
      });
      recorder.current = media;
      const chunks: Blob[] = [];
      let started = 0;

      tracks.getTracks().forEach((track) => {
        track.onended = () => {
          if (current()) {
            cancel();
            setStatus('error');
            setError(copy.interrupted);
          }
        };
      });

      media.onerror = () => {
        if (current()) {
          cancel();
          setStatus('error');
          setError(copy.interrupted);
        }
      };

      media.ondataavailable = (e) => {
        if (current() && e.data.size) chunks.push(e.data);
      };

      media.onstart = () => {
        if (!current()) return;
        started = performance.now();
        setStatus('listening');
        timer.current = setInterval(() => {
          const elapsed = (performance.now() - started) / 1000;
          setSeconds(Math.floor(elapsed));
          if (elapsed >= 60 && media.state === 'recording') media.stop();
        }, 100);
      };

      media.onstop = async () => {
        const duration = (performance.now() - started) / 1000;
        release();
        recorder.current = null;
        if (!current()) return;
        setLevel(0);
        setStatus('transcribing');
        const actualMime = media.mimeType || chunks.find((c) => c.type)?.type || '';
        const blob = new Blob(chunks, { type: actualMime });

        try {
          if (!blob.size || blob.size > 8 * 1024 * 1024) throw new Error(copy.silent);
          const prepared = await prepareUpload(blob);
          if (!current()) return;

          if (debug) {
            const originalUrl = URL.createObjectURL(blob);
            const uploadUrl = URL.createObjectURL(prepared.audio);
            urls.current.push(originalUrl, uploadUrl);
            setDebugAudio({
              originalUrl,
              uploadUrl,
              mime: actualMime,
              bytes: blob.size,
              uploadBytes: prepared.audio.size,
              duration: prepared.metrics.duration,
              sampleRate: prepared.metrics.sampleRate,
            });
            console.debug('[speech:recording]', {
              duration,
              decodedDuration: prepared.metrics.duration,
              captureMime: actualMime,
              captureBytes: blob.size,
              uploadMime: prepared.audio.type,
              uploadBytes: prepared.audio.size,
              sampleRate: prepared.metrics.sampleRate,
              rms: prepared.metrics.rms,
              voicedMs: prepared.metrics.voicedMs,
            });
          }

          if (prepared.metrics.silent) throw new Error(copy.silent);

          const form = new FormData();
          form.set('audio', prepared.audio, 'recording.wav');
          form.set('language', `${language}-IN`);
          form.set('languageMode', languageMode);
          form.set('namespace', namespace);

          const abort = new AbortController();
          request.current = abort;

          const res = await fetch('/api/assistant/transcribe', {
            method: 'POST',
            credentials: 'same-origin',
            body: form,
            signal: AbortSignal.any([abort.signal, AbortSignal.timeout(50000)]),
          });

          const data = await res.json();
          if (debug) console.debug('[speech:response]', { status: res.status, response: data });
          if (!res.ok) {
            throw new Error(
              data.code === 'NO_SPEECH'
                ? copy.silent
                : data.code === 'UNCLEAR_SPEECH'
                  ? copy.unclear
                  : data.error || copy.service,
            );
          }
          if (typeof data.transcript !== 'string' || !data.transcript.trim() || data.isIllustrative) {
            throw new Error(copy.unclear);
          }
          if (current()) {
            callback.current(data.transcript);
            setStatus('reviewing');
          }
        } catch (e) {
          if (current()) {
            setStatus('error');
            setError(e instanceof Error ? e.message : copy.service);
          }
        } finally {
          if (current()) {
            recording.current = false;
            request.current = null;
          }
        }
      };

      // One complete container, including the final dataavailable event before onstop.
      media.start();

      try {
        const audioContext = new AudioContext();
        context.current = audioContext;
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        audioContext.createMediaStreamSource(tracks).connect(analyser);
        void audioContext.resume().catch(() => {});
        const samples = new Float32Array(analyser.fftSize);
        const sample = () => {
          if (!current() || media.state !== 'recording') return;
          analyser.getFloatTimeDomainData(samples);
          let sum = 0;
          for (const value of samples) sum += value * value;
          setLevel(Math.min(1, Math.sqrt(sum / samples.length) * 7));
          animation.current = requestAnimationFrame(sample);
        };
        sample();
      } catch {
        /* Meter is optional; completed audio is decoded and checked before upload. */
      }
    } catch (e) {
      release();
      if (!current()) return;
      recording.current = false;
      setStatus('error');
      setError(
        e instanceof DOMException && e.name === 'NotAllowedError'
          ? copy.permission
          : e instanceof DOMException && e.name === 'NotFoundError'
            ? copy.missingMic
            : copy.unsupported,
      );
    }
  }

  function stopRecording() {
    if (recorder.current?.state === 'recording') {
      setStatus('transcribing');
      recorder.current.stop();
    }
  }

  /**
   * Dual-mode speech synthesis:
   * 1. Primary: Server-side Gemini Neural TTS (/api/assistant/speak)
   * 2. Fallback: Client Web Speech API with regional Indian voices
   */
  async function speak(id: string, rawText: string, lang: Language) {
    cancel();
    const gen = generation.current;
    const normalizedText = normalizeIndianSpeech(rawText, lang);

    // Display live captions of what is being spoken
    setCaption(rawText.slice(0, 160) + (rawText.length > 160 ? '...' : ''));

    setStatus('responding');
    setSpeakingId(id);
    const abort = new AbortController();
    request.current = abort;

    // Attempt Gemini Neural TTS first
    try {
      const res = await fetch('/api/assistant/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: normalizedText, language: lang, namespace }),
        signal: AbortSignal.any([abort.signal, AbortSignal.timeout(25000)]),
      });

      if (res.ok && alive.current && generation.current === gen) {
        const blob = await res.blob();
        if (!alive.current || generation.current !== gen) return;
        if (blob.size > 1000) {
          const url = URL.createObjectURL(blob);
          audioBlobUrl.current = url;
          const audio = new Audio(url);
          audioElement.current = audio;
          audio.playbackRate = rate;

          audio.onplay = () => {
            if (alive.current && generation.current === gen) {
              setSpeakingId(id);
              setStatus('speaking');
              setPaused(false);
            }
          };

          audio.onended = () => {
            if (alive.current && generation.current === gen) {
              stopAudioPlayback();
              setSpeakingId(null);
              setStatus('ready');
              setPaused(false);
              setCaption('');
            }
          };

          audio.onerror = () => {
            stopAudioPlayback();
            fallbackLocalSpeech(id, normalizedText, lang, gen);
          };

          await audio.play();
          return;
        }
      }
    } catch {
      // Fall through to Web Speech API fallback
    }

    fallbackLocalSpeech(id, normalizedText, lang, gen);
  }

  function fallbackLocalSpeech(id: string, text: string, lang: Language, gen: number) {
    if (!alive.current || generation.current !== gen) return;
    stopAudioPlayback();
    if (!('speechSynthesis' in window)) {
      setStatus('error');
      setError(copy.voiceUnavailable);
      return;
    }

    const voices = voiceList.current.length ? voiceList.current : window.speechSynthesis.getVoices();

    // Prioritized search for natural Indian regional voices
    const targetLocale = `${lang}-in`.toLowerCase();
    const voice =
      voices.find((v) => v.lang.toLowerCase() === targetLocale) ||
      voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(lang) &&
          /india|hindi|telugu|ravi|neerja|veena|heera/i.test(v.name),
      ) ||
      voices.find((v) => v.lang.toLowerCase().startsWith(lang));
    if (!voice) { setSpeakingId(null); setStatus('error'); setError(copy.voiceUnavailable); setCaption(''); return; }
    setError(lang === 'hi' ? 'डिवाइस की आवाज़ का उपयोग हो रहा है।' : lang === 'te' ? 'పరికరంలోని వాయిస్ ఉపయోగించబడుతోంది.' : 'Using a device voice; cloud speech is unavailable.');

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = `${lang}-IN`;
    if (voice) utterance.voice = voice;
    utterance.rate = rate;
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      if (alive.current && generation.current === gen) {
        setSpeakingId(id);
        setStatus('speaking');
      }
    };

    utterance.onend = () => {
      if (alive.current && generation.current === gen) {
        setSpeakingId(null);
        setStatus('ready');
        setPaused(false);
        setCaption('');
      }
    };

    utterance.onerror = () => {
      if (alive.current && generation.current === gen) {
        setSpeakingId(null);
        setStatus('error');
        setError(copy.service);
        setCaption('');
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  function pause() {
    if (audioElement.current) {
      if (paused) {
        void audioElement.current.play().catch(() => { cancel(); setStatus('error'); setError(copy.voiceUnavailable); });
        setPaused(false);
      } else {
        audioElement.current.pause();
        setPaused(true);
      }
      return;
    }

    if (!('speechSynthesis' in window)) return;
    if (paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    } else {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  }

  function cycleRate() {
    const nextRate: Record<SpeechRate, SpeechRate> = { 0.8: 1.0, 1.0: 1.2, 1.2: 0.8 };
    const newRate = nextRate[rate];
    setRate(newRate);
    if (audioElement.current) {
      audioElement.current.playbackRate = newRate;
    }
  }

  function toggleAutoPlay() {
    setAutoPlay((prev) => !prev);
  }

  return {
    status,
    debugAudio,
    languageMode,
    setLanguageMode,
    error,
    seconds,
    level,
    paused,
    speakingId,
    rate,
    caption,
    autoPlay,
    start,
    stopRecording,
    cancel,
    speak,
    pause,
    cycleRate,
    toggleAutoPlay,
  };
}
