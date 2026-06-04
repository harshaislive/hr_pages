const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
loadEnv();

const passcode = process.env.PASS || "hr@beforest";
const sessionToken = crypto.createHash("sha256").update(passcode).digest("hex");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const clean = decoded === "/" ? "/index.html" : decoded;
  const filePath = path.join(root, clean);
  return filePath.startsWith(root) ? filePath : null;
}

function loadEnv() {
  const envPath = path.join(root, ".env");

  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }

    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024) {
        req.destroy();
      }
    });
    req.on("end", () => resolve(new URLSearchParams(body)));
  });
}

function hasSession(req) {
  return (req.headers.cookie || "").split(";").some((cookie) => cookie.trim() === `hr_pages=${sessionToken}`);
}

function sendLogin(res, message = "") {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>HR Pages Login</title>
    <style>
      @font-face{font-family:"ABC Arizona Flare";src:url("https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/fonts_beforest_arizona/ABCArizonaFlare-Light.e9c1597c.woff2") format("woff2");font-weight:300;font-style:normal;font-display:swap}
      @font-face{font-family:"ABC Arizona Flare";src:url("https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/fonts_beforest_arizona/ABCArizonaFlare-Regular.cbcc518c.woff2") format("woff2");font-weight:400;font-style:normal;font-display:swap}
      @font-face{font-family:"ABC Arizona Flare";src:url("https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/fonts_beforest_arizona/ABCArizonaFlare-Medium.7ce0f1db.woff2") format("woff2");font-weight:500;font-style:normal;font-display:swap}
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#fdfbf7;color:#000000;font-family:"ABC Arizona Flare",Georgia,serif}
      form{width:min(390px,calc(100% - 32px));display:grid;gap:16px}
      h1{margin:0;color:#86312b;font-size:clamp(2.4rem,7vw,4.2rem);font-weight:500;line-height:.95}
      p{margin:0;color:#344736;font-size:1.08rem;line-height:1.45}
      input,button{height:46px;border-radius:8px;font:inherit}
      input{border:1px solid rgba(52,71,54,.28);background:#fffdfa;padding:0 12px;color:#000000}
      button{border:0;background:#344736;color:#fdfbf7;font-weight:500;cursor:pointer}
      .error{color:#86312b;font-weight:500}
    </style>
  </head>
  <body>
    <form method="post" action="/login">
      <h1>HR Pages</h1>
      <p>Enter the passcode to open the page dashboard.</p>
      ${message ? `<p class="error">${message}</p>` : ""}
      <input type="password" name="pass" autocomplete="current-password" autofocus />
      <button type="submit">Open dashboard</button>
    </form>
  </body>
</html>`);
}

const server = http.createServer((req, res) => {
  if (req.url === "/healthz") {
    res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("ok");
    return;
  }

  if (req.url === "/login" && req.method === "POST") {
    parseBody(req).then((body) => {
      if (body.get("pass") === passcode) {
        res.writeHead(302, {
          Location: "/",
          "Set-Cookie": `hr_pages=${sessionToken}; Path=/; HttpOnly; SameSite=Lax`
        });
        res.end();
        return;
      }

      sendLogin(res, "Incorrect passcode.");
    });
    return;
  }

  if (req.url === "/logout") {
    res.writeHead(302, {
      Location: "/",
      "Set-Cookie": "hr_pages=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax"
    });
    res.end();
    return;
  }

  if (!hasSession(req)) {
    sendLogin(res);
    return;
  }

  const filePath = safePath(req.url || "/");

  if (!filePath) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream"
    });
    res.end(data);
  });
});

server.listen(port, () => {
  console.log(`HR pages running at http://localhost:${port}`);
});
