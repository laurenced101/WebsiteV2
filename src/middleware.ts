import { defineMiddleware } from 'astro:middleware';
import { createHash } from 'node:crypto';

// /studies password gate (Ticket 25, option b — edge/serverless cookie gate).
// The password lives ONLY in the STUDIES_PASSWORD env var (set in Vercel project
// settings; locally via a .env). It is never shipped to the browser: we validate
// server-side and store an httpOnly cookie holding a salted SHA-256 token (not the
// raw password). Fails closed — if STUDIES_PASSWORD is unset, no input unlocks.
//
// Only /studies* opts into on-demand rendering (prerender = false), so this
// middleware's request-time logic runs there; for prerendered routes it runs at
// build time and the early return makes it a no-op.
const COOKIE = 'studies_auth';
const SALT = 'lds-studies-v1';
const token = (pw: string) => createHash('sha256').update(pw + SALT).digest('hex');

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request, cookies, redirect, locals } = context;
  if (!url.pathname.startsWith('/studies')) return next();

  const password = process.env.STUDIES_PASSWORD ?? '';
  const expected = password ? token(password) : '';

  // Login attempt.
  if (request.method === 'POST') {
    const form = await request.formData();
    const submitted = String(form.get('password') ?? '');
    if (expected && token(submitted) === expected) {
      cookies.set(COOKIE, expected, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        path: '/studies',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
      return redirect(url.pathname, 303);
    }
    locals.studiesGate = true;
    locals.studiesAuthError = true;
    return next();
  }

  // Already unlocked?
  if (expected && cookies.get(COOKIE)?.value === expected) {
    locals.studiesGate = false;
    return next();
  }

  locals.studiesGate = true;
  return next();
});
