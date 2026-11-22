import test from 'node:test';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const load = async path => (await import(pathToFileURL(join(process.env.DOMAIN_BUILD,path)).href)).default;
const { captureType, languageHint, encodeMonoWav, inspectPcmWav } = await load('domain/speech-audio.js');
const { transcribeAudio } = await load('server/transcription.js');
const wave = (seconds=.7, volume=.2) => encodeMonoWav(Float32Array.from({length:Math.round(16000*seconds)},(_,i)=>volume*Math.sin(2*Math.PI*440*i/16000)));
const file = (seconds=.7) => new File([wave(seconds)],'recording.wav',{type:'audio/wav'});
const options = extra => ({apiKey:'test-only-key',language:'en-IN',signal:new AbortController().signal,...extra});
const response = (text, extra={}) => Response.json({text,language:'english',segments:[{text,no_speech_prob:.01,avg_logprob:-.1,compression_ratio:1.1}],...extra});

test('capture formats honor runtime support, including Safari MP4/AAC',()=>{
 assert.equal(captureType(m=>m==='audio/mp4'),'audio/mp4');assert.equal(captureType(m=>m==='audio/webm;codecs=opus'),'audio/webm;codecs=opus');assert.equal(captureType(()=>false),undefined);
});
test('PCM preserves duration, sample rate, signal and container size',()=>{const b=wave(1.25),m=inspectPcmWav(b);assert.equal(m.duration,1.25);assert.equal(m.sampleRate,16000);assert.equal(m.channels,1);assert.equal(b.byteLength,40044);assert.equal(m.silent,false);assert.ok(Math.abs(m.rms-.2/Math.sqrt(2))<.001);});
test('silence and a stuck DC signal are rejected without contacting any provider',async()=>{for(const samples of [new Float32Array(8000),new Float32Array(8000).fill(.2)]){const f=new File([encodeMonoWav(samples)],'recording.wav',{type:'audio/wav'});await assert.rejects(transcribeAudio(f,options({fetcher:()=>assert.fail('must not call provider')})),e=>e.code==='NO_SPEECH');}});
test('empty, truncated, mislabeled and out-of-range audio never reaches provider',async()=>{
 for(const f of [new File([],'empty.wav',{type:'audio/wav'}),new File([wave().slice(0,100)],'truncated.wav',{type:'audio/wav'}),new File([wave()],'wrong.mp4',{type:'audio/mp4'}),new File([new Uint8Array(1000)],'fake.wav',{type:'audio/wav'}),file(.1),file(61)])await assert.rejects(transcribeAudio(f,options({fetcher:()=>assert.fail('must not call provider')})),e=>['INVALID_AUDIO'].includes(e.code));
});
for(const [phrase,locale,code] of [['Hello','en-IN','en'],['How are you?','en-IN','en'],['I need a scholarship','en-IN','en'],['नमस्ते','hi-IN','hi'],['నమస్కారం','te-IN','te']]){
 test(`adapter passthrough, NOT live recognition: ${phrase}`,async()=>{
  const audio=file();const result=await transcribeAudio(audio,options({language:locale,fetcher:async(url,init)=>{
   assert.equal(url,'https://api.openai.com/v1/audio/transcriptions');assert.equal(init.body.get('language'),code);assert.equal(init.body.get('model'),'whisper-1');assert.equal(init.body.get('response_format'),'verbose_json');assert.equal(init.body.has('prompt'),false);
   const upload=init.body.get('file');assert.equal(upload.name,'recording.wav');assert.equal(upload.type,'audio/wav');assert.deepEqual(new Uint8Array(await upload.arrayBuffer()),new Uint8Array(await audio.arrayBuffer()));return response(phrase);
  }}));assert.equal(result.transcript,phrase);assert.equal(result.isIllustrative,undefined);
 });
}
test('language codes normalize only supported locales',()=>{assert.equal(languageHint('en-IN'),'en');assert.equal(languageHint('hi-IN'),'hi');assert.equal(languageHint('te-IN'),'te');assert.equal(languageHint('unknown'),null);});
test('long recordings and explicit mixed-language mode omit forced language',async()=>{for(const [seconds,mode]of [[12.5,'hint'],[.7,'auto']]){const result=await transcribeAudio(file(seconds),options({language:'te-IN',languageMode:mode,fetcher:async(_,init)=>{assert.equal(init.body.has('language'),false);return response('Hello నమస్కారం');}}));assert.equal(result.languageMode,'auto');}});
test('missing key never returns a fabricated transcript',async()=>{await assert.rejects(transcribeAudio(file(),options({apiKey:undefined,fetcher:()=>assert.fail('must not call provider')})),e=>e.status===503&&e.code==='NOT_CONFIGURED');});
test('low-confidence, no-speech, repetitions and missing confidence reject instead of fabricating',async()=>{
 for(const data of [{text:'Hello',segments:[]},{text:'Hello',segments:[{text:'Hello',avg_logprob:-1.4,no_speech_prob:.1}]},{text:'Hello',segments:[{text:'Hello',avg_logprob:-.1,no_speech_prob:.95}]},{text:'Hello Hello Hello',segments:[{text:'Hello Hello Hello',avg_logprob:-.1,no_speech_prob:.1,compression_ratio:3}]},{text:'...'},{}])await assert.rejects(transcribeAudio(file(),options({fetcher:async()=>Response.json(data)})),e=>e.code==='UNCLEAR_SPEECH');
});
test('provider failures and unsupported model return actionable errors',async()=>{await assert.rejects(transcribeAudio(file(),options({fetcher:async()=>Response.json({error:'bad key'},{status:401})})),e=>e.status===502);await assert.rejects(transcribeAudio(file(),options({model:'unsupported'})),e=>e.code==='INVALID_MODEL');});
test('exhausted provider credit is actionable and distinct from a temporary rate limit',async()=>{
 for(const error of [{code:'credit_balance_exhausted',type:'insufficient_quota'},{code:'insufficient_quota'},{type:'insufficient_quota'}]) {
  await assert.rejects(transcribeAudio(file(),options({fetcher:async()=>Response.json({error:{...error,message:'private upstream details'}},{status:429})})),e=>e.status===503&&e.code==='PROVIDER_QUOTA_EXHAUSTED'&&e.message.includes('billing')&&!e.message.includes('private upstream details'));
 }
 await assert.rejects(transcribeAudio(file(),options({fetcher:async()=>Response.json({error:{code:'rate_limit_exceeded'}},{status:429})})),e=>e.status===502&&e.code==='PROVIDER_UNAVAILABLE');
});
test('JSON transcription models request and validate log probabilities',async()=>{
 const opts=options({model:'gpt-4o-transcribe',fetcher:async(_,init)=>{assert.equal(init.body.get('response_format'),'json');assert.equal(init.body.get('include[]'),'logprobs');return Response.json({text:'Hello',logprobs:[{token:'Hello',logprob:-.05}]});}});assert.equal((await transcribeAudio(file(),opts)).transcript,'Hello');
 await assert.rejects(transcribeAudio(file(),{...opts,fetcher:async()=>Response.json({text:'Wrong words',logprobs:[{logprob:-3}]})}),e=>e.code==='UNCLEAR_SPEECH');
});
test('production never logs provider text even with debugging requested',async()=>{
 const oldEnv=process.env.NODE_ENV, debug=console.debug;process.env.NODE_ENV='production';console.debug=()=>assert.fail('no production transcription logs');
 try{await transcribeAudio(file(),options({debug:true,fetcher:async()=>response('Hello')}));}finally{console.debug=debug;if(oldEnv===undefined)delete process.env.NODE_ENV;else process.env.NODE_ENV=oldEnv;}
});

test('mocked Gemini forwards exact WAV bytes and keeps keys out of URLs',async()=>{
 const audio=file();const result=await transcribeAudio(audio,options({provider:'gemini',model:'gemini-2.5-flash',language:'hi-IN',fetcher:async(url,init)=>{
 assert.equal(new URL(url).search,'');assert.equal(init.headers['x-goog-api-key'],'test-only-key');const body=JSON.parse(init.body);assert.deepEqual(Buffer.from(body.contents[0].parts[0].inlineData.data,'base64'),Buffer.from(await audio.arrayBuffer()));assert.match(body.contents[0].parts[1].text,/Devanagari/);return Response.json({candidates:[{content:{parts:[{text:'नमस्ते'}]}}]});
 }}));assert.equal(result.transcript,'नमस्ते');assert.equal(result.provider,'gemini');
});
test('mocked Gemini mixed-language mode does not force the selected language',async()=>{
 for(const [seconds,mode]of [[12.5,'hint'],[.7,'auto']]) await transcribeAudio(file(seconds),options({provider:'gemini',model:'gemini-2.5-flash',language:'hi',languageMode:mode,fetcher:async(_,init)=>{const prompt=JSON.parse(init.body).contents[0].parts[1].text;assert.match(prompt,/Detect the spoken language/);assert.doesNotMatch(prompt,/contains Hindi/);return Response.json({candidates:[{content:{parts:[{text:'Hello नमस्ते'}]}}]});}}));
});
test('mocked Gemini no-speech and quota never fabricate a transcript',async()=>{
 for(const [response,status]of [[Response.json({candidates:[{content:{parts:[{text:'[NO_SPEECH]'}]}}]}),422],[Response.json({error:{message:'private upstream message'}},{status:429}),503]])await assert.rejects(transcribeAudio(file(),options({provider:'gemini',model:'gemini-2.5-flash',fetcher:async()=>response})),e=>e.status===status&&!e.message.includes('private upstream'));
});
