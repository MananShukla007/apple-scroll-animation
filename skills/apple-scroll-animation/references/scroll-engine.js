/* Apple-style scroll engine: plain JS, no dependencies. Paste into a <script> at the end of <body>.
 *
 * HTML shape for a pinned effect:
 *   <section id="hero" style="height:300vh">          <!-- tall wrapper = animation budget -->
 *     <div class="stick">...content...</div>          <!-- .stick{position:sticky;top:0;height:100vh;overflow:hidden} -->
 *   </section>
 */
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = t => 1 - Math.pow(1 - t, 3);

// progress 0..1 through a tall pinned wrapper
const pin = el => { if (RM) return 1; const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };
// progress 0..1 as an element scrolls into view: starts when its top is at `a`*viewport height, ends at `b`*vh (a > b)
const enter = (el, a = 1, b = 0.4) => { if (RM) return 1; const r = el.getBoundingClientRect(); return clamp((innerHeight * a - r.top) / (innerHeight * (a - b))); };

/* ---- Example 1: items fly in from the edges and assemble into their layout position ---- */
const hero = document.getElementById('hero');
const items = [...document.querySelectorAll('#lineup .f')];   // laid out normally with flex/grid
let scatter = [];
function layout() {
  const box = hero.firstElementChild.getBoundingClientRect();
  items.forEach(i => { i.style.translate = ''; i.style.rotate = ''; i.style.scale = ''; });   // measure at the natural spot
  scatter = items.map((el, i) => {
    const r = el.getBoundingClientRect(), a = (i / items.length) * Math.PI * 2 + 0.5;
    return {
      dx: box.width / 2 + Math.cos(a) * innerWidth * 0.62 - (r.left - box.left + r.width / 2),
      dy: box.height / 2 + Math.sin(a) * innerHeight * 0.62 - (r.top - box.top + r.height / 2),
      rot: (i % 2 ? 1 : -1) * (35 + i * 9),
    };
  });
}

/* ---- Example 2: words light up (wrap each word in a <span> first) ---- */
// const words = [...document.querySelectorAll('#words span')];

/* ---- Example 3: pinned stepper ---- */
// const steps = [...document.querySelectorAll('.step')]; let cur = -1;
// const q = pin(stepperEl), pos = q * steps.length, i = Math.min(steps.length - 1, Math.floor(pos));
// if (i !== cur) { cur = i; show(i); }                    // swap the content for step i
// steps[i].style.setProperty('--sp', pos - i);             // CSS: .step.on .bar{transform:scaleX(var(--sp))}

function tick() {
  // assemble
  const p = pin(hero);
  items.forEach((el, i) => {
    const s = scatter[i]; if (!s) return;
    const e = ease(clamp((p - i * 0.012) / 0.55));         // slight stagger per item
    el.style.translate = `${s.dx * (1 - e)}px ${s.dy * (1 - e)}px`;
    el.style.rotate = `${s.rot * (1 - e)}deg`;
    el.style.scale = 0.35 + 0.65 * e;
    el.style.opacity = 0.2 + 0.8 * e;
  });

  // tilt-flat device mockup
  // const e1 = ease(enter(phone, .98, .35));
  // phone.style.transform = `perspective(1400px) rotateX(${(1 - e1) * 22}deg) translateY(${(1 - e1) * 60}px) scale(${.84 + .16 * e1})`;
  // phone.style.opacity = .2 + .8 * e1;

  // cards rise in, staggered by column
  // cards.forEach((c, k) => { const d = (k % 4) * .04, e = ease(enter(c, 1.02 - d, .62 - d));
  //   c.style.translate = `0 ${(1 - e) * 80}px`; c.style.scale = .9 + .1 * e; c.style.opacity = e; });

  // media expands
  // const e2 = ease(enter(vid, 1, .25)); vid.style.scale = .78 + .22 * e2; vid.style.borderRadius = (44 - 16 * e2) + 'px';
}

let queued = false;
const req = () => { if (!queued) { queued = true; requestAnimationFrame(() => { queued = false; tick(); }); } };
addEventListener('scroll', req, { passive: true });
addEventListener('resize', () => { layout(); req(); });
layout(); tick();
