---
name: apple-scroll-animation
description: Build Apple-style scroll-driven animation (scrollytelling) in plain HTML/CSS/JS with no libraries. Use when the user wants a page where things assemble, light up, tilt, expand or switch as they scroll, like apple.com product pages. Covers pinned (sticky) sections, scroll-progress scrubbing, word-by-word reveals, element fly-ins, and how to test it headlessly.
---

# Apple-style scroll animation

Effects are **scrubbed by scroll position**, not triggered by a timer. Scrolling up plays them backwards. No library needed.

## The three ideas

1. **Pin.** A tall wrapper (e.g. `height: 300vh`) holds a `position: sticky; top: 0; height: 100vh; overflow: hidden` child. The child stays on screen while the wrapper scrolls past. The wrapper's extra height is your animation budget.
2. **Progress.** One function turns scroll position into a number 0..1:
   - pinned section: `clamp(-rect.top / (rect.height - innerHeight))`
   - element entering the viewport: `clamp((innerHeight*a - rect.top) / (innerHeight*(a-b)))`
3. **Drive visuals from the number.** Set `translate`, `rotate`, `scale`, `opacity` (and `borderRadius`) each frame. One `scroll` listener throttled with `requestAnimationFrame` recomputes everything.

Ready-to-paste engine: `references/scroll-engine.js`.

## Effects that work well (pick 3-5, not all)

| Effect | How |
|---|---|
| **Assemble** | Items start scattered around the viewport edge (random angle, rotation, scale .35, opacity .2) and ease to their layout position. Compute each item's offset to its natural spot once (on load/resize), then multiply by `(1 - ease(p))`. Stagger by index. |
| **Word light-up** | Wrap each word in a span. Opacity `.18 → 1` as `clamp(p * 1.25 * N - k)`. |
| **Pinned stepper** | `step = floor(p * N)`; the fraction `p*N - step` fills a progress bar inside the active step. Clicking a step should `scrollTo` that step's position. |
| **Tilt-flat** | `perspective(1400px) rotateX((1-e)*22deg) translateY((1-e)*60px) scale(.84 + .16*e)` for a phone/device mockup. |
| **Rise-in cards** | `translate: 0 (1-e)*80px; scale: .9+.1e; opacity: e`, delay by column (`i % cols`). |
| **Expand** | Video/image `scale .78 → 1` and `borderRadius 44px → 28px`. |

Use `ease = t => 1 - (1-t)**3` on the progress before applying it.

## Rules (learned the hard way)

- **Use the individual CSS properties** `translate`, `rotate`, `scale` for scrubbing, and keep `transform` for hover. Otherwise hover and scroll fight over the same property.
- **Don't combine** a `.reveal` fade class with a scrubbed transform on the same element. Pick one.
- **Put the section heading inside the pinned panel** with the content. If the panel holds only the content and it is centred, tall monitors show a big blank area.
- **Keep scroll distance modest.** About `N * 55vh + 100vh` for an N-step stepper, `240-300vh` for a one-shot effect. Users find 700vh+ tiring.
- **Cap what's pinned to what fits 100vh.** On short screens (`max-height: 820px`) and phones, hide subtitles and extras, and show only the active step in a stepper.
- **Reduced motion:** if `prefers-reduced-motion: reduce`, return progress `1` everywhere (final state, no movement). Don't leave things hidden.
- **Sticky needs no `overflow` on ancestors** except `overflow-x: hidden` on `body`, which is fine. Avoid `overflow: hidden` on any wrapper between the sticky element and the page.
- **Recompute on resize** (the assemble offsets depend on layout).
- Animate only `translate/rotate/scale/opacity/border-radius`; avoid layout properties.
- Avoid a tiny first/last segment of video: if scrubbing `<video>` playback, short clips can render blank.

## Typical page order

Hero (pinned, assemble) → one plain statement (no effect) → proof/film (expand) → pinned stepper → device mockup (tilt-flat) → card grid (rise-in) → CTA. Alternate black and light-grey sections for the Apple feel; one accent colour.

## Testing

Headless Chrome's `--screenshot` cannot scroll. Drive a real Chrome over the DevTools protocol instead:

1. `chrome --headless=new --remote-debugging-port=9333 --user-data-dir=/tmp/prof about:blank &`
2. From Node (v22+ has global `WebSocket`): fetch `http://localhost:9333/json`, open the page's `webSocketDebuggerUrl`, send `Emulation.setDeviceMetricsOverride`, `Page.navigate`, then for each position `Runtime.evaluate("scrollTo(0,Y)")`, wait ~700 ms, `Page.captureScreenshot`.
3. Choose Y from the sections' `offsetTop` and heights (e.g. 0%, 60%, 100% of each pinned section).
4. Check at desktop (1440x900), a large screen (2000x1300) and a phone (390x800), and confirm `document.documentElement.scrollWidth === innerWidth` (no horizontal overflow).

## Deliverable checklist

- [ ] Every effect driven by scroll progress, reversible
- [ ] Reduced-motion fallback
- [ ] Phone layout checked, no horizontal scroll
- [ ] Pinned scroll length modest; no blank space on tall screens
- [ ] Screenshots taken at start / middle / end of each pinned section
