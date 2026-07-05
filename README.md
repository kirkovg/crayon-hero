# Crayon Hero

A premium, realistic crayon-drawing app for kids (iOS + Android).

📄 Product & feature plan: [`docs/PRODUCT_PLAN.md`](./docs/PRODUCT_PLAN.md) · Build roadmap: [`docs/BUILD_PLAN.md`](./docs/BUILD_PLAN.md)

---

## Phase 0 — Crayon-stroke spike (current state)

This repo currently contains **only the Phase 0 spike**: a throwaway screen whose job is to
prove the crayon *feel* on a real device before we build the app around it. Everything lives
in [`src/spike/`](./src/spike).

**What the spike does**
- A warm "paper" canvas you draw on with your finger.
- Variable-width **ribbon** strokes: move slow → thick & dense, move fast → thin & sketchy.
- A **paper-tooth grain shader** (SkSL) gives the broken, waxy crayon texture.
- **Multiply blending** so overlapping strokes build up like real wax.
- A floating **crayon tray** (tap to select; the crayon slides out) + eraser, undo, clear.
- A light **haptic tick** on touch-down and on crayon selection.
- A live **fps meter** (top-right) to check the 60/120 fps exit gate on-device.

**Stack:** Expo SDK 54 · React Native 0.81 (New Architecture) · `@shopify/react-native-skia` 2.2 ·
`react-native-reanimated` 4 · `react-native-gesture-handler` · `expo-haptics`.

> **Why SDK 54 and not the newest (57)?** The public App Store **Expo Go only runs its single
> latest SDK, which is currently 54** (`expoGoSdkVersion` in Expo's version API). Pinning to 54
> lets us run on a physical iPhone via a QR code with **no Xcode**. We'll bump back to the latest
> SDK once we move to a real development build (see below).

The drawing hot-path never touches React: the active stroke is a Reanimated shared value
rendered by Skia on the UI thread; React state only updates when a stroke is committed
(finger up). See [`docs/BUILD_PLAN.md`](./docs/BUILD_PLAN.md) for the architecture rules.

---

## Running it on your iPhone (no Xcode)

Skia, Reanimated, and Gesture Handler are all **bundled into Expo Go**, so the spike runs there
directly — no native build required.

1. Install **Expo Go** from the App Store on your iPhone.
2. From the project folder:
   ```sh
   npx expo start
   ```
3. Open the **Camera** app, scan the QR code in the terminal, and tap the banner to open in Expo Go.

Hot-reload works: save a file and the phone updates.

> If Expo Go ever reports an SDK mismatch again, it means the public Expo Go moved to a newer
> SDK — re-check `expoGoSdkVersion` at `https://exp.host/--/api/v2/versions` and re-pin.

### Later: real development build (needed for Apple Pencil, App Store, latest SDK)
This needs **full Xcode**, which on this Mac requires upgrading **macOS to 26.2+** first (currently
15.6). Then: `brew install cocoapods watchman` → `npx expo run:ios --device`. The cloud
alternative (`eas build` / `eas go`) needs a paid Apple Developer account for device provisioning.

---

## What to look for (Phase 0 exit gate)
- Drawing feels like **pressing a crayon into paper** — grainy, with speed changing the weight of the line.
- The **fps meter holds ~120** while scribbling fast (no stutter).
- Selecting crayons and the touch-down tick feel tactile, not gimmicky.

If that "wow" lands, the stack is validated. If not, we revisit rendering before building further.

## Not yet in the spike (deliberately deferred)
- **Apple Pencil** force + tilt (needs an iPad + a thin Swift module + a dev build — can't test on iPhone).
- **Android** performance profiling (needs a flagship Android).
- **Crayon sound** (scratch loop that tracks speed — needs an audio asset).
- Offscreen "baking" of finished strokes, save/gallery, and everything from Phase 1 onward.
