# Pixel Emotion Assets

This directory is reserved for approved high-quality pixel emotion assets.

Use pixel assets only for restrained emotional accents:

- status badges and stamps
- small icons and completion feedback
- decorative stars, leaves, hands, and wishes

Do not place programmatically drawn people or large game scenes here. Dongdong,
Lili, and couple scenes belong in `src/assets/illustrations` and are consumed
through `src/components/illustrations`.

Business pages should call `PixelBadge`, `PixelStamp`, or `PixelIcon` from
`src/components/pixel` instead of importing pixel files directly. This keeps asset
replacement independent from list, chips, and persistence logic.
