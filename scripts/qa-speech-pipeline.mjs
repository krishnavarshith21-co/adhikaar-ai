// Synthetic-audio transport verification; does not certify live recognition accuracy.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const origin=process.env.QA_BASE_URL||'http://127.0.0.1:3104';
const tab=await(await fetch('http://127.0.0.1:9225/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(tab.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let seq=0;const pending=new Map(),checks=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m.result);}});
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const until=async expression=>{for(let i=0;i<150;i++){if(await ev(expression))return;await wait(100);}throw Error('Timed out: '+expression);};
const pass=name=>{checks.push(name);console.log('PASS',name);};
try{
 await send('Page.enable');await send('Runtime.enable');
 await send('Page.addScriptToEvaluateOnNewDocument',{source:`
 window.__speech={uploads:[],tracks:[],recognition:0,chatRequests:0,forceMp4:false};
 const nativeFetch=window.fetch.bind(window);window.fetch=async function(url,init){
  if(String(url).endsWith('/api/assistant/chat'))window.__speech.chatRequests++;
  if(String(url).endsWith('/api/assistant/transcribe')){const file=init.body.get('audio');window.__speech.lastAudio=file;window.__speech.uploads.push({mime:file.type,name:file.name,bytes:file.size,language:init.body.get('language'),mode:init.body.get('languageMode')});}
  return nativeFetch(url,init);
 };
 const originalMedia=navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);navigator.mediaDevices.getUserMedia=async(...args)=>{const s=await originalMedia(...args);window.__speech.tracks.push(...s.getTracks());return s;};
 window.SpeechRecognition=window.webkitSpeechRecognition=function(){window.__speech.recognition++;throw Error('Parallel recognition must never run');};
 const supports=MediaRecorder.isTypeSupported.bind(MediaRecorder);window.__speech.mp4=supports('audio/mp4');MediaRecorder.isTypeSupported=t=>supports(t)&&(!window.__speech.forceMp4||t.startsWith('audio/mp4'));
 `});
 await send('Page.navigate',{url:origin+'/sign-in'});await until("location.pathname==='/sign-in' && document.readyState==='complete'");
 assert.equal(await ev("fetch('/api/auth/demo',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({personaId:'aarohi-rao'})}).then(r=>r.status)"),200);
 await send('Page.navigate',{url:origin+'/app/assistant?speechDebug=1'});await until("!!document.querySelector('#chat-input')");await wait(1200);
 const record=async()=>{await ev("document.querySelector('.chat-composer button[aria-label]').click()");await until("!!document.querySelector('.recording-strip')");await wait(1800);await ev("document.querySelector('.recording-strip button').click()");await until("document.querySelector('.assistant-workspace [role=alert]')?.textContent.includes('not configured')");};
 await record();
 const first=await ev("window.__speech.uploads[0]");assert.equal(first.mime,'audio/wav');assert.equal(first.name,'recording.wav');assert.equal(first.language,'en-IN');assert.equal(first.mode,'hint');assert.ok(first.bytes>10000);pass('Native MediaRecorder audio decodes and uploads a correctly named PCM WAV');
 assert.equal(await ev("document.querySelector('#chat-input').value"),'');assert.equal(await ev('window.__speech.chatRequests'),0);assert.equal(await ev('window.__speech.recognition'),0);pass('Missing API key returns an error; no canned transcript, parallel recognizer, or automatic chat submission');
 if(process.env.QA_PRODUCTION === '1') {
  assert.equal(await ev("document.querySelectorAll('[data-speech-debug] audio').length"),0);
  assert.ok(await ev("window.__speech.tracks.every(t=>t.readyState==='ended')"));
  pass('Production never exposes debug playback even with speechDebug=1; tracks are released');
  await fs.mkdir('.qa-artifacts/speech',{recursive:true});await fs.writeFile('.qa-artifacts/speech/production.json',JSON.stringify({checks,firstUpload:first,liveProviderTested:false},null,2));
 } else {
 assert.ok(await ev("document.querySelectorAll('[data-speech-debug] audio').length===2"));
 const playback=await ev(`(async()=>{const ctx=new AudioContext();try{const original=await fetch(document.querySelector('[data-speech-debug] audio').src).then(r=>r.arrayBuffer());const decoded=await ctx.decodeAudioData(original);const upload=await window.__speech.lastAudio.arrayBuffer();const v=new DataView(upload);return {originalDuration:decoded.duration,uploadDuration:(upload.byteLength-44)/32000,sampleRate:v.getUint32(24,true),channels:v.getUint16(22,true),bits:v.getUint16(34,true),riff:String.fromCharCode(...new Uint8Array(upload,0,4)),debug:document.querySelector('[data-speech-debug]').textContent};}finally{await ctx.close();}})()`);
 assert.equal(playback.sampleRate,16000);assert.equal(playback.channels,1);assert.equal(playback.bits,16);assert.equal(playback.riff,'RIFF');assert.ok(Math.abs(playback.originalDuration-playback.uploadDuration)<.002);pass('Original/upload playback exist in development; decoded duration and PCM header agree');
 assert.ok(await ev("window.__speech.tracks.every(t=>t.readyState==='ended')"));pass('Capture tracks are released after stopping');
 const mp4=await ev('window.__speech.mp4');if(mp4){await ev('window.__speech.forceMp4=true');await ev("[...document.querySelectorAll('button')].find(b=>b.textContent==='Retry Recording').click()");await until("!!document.querySelector('.recording-strip')");await wait(1500);await ev("document.querySelector('.recording-strip button').click()");await until("document.querySelector('.assistant-workspace [role=alert]')?.textContent.includes('not configured')");assert.ok(await ev("document.querySelector('[data-speech-debug]').textContent.includes('audio/mp4')"));pass('Native MP4/AAC also decodes to WAV (Chromium format test, not Safari certification)');}
 const count=await ev('window.__speech.uploads.length');await ev("document.querySelector('.chat-composer button[aria-label]').click()");await until("!!document.querySelector('.recording-strip')");await ev("document.querySelectorAll('.recording-strip button')[1].click()");await wait(500);assert.equal(await ev('window.__speech.uploads.length'),count);assert.ok(await ev("window.__speech.tracks.every(t=>t.readyState==='ended')"));assert.equal(await ev("document.querySelectorAll('[data-speech-debug] audio').length"),0);pass('Cancel uploads nothing and releases tracks and debug playback URLs');
 await fs.mkdir('.qa-artifacts/speech',{recursive:true});await fs.writeFile('.qa-artifacts/speech/browser.json',JSON.stringify({kind:'synthetic fixture transport only',checks,firstUpload:first,playback,mp4Supported:mp4,liveProviderTested:false},null,2));console.log(JSON.stringify({checks:checks.length,firstUpload:first,playback},null,2));
 }
}catch(error){console.log('Diagnostic',await ev("({alerts:[...document.querySelectorAll('[role=alert]')].map(e=>e.textContent),status:document.querySelector('.conversation-status')?.textContent,uploads:window.__speech?.uploads,debug:document.querySelector('[data-speech-debug]')?.textContent})"));throw error;}finally{await send('Target.closeTarget',{targetId:tab.id});ws.close();}
