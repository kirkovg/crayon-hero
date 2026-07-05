# Crayon Hero

A premium, realistic crayon-drawing app for kids (iOS + Android).

📄 Product & feature plan: [`docs/PRODUCT_PLAN.md`](./docs/PRODUCT_PLAN.md) · Build roadmap: [`docs/BUILD_PLAN.md`](./docs/BUILD_PLAN.md)

---

## Current state — Phase 1: MVP editor & core loop

The app now has a real navigable shell around the (Phase-0-validated) crayon engine.

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

## What to test in Phase 1
- **Free Draw → draw → Save → it shows up in Gallery → open it → delete it.** The full loop.
- Tray: switch colors, thickness (thin/normal/chunky), eraser, collapse/expand.
- Undo / redo / clear.
- Settings: change tray side (left/right), toggle haptics, set name/avatar → persists across relaunch.
- Perf: fps holds while scribbling; large drawings still smooth.

## Deliberately deferred (later phases)
- **Draw Mode** + subjects + scoring (Phase 2), accounts/cloud/subscription (Phase 3).
- **Apple Pencil** force+tilt, **crayon sound**, offscreen stroke-baking, zoom/pan, color-bucket fill,
  real file storage (expo-file-system) + thumbnails, onboarding.
