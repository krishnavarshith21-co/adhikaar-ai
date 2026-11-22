# Heritage pavilion implementation and verification

22 November 2026. This change follows the supplied sandstone-and-brass pavilion reference within the existing landing-page heritage card. It is an original procedural 3D reconstruction, not a pixel-identical reproduction of the supplied raster image. The original photograph is used only as the clearly labelled loading/error fallback.

## Inspection and corrections

The original model consisted primarily of two shallow facade extrusions, thin columns, a small spherical dome and a translucent circular shadow. Its camera was frontal; cursor following lacked drag controls; it bobbed vertically rather than rotating; it rendered while offscreen; materials had no surface detail or environment reflections. The wrapper also imported the heavyweight Three.js module to display its fallback, defeating the intended loading boundary.

Installed versions were checked: Next.js 16.4.6, React 19.3, React Three Fiber 9.8.2 and Three.js 0.187.0. Local Next.js client-component documentation and installed renderer APIs were inspected before implementation. The removed `PCFSoftShadowMap` default was replaced explicitly with the supported `PCFShadowMap`.

The geometry now has a full-depth pavilion, actual open front/rear portals, nested scalloped arch mouldings, pierced floral jali screens, masonry courses, cylindrical columns with lotus capitals/bases, rosettes, corbels, layered eaves, tiled floor, stepped bevelled foundations, and a broad lathed brass dome with ribs, ornamental drum and finials. Stone grain is deterministic procedural mineral noise. Materials use physically based roughness/metalness, a generated reflection environment, warm upper-left lighting, cool fill and a receiving shadow plane.

Six merged meshes hold 245,920 triangles for the sculpture; shadow rendering adds its own passes. No external model, texture service, postprocessing or new dependency is required. Geometry/material/texture resources and the generated environment are explicitly disposed. DPR is capped at 1.5 and the shadow map at 1024 square. The model loads when its section first enters view. Frame-delta integration drives a slow bounded rotation sweep and damped input, with no per-frame React state updates. The ground remains stationary; vertical mouse movement adjusts the camera instead of tipping the building through the floor.

Dragging, keyboard arrows, Home/reset and pause/resume are available. The camera frames the complete model at desktop/tablet/mobile widths. Touch uses `pan-y` so vertical page scrolling remains available. Reduced motion disables automatic motion; manual exploration remains possible. Intersection and page visibility stop the continuous frame loop. WebGL creation failures and context loss display an accessible static reference.

The 320px overflow was traced to the eligibility preview's nonshrinking **Additional Information Required** badge, extending to x=331.83px. Its row now wraps and the badge is width-constrained. The heritage grid child separately has `min-width: 0` and a parent-sized canvas. No global overflow hiding was introduced.

## Modified files

- `src/components/three/heritage-model.ts`: geometry, seeded stone textures, material batching and resource ownership.
- `src/components/three/hero-sculpture.tsx`: scene, lighting, camera, rendering lifecycle, pointer/keyboard controls and motion preferences.
- `src/components/three/sculpture-fallback.tsx`: lightweight accessible image fallback.
- `src/components/three/sculpture-wrapper.tsx`: true lazy WebGL loading and error boundary.
- `src/components/home/heritage-section.tsx`: local minimum-width constraints and card hook; existing text/layout retained.
- `src/components/home/eligibility-section.tsx`: narrowly scoped status-badge overflow correction.
- `src/app/globals.css`: viewer sizing, controls, touch/focus and entrance animation; original 320/380/440px height breakpoints retained.
- `public/images/heritage-reference.png`: supplied user image, copied unchanged for static fallback.
- `scripts/test-heritage-geometry.mjs`: reproducible geometry/ownership checks.
- `scripts/qa-heritage.mjs`: Chromium CDP interaction/responsive/fallback checks.
- `docs/HERITAGE-3D.md`: this report.

The landing hero image, text, page sections, navigation and navy/ivory/gold identity were preserved. Hero image SHA-256 remains `3da86f49eeba1a8691d553aa58ac460da5dc7cbe3fbe8e8b87e6dadb72487984`.

## Checks

- `npm run typecheck`: passed.
- `npm run lint`: passed without warnings.
- `npm run build`: passed.
- `node scripts/test-heritage-geometry.mjs`: passed; verifies six batches, finite geometry, bounded triangle count and dimensions, a raycast-open central passage, solid corner piers and disposal of all six geometries/materials.
- `QA_BASE_URL=http://127.0.0.1:3100 node scripts/qa-heritage.mjs`: **12 checks passed** in production Chromium, covering continuous motion, stable pause, mouse drag/limits, keyboard reset, reduced motion/manual interaction, 834×1112 tablet, 390×844 mobile, 320×740 small mobile, horizontal touch inspection versus vertical scrolling, offscreen pause, simulated page visibility, forced context loss and unavailable-WebGL fallback. Desktop was also visually inspected at 1440×1000.
- Screenshots and machine-readable results are written to ignored `.qa-artifacts/heritage/`; the running browser must expose its isolated CDP port (default 9223). No ordinary personal browser profile is used.

Normal rendering produced no application exceptions or WebGL errors. The existing unauthenticated `/api/session` probe returns 401 and is recorded separately. React Three Fiber 9.8.2 constructs a deprecated `THREE.Clock` internally; its vendor deprecation warning remains, without editing dependencies or suppressing application logging. Intentionally losing/disabling WebGL produces expected renderer/error-boundary diagnostics; these are recorded separately from the normal rendering assertions.

## Remaining limits

Actual desktop Safari/iOS Safari and physical touch devices were not available for this verification. Chromium touch/media preference emulation is not equivalent to physical-device QA. Browser resource stability over very long sessions and low-end mobile frame rates have not been certified; explicit resource disposal and bounded geometry were checked. Pixel-identical photographic lighting, carving and surface detail cannot be established from a single reference image; this is a real interactive geometry interpretation, with simplified ornament to keep rendering practical.

API references: [React Three Fiber on-demand rendering](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Three.js WebGLRenderer](https://threejs.org/docs/pages/WebGLRenderer). Installed package source is authoritative for this implementation's version-specific behaviour.
