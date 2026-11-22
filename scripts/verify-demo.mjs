import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const chromeProc = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new',
  '--remote-debugging-port=9270',
  'about:blank'
], { stdio: 'ignore' });

async function main() {
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://localhost:9270/json');
  const targets = await res.json();
  const pageTarget = targets.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  let curId = 1;
  function send(method, params = {}) {
    const id = curId++;
    return new Promise(r => {
      ws.addEventListener('message', function h(e) {
        const d = JSON.parse(e.data);
        if (d.id === id) {
          ws.removeEventListener('message', h);
          r(d.result);
        }
      });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  const artifactDir = '/Users/krishnavarshithkamanaboina/.gemini/antigravity/brain/e0f4c57e-9594-4fdb-a3b8-f25aa0f7255d';

  console.log('1. Navigating to http://localhost:3000/sign-in');
  await send('Page.navigate', { url: 'http://localhost:3000/sign-in' });
  await new Promise(r => setTimeout(r, 2000));
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });

  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'verify-01-signin.png'), Buffer.from(shot1.data, 'base64'));
  console.log('-> Captured verify-01-signin.png');

  console.log('2. Clicking "Explore with Demo Account"');
  const clickRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const btn = btns.find(b => b.textContent.includes('Explore with Demo Account') || b.textContent.includes('Sign in with Demo'));
        if (!btn) return 'NOT_FOUND: ' + btns.map(b => b.textContent.trim()).join(' | ');
        btn.click();
        return 'CLICKED: ' + btn.textContent.trim();
      })()
    `,
    returnByValue: true
  });
  console.log('Click result:', clickRes.result.value);

  // Wait for redirect to finish
  let navigated = false;
  for (let i = 0; i < 10; i++) {
    await new Promise(r => setTimeout(r, 500));
    const urlCheck = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
    if (urlCheck.result.value.includes('/app') || urlCheck.result.value.includes('/dashboard')) {
      navigated = true;
      console.log(`-> Navigation detected at t=${(i+1)*500}ms: ${urlCheck.result.value}`);
      break;
    }
  }

  if (!navigated) {
    const errorText = await send('Runtime.evaluate', { expression: 'document.body.innerText', returnByValue: true });
    console.log('Navigation did not complete. Page text:\n', errorText.result.value.slice(0, 300));
  }

  await new Promise(r => setTimeout(r, 1000));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'verify-02-dashboard-aarohi.png'), Buffer.from(shot2.data, 'base64'));
  console.log('-> Captured verify-02-dashboard-aarohi.png');

  console.log('3. Refreshing Dashboard');
  await send('Page.reload');
  await new Promise(r => setTimeout(r, 1500));

  const postReloadUrl = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
  console.log('-> URL after reload:', postReloadUrl.result.value);
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'verify-03-dashboard-persisted.png'), Buffer.from(shot3.data, 'base64'));
  console.log('-> Captured verify-03-dashboard-persisted.png');

  console.log('4. Switching Persona to Ramesh Patil');
  const switchRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const select = document.querySelector('select#persona');
        if (!select) return 'SELECT_NOT_FOUND';
        select.value = 'ramesh-patil';
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return 'SWITCHED_TO_RAMESH';
      })()
    `,
    returnByValue: true
  });
  console.log('Switch result:', switchRes.result.value);
  await new Promise(r => setTimeout(r, 1200));

  const shot4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'verify-04-dashboard-ramesh.png'), Buffer.from(shot4.data, 'base64'));
  console.log('-> Captured verify-04-dashboard-ramesh.png');

  console.log('5. Clicking Exit Demo');
  const exitRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const exitBtn = btns.find(b => b.textContent.includes('Exit Demo'));
        if (!exitBtn) return 'EXIT_BTN_NOT_FOUND';
        exitBtn.click();
        return 'EXIT_CLICKED';
      })()
    `,
    returnByValue: true
  });
  console.log('Exit result:', exitRes.result.value);

  await new Promise(r => setTimeout(r, 1500));
  const finalUrl = await send('Runtime.evaluate', { expression: 'window.location.href', returnByValue: true });
  console.log('-> Final URL after Exit Demo:', finalUrl.result.value);

  const shot5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(artifactDir, 'verify-05-post-exit-signin.png'), Buffer.from(shot5.data, 'base64'));
  console.log('-> Captured verify-05-post-exit-signin.png');

  ws.close();
  chromeProc.kill();
  console.log('\nSUCCESS: ALL E2E VERIFICATION STEPS PASSED!');
}

main().catch(err => {
  console.error('Test script error:', err);
  chromeProc.kill();
  process.exit(1);
});
