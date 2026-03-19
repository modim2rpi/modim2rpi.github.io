# Shahid Modi — Personal Academic Website

A single-page static website for hosting on GitHub Pages.

## Quick Deploy to GitHub Pages

1. **Create a GitHub repository** named `<your-username>.github.io` (for a user site) or any name (for a project site).

2. **Push the contents of the `site/` folder** to the repository:

```bash
cd site
git init
git add .
git commit -m "Initial commit — personal website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

3. **Enable GitHub Pages** in repository Settings → Pages → Source: `main` branch, root `/`.

4. Your site will be live at `https://<your-username>.github.io/` (or `https://<your-username>.github.io/<repo-name>/`).

## Adding Your Photo

Replace the placeholder in the hero section by:
1. Place your photo (e.g., `profile.jpg`) in the `site/assets/` folder.
2. In `index.html`, find the `photo-placeholder` div and replace its contents:

```html
<div class="photo-placeholder" id="profilePhoto">
    <img src="assets/profile.jpg" alt="Shahid Modi">
</div>
```

## Structure

```
site/
├── index.html       # Single-page monolith (all 5 sections)
├── css/style.css    # All styling
├── js/main.js       # Tab navigation & animations
├── assets/          # Resume PDF, profile photo
└── .nojekyll        # Tells GitHub Pages to skip Jekyll processing
```

## Features

- **Single-page architecture** — no reloads between tabs
- **5 tabbed sections** — Home, Research, Building, Experience, Principles
- **Dark theme** with tech-blue accent
- **Fully responsive** — mobile, tablet, desktop
- **Zero dependencies** — pure HTML/CSS/JS, no frameworks
- **Keyboard navigation** — arrow keys switch tabs
- **Efficient** — under 100KB total (excluding resume PDF)
