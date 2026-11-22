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
    '--remote-debugging-port=9223',
    '--disable-background-networking',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-sync',
    '--no-first-run',
    'about:blank',
  ]);

  await sleep(1500);

  try {
    const targetsRes = await fetch('http://localhost:9223/json');
    const targets = await targetsRes.json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    console.log('Connected to Chrome CDP for Auth Testing');

    await sendCdp(ws, 'Page.enable');
    await sendCdp(ws, 'DOM.enable');
    await sendCdp(ws, 'Runtime.enable');
    await sendCdp(ws, 'Network.enable');

    // Ensure session cookies are cleared before starting auth tests
    await sendCdp(ws, 'Network.clearBrowserCookies');

    // =========================================================================
    // 1. SIGN UP — Responsive Viewport Suite
    // =========================================================================
    const viewports = [
      { name: 'auth-signup-1920x1080', w: 1920, h: 1080 },
      { name: 'auth-signup-1440x900-en', w: 1440, h: 900 },
      { name: 'auth-signup-1024x768', w: 1024, h: 768 },
      { name: 'auth-signup-768x1024', w: 768, h: 1024 },
      { name: 'auth-signup-390x844', w: 390, h: 844 },
      { name: 'auth-signup-360x800', w: 360, h: 800 },
    ];

    for (const vp of viewports) {
      await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
        width: vp.w,
        height: vp.h,
        deviceScaleFactor: 1,
        mobile: vp.w < 768,
      });

      await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000/sign-up' });
      await sleep(1500);

      const shot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(artifactDir, `${vp.name}.png`), Buffer.from(shot.data, 'base64'));
      console.log(`Saved: ${vp.name}.png`);
    }

    // Set back to 1440x900 for Language Switching & Sign In
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });

    // =========================================================================
    // 2. SIGN UP — Language Variations (Hindi & Telugu) & Error State
    // =========================================================================
    // Switch to Hindi
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[data-lang="hi"]');
        if (btn) btn.click();
      `
    });
    await sleep(800);
    const hiShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-signup-1440x900-hi.png'), Buffer.from(hiShot.data, 'base64'));
    console.log('Saved: auth-signup-1440x900-hi.png');

    // Switch to Telugu
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[data-lang="te"]');
        if (btn) btn.click();
      `
    });
    await sleep(800);
    const teShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-signup-1440x900-te.png'), Buffer.from(teShot.data, 'base64'));
    console.log('Saved: auth-signup-1440x900-te.png');

    // Switch back to English
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const btn = document.querySelector('button[data-lang="en"]');
        if (btn) btn.click();
      `
    });
    await sleep(600);

    // Test and capture validation error state on Sign Up
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        function setInput(el, val) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const nameEl = document.getElementById('full-name') || document.getElementById('name');
        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        const confirmEl = document.getElementById('confirmPassword') || document.getElementById('confirm-password');

        if (nameEl) setInput(nameEl, 'Ravi Kumar');
        if (emailEl) setInput(emailEl, 'ravi@example.com');
        if (passEl) setInput(passEl, 'Secret123');
        if (confirmEl) setInput(confirmEl, 'Mismatch456');

        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
      `
    });
    await sleep(800);
    const errShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-signup-error.png'), Buffer.from(errShot.data, 'base64'));
    console.log('Saved: auth-signup-error.png');

    // =========================================================================
    // 3. SIGN IN — Desktop & Mobile Captures + Languages
    // =========================================================================
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000/sign-in' });
    await sleep(1500);

    const signinEn = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-signin-1440x900-en.png'), Buffer.from(signinEn.data, 'base64'));
    console.log('Saved: auth-signin-1440x900-en.png');

    // Sign In Hindi
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'हिन्दी');
        if (btn) btn.click();
      `
    });
    await sleep(800);
    const signinHi = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-signin-1440x900-hi.png'), Buffer.from(signinHi.data, 'base64'));
    console.log('Saved: auth-signin-1440x900-hi.png');

    // Sign In Mobile (390x844)
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000/sign-in' });
    await sleep(1500);
    const signinMob = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-signin-390x844.png'), Buffer.from(signinMob.data, 'base64'));
    console.log('Saved: auth-signin-390x844.png');

    // =========================================================================
    // 4. FUNCTIONAL FLOW VERIFICATION (Sign In & Redirect to Dashboard)
    // =========================================================================
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: 1440,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    });
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000/sign-in' });
    await sleep(1500);

    // Fill form using native input setter so React state updates
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `
        function setInput(el, val) {
          const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          setter.call(el, val);
          el.dispatchEvent(new Event('input', { bubbles: true }));
          el.dispatchEvent(new Event('change', { bubbles: true }));
        }

        const emailEl = document.getElementById('email');
        const passEl = document.getElementById('password');
        if (emailEl) setInput(emailEl, 'citizen.ravi@example.com');
        if (passEl) setInput(passEl, 'SecretPassword123');

        // Click submit button
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.click();
      `
    });
    console.log('Submitted Sign In form with React events...');
    await sleep(2500);

    // Verify current URL and cookies
    const authState = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `({
        url: window.location.href,
        cookie: document.cookie,
        user: localStorage.getItem('adhikaar_user'),
      })`,
      returnByValue: true,
    });
    console.log('Auth submission state:', authState.result.value);

    // Capture dashboard after successful authentication
    const dashShot = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(artifactDir, 'auth-post-login-dashboard.png'), Buffer.from(dashShot.data, 'base64'));
    console.log('Saved: auth-post-login-dashboard.png');

    // =========================================================================
    // 5. TEST REDIRECT AWAY WHEN ALREADY AUTHENTICATED
    // =========================================================================
    await sendCdp(ws, 'Page.navigate', { url: 'http://localhost:3000/sign-in' });
    await sleep(1500);

    const redirectState = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `window.location.href`,
      returnByValue: true,
    });
    console.log('Attempting /sign-in while authenticated redirected to:', redirectState.result.value);

    ws.close();
  } finally {
    chromeProc.kill();
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
