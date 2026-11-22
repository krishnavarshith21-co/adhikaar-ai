import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = '.qa-artifacts/demo-login'; await fs.mkdir(output, {recursive:true});
const tab = await (await fetch('http://127.0.0.1:9224/json/new?about:blank', {method:'PUT'})).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl); await new Promise(r => ws.addEventListener('open', r, {once:true}));
let nextId=0, failNext=false; const pending=new Map(), requests=new Map(), extras=new Map(), records=[], checks=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++nextId;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
ws.addEventListener('message', async e => {
 const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(m.error);else p.resolve(m.result);return;}
 const p=m.params;
 if(m.method==='Fetch.requestPaused') {
  if(failNext){failNext=false;await send('Fetch.fulfillRequest',{requestId:p.requestId,responseCode:503,responseHeaders:[{name:'Content-Type',value:'application/json'}],body:Buffer.from(JSON.stringify({error:'QA service interruption. Please retry.'})).toString('base64')});}
  else await send('Fetch.continueRequest',{requestId:p.requestId});
 }
 if(m.method==='Network.requestWillBeSentExtraInfo') extras.set(p.requestId,p.headers);
 if(m.method==='Network.requestWillBeSent' && /\/api\/(auth\/(demo|logout)|demo\/switch-persona)$/.test(p.request.url)) requests.set(p.requestId,{url:p.request.url,method:p.request.method});
 if(m.method==='Network.responseReceived' && requests.has(p.requestId)) requests.get(p.requestId).status=p.response.status;
 if(m.method==='Network.loadingFinished' && requests.has(p.requestId)) {
  const row=requests.get(p.requestId), h=extras.get(p.requestId)||{};
  Object.assign(row,{origin:h.Origin||h.origin,host:h.Host||h[':authority'],fetchSite:h['Sec-Fetch-Site']});
  try { const raw=await send('Network.getResponseBody',{requestId:p.requestId}), d=JSON.parse(raw.body), session=d.session||d;
   row.body=d.error?{error:d.error}:{ok:d.ok,role:session.role,personaId:session.personaId,name:session.workspace?.profile?.name};
  } catch { row.body='Response body unavailable'; }
  records.push(row);
 }
});
const ev=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result.value;};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let i=0;i<100;i++){if(await ev(expression))return;await wait(100);}throw Error('Timed out: '+expression);}
const session=()=>ev("fetch('/api/session',{credentials:'same-origin'}).then(async r=>({status:r.status,data:await r.json()}))");
const clickDemo=()=>ev("[...document.querySelectorAll('button')].find(b=>/demo/i.test(b.textContent)&&!b.disabled).click()");
const clickExit=()=>ev("[...document.querySelectorAll('.demo-banner button')].find(b=>b.textContent.includes('Exit Demo')).click()");
function passed(name){checks.push(name);console.log('PASS',name);}
try {
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 for(const origin of ['http://127.0.0.1:3100','http://localhost:3100']) {
  await send('Network.clearBrowserCookies');await send('Page.navigate',{url:origin+'/sign-in'});
  await until("[...document.querySelectorAll('button')].some(b=>/demo/i.test(b.textContent)&&!b.disabled)");
  if(origin.includes('localhost')){
   failNext=true;await send('Fetch.enable',{patterns:[{urlPattern:'*/api/auth/demo',requestStage:'Request'}]});await clickDemo();
   await until("document.querySelector('[role=alert]')?.textContent.includes('QA service interruption. Please retry.')");
   assert.ok(await ev("[...document.querySelectorAll('button')].some(b=>b.textContent==='Retry'&&!b.disabled)"));
   await send('Fetch.disable');await ev("[...document.querySelectorAll('button')].find(b=>b.textContent==='Retry').click()");passed('Actual failure text and enabled retry without stuck spinner');
  }else await clickDemo();
  await until("location.pathname==='/app' && !!document.querySelector('#persona')");
  let s=await session();assert.equal(s.status,200);assert.equal(s.data.role,'DEMO_USER');assert.equal(s.data.personaId,'aarohi-rao');assert.equal(s.data.workspace.profile.name,'Aarohi Rao');assert.equal(s.data.workspace.profile.cultivableLand,'no');
  const cookies=(await send('Network.getCookies',{urls:[origin]})).cookies;const cookie=cookies.find(c=>c.name==='adhikaar_session');assert.ok(cookie?.httpOnly);assert.equal(cookie.sameSite,'Lax');assert.equal(cookie.secure,false);passed(origin+': real demo endpoint sets HTTP-only session and navigates to dashboard');
  await send('Page.reload');await until("document.querySelector('#persona')?.value==='aarohi-rao'");assert.equal((await session()).data.personaId,'aarohi-rao');passed(origin+': refresh preserves session');
  for(const [id,name] of [['ramesh-patil','Ramesh Patil'],['sana-khan','Sana Khan']]){
   await ev(`(()=>{const s=document.querySelector('#persona');s.value=${JSON.stringify(id)};s.dispatchEvent(new Event('change',{bubbles:true}))})()`);
   await until(`document.querySelector('#persona')?.value===${JSON.stringify(id)} && !document.querySelector('#persona').disabled`);
   s=await session();assert.equal(s.data.personaId,id);assert.equal(s.data.workspace.profile.name,name);
  }
  passed(origin+': farmer and entrepreneur persona switches stay isolated');
  await clickExit();await until("location.pathname==='/sign-in'");assert.equal((await session()).status,401);passed(origin+': exit destroys session');
  await until("[...document.querySelectorAll('button')].some(b=>/demo/i.test(b.textContent)&&!b.disabled)");await clickDemo();await until("location.pathname==='/app' && document.querySelector('#persona')?.value==='aarohi-rao'");
  assert.equal((await session()).data.workspace.profile.name,'Aarohi Rao');passed(origin+': sign-in again restores the chosen student fixture');
  await clickExit();await until("location.pathname==='/sign-in'");
 }
 await wait(300); await fs.writeFile(output+'/results.json',JSON.stringify({checks,requests:records},null,2));
 console.log(JSON.stringify({checks:checks.length,loginRequests:records.filter(r=>r.url.endsWith('/api/auth/demo'))},null,2));
}finally{await send('Target.closeTarget',{targetId:tab.id});ws.close();}
