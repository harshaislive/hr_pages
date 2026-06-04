(function () {
  var configuredPass = "hr@beforest";
  var sessionKey = "hr_pages_auth";

  function showLogin() {
    document.body.innerHTML = [
      '<main class="login-shell">',
      '  <form class="login-form" id="loginForm">',
      '    <h1>HR Pages</h1>',
      '    <p>Enter the passcode to open this page.</p>',
      '    <p class="login-error" id="loginError" hidden>Incorrect passcode.</p>',
      '    <input type="password" id="passcode" autocomplete="current-password" autofocus />',
      '    <button type="submit">Open</button>',
      '  </form>',
      '</main>'
    ].join("");

    var style = document.createElement("style");
    style.textContent = [
      "@font-face{font-family:'ABC Arizona Flare';src:url('https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/fonts_beforest_arizona/ABCArizonaFlare-Light.e9c1597c.woff2') format('woff2');font-weight:300;font-style:normal;font-display:swap}",
      "@font-face{font-family:'ABC Arizona Flare';src:url('https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/fonts_beforest_arizona/ABCArizonaFlare-Regular.cbcc518c.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}",
      "@font-face{font-family:'ABC Arizona Flare';src:url('https://isdbyvwocudnlwzghphw.supabase.co/storage/v1/object/public/fonts_beforest_arizona/ABCArizonaFlare-Medium.7ce0f1db.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}",
      ".login-shell{min-height:100vh;display:grid;place-items:center;background:#fdfbf7;color:#000000;font-family:'ABC Arizona Flare',Georgia,serif;padding:16px}",
      ".login-form{width:min(390px,100%);display:grid;gap:16px}",
      ".login-form h1{margin:0;color:#86312b;font-size:clamp(2.4rem,7vw,4.2rem);font-weight:500;line-height:.95}",
      ".login-form p{margin:0;color:#344736;font-size:1.08rem;line-height:1.45}",
      ".login-form input,.login-form button{height:46px;border-radius:8px;font:inherit}",
      ".login-form input{border:1px solid rgba(52,71,54,.28);background:#fffdfa;padding:0 12px;color:#000000}",
      ".login-form button{border:0;background:#344736;color:#fdfbf7;font-weight:500;cursor:pointer}",
      ".login-error{color:#86312b!important;font-weight:500}"
    ].join("");
    document.head.appendChild(style);

    document.getElementById("loginForm").addEventListener("submit", function (event) {
      event.preventDefault();
      var value = document.getElementById("passcode").value;

      if (value === configuredPass) {
        sessionStorage.setItem(sessionKey, "ok");
        window.location.reload();
        return;
      }

      document.getElementById("loginError").hidden = false;
    });
  }

  if (sessionStorage.getItem(sessionKey) !== "ok") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", showLogin);
    } else {
      showLogin();
    }
  }
})();
