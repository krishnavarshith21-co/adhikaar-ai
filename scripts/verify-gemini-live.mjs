import assert from 'node:assert';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:3000';

async function main() {
  console.log('--- 1. Authenticate Demo Session ---');
  const loginRes = await fetch(`${BASE_URL}/api/auth/demo`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': BASE_URL,
      'Sec-Fetch-Site': 'same-origin',
    },
    body: JSON.stringify({ personaId: 'aarohi-rao' }),
  });

  assert.strictEqual(loginRes.status, 200, `Login failed: ${loginRes.status}`);
  const setCookies = loginRes.headers.getSetCookie?.() || [loginRes.headers.get('set-cookie') || ''];
  const sessionCookie = setCookies.find(v => v.startsWith('adhikaar_session='))?.split(';')[0];
  assert.ok(sessionCookie, 'Session cookie must be set');
  console.log(`✓ Demo session established: ${sessionCookie.slice(0, 30)}...`);

  // Fetch session view
  const sessRes = await fetch(`${BASE_URL}/api/session`, {
    headers: {
      'Cookie': sessionCookie,
      'Origin': BASE_URL,
      'Sec-Fetch-Site': 'same-origin',
    },
  });
  assert.strictEqual(sessRes.status, 200);
  const view = await sessRes.json();
  const namespace = view.namespace;
  const revision = view.revision;
  console.log(`✓ Session loaded for: ${view.workspace.profile.fullName || view.workspace.profile.name}, namespace: ${namespace}`);

  console.log('\n--- 2. Test Gemini Neural TTS (/api/assistant/speak) ---');
  const ttsLanguages = [
    { lang: 'en', text: 'Welcome to ADHIKAAR AI. You are eligible for the PM Vidyalaxmi scheme.' },
    { lang: 'hi', text: 'अधिकार एआई में आपका स्वागत है। आप पीएम विद्यालक्ष्मी योजना के पात्र हैं।' },
    { lang: 'te', text: 'అధికార్ AI కి స్వాగతం. మీరు పిఎం విద్యాలక్ష్మి పథకానికి అర్హులు.' },
  ];

  for (const { lang, text } of ttsLanguages) {
    const speakRes = await fetch(`${BASE_URL}/api/assistant/speak`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'Origin': BASE_URL,
        'Sec-Fetch-Site': 'same-origin',
      },
      body: JSON.stringify({ text, language: lang }),
    });

    console.log(`  [TTS ${lang}] status: ${speakRes.status}, content-type: ${speakRes.headers.get('content-type')}`);
    assert.strictEqual(speakRes.status, 200, `TTS failed for ${lang}: ${speakRes.status}`);
    const audioBuf = await speakRes.arrayBuffer();
    console.log(`  [TTS ${lang}] received audio buffer: ${audioBuf.byteLength} bytes`);
    assert.ok(audioBuf.byteLength > 1000, `Audio buffer too small: ${audioBuf.byteLength}`);
  }
  console.log('✓ Gemini Neural TTS passed for English, Hindi, and Telugu.');

  console.log('\n--- 3. Test Assistant Chat (/api/assistant/chat) ---');
  const chatQueries = [
    { lang: 'en', message: 'What is PM Vidyalaxmi?' },
    { lang: 'hi', message: 'मुद्रा व्यवसाय ऋण की शर्तें क्या हैं?' },
    { lang: 'te', message: 'రైతు భరోసా అర్హత ఏమిటి?' },
  ];

  for (const { lang, message } of chatQueries) {
    const chatRes = await fetch(`${BASE_URL}/api/assistant/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionCookie,
        'Origin': BASE_URL,
        'Sec-Fetch-Site': 'same-origin',
      },
      body: JSON.stringify({
        message,
        language: lang,
        namespace,
        revision,
      }),
    });

    console.log(`  [Chat ${lang}] status: ${chatRes.status}`);
    assert.strictEqual(chatRes.status, 200, `Chat failed for ${lang}: ${chatRes.status}`);
    const data = await chatRes.json();
    console.log(`  [Chat ${lang}] responseText: ${data.responseText?.slice(0, 80)}...`);
    console.log(`  [Chat ${lang}] verificationStatus: ${data.verificationStatus}, citations: ${data.citations?.length || 0}`);
    assert.ok(data.responseText, 'Response text must be present');
  }
  console.log('✓ Assistant Chat passed for English, Hindi, and Telugu.');

  console.log('\n--- 4. Test Silence Rejection in Audio Transcription (/api/assistant/transcribe) ---');
  const silentWav = createSineWaveWav(1.0, 0.0); // 0 amplitude = silence
  const silentForm = new FormData();
  silentForm.set('audio', new Blob([silentWav], { type: 'audio/wav' }), 'recording.wav');
  silentForm.set('language', 'en');
  silentForm.set('namespace', namespace);

  const silentRes = await fetch(`${BASE_URL}/api/assistant/transcribe`, {
    method: 'POST',
    headers: {
      'Cookie': sessionCookie,
      'Origin': BASE_URL,
      'Sec-Fetch-Site': 'same-origin',
    },
    body: silentForm,
  });
  console.log(`  [STT Silence check] status: ${silentRes.status}`);
  assert.strictEqual(silentRes.status, 422, 'Silence must be rejected with 422');
  const silentData = await silentRes.json();
  console.log(`  [STT Silence check] error code: ${silentData.code}`);
  assert.strictEqual(silentData.code, 'NO_SPEECH');
  console.log('✓ Silence rejection verified.');

  console.log('\n--- 5. Direct Gemini API Live Validation ---');
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const keyMatch = envContent.match(/GEMINI_API_KEY=([^\s]+)/);
  const geminiKey = keyMatch ? keyMatch[1] : null;
  assert.ok(geminiKey, 'GEMINI_API_KEY must be in .env.local');

  // Test Gemini Chat Generation directly
  const geminiChatRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Answer in one sentence: What is PM Vidyalaxmi?' }] }],
      }),
    }
  );
  console.log(`  [Direct Gemini 2.5 Flash] status: ${geminiChatRes.status}`);
  assert.strictEqual(geminiChatRes.status, 200, 'Direct Gemini 2.5 Flash failed');
  const chatJson = await geminiChatRes.json();
  const directText = chatJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  console.log(`  [Direct Gemini 2.5 Flash] response: ${directText?.slice(0, 100)}...`);

  // Test Gemini Multimodal STT directly with a synthesized speech wav
  const ttsForSttRes = await fetch(`${BASE_URL}/api/assistant/speak`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': sessionCookie,
      'Origin': BASE_URL,
      'Sec-Fetch-Site': 'same-origin',
    },
    body: JSON.stringify({ text: 'Hello, how can I help you today?', language: 'en' }),
  });
  assert.strictEqual(ttsForSttRes.status, 200);
  const ttsAudioBuffer = await ttsForSttRes.arrayBuffer();
  const base64Audio = Buffer.from(ttsAudioBuffer).toString('base64');

  const geminiSttRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { inlineData: { mimeType: 'audio/wav', data: base64Audio } },
              { text: 'Transcribe verbatim the spoken words in the audio. Output only the transcript.' },
            ],
          },
        ],
      }),
    }
  );
  console.log(`  [Direct Gemini Multimodal STT] status: ${geminiSttRes.status}`);
  assert.strictEqual(geminiSttRes.status, 200, 'Direct Gemini STT failed');
  const sttJson = await geminiSttRes.json();
  const transcriptText = sttJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
  console.log(`  [Direct Gemini Multimodal STT] transcribed: "${transcriptText}"`);
  assert.ok(transcriptText?.toLowerCase().includes('hello'), 'Transcript should recognize "hello"');

  console.log('\n=== ALL LIVE GEMINI API CHECKS PASSED SUCCESSFULLY ===');
}

function createSineWaveWav(seconds = 1.0, volume = 0.2) {
  const sampleRate = 16000;
  const numSamples = Math.round(sampleRate * seconds);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const text = (offset, str) => {
    for (let i = 0; i < str.length; i++) view.setUint8(offset + i, str.charCodeAt(i));
  };

  text(0, 'RIFF');
  view.setUint32(4, buffer.byteLength - 8, true);
  text(8, 'WAVE');
  text(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // Mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, 'data');
  view.setUint32(40, numSamples * 2, true);

  for (let i = 0; i < numSamples; i++) {
    const sample = volume * Math.sin((2 * Math.PI * 440 * i) / sampleRate);
    const clamped = Math.max(-1, Math.min(1, sample));
    view.setInt16(44 + i * 2, Math.round(clamped * (clamped < 0 ? 32768 : 32767)), true);
  }

  return buffer;
}

main().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
