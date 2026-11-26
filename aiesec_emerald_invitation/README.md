# AIESEC Emerald & Gold Digital Invitation

A responsive, single-page digital invitation built with plain HTML, CSS and JavaScript. No build step or package installation is required.

## Run locally
1. Extract the project folder.
2. Open `index.html` in a browser, or use VS Code Live Server for a local development server.
3. Edit the placeholder content in `index.html`.

## Add the AIESEC logo
The current project includes a temporary lettermark placeholder. Put your logo in `assets/images/` (for example `aiesec-logo.svg`) and replace the `.hero-logo-placeholder` block in `index.html` with:

```html
<img class="event-logo" src="assets/images/aiesec-logo.svg" alt="AIESEC">
```

You can add this CSS to `styles.css`:

```css
.event-logo { width: 100px; height: auto; object-fit: contain; }
```

The small header brand can also be updated to use the same logo.

## Add dinner jazz
Place an MP3 file you have permission to use at:

`assets/audio/dinner-jazz.mp3`

The music control starts playback only after the visitor clicks it, because browsers generally block autoplay with sound. The audio loops and can be paused/resumed.

## Update the invitation content
Search `index.html` for square-bracket placeholders such as:
- `[Local Committee]`
- `[Venue name]`
- `[Street, area, city]`
- `[Day, date and month]`
- `[Arrival time]`
- `[Your Event Theme]`
- `[KES 0]`
- Agenda times and titles

Replace them with the official event information. The theme colour samples are in the `#theme` section. Adjust the CSS custom properties at the top of `styles.css` to refine the palette.

## RSVP behaviour
- "Yes" immediately displays an attendance confirmation.
- "No" playfully dodges up to four times, then settles and becomes a usable decline button.
- The interaction is local to the page. It does **not** send or store RSVP data on a server. To collect responses, connect a form backend or spreadsheet endpoint later.

## Project structure

```text
aiesec_emerald_invitation/
├── index.html
├── styles.css
├── script.js
├── README.md
└── assets/
    ├── audio/
    │   └── dinner-jazz.mp3   (add your audio file)
    └── images/
        └── (add logo and event images here)
```

## Notes
- Responsive layouts are included for mobile and desktop.
- Smooth anchor scrolling and scroll-reveal effects are included.
- Respects `prefers-reduced-motion`.
- Fonts are loaded from Google Fonts when internet access is available; system fallbacks are provided.
