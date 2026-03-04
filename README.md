## Liu Peijie - Academic Homepage

This repository contains the source code for my personal academic homepage, hosted via GitHub Pages.

The site is a single-page static website built with HTML, CSS, and JavaScript, and renders most content from Markdown and a small YAML config file.

### Tech Stack

- Static HTML + CSS + JavaScript
- [Bootstrap](https://getbootstrap.com/) and Bootstrap Icons for layout and components
- [Google Fonts](https://fonts.google.com/) for typography
- [marked.js](https://marked.js.org/) to render Markdown files into HTML
- [js-yaml](https://github.com/nodeca/js-yaml) to parse YAML configuration
- [MathJax](https://www.mathjax.org/) to render LaTeX-style math formulas

### Content Structure

- `index.html`  
  Main single-page layout. Sections:
  - `HOME`
  - `PUBLICATIONS`
  - `EXPERIENCE`
  - `AWARDS`

- `contents/config.yml`  
  Basic site configuration, including:
  - `title`: page `<title>`
  - `page-top-title`: text in the navbar
  - `top-section-bg-text`: large tagline on the hero section
  - `home-subtitle`: subtitle for the home section
  - `copyright-text`: footer text

- `contents/home.md`  
  Home section content: about me, research experience, skills, education, and contact information.

- `contents/publications.md`  
  Publication list (published and preprint).

- `contents/experience.md`  
  Industry and research experience.

- `contents/awards.md`  
  Awards, scholarships, and volunteer honors.

### How to Update Content

- **Basic information**  
  Edit `contents/config.yml`.

- **Homepage introduction and profile**  
  Edit `contents/home.md`.

- **Publication list**  
  Edit `contents/publications.md`.

- **Experience and awards**  
  Edit `contents/experience.md` and `contents/awards.md`.

Changes to these files are picked up automatically by the front-end JavaScript and rendered via marked.js and MathJax.

### Local Preview

You can use any static file server to preview the site locally, for example with Python:

```bash
cd liupeijie.github.io
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

### License

The code in this repository is licensed under the MIT License (see `LICENSE`).

