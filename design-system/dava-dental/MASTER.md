# Dava Dental Care

## Identity
Use the exact doctor name `drg. Dava Fathiyatuzzakiyah, Sp.KG.` and specialty `Spesialis Konservasi Gigi`. The service catalog includes consultation and excludes orthodontics. Source: lib/site.ts; keep booking catalog synchronized with scripts/sync-clinic.mjs without deleting booking history.

## Visual direction
Professional, patient-focused dental practice for Indonesian and international visitors. Violet remains the brand color, with offwhite surfaces, restrained borders and generous spacing. All type uses Plus Jakarta Sans; the user explicitly rejected serif typography.

Primary action #7348a8 with white text. Heading #292335, body #746d80, background #fcfbfe, soft surface #f3eff8. Editorial layouts use large, restrained sans-serif headings (weight 500), 14–15px body copy, rounded content panels, and pill-shaped appointment buttons. Content width 1232px, mobile gutters 20px, with visible keyboard focus. Preserve the violet/offwhite palette and light/dark themes.

On the doctor page, give the name the full header width and keep `drg. Dava Fathiyatuzzakiyah` together, with the specialist credential smaller. Place the specialty and clinic locations below. Avoid oversized names in narrow split columns. The treatment-page introduction uses a balanced two-line heading with a violet second line, supporting copy, and a consultation link.

## Opening sequence
The first opening has a branded dental loading screen with real 3D asset progress, inspired by https://porto-ten-tau.vercel.app/. Reach 100% after the first rendered frame, show WELCOME, then reveal a rotating molar in a full-screen visual scene. Scroll continuously returns the molar to its position in a complete rotating dental arch with gums; further scrolling reaches all clinic content, starting with the headline and consultation CTA.

This is a visual introduction, not a dental education tool. No names, labels, information cards, tooth picker or selection behavior. Retain only an unobtrusive pause/play control for accessibility. The scene occupies the whole screen on mobile and desktop. Local assets and lighting; no runtime HDR dependency. Use the original procedural model from scripts/generate-dental-model.mjs. The standalone lower molar follows the supplied rotating reference: five unequal convex cusps, branching fissures, glossy ivory enamel and two asymmetric matte cream roots. It returns to the lower right M1 slot; assembled teeth have only compact crowns embedded in naturally rounded gingiva. Preserve the approved tooth arrangement. This is a reconstruction rather than an exact copy of the reference asset. Pause rendering offscreen, honor reduced motion, preserve vertical touch scrolling and provide a visual fallback when WebGL fails. Legacy model provenance stays documented in README.md.

## Content
Use bilingual ID/EN copy. Do not invent patient ratings, credentials, real clinic photography or business details. Gallery illustrations must remain labeled. Contact details in lib/site.ts are sample data that the clinic must verify before publication. Footer credit: `Developed by Naufal Dzakwan`, linking to https://porto-ten-tau.vercel.app/.

## WhatsApp appointments and two clinics
The public homepage presents the approved 3D intro, a welcome with labeled editorial still-life imagery, two clinic choices, a numbered treatment list, the doctor’s approach, WhatsApp visit steps, FAQs, and location-specific CTAs. Pekanbaru and Taluk Kuantan are the confirmed locations. Both currently use the existing example WhatsApp number, expressly approved for this redesign; real addresses and schedules must not be invented.

The public `/booking` page prepares a WhatsApp message. Location is required; name, treatment, preferred date/time (WIB), and a brief note are optional. It does not reserve an appointment or submit patient data to the booking API. The patient reviews and sends the message in WhatsApp; the clinic confirms the schedule. Keep legacy records and administration routes intact. Query parameters can preselect a validated clinic/treatment; selecting a clinic from any page must reach the corresponding WhatsApp context.
