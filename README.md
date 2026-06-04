# HR Pages

Static quick pages for HR and internal links.

## Local Preview

```bash
npm start
```

Then open `http://localhost:3000`.

## Passcode

For local Node hosting, copy `.env.example` to `.env` and set:

```bash
PASS=your-passcode
```

If `.env` is missing, the server uses `hr@beforest`.

GitHub Pages is static, so it uses the lightweight browser gate in `auth.js`.

## Add A Page

1. Add the HTML file inside `pages/`.
2. Add `<script src="../auth.js"></script>` before `</head>` in the page.
3. Add a link to it in `index.html`.
4. Commit and push.

Once GitHub Pages is enabled for this repo, the index should be available at:

`https://harshaislive.github.io/hr_pages/`
