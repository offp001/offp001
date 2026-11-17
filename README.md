# offp — personal portfolio

A responsive three-tab portfolio made with plain HTML, CSS and JavaScript.

## Run locally
Open `index.html` in a browser, or serve this folder with any static web server.

## Pages
- **about** — profile, Discord presence, intro terminal and language list.
- **github** — fetches the public GitHub profile, repositories and profile README from the GitHub REST API.
- **projects** — intentionally empty placeholder page.

## Personalization
- Discord user ID and GitHub username are in `script.js`.
- Social profile links and Open Graph metadata are in `index.html`.
- To prioritize selected repositories in the GitHub page, add exact repo names to `pinnedNames` in `script.js`.
- Replace the `projects` page placeholder with your own content when ready.

## Discord embed
The Open Graph title, description and GIF preview are configured in `index.html`. After deployment, use your public site URL in Discord. Discord may cache previews; use its embed refresh/debugger workflow or change the page URL/query string to force a fresh preview.

Presence uses the public Lanyard endpoint and may show unavailable if the user is not sharing presence there. GitHub API data is fetched live in the browser; no token is needed for public profile data.
