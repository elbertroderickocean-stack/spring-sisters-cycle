
- Routing: marketing site owns `/`, `/shop`, `/privacy`, `/terms`; the app entry (splash) is `/app` and app screens keep their own top-level paths — the domain serves the brand site, the app is secondary.
- Scroll reveals: never let the element that owns the in-view observer be one that starts clipped or scaled to zero area (clip-path inset, scaleX/scaleY 0) — IntersectionObserver sees zero area and never fires, so the reveal can't start. Observe an unclipped wrapper (or drive `animate` from state) and apply the clip on the child.
- Scroll reveals: a nested `whileInView` inside an element that already animates on scroll can be skipped by variant propagation — for children of scroll-animated blocks use `useInView` on their own ref and pass the result to `animate`.
