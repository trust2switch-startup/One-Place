import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { isValidSignup } from '../server/server.js';

const validSignup = {
  role: 'worker', name: 'Test Person', phone: '9876543210', email: 'test@example.com',
  city: 'Bengaluru', details: 'Looking for work', consent: true,
};

test('landing page and signup page include their expected content', async () => {
  const landingPage = await readFile(new URL('../public/index.html', import.meta.url), 'utf8');
  const signupPage = await readFile(new URL('../public/signup.html', import.meta.url), 'utf8');
  assert.match(landingPage, /Good things happen/);
  assert.match(landingPage, /Admissions/);
  assert.match(landingPage, /Branding & marketing/);
  assert.match(signupPage, /JOIN THE COMMUNITY/);
  assert.match(signupPage, /name="role"/);
  assert.match(signupPage, /name="consent"/);
});

test('signup validation accepts a complete submission', () => {
  assert.equal(isValidSignup(validSignup), true);
});

test('signup validation rejects missing consent, invalid roles and oversized details', () => {
  assert.equal(isValidSignup({ ...validSignup, consent: false }), false);
  assert.equal(isValidSignup({ ...validSignup, role: 'admin' }), false);
  assert.equal(isValidSignup({ ...validSignup, details: 'x'.repeat(2001) }), false);
});
