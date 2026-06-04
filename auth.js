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
      ".login-shell{min-height:100vh;display:grid;place-items:center;background:#f7f3ea;color:#231f20;font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:16px}",
      ".login-form{width:min(360px,100%);display:grid;gap:14px}",
      ".login-form h1{margin:0;font-size:2rem;line-height:1}",
      ".login-form p{margin:0;color:#6d665f;line-height:1.5}",
      ".login-form input,.login-form button{height:46px;border-radius:8px;font:inherit}",
      ".login-form input{border:1px solid #d8d0c2;background:#fffdfa;padding:0 12px}",
      ".login-form button{border:0;background:#2f6f57;color:white;font-weight:700;cursor:pointer}",
      ".login-error{color:#9f2f24!important;font-weight:700}"
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
