/** Shared, dependency-free PCM contract. Encoded browser audio is decoded before upload. */
export const SPEECH_SAMPLE_RATE = 16000;
export const MAX_RECORDING_SECONDS = 60;
export const CAPTURE_TYPES = ['audio/webm;codecs=opus', 'audio/mp4;codecs=mp4a.40.2', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'] as const;
export function captureType(supported: (mime: string) => boolean) { return CAPTURE_TYPES.find(supported); }
export function languageHint(locale: string): 'en' | 'hi' | 'te' | null {
  const code = locale.toLowerCase().split('-')[0];
  return code === 'en' || code === 'hi' || code === 'te' ? code : null;
}
export function encodeMonoWav(samples: Float32Array, sampleRate = SPEECH_SAMPLE_RATE): ArrayBuffer {
  const buffer = new ArrayBuffer(44 + samples.length * 2), view = new DataView(buffer);
  const text = (offset: number, value: string) => { for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i)); };
  text(0, 'RIFF'); view.setUint32(4, buffer.byteLength - 8, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true); view.setUint16(34, 16, true);
  text(36, 'data'); view.setUint32(40, samples.length * 2, true);
  samples.forEach((value, i) => { const v = Math.max(-1, Math.min(1, Number.isFinite(value) ? value : 0)); view.setInt16(44 + i * 2, Math.round(v * (v < 0 ? 32768 : 32767)), true); });
  return buffer;
}
export function inspectPcmWav(buffer: ArrayBuffer) {
  const v = new DataView(buffer);
  const text = (offset: number, count: number) => String.fromCharCode(...new Uint8Array(buffer, offset, count));
  if (v.byteLength < 44 || text(0, 4) !== 'RIFF' || text(8, 4) !== 'WAVE' || v.getUint32(4, true) + 8 !== v.byteLength) throw new Error('Invalid or truncated WAV container.');
  let dataOffset = 0, dataSize = 0, validFormat = false;
  for (let offset = 12; offset + 8 <= v.byteLength;) {
    const length = v.getUint32(offset + 4, true), start = offset + 8;
    if (start + length > v.byteLength) throw new Error('Truncated audio data.');
    if (text(offset, 4) === 'fmt ') {
      validFormat = length >= 16 && v.getUint16(start, true) === 1 && v.getUint16(start + 2, true) === 1 && v.getUint32(start + 4, true) === SPEECH_SAMPLE_RATE && v.getUint32(start + 8, true) === SPEECH_SAMPLE_RATE * 2 && v.getUint16(start + 12, true) === 2 && v.getUint16(start + 14, true) === 16;
    } else if (text(offset, 4) === 'data') { dataOffset = start; dataSize = length; }
    offset = start + length + (length % 2);
  }
  if (!validFormat || !dataOffset || !dataSize || dataSize % 2) throw new Error('Expected mono 16 kHz 16-bit PCM WAV.');
  const samples = dataSize / 2, duration = samples / SPEECH_SAMPLE_RATE;
  if (duration < .15 || duration > MAX_RECORDING_SECONDS + .5) throw new Error('Record between 0.15 and 60 seconds.');
  let peak = 0, energy = 0, voicedSamples = 0;
  const frame = Math.round(SPEECH_SAMPLE_RATE * .02);
  for (let offset = 0; offset < samples; offset += frame) {
    let sum = 0, squared = 0; const count = Math.min(frame, samples - offset);
    for (let i = 0; i < count; i++) { const sample = v.getInt16(dataOffset + (offset + i) * 2, true) / 32768; sum += sample; squared += sample * sample; peak = Math.max(peak, Math.abs(sample)); }
    // Remove DC offset so a stuck/non-audio input does not count as speech energy.
    const variance = Math.max(0, squared / count - (sum / count) ** 2); energy += variance * count;
    if (Math.sqrt(variance) >= .003) voicedSamples += count;
  }
  const voicedMs = voicedSamples / SPEECH_SAMPLE_RATE * 1000;
  return { duration, sampleRate: SPEECH_SAMPLE_RATE, channels: 1, peak, rms: Math.sqrt(energy / samples), voicedMs, silent: peak < .012 || voicedMs < 60 };
}
