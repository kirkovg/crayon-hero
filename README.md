# Crayon Hero

A premium, realistic crayon-drawing app for kids (iOS + Android).

📄 Product & feature plan: [`docs/PRODUCT_PLAN.md`](./docs/PRODUCT_PLAN.md) · Build roadmap: [`docs/BUILD_PLAN.md`](./docs/BUILD_PLAN.md)

---

## Current state — Phase 3: monetization, parent controls, i18n & polish

Latest additions (all Expo Go-compatible):
- **Model decided:** **local-first, no cloud accounts**, a **store-managed subscription** (mocked until a dev build), and **zero ads** (barred for a kids' app by COPPA/GDPR-K + store policy).
- **Parent Zone** (behind a press-and-hold parental gate): subscription status, restore, and privacy controls (**export** + **delete all data**). A mock "premium" toggle stands in for RevenueCat.
- **Paywall** + premium gating on 2 demo subjects (lock badge → paywall).
- **Fonts:** Fredoka everywhere (via `AppText`). **Icons:** Ionicons replaced UI emojis. **i18n:** EN / DE / FR / ES with a language picker in Settings (defaults to device locale).

### Phase 2 — the game (below)

Phases 0–1 are done (crayon feel + navigable MVP editor). Phase 2 adds the **game**:
- **Draw Mode**: Home → *Draw Something* → category (household / flora / fauna) → subject → the
  editor with the subject shown, a **Color It / Draw It** toggle, and a reference chip. Tap **Done**
  to get scored.
- **9 programmatic vector subjects** (`src/subjects/`) — no art pipeline yet; real illustrated art
  swaps in later behind the same `Region` data model.
- **Scoring** (`src/scoring/score.ts`): the drawing + the target are rasterized to 96×96 (Skia
  offscreen surfaces + `readPixels`) and compared on **coverage / color-match / staying-in-lines** →
  forgiving **1–3 stars + points**. It never hard-fails (gentle fallback on any error).
- **Progression** (`src/state/useProgress.ts`): points, level, best-stars per subject, and a
  day-streak, persisted. Home shows level / points / streak.

Below: the Phase 1 foundation it builds on.

## Phase 1 foundation — MVP editor & core loop

The app has a navigable shell around the (Phase-0-validated) crayon engine.

**Screens** (`src/screens/`)
- **Home** — greeting + entries: **Free Draw**, Draw Something (Phase 2, disabled), **My Gallery**, **Settings**.
- **Editor** — the heart:
  - realistic paper + the crayon engine (velocity-driven grainy ribbons, multiply wax layering);
  - floating **crayon tray** (collapsible, left/right per settings) with **10 colors**, **3 thicknesses**, and an **eraser**;
  - **toolbar**: undo, redo, clear (with confirm), and **save**;
  - a small live **fps meter**.
- **Gallery** — grid of saved drawings; tap to open.
- **Artwork viewer** — full-screen view + delete.
- **Settings** — artist name & avatar color, crayon-tray side (handedness), haptics toggle, sound toggle (disabled — not wired yet).

**How saving works:** the Skia canvas is snapshotted (`makeImageSnapshot` → JPEG) and stored as a
data-URI in **AsyncStorage** (`src/storage/gallery.ts`). This is a deliberate Expo-Go-friendly
choice; it'll be swapped for real `expo-file-system` PNG files + thumbnails once we move to a dev build.

**Architecture** (`src/`): `editor/` (canvas, tray, toolbar, shader, ribbon, palette), `screens/`,
`navigation/` (React Navigation native-stack), `state/` (Zustand + AsyncStorage settings), `storage/`,
`feedback/` (haptics). The drawing hot-path stays on the UI thread; React state only changes on stroke-commit.

**Stack:** Expo SDK 54 · React Native 0.81 (New Architecture) · `@shopify/react-native-skia` 2.2 ·
`react-native-reanimated` 4.1.1 / `react-native-worklets` 0.5.1 (pinned to match Expo Go 54) ·
`react-native-gesture-handler` · React Navigation 7 · Zustand · AsyncStorage · `expo-haptics`.

> **Why SDK 54?** The public App Store Expo Go runs only its single latest SDK (currently 54), which
> lets us test on a physical iPhone via QR with **no Xcode**. Bump to the latest SDK when we move to a
> real dev build. Don't bump reanimated/worklets while on Expo Go (breaks with "reanimated is not installed").

---

## Running it on your iPhone (no Xcode)

1. Install **Expo Go** from the App Store.
2. `npx expo start` (add `--clear` after dependency changes).
3. Scan the QR with the Camera app → open in Expo Go.

### Later: real dev build (Apple Pencil, App Store, latest SDK)
Needs full Xcode → requires upgrading **macOS to 26.2+** first (currently 15.6), then
`brew install cocoapods watchman` → `npx expo run:ios --device`.

---

## What to test
**Phase 3 + polish (new):**
- **Language:** Settings → Language → switch to Deutsch / Français / Español — the whole app re-translates live.
- **Fonts & icons:** everything should be in the rounded Fredoka font, with clean icons (no UI emojis).
- **Parent Zone:** Settings → Parent Zone → **press and hold** to enter → toggle "Preview premium" and confirm the 🔒 subjects (Leaf, Ladybug) unlock; try **Delete all data**.
- **Paywall:** tap a locked subject (Leaf/Ladybug) → paywall → "Start free trial" unlocks (mock).

**Phase 2:**
- **Draw Something → pick a category → pick a subject → color inside the outline → Done → Score.**
  The full game loop. Try to color it well vs. scribble randomly and confirm the **stars/points differ**.
- Color It (outline) vs Draw It (guide) toggle; the reference chip.
- Score screen: stars, points, the three bars, **Try again** and **Done**.
- Home **level / points / streak** update after scoring and persist across relaunch.

**Phase 1 (foundation):**
- **Free Draw → draw → Save → it shows up in Gallery → open it → delete it.** The full loop.
- Tray: switch colors, thickness (thin/normal/chunky), eraser, collapse/expand.
- Undo / redo / clear.
- Settings: change tray side (left/right), toggle haptics, set name/avatar → persists across relaunch.
- Perf: fps holds while scribbling; large drawings still smooth.

## Deliberately deferred (later phases)
- **Draw Mode** + subjects + scoring (Phase 2), accounts/cloud/subscription (Phase 3).
- **Apple Pencil** force+tilt, **crayon sound**, offscreen stroke-baking, zoom/pan, color-bucket fill,
  real file storage (expo-file-system) + thumbnails, onboarding.
