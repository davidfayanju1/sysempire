# Sketch artwork

Optimised WebP sketches for the Personal Fit flow. **Generated. Do not edit by
hand.** Drop the illustrator's PNG masters into `design/sketches/` (gitignored,
same folder structure) and run:

```bash
npm run sketches
```

Paths are derived from the option labels, so the file name must match the slug
the app looks up:

```
outfit-type/<outfit-type-id>.webp        Step 1 cards, and the summary fallback
fit/<men|women>/<regular|slim|relaxed|tailored>.webp
suits/suitFor/<mens-tailoring|womens-tailoring>.webp
suits-<men|women>/<field>/<option-slug>.webp
<outfit-type-id>/<field>/<option-slug>.webp
croquis/<female|male>.webp               Step 5 measuring figure
```

Slugs are lowercase, apostrophes dropped, every other run of non-alphanumerics
turned into a single `-`: `Men's Tailoring` → `mens-tailoring`, `3/4` → `3-4`.
`src/lib/sketchRegistry.test.ts` lists every path still missing.
