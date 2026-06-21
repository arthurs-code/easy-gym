# Easy Gym PWA

This is the installable iPhone web-app version.

## Test on Windows

1. Unzip this folder.
2. Open Command Prompt inside the folder.
3. Run:

```bash
python -m http.server 8080
```

4. Open `http://localhost:8080` in Chrome or Edge.

## Install on iPhone

For iPhone Home Screen install, upload the folder to an HTTPS host, for example GitHub Pages, Netlify, Vercel, or your web hosting.

Then on iPhone:

1. Open the HTTPS link in Safari.
2. Tap Share.
3. Tap Add to Home Screen.
4. Open Easy Gym from the Home Screen icon.

## Files

- `index.html` — app
- `manifest.json` — PWA install settings
- `service-worker.js` — offline cache
- `icons/` — app icons
