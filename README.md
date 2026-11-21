# swixixle.github.io

Form Filler moved on 2026-11-21 from `swixixle.github.io/form-filler/` to
<https://formfiller-app.github.io/form-filler/> (its repository is now
[formfiller-app/form-filler](https://github.com/formfiller-app/form-filler)).

This repository publishes only what the old address shows since then, in `form-filler/`:

- `index.html`, `goodbye.js`, `goodbye.css`: a page that says where Form Filler went. It finds what an earlier version
  kept in this browser at the old address (your details, a saved signature and remembered forms, all in plain text,
  and the copy kept for offline use), shows your details if you ask, so you can type them in again at the new
  address, and removes all of it when you ask. It sends nothing anywhere.
- `sw.js`: takes the place of the service worker an earlier version left at the old address, so a copy kept for
  offline use, or put on a home screen, opens this page instead of the old version.

Do not make a repository called `Swixixle/form-filler` again: GitHub forwards links from that name to
`formfiller-app/form-filler` only while nothing else takes the name.
