/* eslint-disable @typescript-eslint/no-require-imports */
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const artifactDir = '/Users/krishnavarshithkamanaboina/.gemini/antigravity/brain/e0f4c57e-9594-4fdb-a3b8-f25aa0f7255d';

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 1000000);
    const handler = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener('message', handler);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const chromeProc = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--no-first-run',
    '--enable-gpu',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const targetsRes = await fetch('http://localhost:9222/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    console.log('Connected to Chrome CDP');

    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'DOM.enable');
    await sendCdp(ws, 'Runtime.enable');

    // 1. Capture across viewports
    const viewports = [
      { name: 'responsive-1920x1080', w: 1920, h: 1080 },
      { name: 'responsive-1440x900', w: 1440, h: 900 },
      { name: 'responsive-1280x800', w: 1280, h: 800 },
      { name: 'responsive-768x1024', w: 768, h: 1024 },
      { name: 'responsive-390x844', w: 390, h: 844 },
      { name: 'responsive-360x800', w: 360, h: 800 },
    ];

    for (const vp of viewports) {
      await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768,
      });

      await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000' });
      await sleep(1800);

      const shot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, `${vp.name}.png`), Buffer.from(shot.data, 'base64'));
      console.log(`Saved: ${vp.name}.png`);
    }

    // Reset to 1440x900 for section captures
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // 2. Full Page Screenshot
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000' });
    await sleep(2000);

    const fullShot = await sendCdp(ws, 'Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: true,
    });
    fs.writeFileSync(path.join(artifactDir, 'refactored-fullpage-1440.png'), Buffer.from(fullShot.data, 'base64'));
    console.log('Saved: refactored-fullpage-1440.png');

    // Scroll to Categories section and screenshot
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const catSec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Explore Schemes by Category') || s.textContent.includes('Pan-India Civic Catalog'));
        if (catSec) catSec.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await sleep(800);
    const catShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'section-categories.png'), Buffer.from(catShot.data, 'base64'));
    console.log('Saved: section-categories.png');

    // Scroll to Eligibility section and screenshot
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const eligSec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Transparent Rules Engine') || s.textContent.includes('Know Where You Stand'));
        if (eligSec) eligSec.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await sleep(800);
    const eligShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'section-eligibility.png'), Buffer.from(eligShot.data, 'base64'));
    console.log('Saved: section-eligibility.png');

    // Scroll to Preflight section and screenshot
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const preSec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Application Preflight:') || s.textContent.includes('Catch Document Gaps'));
        if (preSec) preSec.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await sleep(800);
    const preShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'section-preflight.png'), Buffer.from(preShot.data, 'base64'));
    console.log('Saved: section-preflight.png');

    // Scroll to Footer and screenshot
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const footer = document.querySelector('footer');
        if (footer) footer.scrollIntoView({ behavior: 'instant', block: 'center' });
      `
    });
    await sleep(800);
    const footerShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'section-footer.png'), Buffer.from(footerShot.data, 'base64'));
    console.log('Saved: section-footer.png');

    // Scroll to Voice section and screenshot
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const voiceSec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('ADHIKAAR VOICE GUIDE'));
        if (voiceSec) {
          voiceSec.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      `
    });
    await sleep(800);
    const voiceShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'section-voice.png'), Buffer.from(voiceShot.data, 'base64'));
    console.log('Saved: section-voice.png');

    // Scroll to Heritage 3D section and screenshot
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const herSec = Array.from(document.querySelectorAll('section')).find(s => s.textContent.includes('Indian Architectural Heritage'));
        if (herSec) {
          herSec.scrollIntoView({ behavior: 'instant', block: 'center' });
        }
      `
    });
    await sleep(1500);
    const herShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'section-heritage-3d.png'), Buffer.from(herShot.data, 'base64'));
    console.log('Saved: section-heritage-3d.png');

    // 4. Test Hindi Language
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        window.scrollTo(0, 0);
        const hiBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Hindi' || b.textContent.includes('हिन्दी') || b.textContent.includes('हिंदी'));
        if (hiBtn) hiBtn.click();
      `
    });
    await sleep(1500);
    const hiShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'refactored-1440x900-hi.png'), Buffer.from(hiShot.data, 'base64'));
    console.log('Saved: refactored-1440x900-hi.png');

    // 5. Test Telugu Language
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        window.scrollTo(0, 0);
        const teBtn = Array.from(document.querySelectorAll('button')).find(b => b.title === 'Telugu' || b.textContent.includes('తెలుగు'));
        if (teBtn) teBtn.click();
      `
    });
    await sleep(1200);
    const teShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'refactored-1440x900-te.png'), Buffer.from(teShot.data, 'base64'));
    console.log('Saved: refactored-1440x900-te.png');

    // Check lang attribute and localStorage
    const testResult = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `({
        lang: document.documentElement.lang,
        storedLang: localStorage.getItem('adhikaar_lang'),
        title: document.title,
      })`,
      returnByValue: true,
    });
    console.log('State verification:', testResult.result.value);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
