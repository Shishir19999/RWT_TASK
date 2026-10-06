# RWT-Shishir

Two front-end tasks.

## Task no. 1 - "Coming Soon" slick-slider
- `index.html`, `script.js`, `app.scss` -> `assets/css/app.css`
- Full-screen slick slider with a text overlay (left aligned on desktop, centred below 992px).
- `script.js` swaps to the `Tribali_website_smallwebsite*.png` images on screens up to 992px, keeping each original src in `data-desktop-src`.
- `app.css` / `app.css.map` in the Task folder root are an extra compile output (untracked); the page uses `assets/css/app.css`.
- Large images: `Tribali_website_comingsoon*.png` are about 8-9 MB each; compress or convert to WebP for production.

## Task no. 2 - Login page
- `index.html`, `script.js`, `style.scss` -> `assets/css/style.css`
- Email/password validation in the browser only (no data is logged or sent).
- Background image: `assets/img/tribali.jpg`. Root `style.css` / `style.css.map` are an extra compile output (untracked); the page uses `assets/css/style.css`.
- Icons come from boxicons (CDN).

Open the `index.html` of each task in a browser; CDNs need internet.

## Library versions (updated 2026-10)
- Task no. 1: jQuery 4.0.0, slick-carousel 2.0.0, Font Awesome 7.3.1 (CSS), boxicons 2.1.4 (latest); unused Popper 1.16 and the redundant Font Awesome JS bundle removed.
- Task no. 2: boxicons 2.1.4 CSS (latest).
- All CDN files use SRI (sha384) + `crossorigin`.
