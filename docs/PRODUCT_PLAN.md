# Crayon Hero — Product & Feature Plan

> Working title: **Crayon Hero**. A premium, realistic crayon-drawing app for kids (App Store + Play Store).
>
> Companion doc: **[`BUILD_PLAN.md`](./BUILD_PLAN.md)** — the phased engineering roadmap (the "how").

## Context

Kids' drawing apps are crowded, but most feel like cheap, ad-filled, flat toy apps. The opportunity is a **premium, tactile, "real crayon on real paper"** experience parents happily pay for and kids love to touch. The heart of the product is the **Editor**: a realistic sheet of paper with a floating crayon tray, where pressing a finger (or Apple Pencil) to the screen feels like pressing wax into paper.

The app ships two ways to play — **Free Mode** (draw anything) and **Draw/Challenge Mode** (color or draw a chosen subject from a big library of household items, flora, and fauna) — with a background **scoring/progression system** that rewards getting closer to the target and keeps kids coming back.

**Locked product decisions:**
- **Audience:** primary **ages 4–8**. Icon-first UI, light text with optional voice narration, medium-large touch targets, forgiving interactions.
- **Business model:** **freemium + parent-gated subscription**. Generous free core; premium subject packs, special crayon/texture sets, unlimited saves, and cloud features behind a subscription.
- **Data & sharing:** **local-first with an optional parent account + cloud** backup, cross-device gallery, parent-gated sharing.
- **Gamification:** **points & progression** (accuracy score, levels, streaks, badges, unlockable crayons/subjects) — tuned to be **encouraging, never punishing**, so the younger end never feels they "failed."

**Intended outcome:** a shared source of truth for the product so design and build stay aligned.

## Product pillars

1. **It feels real.** Paper you can see the grain of; crayons that live in a box; strokes that grit and vary as you press and drag. Pressing = pressing wax to paper (visually, audibly, haptically).
2. **Two ways to play.** Pure creativity (Free Mode) and guided challenge (Draw Mode) — both share the same premium Editor.
3. **Gentle mastery.** Points, levels, streaks, badges, and unlocks that motivate without ever making a young kid feel bad.
4. **Safe & trusted.** Ad-free, privacy-first, parent-gated, COPPA/GDPR-K compliant — the kind of app parents recommend.
5. **Premium, and priced like it.** A polished free core that clearly earns the subscription.

## Design research & inspiration

**Dribbble references to mine for the visual language:**
- Kids drawing app — https://dribbble.com/tags/kids-drawing-app
- Crayon (700+ shots) — https://dribbble.com/tags/crayon
- Drawing app for kids — https://dribbble.com/tags/drawing-app-for-kids
- Coloring app — https://dribbble.com/tags/coloring-app
- Coloring game — https://dribbble.com/tags/coloring-game
- Drawing app UI — https://dribbble.com/tags/drawing-app-ui

**Recurring premium patterns worth adopting:** oversized rounded "chunky" tappable objects; warm, saturated-but-soft palettes; real material textures (paper grain, wax, wood); playful springy motion; illustrated (not iconographic) subjects; a tool tray that reads as physical objects (crayons in a box) rather than abstract swatches.

**Competitive landscape (what to match / beat):** Crayola Create & Play (brand, activity variety, ad-free/safe), Adobe **Aqua** (privacy-first "activity islands," guided challenges that teach fundamentals, zero ads/IAP), **ArtWorkout** (gamified, *evaluates your drawing*, bite-size lessons), and step-by-step "learn to draw" apps (150+ tutorials, color-by-number). Our wedge vs. all of them: **realistic premium crayon feel + tactile interaction (incl. Apple Pencil tilt shading)**, which none of them lead with.
Sources: [Adobe Aqua — drawing apps for kids](https://aqua.adobe.com/learn/drawing-apps-for-kids), [Top coloring apps (Goally)](https://getgoally.com/blog/top-10-coloring-apps-for-kids/), [Best iPad drawing apps for kids 2026](https://artsideoflife.com/ipad-drawing-app-for-kids-and-toddlers/).

**Skeuomorphism, applied carefully:** depth, texture, and realistic lighting (paper grain, wax sheen, soft shadows, bevels) make elements feel tangible — but heavy textures can hurt performance on low-end devices, so we design "realistic but optimized" (baked textures, restrained real-time effects). Sources: [Skeuomorphism — NN/g](https://www.nngroup.com/articles/skeuomorphism/), [Skeuomorphic design guide + examples](https://www.mockplus.com/blog/post/skeuomorphic-design-examples).

**Crayon stroke realism:** real crayon look = natural grit, uneven edges, grainy texture responding to speed/pressure; scanned high-detail crayon brushes capture the imperfections. This is the single most important detail to nail. Sources: [Realistic crayon brushes](https://artifexforge.com/product/free-wax-crayon-brushes-illustrator-affinity/), [Create crayon effect drawings](https://www.sitepoint.com/create-crayon-effect-drawings-in-photoshop/).

**Premium "feel" = haptics + microinteractions:** good, *restrained* haptics make apps feel "more polished, more expensive, more professional"; less is more. Pair subtle tactile feedback with sound and motion for the crayon press. Sources: [Haptics = premium feel](https://medium.com/@chandra.welim/haptic-feedback-the-secret-to-apps-that-feel-premium-7463fdc1ccca), [2025 haptics guide](https://saropa-contacts.medium.com/2025-guide-to-haptics-enhancing-mobile-ux-with-tactile-feedback-676dd5937774).

**Scoring / "closer = more points" precedent:** drawing-assessment systems compare a drawing to a target using image-similarity math (e.g., normalized cross-correlation, color/shape overlap) to produce a similarity score. We adapt this into a **forgiving, kid-friendly accuracy score** (coverage, color match, staying in the lines, completeness). Sources: [Drawing exactness assessment (NCC)](https://www.mdpi.com/2073-431X/13/9/215).

**Kids-app compliance (non-negotiable):** ages 4–8 means **COPPA / GDPR-K**: no behavioral ads to kids, verifiable parental consent before collecting personal info, a **parental gate** before purchases/external links/account creation, data minimization, clear privacy policy. Sources: [COPPA compliance guide](https://www.techaheadcorp.com/blog/coppa-compliance/), [COPPA & mobile apps (iubenda)](https://www.iubenda.com/en/blog/guide-coppa-mobile-apps/).

## Feature set

### 1. Onboarding & profiles
- **Warm first-run** with animated crayon characters; no forced signup to start drawing.
- **Kid profile:** avatar (a crayon character), name/nickname, age band (tunes difficulty & UI density within 4–8).
- **Optional parent account** (email) for cloud backup, cross-device gallery, and subscription — created only behind a **parental gate**.
- **Neutral age gate** (ask birth month/year, not "are you over X"); age-appropriate defaults.
- **Voice narration toggle** so pre-readers can navigate by listening.

### 2. Home / mode select
- Big, illustrated entry to **Free Mode** and **Draw Mode**.
- Quick access to **My Gallery**, **Rewards** (badges/streak), and a discreet **Parent Zone** (gated).
- "Continue where you left off" and a **daily suggested subject** to build a streak habit.

### 3. The Editor (the core experience)
- **Realistic canvas:** a sheet of paper with visible grain/tooth; subtle drop shadow and page curl; optional paper types (white, kraft, colored, textured) — some premium.
- **Floating crayon tray** opening/closing from left or right (handedness-configurable), styled as a **physical crayon box**; crayons stick up, the selected one lifts/tilts forward.
- **Crayon selection:** tap a crayon → it "comes out of the box." Colors grouped like a real set; premium sets (metallics, neons, pastels, glitter) unlock via subscription.
- **The stroke = the magic:**
  - Grainy, textured wax stroke with uneven edges.
  - **Pressure/tilt/speed response:** on **Apple Pencil**, real **force** = darker/denser/wider wax and **tilt** = broad-side shading; on **finger**, simulated from contact radius + velocity + dwell.
  - **Layering & blending:** overlapping strokes build up and mix like real wax.
  - **Crayon "wear"** (optional flourish): tip dulls/rounds with heavy use.
- **Tactile press feedback:** soft haptic "tick" on touch-down + subtle crayon-on-paper sound that varies with speed; restrained, never buzzy.
- **Core tools (kid-simple):** crayon (primary), eraser (as a physical eraser), fill/"color bucket" for coloring mode, generous undo/redo, clear page (confirm), and a few crayon **thicknesses** (thin/normal/chunky).
- **Gesture rules tuned for kids:** palm rejection, an explicit **zoom/pan mode**, and a **"lock the paper"** option so accidental gestures don't ruin work.
- **Stickers & stamps** (later): press-on crayon-style stamps (stars, hearts, animals).

### 4. Free Mode
- Blank paper + full crayon tray. Open-ended, **no scoring, no pressure**.
- Optional **template/background packs** (a scene to decorate: garden, bedroom, outer space).
- Save to gallery; parent-gated share/export.

### 5. Draw / Challenge Mode
- **Subject library** in browsable, illustrated categories (see Content Library): pick *what* to make.
- Two sub-modes per subject:
  - **Color It** (coloring-book): pre-drawn outline to fill in — great for the younger end.
  - **Draw It** (from scratch / guided): faint **guide outline** or **step-by-step** build-up that fades with confidence; guide toggle.
- **Reference chip:** a small thumbnail of the target the kid can peek at.
- On finish, the **scoring system** compares to the target and celebrates the result.
- **Difficulty tiers** per subject (simple shapes → detailed) so the library grows with the kid.

### 6. Scoring & progression (gamified, gentle)
- **Accuracy score** blends forgiving, kid-friendly dimensions: **Coverage** (how much got colored/drawn), **Color match** (rough color correctness), **Staying in the lines** (neatness/containment, coloring mode), **Completeness/effort** (reward finishing & trying).
- **Presentation:** **1–3 stars + sparkles + "Great job!"**; numeric score available but soft. **No failing state** — worst case is "nice start, want to add more?"
- **Points & levels:** points per finished piece; level up a friendly avatar/rank.
- **Streaks:** draw-a-day streak with gentle, non-guilt nudges.
- **Badges/achievements:** "First flower," "Colored 10 animals," "Rainbow master," "Careful colorer (stayed in the lines)."
- **Unlocks:** crayon sets, paper types, subjects, stickers unlock via progression **and/or** subscription (progression gives free players a taste; subscription unlocks the full set instantly).
- **"Beat your best":** compare only against the kid's own previous attempt — self-competition, never vs. other kids.

### 7. Gallery, saving & sharing
- **My Gallery:** every artwork saved locally, thumbnailed like a fridge/scrapbook wall.
- **Cloud backup & cross-device gallery** for parent-account users.
- **Replay/time-lapse** of how a drawing was made (delightful + shareable).
- **Parent-gated export/share:** camera roll, share sheet, or print — always behind the gate. No open social feed, no kid-to-kid contact.

### 8. Premium & monetization (parent-gated)
- **Free tier:** Free Mode, a basic crayon set, a starter set of subjects, core scoring/progression, local gallery with a reasonable save cap.
- **Subscription (premium):** full subject library + regular new packs, special crayon/texture/paper sets, unlimited saves, cloud backup & cross-device gallery, time-lapse export, premium paper.
- **Parental gate** in front of all purchase, subscription, and account flows (hold-to-confirm / simple math).
- **Trial** (short free trial) and honest subscription management; no dark patterns. **Zero ads. No third-party behavioral tracking.**

### 9. Parent Zone / settings / privacy
- **Gated dashboard:** manage subscription, kid profiles, cloud/backup, screen-time limits, sound/haptics defaults, and data controls (export/delete).
- **Privacy-by-design:** collect only what's needed (progress metrics, artwork); no ad SDKs; plain-language privacy policy; verifiable parental consent before any personal-data collection.
- **Content controls:** toggle which categories/packs are available.

### 10. Feedback systems (the "premium" layer)
- **Haptics:** restrained, meaningful — crayon touch-down tick, button "give," reward pop, unlock celebration. Consistent vocabulary; global toggle.
- **Sound:** soft crayon-on-paper scratch tracking stroke speed; gentle UI chimes; celebratory (not chaotic) reward sounds; mellow optional background track. Global mute.
- **Motion:** springy, physical animations (crayon lifting from box, page settle, sticker press, star burst) — polished, never janky.
- **Voice:** optional narration of prompts/labels and encouraging phrases for pre-readers.

### 11. Accessibility & inclusivity
- Colorblind-friendly crayon **labels/names** (not color alone).
- Large-target, low-text mode; adjustable UI scale.
- Left/right-handed tray placement.
- Reduce-motion and reduce-haptics options.
- Diverse, inclusive subject art and avatars.

### 12. Realistic design system (visual direction)
- Material palette: warm paper tones, wax-sheen highlights, soft realistic shadows.
- Physical-object UI (crayon box, eraser, paper) over flat icons — but performance-optimized (baked textures).
- Illustrated subjects and characters, cohesive art style across the whole library.
- Consistent, springy motion + haptic vocabulary as the through-line that sells "premium."

## Content library (Draw Mode subjects)

Broad, expandable, illustrated categories. Each subject ships in **Color It** and **Draw It** variants with difficulty tiers.

- **Household items:** cup, teapot, chair, lamp, toothbrush, backpack, clock, umbrella, key, book, balloon, kite…
- **Flora:** flower, tree, sunflower, cactus, mushroom, leaf, potted plant, strawberry, palm tree…
- **Fauna:** cat, dog, fish, butterfly, bird, bunny, lion, frog, turtle, bee, dinosaur, whale…
- **Bonus/premium themepacks:** vehicles, space, food/treats, weather, seasons/holidays, fantasy (dragon, unicorn) — recurring drops to keep the library fresh and justify the subscription.

---

*Sources are linked inline above (Dribbble collections, competitor apps, skeuomorphism & haptics references, drawing-assessment research, COPPA/GDPR-K guidance).*
