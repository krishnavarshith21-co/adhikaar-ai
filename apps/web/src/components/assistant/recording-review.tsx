'use client';
import type { DebugRecording } from './use-voice';

/** Explicit local-development opt-in; blob URLs are revoked by useVoice. */
export function RecordingDebug({ recording }: { recording: DebugRecording | null }) {
  if (process.env.NODE_ENV !== 'development' || !recording) return null;
  return <details className="metadata px-4 py-2" data-speech-debug>
    <summary>Developer audio check · temporary, in memory</summary>
    <p>{recording.duration.toFixed(2)}s · capture {recording.mime} · {recording.bytes} bytes</p>
    <label>Exact captured recording<audio controls preload="metadata" src={recording.originalUrl} className="w-full" /></label>
    <p>Exact upload · audio/wav · mono PCM 16-bit · {recording.sampleRate} Hz · {recording.uploadBytes} bytes</p>
    <label>Listen to the uploaded audio<audio controls preload="metadata" src={recording.uploadUrl} className="w-full" /></label>
  </details>;
}
