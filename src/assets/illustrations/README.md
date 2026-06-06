# Illustration Asset Slots

`src/components/illustrations` is the only page-facing illustration layer. Business
pages should render these components instead of drawing characters or scenes
directly.

Current status:

- All illustration components are production-ready asset slots.
- Their built-in shapes are restrained temporary placeholders, not final IP art.
- Pass an approved PNG / WebP / SVG through each component's `assetSrc` prop to
  replace a placeholder without changing page or store logic.

Recommended production files:

- `home-couple-scene.webp`: Dongdong and Lili in a warm room scene.
- `greeting-sun.webp`: small time-of-day greeting illustration.
- `reminder-water.webp`: daily reminder illustration.
- `quote-letter.webp`: soft letter / heart illustration.
- `quick-home.webp`, `quick-travel.webp`, `quick-love.webp`, `quick-chips.webp`.
- `travel-empty.webp`: restrained travel-object empty state.
- `love-empty.webp`: restrained couple-interaction empty state.
- `dongdong-portrait.webp`: dark red hair, black heavyweight T-shirt, loose white
  shorts, taller silhouette.
- `lili-portrait.webp`: dark purple hair, thin-frame glasses, hiphop / jazz styling,
  smaller and more dynamic silhouette.

Use transparent WebP or PNG for character assets. Keep source artwork outside UI
components so final art can be replaced without changing layout or business logic.
