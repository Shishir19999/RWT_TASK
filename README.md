# RWT Tasks

Two front-end practice tasks, published as a static site.

**Live demo:** https://shishir19999.github.io/RWT_TASK/

| Task | Page |
| --- | --- |
| Landing page (overview cards) | `index.html` |
| Task no. 1 - coming soon slider | `Task no. 1/index.html` |
| Task no. 2 - login form | `Task no. 2/index.html` |

## Features

### Landing page
- Cards with screenshots linking to both tasks
- Layered parallax background and scroll-reveal cards
- Light and dark theme

### Task no. 1 - coming soon slider
- Slick slider with fade transition, previous / next buttons, dot navigation and a pause / play button
- Autoplay pauses on hover, on keyboard focus, when the tab is hidden and when the visitor presses pause
- Left / right arrow keys and touch swipe; the slideshow starts paused when the system asks for reduced motion
- Live countdown to the launch date (change `data-launch` on `#countdown` in the page)
- E-mail subscribe form with inline validation; addresses are stored only in this browser (`localStorage`)
- "What to expect" section with scroll-reveal cards
- Parallax: pointer and scroll depth on the slider, floating orbs (see Motion below)
- Large source photos are served as optimized AVIF / WebP copies through `<picture>`; small-screen crops are used up to 992px

### Task no. 2 - login form
- Full validation (required, e-mail format, minimum password length) with inline messages and `aria-invalid`
- Show / hide password toggle, remember me (stores the e-mail address only), forgot-password view
- Demo authentication with a SHA-256 hash check (WebCrypto) and a 30 second pause after 5 failed attempts
- Success state with sign out; session restored on reload

### Shared
- Design tokens (CSS variables), light and dark theme (follows the system setting, remembered after you pick one)
- Skip link, visible focus rings, labelled controls, ARIA live regions, toasts
- Responsive from 320px, favicon, page titles, meta and Open Graph tags, `404.html`
- Motion: parallax, floating decoration and scroll reveal use only `transform` and `opacity`, driven by
  `IntersectionObserver` and `requestAnimationFrame`. It is switched off for `prefers-reduced-motion`,
  and scroll / pointer parallax is off on small screens, in data-saver mode and on low-power devices.
  Form fields are never animated.

## Demo login

| E-mail | Password |
| --- | --- |
| `demo@example.com` | `Demo@1234` |

This is a client-side demo only. Nothing is sent anywhere.

## How to run

Open `index.html` in a browser, or serve the folder with any static server, for example:

```
npx serve .
python -m http.server 8080
```

All links and assets are relative, so the site works from a sub-path such as `/RWT_TASK/`.
No CDN is required; jQuery and slick are included in `Task no. 1/vendor/`.

## Publish on GitHub Pages

Settings -> Pages -> deploy from the `main` branch, root folder. `404.html` uses the `/RWT_TASK/` base path;
update it if the repository is renamed.

## Project structure

```
index.html            landing page
404.html
assets/               shared css (base, landing), js (ui, parallax) and images
Task no. 1/           coming soon page (assets/, vendor/)
Task no. 2/           login page (assets/)
```

## Notes

- The original `Tribali_website_comingsoon*.png` (8-9 MB), `tribali*.jpg` and `smallwebsite*.png` files are kept as
  they were; pages load the `-1200` / `-1920` / `-500` AVIF and WebP copies instead.
- Older build leftovers (`app.scss`, `style.scss`, `*.css.map`, `Task no. 1/script.js`, `screenshots/`) are no longer
  used by the pages and can be removed.
