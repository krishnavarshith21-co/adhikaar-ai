import test from 'node:test';
import assert from 'node:assert/strict';

const origin = process.env.QA_BASE_URL || 'http://localhost:3077';

async function call(path, { cookie, body, headers = {}, method } = {}) {
  const res = await fetch(origin + path, {
    method: method || (body === undefined ? 'GET' : 'POST'),
    headers: {
      Origin: origin,
      'Sec-Fetch-Site': 'same-origin',
      ...(cookie ? { Cookie: cookie } : {}),
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    redirect: 'manual',
  });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return {
    status: res.status,
    data,
    headers: res.headers,
    cookie: res.headers.getSetCookie?.()?.find(v => v.startsWith('adhikaar_session='))?.split(';')[0],
    location: res.headers.get('location'),
  };
}

async function loginDemo(personaId = 'aarohi-rao') {
  const r = await call('/api/auth/demo', { body: { personaId } });
  assert.equal(r.status, 200);
  assert.ok(r.cookie, 'Session cookie must be set');
  return r.cookie;
}

test('Proxy authentication and navigation guardrails', async (t) => {
  await t.test('unauthenticated access to protected routes redirects to /sign-in', async () => {
    for (const path of ['/app', '/app/discover', '/app/eligibility', '/app/preflight', '/dashboard']) {
      const r = await call(path);
      assert.equal(r.status, 307, `Expected 307 redirect for unauthenticated ${path}`);
      assert.ok(r.location?.includes('/sign-in'), `Redirect target should be /sign-in, got ${r.location}`);
    }
  });

  const cookie = await loginDemo('aarohi-rao');

  await t.test('authenticated access to /sign-in and /sign-up redirects to /app', async () => {
    for (const path of ['/sign-in', '/sign-up']) {
      const r = await call(path, { cookie });
      assert.equal(r.status, 307, `Expected 307 redirect for authenticated ${path}`);
      assert.ok(r.location === '/app' || r.location === `${origin}/app`, `Expected redirect to /app, got ${r.location}`);
    }
  });

  await t.test('authenticated access to /dashboard redirects directly to /app', async () => {
    const r = await call('/dashboard', { cookie });
    assert.equal(r.status, 307);
    assert.ok(r.location === '/app' || r.location === `${origin}/app`, `Expected redirect to /app, got ${r.location}`);
  });

  await t.test('all 11 sidebar destinations serve HTTP 200 with session', async () => {
    const sidebarRoutes = [
      '/app',
      '/app/discover',
      '/app/eligibility',
      '/app/preflight',
      '/app/journey',
      '/app/saved',
      '/app/assistant',
      '/app/notifications',
      '/app/profile',
      '/app/settings',
      '/app/help',
    ];

    for (const path of sidebarRoutes) {
      const r = await call(path, { cookie });
      assert.equal(r.status, 200, `Sidebar route ${path} should return HTTP 200`);
      assert.ok(!String(r.data).includes('Application error'), `Route ${path} threw server error`);
    }
  });

  await t.test('all scheme detail pages serve HTTP 200', async () => {
    for (const id of ['pm-vidyalaxmi', 'ts-rythu-bharosa', 'pm-mudra']) {
      const r = await call(`/app/schemes/${id}`, { cookie });
      assert.equal(r.status, 200);
    }
  });

  await t.test('session survives subsequent requests across routes (no reset on navigation)', async () => {
    const r1 = await call('/api/session', { cookie });
    assert.equal(r1.status, 200);
    assert.equal(r1.data.role, 'DEMO_USER');
    assert.equal(r1.data.personaId, 'aarohi-rao');

    await call('/app/discover', { cookie });
    await call('/app/preflight', { cookie });

    const r2 = await call('/api/session', { cookie });
    assert.equal(r2.status, 200);
    assert.equal(r2.data.personaId, 'aarohi-rao');
    assert.equal(r2.data.namespace, r1.data.namespace);
  });

  await t.test('persona switching survives route requests and isolates state', async () => {
    const s1 = await call('/api/session', { cookie });
    const switchRes = await call('/api/demo/switch-persona', {
      cookie,
      body: {
        namespace: s1.data.namespace,
        revision: s1.data.revision,
        personaId: 'ramesh-patil',
      },
    });
    assert.equal(switchRes.status, 200);
    assert.equal(switchRes.data.personaId, 'ramesh-patil');
    assert.equal(switchRes.data.workspace.profile.occupation, 'Farmer');

    // Navigation after switch
    const dash = await call('/app', { cookie });
    assert.equal(dash.status, 200);

    const s2 = await call('/api/session', { cookie });
    assert.equal(s2.data.personaId, 'ramesh-patil');
  });

  await t.test('exit demo cleans up session', async () => {
    const r = await call('/api/auth/logout', { cookie, body: {} });
    assert.equal(r.status, 200);

    const s = await call('/api/session', { cookie });
    assert.equal(s.status, 401);
  });
});
