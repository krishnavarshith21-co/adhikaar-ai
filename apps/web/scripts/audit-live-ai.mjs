// Real provider connectivity with synthetic text/audio; NOT physical speech or listening QA.
import fs from 'node:fs/promises';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
process.loadEnvFile('.env.local');
const build=mkdtempSync(join(tmpdir(),'adhikaar-ai-audit-'));
const results=[];await fs.mkdir('.qa-artifacts/audit',{recursive:true});
try {
 const tscPath=createRequire(import.meta.url).resolve('typescript/bin/tsc');
 const c=spawnSync(process.execPath,[tscPath,'--module','commonjs','--target','es2022','--esModuleInterop','--skipLibCheck','--outDir',build,'src/lib/server/ai-provider.ts','src/lib/server/transcription.ts'],{stdio:'inherit'});if(c.status)throw Error('Compilation failed');
 const require=createRequire(import.meta.url);const provider=require(join(build,'server/ai-provider.js'));const {transcribeAudio}=require(join(build,'server/transcription.js'));
 const config=provider.getAiConfig();console.log('Configured provider:',config.provider,'chat:',config.chatModel,'speech:',config.ttsModel);
 if(!config.apiKey)throw Error('No configured provider key');
 let limited=false;
 for(const [language,phrase]of [['en','Hello.'],['hi','नमस्ते।'],['te','నమస్కారం.']]){
  if(limited){results.push({language,status:'BLOCKED',reason:'Earlier provider quota failure; no repeated paid requests'});continue;}
  try{const answer=await provider.generateCivicExplanation({question:'What is ADHIKAAR?',language,programme:'ADHIKAAR AI',untrustedOfficialEvidence:'ADHIKAAR AI is an independent civic preparation platform. It helps people review preliminary programme conditions and prepare questions for the responsible authority. It cannot submit applications or guarantee approval.'},new AbortController().signal);results.push({type:'live text connectivity; supplied application description, not scheme retrieval',language,status:answer?'PASS':'FAIL',responseLanguage:answer?.language});}catch(e){results.push({type:'live text',language,status:'BLOCKED',httpStatus:e.status||null,reason:'Provider unavailable; no secret/raw provider response logged'});if(e.status===429)limited=true;}
  if(limited)continue;
  try{const speech=await provider.generateGeminiSpeech(phrase,language,new AbortController().signal);if(!speech)throw Error('No audio');const bytes=Buffer.from(speech.audioBase64,'base64');await fs.writeFile(`.qa-artifacts/audit/tts-${language}.wav`,bytes);results.push({type:'live TTS transport; not audibly verified',language,status:'PASS',bytes:bytes.length,mime:speech.mimeType});
   // Provider output is decoded by the browser pipeline in normal use. Do not mislabel synthesized speech as a live microphone sample.
   if(speech.mimeType.includes('wav')&&bytes.toString('ascii',0,4)==='RIFF'){
    const audio=new File([bytes],'synthetic-tts.wav',{type:'audio/wav'});
    try{const stt=await transcribeAudio(audio,{apiKey:config.apiKey,provider:config.provider,model:process.env.GEMINI_TRANSCRIBE_MODEL||'gemini-2.5-flash',language,languageMode:'hint',signal:new AbortController().signal});results.push({type:'synthetic TTS audio to live STT; not microphone accuracy',language,status:'PASS',transcript:stt.transcript??stt.text});}catch(e){results.push({type:'synthetic STT',language,status:'BLOCKED',code:e.code||null,httpStatus:e.status||null});}
   }
  }catch(e){results.push({type:'live TTS',language,status:'BLOCKED',httpStatus:e.status||null,reason:'No provider audio returned'});if(e.status===429)limited=true;}
 }
}finally{await fs.writeFile('.qa-artifacts/audit/live-ai-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));rmSync(build,{recursive:true,force:true});}
