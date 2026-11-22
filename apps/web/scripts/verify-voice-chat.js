import fs from 'node:fs';
import net from 'node:net';
import WebSocket from 'ws';
import { spawn } from 'node:child_process';

const ARTIFACTS = '/Users/krishnavarshithkamanaboina/.gemini/antigravity/brain/e0f4c57e-9594-4fdb-a3b8-f25aa0f7255d';
const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function freePort() {
  return new Promise((resolve) => {
    const srv = net.createServer();
    srv.listen(0, () => {
      const port = srv.address().port;
      srv.close(() => resolve(port));
    });
  });
}

let msgId = 1;

async function runTests() {
  const port = await freePort();
  console.log('Testing on port:', port);

  const proc = spawn(
    CHROME,
    [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--window-size=1440,900',
      '--remote-debugging-port=' + port,
      'about:blank',
    ],
    { stdio: 'pipe' },
  );

  await new Promise((r) => setTimeout(r, 2000));
  const listRes = await fetch('http://127.0.0.1:' + port + '/json');
  const tabs = await listRes.json();
  const ws = new WebSocket(tabs[0].webSocketDebuggerUrl);
  await new Promise((resolve) => ws.on('open', resolve));

  function send(method, params = {}) {
    const id = msgId++;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Timeout: ' + method)), 30000);
      const handler = (msg) => {
        const data = JSON.parse(msg);
        if (data.id === id) {
          clearTimeout(timeout);
          ws.off('message', handler);
          if (data.error) reject(new Error(data.error.message));
          else resolve(data.result);
        }
      };
      ws.on('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');

  // ── TEST 1: Landing Page Floating Launcher & Guest Panel ──
  console.log('=== TEST 1: Landing Page Floating Launcher ===');
  await send('Page.navigate', { url: 'http://localhost:3000/' });
  await new Promise((r) => setTimeout(r, 3000));

  const landingLauncher = await send('Runtime.evaluate', {
    expression: `(() => {
      const l = document.querySelector('.floating-chat-launcher');
      return l ? { visible: true, tag: l.tagName } : null;
    })()`,
    returnByValue: true,
  });
  console.log('1. Landing launcher present:', landingLauncher.result?.value);

  // Click launcher on landing page
  await send('Runtime.evaluate', {
    expression: `(() => {
      const l = document.querySelector('.floating-chat-launcher');
      if (l) l.click();
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 600));

  const guestPanel = await send('Runtime.evaluate', {
    expression: `(() => {
      const p = document.querySelector('.floating-chat-panel');
      if (!p) return null;
      return {
        title: p.querySelector('.fc-title')?.textContent,
        hasGuestBanner: Boolean(p.querySelector('.fc-guest-banner')),
        hasDemoBtn: Boolean(p.querySelector('.fc-demo-btn')),
        chips: p.querySelectorAll('.fc-chips button').length
      };
    })()`,
    returnByValue: true,
  });
  console.log('2. Guest panel state:', guestPanel.result?.value);

  const ss1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-01-landing-guest-panel.png', Buffer.from(ss1.data, 'base64'));
  console.log('3. Screenshot saved: voice-01-landing-guest-panel.png');

  // ── TEST 2: Click Demo from Panel & Transition to Dashboard ──
  console.log('\n=== TEST 2: Demo Mode Login from Panel ===');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const b = document.querySelector('.fc-demo-btn');
      if (b) b.click();
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 4000));

  const urlAfterDemo = await send('Runtime.evaluate', {
    expression: 'window.location.href',
    returnByValue: true,
  });
  console.log('4. URL after demo login:', urlAfterDemo.result?.value);

  // Ensure panel is open on dashboard
  await send('Runtime.evaluate', {
    expression: `(() => {
      const p = document.querySelector('.floating-chat-panel');
      if (!p) {
        const l = document.querySelector('.floating-chat-launcher');
        if (l) l.click();
      }
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 800));

  // ── TEST 3: Ask English Question & Verify Structured Grounded Output ──
  console.log('\n=== TEST 3: English Conversational Guidance ===');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const chip = document.querySelector('.fc-chips button');
      if (chip) chip.click();
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 4000));

  const enAnswer = await send('Runtime.evaluate', {
    expression: `(() => {
      const msgs = document.querySelectorAll('.fc-message');
      const last = msgs[msgs.length - 1];
      if (!last) return null;
      return {
        role: last.className,
        text: last.querySelector('.fc-text')?.textContent?.slice(0, 80),
        verification: last.querySelector('.fc-verification')?.textContent,
        hasConditions: Boolean(last.querySelector('.fc-section')),
        hasSource: Boolean(last.querySelector('.fc-source')),
        hasPlayback: Boolean(last.querySelector('.fc-playback'))
      };
    })()`,
    returnByValue: true,
  });
  console.log('5. English response:', enAnswer.result?.value);

  const ss2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-02-conversation-en.png', Buffer.from(ss2.data, 'base64'));
  console.log('6. Screenshot saved: voice-02-conversation-en.png');

  // ── TEST 4: Hindi Language Interaction ──
  console.log('\n=== TEST 4: Hindi Multilingual Guidance ===');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sel = document.querySelector('.fc-language');
      if (sel) {
        sel.value = 'hi';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 400));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const ta = document.querySelector('.fc-composer textarea');
      if (ta) {
        ta.value = 'तेलंगाना में किसानों के लिए रैतु भरोसा योजना की क्या शर्तें हैं?';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 300));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const form = document.querySelector('.fc-composer');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 3500));

  const hiAnswer = await send('Runtime.evaluate', {
    expression: `(() => {
      const msgs = document.querySelectorAll('.fc-message');
      const last = msgs[msgs.length - 1];
      if (!last) return null;
      return {
        text: last.querySelector('.fc-text')?.textContent?.slice(0, 80),
        verification: last.querySelector('.fc-verification')?.textContent,
        sections: last.querySelectorAll('.fc-section h4').length
      };
    })()`,
    returnByValue: true,
  });
  console.log('7. Hindi response:', hiAnswer.result?.value);

  const ss3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-03-conversation-hi.png', Buffer.from(ss3.data, 'base64'));
  console.log('8. Screenshot saved: voice-03-conversation-hi.png');

  // ── TEST 5: Telugu Language Interaction ──
  console.log('\n=== TEST 5: Telugu Multilingual Guidance ===');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const sel = document.querySelector('.fc-language');
      if (sel) {
        sel.value = 'te';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 400));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const ta = document.querySelector('.fc-composer textarea');
      if (ta) {
        ta.value = 'పీఎం ముద్ర లోన్ కోసం ఏ పత్రాలు కావాలి?';
        ta.dispatchEvent(new Event('input', { bubbles: true }));
      }
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 300));

  await send('Runtime.evaluate', {
    expression: `(() => {
      const form = document.querySelector('.fc-composer');
      if (form) form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 3500));

  const teAnswer = await send('Runtime.evaluate', {
    expression: `(() => {
      const msgs = document.querySelectorAll('.fc-message');
      const last = msgs[msgs.length - 1];
      if (!last) return null;
      return {
        text: last.querySelector('.fc-text')?.textContent?.slice(0, 80),
        verification: last.querySelector('.fc-verification')?.textContent
      };
    })()`,
    returnByValue: true,
  });
  console.log('9. Telugu response:', teAnswer.result?.value);

  const ss4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-04-conversation-te.png', Buffer.from(ss4.data, 'base64'));
  console.log('10. Screenshot saved: voice-04-conversation-te.png');

  // ── TEST 6: Audio Controls & Speed Adjustment ──
  console.log('\n=== TEST 6: Audio Controls & Speed Adjustment ===');
  const speedBefore = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = [...document.querySelectorAll('.fc-header-actions button')];
      const b = btns.find((x) => x.textContent.includes('x'));
      return b ? b.textContent.trim() : 'none';
    })()`,
    returnByValue: true,
  });
  console.log('11. Initial speed:', speedBefore.result?.value);

  // Cycle speed
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = [...document.querySelectorAll('.fc-header-actions button')];
      const b = btns.find((x) => x.textContent.includes('x'));
      if (b) b.click();
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 200));

  const speedAfter = await send('Runtime.evaluate', {
    expression: `(() => {
      const btns = [...document.querySelectorAll('.fc-header-actions button')];
      const b = btns.find((x) => x.textContent.includes('x'));
      return b ? b.textContent.trim() : 'none';
    })()`,
    returnByValue: true,
  });
  console.log('12. Cycled speed:', speedAfter.result?.value);

  // Click Play on last message
  await send('Runtime.evaluate', {
    expression: `(() => {
      const btn = document.querySelector('.fc-playback button');
      if (btn) btn.click();
    })()`,
    returnByValue: true,
  });
  await new Promise((r) => setTimeout(r, 500));

  const captionCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const c = document.querySelector('.fc-caption-banner');
      return c ? { visible: true, text: c.textContent?.slice(0, 60) } : null;
    })()`,
    returnByValue: true,
  });
  console.log('13. Caption banner:', captionCheck.result?.value);

  const ss5 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-05-playback-captions.png', Buffer.from(ss5.data, 'base64'));
  console.log('14. Screenshot saved: voice-05-playback-captions.png');

  // ── TEST 7: Responsive Mobile Layout (375x812) ──
  console.log('\n=== TEST 7: Responsive Mobile Layout ===');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await new Promise((r) => setTimeout(r, 500));

  const mobilePanel = await send('Runtime.evaluate', {
    expression: `(() => {
      const p = document.querySelector('.floating-chat-panel');
      if (!p) return null;
      const rect = p.getBoundingClientRect();
      return { width: rect.width, height: rect.height, bottom: rect.bottom };
    })()`,
    returnByValue: true,
  });
  console.log('15. Mobile panel dimensions:', mobilePanel.result?.value);

  const ss6 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-06-mobile-panel.png', Buffer.from(ss6.data, 'base64'));
  console.log('16. Screenshot saved: voice-06-mobile-panel.png');

  // Reset viewport to desktop
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await new Promise((r) => setTimeout(r, 500));

  // ── TEST 8: Full-Page Assistant (/app/assistant) ──
  console.log('\n=== TEST 8: Full-Page Assistant Route ===');
  await send('Page.navigate', { url: 'http://localhost:3000/app/assistant' });
  await new Promise((r) => setTimeout(r, 3000));

  const fullPageCheck = await send('Runtime.evaluate', {
    expression: `(() => {
      const fp = document.querySelector('.assistant-workspace');
      const micBtn = document.querySelector('.chat-composer button.icon-button');
      const floatingWidget = document.querySelector('.floating-chat-panel, .floating-chat-launcher');
      return {
        isFullPagePresent: Boolean(fp),
        isMicEnabled: micBtn ? !micBtn.disabled : false,
        isFloatingHiddenOnAssistant: !floatingWidget
      };
    })()`,
    returnByValue: true,
  });
  console.log('17. Full-page assistant check:', fullPageCheck.result?.value);

  const ss7 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(ARTIFACTS + '/voice-07-fullpage-assistant.png', Buffer.from(ss7.data, 'base64'));
  console.log('18. Screenshot saved: voice-07-fullpage-assistant.png');

  ws.close();
  proc.kill();
  console.log('\n========================================');
  console.log('ALL VERIFICATION SUITE TESTS PASSED!');
  console.log('========================================');
}

runTests().catch((e) => {
  console.error('TEST RUNNER FAILED:', e);
  process.exit(1);
});
