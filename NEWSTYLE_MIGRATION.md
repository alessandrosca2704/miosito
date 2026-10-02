# NewStyle Migration

## Current Transition State

1. CURRENT: CRA portfolio with `/newstyleparrucchiere` (actual existing route, not `/newstyle`), React/TS feature and Netlify Functions.
2. Reuse: cards, Italian dashboard, history, FullCalendar/Luxon, normalized Cal adapter, validation, timeouts, reconciliation.
3. Incompatible with standalone Android: same-origin cookie authentication, implicit relative API URL and dependency on the portfolio entry point. CRA does not read `import.meta.env`.
4. Portfolio coupling: route/layout wrapper and build environment. Feature UI already has mostly scoped styles.
5. Existing auth: bcrypt admin login and signed seven-day cookie. Kept only in a transitional web adapter; target app uses device activation.
6. Functions: scoped Cal reads/writes; device activation and Bearer validation now use a Netlify Blobs registry. Cookie auth remains only for the transition web UI.
7. Secrets stay in Functions. Only API base URL is public. A separate Vite entry reads `VITE_API_BASE_URL` and injects it.
8. All fetches remain in one configurable client. UI consumes it through a provider, without Capacitor imports.
9. Device flow: activation hash -> random 256-bit secret -> token hash in strong-consistency Blobs -> secure-storage interface -> Bearer. No booking database.
10. MOVE: `src/features/newstyle`, `src/shared/newstyle`, and the future Vite entry/config. KEEP: `server/newstyle` and Netlify Functions. The transitional web wrapper is not part of the mobile app.

## Target

- `newstyle-mobile`: React + TypeScript + Vite + FullCalendar + Capacitor Android.
- `miosito`: portfolio, `/api/newstyle/*`, Cal.com integration, device registry, and secrets.
- Cal.com remains the source of truth. No booking database is introduced.
- Device tokens are generated with 256 bits of entropy and only their SHA-256 hashes are stored in the `newstyle-devices` Netlify Blobs store.
- Capacitor production origin is expected to be `https://localhost`; configure it explicitly in `NEWSTYLE_ALLOWED_ORIGINS`.

## API and Authentication

| Method | Path | Authentication |
| --- | --- | --- |
| `POST` | `/api/newstyle/device/activate` | Activation code, rate limited |
| `GET` | `/api/newstyle/bookings` | Bearer device token or transitional web session |
| `POST` | `/api/newstyle/bookings/:uid/confirm` | Bearer device token or transitional web session |
| `POST` | `/api/newstyle/bookings/:uid/reject` | Bearer device token or transitional web session |

`VITE_API_BASE_URL` is public configuration. `CAL_API_KEY`, `NEWSTYLE_ACTIVATION_CODE_HASH`, session secrets, and device records remain server-side.

The client boundary is `src/features/newstyle/deviceApi.ts`. The future Android repository should inject an Android Keystore-backed implementation of `DeviceTokenStorage`; the current memory adapter is only for web development and tests.

## Logical implementation steps

API client/configuration and shared contracts; storage interface and activation shell; Blobs registry and device middleware; activation rate limit/CORS; audit fixes; regression tests; extraction documentation. No portfolio route removal or deployment in this iteration.

## Audit checklist (initial)

- [ ] R1 boundary chunk failure
- [ ] R2 empty vs incomplete calendar
- [ ] R3 uncertain outcome blocks unrelated bookings
- [ ] R4 keyboard access to list events
- [ ] R5 malformed row takes down entire page
- [ ] R6 concurrent server mutations
- [ ] R7 cross-tab sessions / revocation
- [ ] R8 production-path test coverage
- [ ] R9 dependency vulnerability triage
- [ ] L1 midnight grid bounds
- [ ] L2 pending filter semantics
- [ ] L3 password input chunks
- [ ] L4 Retry-After
- [ ] L5 duplicated logic / responsibilities
- [ ] L6 safe diagnostics

## Audit Status

- **FIXED**: R1 boundary error boundary is loaded around the lazy NewStyle route.
- **FIXED**: R2 month data is requested independently from day event rendering; calendar pagination remains visible through the API cursor.
- **PARTIALLY FIXED**: R3 uncertain mutations are isolated to the selected booking, but the current dashboard still presents a blocking verification panel for that operation.
- **FIXED**: R5 malformed Cal rows are rejected at the adapter boundary without leaking upstream payloads.
- **PARTIALLY FIXED**: R6 Cal.com concurrency is guarded by read-before-write and reconciliation; persistent cross-instance locking is deferred because Cal.com remains authoritative.
- **PARTIALLY FIXED**: R7 web session rotation exists; device revocation is now represented by `revokedAt`, while an admin revocation UI is deferred.
- **FIXED**: L3 password bounds, L4 retry handling, and L6 sanitized diagnostics.
- **DEFERRED**: R4 keyboard event interaction, R8 production-path browser coverage, R9 dependency refresh, L1 midnight visual test, L2 copy decision, and L5 broader CSS/service deduplication.
- **OBSOLETE DUE TO ARCHITECTURE CHANGE**: same-origin-only authentication is no longer the target for the mobile client; it remains intentionally available only for the transitional web route.

## Move To Mobile Repo

MOVE:

- `src/features/newstyle/*`
- `src/shared/newstyle/*`
- `src/features/newstyle/deviceApi.ts`
- `src/features/newstyle/deviceTokenStorage.ts`
- `src/features/newstyle/DeviceActivationScreen.tsx`
- `src/features/newstyle/newstyle.css`

KEEP ON SERVER:

- `server/newstyle/*`
- `netlify/functions/newstyle*.ts`
- `netlify.toml` redirects and headers
- Cal.com environment variables and Netlify Blobs configuration

DELETE AFTER MIGRATION:

- `/newstyleparrucchiere` route and portfolio wrapper
- transitional cookie-login code, only after the Android client is verified in production

## Capacitor Next Steps

1. Create `newstyle-mobile` with Vite React TypeScript.
2. Move the frontend files listed above.
3. Install and initialize Capacitor Android.
4. Replace the memory storage adapter with an Android Keystore-backed plugin adapter.
5. Set `VITE_API_BASE_URL` to `https://alessandroscarimbolo.it/api/newstyle`.
6. Configure and verify `NEWSTYLE_ALLOWED_ORIGINS=https://localhost`.
7. Test activation, token revocation, 401 recovery, and booking mutations on a physical device.
8. Build and sign the APK.
9. Remove the web route only after the APK and API have passed production verification.
