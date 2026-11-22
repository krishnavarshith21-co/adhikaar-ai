// Requires an isolated Chromium session with --remote-debugging-port=9223.
// No browser package or application dependency is installed by this script.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
const output = process.env.QA_OUTPUT || '.qa-artifacts/heritage';
await fs.mkdir(output, { recursive: true });
const cdpURL = process.env.QA_CDP_URL || 'http://127.0.0.1:9223/json/list';
const tab = await (await fetch(cdpURL.replace('/json/list', '/json/new?about:blank'), {method: 'PUT'})).json();
const ws = new WebSocket(tab.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r, { once: true }));
let serial = 0; const callbacks = new Map(), errors = [], results = [];
ws.addEventListener('message', e => {
  const m = JSON.parse(e.data);
  if (m.id) { const c = callbacks.get(m.id); callbacks.delete(m.id); if (m.error) c.reject(m.error); else c.resolve(m.result); }
  else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails);
  else if (m.method === 'Runtime.consoleAPICalled' && ['warning', 'error'].includes(m.params.type)) errors.push({source: 'console', text: m.params.args.map(a => a.value || a.description).join(' ')});
  else if (m.method === 'Log.entryAdded' && ['error', 'warning'].includes(m.params.entry.level)) errors.push(m.params.entry);
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const id = ++serial; callbacks.set(id, { resolve, reject }); ws.send(JSON.stringify({ id, method, params })); });
const evaluate = async expression => (await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result.value;
const wait = ms => new Promise(r => setTimeout(r, ms));
const rotation = () => evaluate("Number(document.querySelector('.heritage-stage canvas')?.dataset.rotation)");
const centre = async () => { await wait(500); await evaluate("document.querySelector('.heritage-card').scrollIntoView({block:'center',behavior:'instant'})"); await wait(1200); };
async function screenshot(name) { const clip = await evaluate('({x:0,y:scrollY,width:document.documentElement.clientWidth,height:innerHeight,scale:1})'); const shot = await send('Page.captureScreenshot', { format: 'png', clip, captureBeyondViewport: true }); await fs.writeFile(`${output}/${name}.png`, Buffer.from(shot.data, 'base64')); }
async function size(width, height, mobile = false) { await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile }); await centre(); }
async function check(name, fn) { await fn(); results.push(name); console.log('PASS', name); }
try {
  await send('Page.enable'); await send('Runtime.enable'); await send('Log.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
  await send('Page.navigate', { url: process.env.QA_BASE_URL || 'http://127.0.0.1:3102' });
  await wait(4500); await centre(); await wait(2000);
  await check('WebGL model loads and continuously moves', async () => { const a = await rotation(); await wait(1100); const b = await rotation(); assert.ok(Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) > .0001); });
  await check('Pause holds a stable view', async () => { await evaluate("document.querySelector('[aria-label=\"Pause sculpture rotation\"]').click()"); await wait(1200); const a = await rotation(); await wait(800); assert.ok(Math.abs(a - await rotation()) < .0002); });
  await screenshot('desktop');
  await check('Mouse drag rotates within limits and keyboard reset works', async () => {
    const rect = await evaluate("document.querySelector('.heritage-stage').getBoundingClientRect().toJSON()");
    const x = rect.x + rect.width / 2, y = rect.y + rect.height / 2;
    const before = await rotation();
    await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y });
    await send('Input.dispatchMouseEvent', { type: 'mousePressed', button: 'left', clickCount: 1, x, y });
    for (let i = 1; i <= 8; i++) { await send('Input.dispatchMouseEvent', { type: 'mouseMoved', button: 'left', buttons: 1, x: x + i * 20, y }); await wait(25); }
    await send('Input.dispatchMouseEvent', { type: 'mouseReleased', button: 'left', clickCount: 1, x: x + 160, y });
    await wait(1200); assert.ok(Math.abs(before - await rotation()) > .3); assert.ok(Math.abs(await rotation()) < 1.1);
    await screenshot('dragged');
    await evaluate("document.querySelector('.heritage-stage').focus()"); await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Home', code: 'Home' }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Home', code: 'Home' }); await wait(1200);
    assert.ok(Math.abs(await rotation()) < .2);
  });
  await check('Reduced motion is stable and remains manually operable', async () => {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); await wait(1000);
    assert.equal(await evaluate("document.querySelector('.heritage-viewer').dataset.motion"), 'paused');
    const a = await rotation(); await wait(1000); assert.ok(Math.abs(a - await rotation()) < .0002);
    await evaluate("document.querySelector('.heritage-stage').focus()"); await send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowRight', code: 'ArrowRight' }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowRight', code: 'ArrowRight' }); await wait(1000); assert.ok(Math.abs(a - await rotation()) > .05);
    await evaluate("document.querySelector('[aria-label=\"Reset sculpture view\"]').click()"); await wait(1000);
  });
  for (const [name, width, height] of [['tablet', 834, 1112], ['mobile', 390, 844], ['small-mobile', 320, 740]]) {
    await check(`${name}: bounded canvas and no horizontal overflow`, async () => {
      await size(width, height, name.includes('mobile'));
      const bounds = await evaluate("({width:document.documentElement.scrollWidth,viewport:innerWidth,canvas:document.querySelector('.heritage-stage canvas').getBoundingClientRect().toJSON(),card:document.querySelector('.heritage-card').getBoundingClientRect().toJSON()})");
      assert.equal(bounds.width, width); assert.equal(bounds.viewport, width); assert.ok(bounds.canvas.left >= 0 && bounds.canvas.right <= width); assert.ok(bounds.card.right <= width); await screenshot(name);
    });
  }
  await check('Touch can inspect horizontally while vertical swipes scroll the page', async () => {
    await size(390, 844, true); await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 1 });
    const r = await evaluate("document.querySelector('.heritage-stage').getBoundingClientRect().toJSON()"); const x = r.x + r.width / 2, y = r.y + r.height / 2;
    const a = await rotation(); await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let i = 1; i <= 6; i++) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: x + i * 12, y }] }); await wait(40); }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await wait(1000); assert.ok(Math.abs(a - await rotation()) > .15);
    const scroll = await evaluate('scrollY'); await send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: y + 50 }] });
    for (let i = 1; i <= 6; i++) { await send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y + 50 - i * 20 }] }); await wait(40); }
    await send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] }); await wait(500); assert.ok(Math.abs(await evaluate('scrollY') - scroll) > 30);
  });
  await check('Offscreen section stops automatic rendering', async () => {
    await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await centre(); await evaluate("document.querySelector('[aria-label=\"Resume sculpture rotation\"]')?.click()"); await wait(500); await evaluate('scrollTo(0,0)'); await wait(1000);
    assert.equal(await evaluate("document.querySelector('.heritage-viewer').dataset.motion"), 'paused'); const a = await rotation(); await wait(800); assert.ok(Math.abs(a - await rotation()) < .0002);
  });
  await check('Page visibility changes pause and resume animation', async () => {
    await centre(); await wait(500);
    await evaluate("Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'))"); await wait(500);
    assert.equal(await evaluate("document.querySelector('.heritage-viewer').dataset.motion"), 'paused');
    await evaluate("delete document.visibilityState;document.dispatchEvent(new Event('visibilitychange'))"); await wait(500);
    assert.equal(await evaluate("document.querySelector('.heritage-viewer').dataset.motion"), 'running');
  });
  // An unauthenticated landing page probes /api/session; those existing 401s are unrelated to WebGL.
  const unexpected = errors.filter(e => !e.url?.endsWith('/api/session') && !e.text?.includes('CONTEXT_LOST_WEBGL') && !e.text?.includes('Clock: This module has been deprecated'));
  assert.deepEqual(unexpected, [], 'No unexpected page/WebGL errors');
  await check('WebGL context loss displays the accessible static reference', async () => {
    await centre(); await evaluate("document.querySelector('.heritage-stage canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext()"); await wait(1000);
    assert.ok(await evaluate("!!document.querySelector('.heritage-fallback img')")); assert.equal(await evaluate("!!document.querySelector('.heritage-stage canvas')"), false); await screenshot('fallback');
  });
  await check('Unavailable WebGL is handled by the static-image error boundary', async () => {
    const script = await send('Page.addScriptToEvaluateOnNewDocument', { source: "const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.startsWith('webgl')?null:original.call(this,type,...args)}" });
    await send('Page.reload'); await wait(2500); await centre(); await wait(1200);
    assert.ok(await evaluate("!!document.querySelector('.heritage-card .heritage-fallback img')"));
    assert.equal(await evaluate("!!document.querySelector('.heritage-card canvas')"), false);
    await screenshot('webgl-unavailable');
    await send('Page.removeScriptToEvaluateOnNewDocument', { identifier: script.identifier });
  });
  await fs.writeFile(`${output}/results.json`, JSON.stringify({ results, observedConsoleEntries: errors }, null, 2));
  console.log(`${results.length} checks passed. Screenshots: ${output}`);
} finally { await send('Target.closeTarget', {targetId: tab.id}); ws.close(); }
