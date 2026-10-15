# Dava Dental Care

## Identity
Use the exact doctor name `drg. Dava Fathiyatuzzakiyah, Sp.KG.` and specialty `Spesialis Konservasi Gigi`. The service catalog includes consultation and excludes orthodontics. Source: lib/site.ts; keep booking catalog synchronized with scripts/sync-clinic.mjs without deleting booking history.

## Visual direction
Professional, patient-focused dental practice for Indonesian and international visitors. Violet remains the brand color, with offwhite surfaces, restrained borders and generous spacing. All type uses Plus Jakarta Sans; the user explicitly rejected serif typography.

Primary action #7348a8 with white text. Heading #292335, body #746d80, background #fcfbfe, soft surface #f3eff8. Buttons use a 7px radius and visible keyboard focus. Content width 1232px, mobile gutters 20px. Primary body content 13–14px, headings weight600 with restrained tracking.

## Opening sequence
The first opening has a branded dental loading screen with real 3D asset progress, inspired by https://porto-ten-tau.vercel.app/. Reach 100% after the first rendered frame, show WELCOME, then reveal a rotating molar in a full-screen visual scene. Scroll continuously returns the molar to its position in a complete rotating dental arch with gums; further scrolling reaches all clinic content, starting with the headline and consultation CTA.

This is a visual introduction, not a dental education tool. No names, labels, information cards, tooth picker or selection behavior. Retain only an unobtrusive pause/play control for accessibility. The scene occupies the whole screen on mobile and desktop. Local assets and lighting; no runtime HDR dependency. Use the original procedural model from scripts/generate-dental-model.mjs. The standalone lower molar follows the supplied rotating reference: five unequal convex cusps, branching fissures, glossy ivory enamel and two asymmetric matte cream roots. It returns to the lower right M1 slot; assembled teeth have only compact crowns embedded in naturally rounded gingiva. Preserve the approved tooth arrangement. This is a reconstruction rather than an exact copy of the reference asset. Pause rendering offscreen, honor reduced motion, preserve vertical touch scrolling and provide a visual fallback when WebGL fails. Legacy model provenance stays documented in README.md.

## Content
Use bilingual ID/EN copy. Do not invent patient ratings, credentials, real clinic photography or business details. Gallery illustrations must remain labeled. Contact details in lib/site.ts are sample data that the clinic must verify before publication. Footer credit: `Developed by Naufal Dzakwan`, linking to https://porto-ten-tau.vercel.app/.
