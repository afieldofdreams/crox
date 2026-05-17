// Initialises PostHog on the client. No-op if PUBLIC_POSTHOG_KEY is unset
// (e.g. during local dev without secrets) so the rest of the page keeps working.
//
// Components can use `window.posthog?.capture(...)` directly — see
// AssessmentQuiz.tsx.
import posthog from 'posthog-js';

const KEY = import.meta.env.PUBLIC_POSTHOG_KEY;
const HOST = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://eu.i.posthog.com';

if (KEY) {
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
  });
  (window as unknown as { posthog: typeof posthog }).posthog = posthog;
}
