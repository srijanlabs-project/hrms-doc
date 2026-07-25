# Static assets

Drop brand assets here — served from the web root by Vite.

- `ridz.png` — Ridz AI assistant avatar (illustrated portrait). Used by `src/components/ui/RidzAvatar.tsx`; a bot glyph renders as fallback until this file exists. Prefer a square crop (512×512+), face centered top.
- `staffsy-logo.png` — full "staffsy" wordmark, transparent background. Used in `TopBar.tsx` (desktop width) and `LoginPage.tsx`.
- `staffsy-mark.png` — compact "st" monogram-in-circle, transparent background. Used in `TopBar.tsx` at narrow (`sm:hidden`) widths in place of the full wordmark.
- `favicon.png` — same monogram mark, referenced from `index.html`'s `<link rel="icon">`.

All three were cropped and background-removed (transparency) from the source files in `D:\HRMS-doc\{desktp-logo,mobile-logo,favicon}.png` — the originals ship with an opaque cream backdrop that doesn't match the app's white/canvas surfaces.
