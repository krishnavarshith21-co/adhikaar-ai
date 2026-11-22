import test from 'node:test';
import assert from 'node:assert/strict';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const { matchesRequestOrigin } = (await import(pathToFileURL(join(process.env.DOMAIN_BUILD, 'server/origin-policy.js')).href)).default;
const check = (url, host, origin, extra = {}) => matchesRequestOrigin(new Request(url, {headers: {...(host ? {host} : {}), ...(origin ? {origin} : {}), ...extra}}));
for (const host of ['localhost:3000', '127.0.0.1:3000', '[::1]:3000', '127.0.0.1:3100']) {
  test(`accept actual same-origin ${host} despite NextURL loopback normalization`, () => assert.equal(check(`http://localhost:${host.split(':').at(-1)}/api/auth/demo`, host, `http://${host}`), true));
}
test('reject host alias crossing rather than allowing every loopback origin', () => {
  assert.equal(check('http://localhost:3100/api/auth/demo', '127.0.0.1:3100', 'http://localhost:3100'), false);
  assert.equal(check('http://localhost:3100/api/auth/demo', 'localhost:3100', 'http://127.0.0.1:3100'), false);
});
test('reject other ports, schemes, null/invalid origins and attackers', () => {
  for (const origin of ['http://localhost:3101', 'https://localhost:3100', 'null', 'https://evil.invalid', 'http://localhost:3100.evil.invalid', 'http://localhost:3100/path']) assert.equal(check('http://localhost:3100/api/auth/demo', 'localhost:3100', origin), false, origin);
});
test('never trust caller-supplied forwarded host', () => assert.equal(check('http://localhost:3100/api/auth/demo', 'localhost:3100', 'https://evil.invalid', {'x-forwarded-host':'evil.invalid', forwarded:'host=evil.invalid;proto=https'}), false));
test('reject malformed host authority', () => {
  for (const host of ['localhost:3100,evil.invalid', 'evil.invalid@localhost:3100', 'localhost:3100/path', 'localhost:3100\\evil', 'localhost:3100?x=1']) assert.equal(check('http://localhost:3100/api/auth/demo', host, 'http://localhost:3100'), false, host);
});
test('HTTPS deployment uses the actual host and retains strict origin comparison', () => {
  assert.equal(check('https://internal:3000/api/auth/demo', 'adhikaar.example', 'https://adhikaar.example'), true);
  assert.equal(check('https://internal:3000/api/auth/demo', 'adhikaar.example', 'http://adhikaar.example'), false);
});
test('preserve requests without Origin and synthetic requests without Host', () => {
  assert.equal(check('http://localhost:3100/api/auth/demo', 'localhost:3100'), true);
  assert.equal(check('http://localhost:3100/api/auth/demo', undefined, 'http://localhost:3100'), true);
});
