# Crayon Hero — Detailed Phased Build Plan

> The engineering roadmap for Crayon Hero. Assumes the **[Product & Feature Plan](./PRODUCT_PLAN.md)**.
>
> Built by a **solo developer** (10 yrs React/TS, new to React Native) optimizing for **ship-fast**, targeting **iPad + iPhone + Apple Pencil + flagship Android**.

## Locked stack

> The hardest, make-or-break piece is the **drawing/rendering engine** (grainy, pressure/tilt-responsive crayon strokes with wax-like layering). The stack is chosen around that; everything else is commodity work.

**Framework: React Native (Expo) + Skia — decided.** A solo React/TS expert optimizing for speed should reuse their existing skill set, not pay the Dart/Flutter from-scratch tax. Flagship-only Android removes RN's main weakness (low-end jank). Plain RN can't render the crayon look, but **`@shopify/react-native-skia`** (the same GPU 2D engine as Chrome/Flutter) exposes **SkSL shaders, blend modes, image filters, offscreen layers, and paths** on the UI thread — closing the gap.

**The stack:**
- **Language:** TypeScript.
- **Canvas/rendering:** React Native Skia — SkSL shaders for grain, blend modes for wax layering, offscreen `SkSurface` for layers/undo, `SkImage` snapshot for saving artwork and feeding scoring.
- **Gestures/animation:** Reanimated + React Native Gesture Handler (UI-thread worklets).
- **Haptics:** `expo-haptics` for standard taps; a small Core Haptics (iOS) / `VibrationEffect` (Android) module if we want a richer "crayon texture" haptic.
- **Audio:** low-latency engine (`expo-audio` / `react-native-audio-api`) for the speed-tracking crayon scratch.
- **Local storage:** MMKV (fast key/value) + filesystem for artwork PNGs; SQLite (`expo-sqlite`/`op-sqlite`) for gallery + progress/score data.
- **State:** Zustand (lightweight).
- **Cloud / parent accounts:** **Firebase** (Auth + Firestore metadata + Cloud Storage for artwork), configured **COPPA-safe** (no ad personalization/analytics data sharing). Supabase is an acceptable alternative.
- **Subscriptions / IAP:** **RevenueCat** (cross-platform entitlements, trials, App Store + Play receipts). Don't hand-roll StoreKit/Play Billing.
- **Native code (bounded):** one thin **Swift module via the Expo Modules API** exposing full Apple Pencil data (force, tilt/azimuth, hover, double-tap) to Skia. The only native code we write.
- **Build/CI/submission:** **Expo + EAS Build** with **Expo Dev Client** (New Architecture on by default) so Skia/Reanimated/RevenueCat/custom native all work while keeping the managed workflow.
- **Store programs:** Apple **Kids Category** + Google Play **Designed for Families**.
- **Analytics:** minimal, **kids-safe only** (never ad SDKs).

**Pressure & Apple Pencil:** Pencil on iPad gives real **force** (→ darker/wider) and **tilt** (→ broad-side shading — the signature crayon move). iPhone fingers have no real pressure (3D Touch is gone), so we **simulate** with contact radius + velocity + dwell. Design: *Pencil = real (showcase); finger = simulated (still good).*

**60fps architecture rules (hold these or blame RN unfairly):**
1. Never drive drawing through React state — strokes live in Skia/Reanimated shared values, not the React tree.
2. Bake completed strokes into an offscreen `SkImage`; keep only the *active* stroke live — keeps per-frame cost flat regardless of drawing count.
3. Keep the live grain shader cheap; bake texture per-stroke on commit, not full-screen every frame.
4. Defer the scoring compare to stroke/drawing end so it never competes with the draw loop.
5. Profile on a **flagship Android**, not just an iPhone.

## Phased build plan

Every phase ends in a **shippable** build. Gates are go/no-go checkpoints.

### Phase 0 — Foundations & the crayon spike (DE-RISK FIRST)
**Goal:** prove the "feel" before investing in the app around it.
**Status:** ✅ Finger spike built (`src/spike/`) and validated on a real iPhone 17 Pro Max — feel + ~120fps gate passed. Temporarily pinned to **Expo SDK 54** (reanimated 4.1.1 / worklets 0.5.1) so it runs in public Expo Go via QR, because this Mac can't run the current Xcode (needs macOS 26.2). Still deferred: Apple Pencil force+tilt (needs iPad + dev build + Swift module), flagship-Android profiling, crayon sound, offscreen stroke baking.
- Init Expo project (TypeScript, New Arch, Dev Client); repo hygiene; EAS build pipeline; run on a real iPad + flagship Android.
- Add core deps: react-native-skia, reanimated, gesture-handler, MMKV.
- Write the **Swift Expo module** for Apple Pencil (force, altitude, azimuth, hover, double-tap).
- **Milestone-0 spike (throwaway):** a single Skia canvas screen — capture touch/Pencil points → build `SkPath` → render with an **SkSL grain shader** → commit strokes to an offscreen `SkSurface`. Map **Pencil force → width/opacity, tilt → broad-side shading**; finger → radius/velocity/dwell. Add the **haptic + sound press moment**.
- **Exit gate:** locked **60fps on flagship Android + 120fps on ProMotion iPad**, and the crayon "wow" is convincing on-device. If yes → the stack is validated; proceed. If no → revisit rendering approach before building further.

### Phase 1 — MVP Editor & core loop (the product's heart)
**Goal:** a kid can open the app and joyfully free-draw with realistic crayons, then save it.
**Status:** 🚧 Implemented, pending on-device test. Navigable app (Home / Editor / Gallery / Artwork viewer / Settings) around the crayon engine; tray with 10 colors + 3 thicknesses + eraser (collapsible, handedness), undo/redo/clear/save, local gallery + viewer, settings (name, avatar, tray side, haptics), Zustand + AsyncStorage persistence. Typecheck + iOS bundle pass. **Adaptations for Expo Go:** artwork saved as JPEG data-URIs in AsyncStorage (not MMKV/expo-file-system — those need a dev build). **Deferred within Phase 1:** real crayon sound, zoom/pan, color-bucket fill, offscreen stroke-baking, thumbnail downscaling, onboarding.
- **Editor screen:** realistic paper (grain texture, shadow); **floating crayon tray** (physical crayon box, open/close, left/right); crayon selection with lift/tilt animation.
- **Tools:** crayon (thickness variants), eraser, undo/redo (stroke stack + offscreen snapshots), clear (confirm), color-bucket fill, zoom/pan mode, lock-paper, palm rejection.
- **Save:** `SkImage` snapshot → PNG + thumbnail to local storage.
- **Free Mode**, **Home/mode-select**, local **kid profile**, basic **settings** (sound/haptics toggles), basic local **gallery**.
- Integrate **sound + haptics** (crayon scratch tracking speed, press tick).
- **Exit gate:** shippable internal/TestFlight build; free-draw + save loop is delightful and stable.

### Phase 2 — Draw Mode, subjects, scoring & progression (the game)
**Goal:** the full single-player game loop with gentle gamification.
**Status:** 🚧 Implemented, pending on-device test. Draw Mode flow (Home → Draw Something → category → subject → Editor(draw) → Score). 9 **programmatic vector subjects** across household/flora/fauna (`src/subjects/`) — real illustrated art can swap in behind the same `Region` model later. Color It (outline) / Draw It (guide) toggle + reference chip. **Scoring engine** (`src/scoring/score.ts`): rasterizes drawing + target to 96×96 via Skia offscreen surfaces + `readPixels`, scores coverage / color-match / staying-in-lines → forgiving 1–3 stars + points (never hard-fails; gentle fallback on any error). **Progression** (`src/state/useProgress.ts`): points, level, best-stars per subject, day-streak — persisted. Home shows level/points/streak. Typecheck + iOS bundle pass. **Deferred within Phase 2:** badge collection UI, unlock economy (all subjects open), difficulty tiers, richer streak/celebration animation.
- **Subject asset pipeline** + data: categories (household/flora/fauna); each subject = outline (Color It) + guide/steps (Draw It) + reference thumbnail + target image.
- **Draw Mode flow:** category → subject → sub-mode → draw → finish → score. Difficulty tiers; guide fade/toggle.
- **Scoring engine (runs at finish, off the draw loop):** rasterize the drawing → compare to target on **coverage, color match, staying-in-lines, completeness** → **1–3 stars + points**; forgiving weights, **no fail state**.
- **Progression:** points, levels, daily streaks, badges, unlock economy (crayons/paper/subjects by progress). Rewards screen.
- **Exit gate:** a kid can pick a subject, color/draw it, and get celebrated with stars/points; progression persists.

### Phase 3 — Monetization & parent controls (the business)
**Goal:** a monetizable, compliant app.
**Revised decisions (2026-07):** **cloud accounts scrapped** — the app is fully **local-first** (no Firebase, no login, strongest privacy story). Monetization = a **store-managed subscription** (Apple/Google + RevenueCat later; needs no backend/accounts of our own) with **zero ads** (ads rejected — behavioral ads to under-13s are effectively barred by COPPA/GDPR-K and by Apple Kids / Google Play Families policies).
**Status:** 🚧 Implemented (Expo Go slice), pending on-device test. Parental gate (press-and-hold), **Parent Zone** (subscription status, restore, privacy: export + delete-all-data), **Paywall** (subscription framing), a **mock entitlements store** (`useEntitlements` — swap for RevenueCat in a dev build; the rest of the app only reads `premium`), and premium gating on 2 demo subjects (lock badge → paywall; toggle premium in Parent Zone to unlock). Typecheck + iOS bundle pass. **Deferred to a dev build:** real RevenueCat purchases (native module + App Store Connect / Play products).

### Cross-cutting polish (added 2026-07, alongside Phase 3)
- **Fonts:** Fredoka (rounded, kid-friendly) via `@expo-google-fonts/fredoka`, applied through a drop-in `AppText` (`src/ui/AppText.tsx`).
- **Icons:** replaced UI emojis with **Ionicons** (`@expo/vector-icons`) via `src/ui/Icon.tsx` (celebration emojis remain in localized reward copy).
- **i18n:** English / German / French / Spanish (`src/i18n/`, `i18n-js` + `expo-localization`); `useT()` hook, device-locale default, language picker in Settings. All user-facing strings + subject/category names translated.
- **Parent account** (Firebase Auth) behind a **parental gate**.
- **Cloud backup + cross-device gallery** (Firestore metadata + Cloud Storage), COPPA-safe Firebase config.
- **Subscription via RevenueCat:** entitlements, free-vs-premium gating (subject packs, crayon/paper sets, unlimited saves, cloud features), **paywall behind parental gate**, free trial.
- **Parent Zone dashboard:** subscription mgmt, profiles, screen-time, data export/delete, content controls.
- **Parental gates** on all purchases/account/external links/sharing; privacy policy + consent flow; data minimization.
- **Exit gate:** subscribe/restore works on both stores; free/premium boundary enforced; parent controls + privacy flows complete.

### Phase 4 — Premium depth & delight
**Goal:** deliver the full premium vision and content cadence.
- **Step-by-step guided lessons** (advanced Draw It).
- **Stickers/stamps**, **template scene packs**.
- **Premium crayon/paper/texture packs**; recurring **themepack drops** (live-ops cadence).
- **Time-lapse replay** + parent-gated **export/share** (camera roll, share sheet, print).
- **Voice narration**; **accessibility polish** (colorblind labels, reduce-motion/haptics, UI scale, handedness).
- **Apple Pencil Pro extras** (hover, double-tap, squeeze/barrel-roll as quick color/size switch).
- **Exit gate:** premium tier feels clearly worth the subscription; content pipeline is repeatable.

### Phase 5 — Launch readiness
**Goal:** ship to both stores with confidence.
- **Store setup:** Apple **Kids Category** + Google Play **Designed for Families**; age ratings; privacy nutrition labels / Data Safety form.
- **Performance pass** on min-spec flagship devices; memory/battery; large-gallery stress.
- **Playtesting with 4–8 y/o**; scoring tuning (a genuine attempt reliably earns 2–3 stars); parent-trust review.
- **Kids-safe analytics**, crash reporting, error monitoring.
- **Beta** (TestFlight / Play internal → closed → open) → submit.

## Dependencies & sequencing
- Phase 0 gates everything — do not build the app until the crayon feel is proven.
- The Skia Editor (Phase 1) is the backbone the rest attaches to.
- Scoring (Phase 2) depends on the `SkImage` snapshot capability built in Phase 1.
- Monetization (Phase 3) depends on the content/unlock model existing (Phase 2).
- Cloud (Phase 3) and premium content (Phase 4) can partly overlap once accounts exist.

## Risk register (top risks → mitigations)
- **Crayon feel underwhelms** → Phase 0 spike is a hard gate before further investment.
- **Frame drops** → the 5 architecture rules above; profile on flagship Android early.
- **Apple Pencil data not exposed in JS** → the bounded Swift Expo module (Phase 0).
- **Scoring feels harsh to young kids** → forgiving weights, no fail state, playtest-tuned so real attempts get 2–3 stars.
- **Compliance mistakes (COPPA/GDPR-K)** → parental gates, data minimization, COPPA-safe Firebase, no ad SDKs; reviewed before launch.
- **Solo-dev scope creep** → strict phase gates; each phase ships; premium/live-ops deferred to Phase 4.

## Validation
- **Feel prototype first** (Phase 0) on real devices.
- **Playtest with target-age kids** — success = they intuitively pick a crayon and draw without instruction, and react with delight; scoring rewards, never discourages.
- **Parent validation** of the gate, privacy story, and subscription flow.
- **Compliance review** against COPPA/GDPR-K before any launch.
