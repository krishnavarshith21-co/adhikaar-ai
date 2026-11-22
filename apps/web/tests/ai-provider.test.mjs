import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { join } from 'node:path';
const require = createRequire(import.meta.url);
const { generateGeminiSpeech, generateCivicExplanation, getAiConfig } = require(join(process.env.DOMAIN_BUILD, 'server/ai-provider.js'));
const originalFetch = globalThis.fetch;
const original = { ...process.env };
test.afterEach(() => { globalThis.fetch = originalFetch; for (const key of ['GEMINI_API_KEY','AI_PROVIDER','GEMINI_TTS_MODEL','OPENAI_API_KEY']) { if(original[key]===undefined) delete process.env[key];else process.env[key]=original[key]; } });
test('mocked Gemini TTS uses Interactions with voice, language style and complete text', async () => {
 process.env.GEMINI_API_KEY='test-only';process.env.AI_PROVIDER='gemini';
 const text='नमस्ते। '.repeat(170);
 globalThis.fetch=async(url,init)=>{assert.equal(url,'https://generativelanguage.googleapis.com/v1beta/interactions');assert.equal(init.headers['x-goog-api-key'],'test-only');const body=JSON.parse(init.body);assert.equal(body.input[0].content[0].text,text.trim());assert.match(body.input[0].content[0].annotations[0].style,/Hindi/);assert.equal(body.generation_config.speech_config[0].voice,'Kore');return Response.json({steps:[{type:'model_output',content:[{type:'audio',data:'V0FWRQ==',mime_type:'audio/wav'}]}]});};
 assert.deepEqual(await generateGeminiSpeech(text,'hi',new AbortController().signal),{audioBase64:'V0FWRQ==',mimeType:'audio/wav'});
});
test('mocked quota errors remain actionable and provider secrets are never echoed',async()=>{
 process.env.GEMINI_API_KEY='test-only';process.env.AI_PROVIDER='gemini';
 globalThis.fetch=async()=>Response.json({error:{message:'sensitive provider detail'}},{status:429});
 await assert.rejects(()=>generateGeminiSpeech('Hello','en',new AbortController().signal),e=>e.status===429&&!e.message.includes('sensitive'));
 globalThis.fetch=async()=>Response.json({error:{message:'sensitive provider detail'}},{status:400});
 await assert.rejects(()=>generateCivicExplanation({question:'Hello',language:'en',programme:'PMMY',untrustedOfficialEvidence:'Evidence'},new AbortController().signal),e=>e.status===502&&!e.message.includes('sensitive'));
});
test('mocked malformed model output returns no unvalidated explanation',async()=>{
 process.env.GEMINI_API_KEY='test-only';process.env.AI_PROVIDER='gemini';
 globalThis.fetch=async()=>Response.json({candidates:[{content:{parts:[{text:'not JSON'}]}}]});
 assert.equal(await generateCivicExplanation({question:'Hello',language:'en',programme:'PMMY',untrustedOfficialEvidence:'Evidence'},new AbortController().signal),null);
});
test('unsupported provider configuration is rejected',()=>{process.env.AI_PROVIDER='bogus';assert.throws(getAiConfig,/Unsupported/);});
