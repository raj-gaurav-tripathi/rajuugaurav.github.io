# Raj — Academic Website

A personal academic website built for graduate-school applications:
plain HTML, CSS and JavaScript, no build step, no framework — ready to push
straight to GitHub Pages.

---

## 1. Folder structure

```
raj-cosmology-site/
├── index.html              Homepage: hero, about, research, projects, publications, blog teaser, contact
├── blog.html                Full blog listing
├── .nojekyll                 Tells GitHub Pages not to run this through Jekyll
├── README.md                 This file
│
├── partials/                 Markup shared by every page
│   ├── nav.html               ← edit the nav ONCE here, updates everywhere
│   └── footer.html            ← same idea, for the footer
│
├── posts/                    Individual blog posts (one HTML file each)
│   └── sample-post.html       A real first post AND the template to copy for new ones
│
├── css/
│   ├── variables.css          Design tokens — colors, fonts, spacing. Edit THIS to re-skin the site.
│   ├── base.css                Reset + base typography + small utility classes
│   ├── layout.css              Nav bar + mobile menu + footer
│   ├── hero.css                 Hero section + canvas animation container
│   ├── components.css          Buttons, cards, tags, quote block, contact tiles
│   ├── sections.css             Layout for About / Research / Projects / Publications / Contact
│   ├── animations.css           Keyframes + scroll-reveal system
│   └── blog.css                  Blog listing + individual post styling
│
├── js/
│   ├── include-partials.js     Loads nav.html/footer.html into every page
│   ├── nav.js                    Mobile menu, active-link highlight, scroll shadow
│   ├── ui.js                      Scroll-reveal, back-to-top, footer year, random quote
│   ├── starfield.js               The hero's animated "resonance band" visualization
│   ├── render.js                  Turns the data files below into on-page cards
│   ├── main.js                    Entry point for index.html
│   ├── blog-main.js               Entry point for blog.html
│   └── data/
│       ├── projects.js            ← EDIT to add/remove Projects cards
│       ├── publications.js        ← EDIT to add publications (starts empty)
│       ├── blog-posts.js          ← EDIT to list blog posts
│       └── quotes.js              ← EDIT to change the rotating quote
│
└── assets/
    ├── images/
    │   ├── profile/                Your photo goes here
    │   ├── projects/                Project thumbnails (placeholders included)
    │   ├── blog/                    Blog thumbnails (placeholder included)
    │   └── favicon/                 Site icon
    └── resume/                     Your CV goes here (see the .txt note inside)
```

**The rule of thumb:** content lives in `js/data/*.js`, design lives in
`css/*.css`, and structure lives in the `.html` files. Most future updates —
a new project, a new blog post, a color tweak — only touch one file.

---

## 2. Previewing it locally

The nav and footer are loaded into every page via JavaScript (`fetch`), so
**double-clicking `index.html` won't show them** — browsers block `fetch()`
on the `file://` protocol. You need a local server. Pick whichever's easiest:

```bash
# Python (already installed on most systems)
cd raj-cosmology-site
python3 -m http.server 8000
# then open http://localhost:8000

# Node
npx serve .

# VS Code
# install the "Live Server" extension, right-click index.html → "Open with Live Server"
```

This is only needed for local preview — once it's on GitHub Pages, it's
served over `https://` and everything works normally.

---

## 3. Publishing to GitHub Pages

1. Create a new repository on GitHub and push this folder's contents to it
   (this folder *is* the repo root — don't nest it inside another folder).
2. In the repo, go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**, pick `main` and `/root`.
4. Save. GitHub gives you a URL — usually
   `https://<your-username>.github.io/<repo-name>/` — within a minute or two.

Every internal link in this project is a *relative* path (never starting
with `/`), so the site works correctly whether it's hosted at the root of
`username.github.io` or in a sub-path like `username.github.io/repo-name/`.
You don't need to change anything either way.

---

## 4. Making it yours

### Colors & fonts
Open `css/variables.css`. Every color and font on the site is a named
variable at the top of that file (`--color-flux`, `--font-display`, etc.) —
change a value there and it updates everywhere it's used, including inside
the hero animation (`js/starfield.js` reads the same variables at runtime).

### Your name, tagline, and photo
- Name/tagline: edit the `<h1>` and the paragraph right after it in the
  Hero section of `index.html`.
- Photo: save your photo as `assets/images/profile/profile-photo.jpg` and
  update the `src` on the `#profile-photo` image in the Intro section of
  `index.html` to match. A square (1:1) crop looks best.
- CV: see `assets/resume/ADD_YOUR_CV_HERE.txt`.
- Email & profile links: search `index.html` for `Contact` and replace the
  `href="#"` / `mailto:` placeholders with your real ones.
- Social icons in the footer: edit `partials/footer.html`.

### Adding a project
Open `js/data/projects.js` and copy the `TEMPLATE` shape described in the
comment at the top of the file into the `SITE_PROJECTS` array. The card,
its tags, and its filter pill are all generated automatically — no HTML
editing required. Categories you haven't used yet (e.g. `internship`) get
their own filter pill automatically the first time you use them.

### Adding a publication
Open `js/data/publications.js` and add an entry to the (currently empty)
array, following the shape shown in the comment. The homepage automatically
swaps the "no publications yet" message for a real list the moment the
array isn't empty.

### Adding a blog post
1. Copy `posts/sample-post.html` to `posts/your-post-slug.html` and edit
   the title, date, tags, and body.
2. Add a matching entry to `js/data/blog-posts.js`.

Full instructions are in the comments at the top of both files.

### Changing the navigation
Edit `partials/nav.html` (and the matching links in `partials/footer.html`)
— every page picks up the change automatically. If you add a page inside
a new subfolder, remember to set `window.SITE_ROOT` at the top of that
page's `<head>` (see the comment in `js/include-partials.js` for exactly
how this works — `posts/sample-post.html` is a working example).

---

## 5. About the hero animation

The moving pattern behind your name isn't a generic starfield — it's a
stylised nod to the actual physics: a Floquet/tachyonic-resonance chart,
where most momentum modes stay calm but a narrow band grows. That's the
mechanism this site's Research section describes for magnetogenesis. It's
drawn live in `js/starfield.js`, pauses automatically when the tab isn't
visible or the hero has scrolled off-screen, and renders a single static
frame instead of animating for visitors who've asked their OS for reduced
motion.

## 6. About the quotes

The rotating quote (shown once per page load, between Research and
Projects) pulls from `js/data/quotes.js`. All six included there were
checked against sourced references before being added — quote
misattribution is extremely common online, so it's worth double-checking
before adding more.

---

Built with plain HTML/CSS/JS on purpose: no build step, no dependencies to
go stale, nothing to break in six months. Everything here should be
readable and editable even if you don't touch it again for a year.
