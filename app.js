// =============================
// CONFIG
// =============================

const RENDER_URL = "https://everecruiter-api.onrender.com";

// =============================
// AUTH GUARD (single source of truth)
// =============================

async function authGuard() {
  const token = localStorage.getItem("session_token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  try {
    const res = await fetch(`${RENDER_URL}/api/me`, {
      headers: {
        Authorization: token
      }
    });

    if (!res.ok) {
      throw new Error("Invalid session");
    }

    return await res.json();
  } catch (err) {
    console.error("Auth failed:", err);

    localStorage.removeItem("session_token");
    localStorage.removeItem("character_id");

    window.location.href = "/";
    return null;
  }
}

// =============================
// LOAD DASHBOARD DATA
// =============================

function renderDashboard(data) {
  const status = document.getElementById("status");
  const main = document.getElementById("mainCharacter");
  const alts = document.getElementById("alts");

  status.innerHTML = `
    <p>✔ EVE Authenticated</p>
    <p>✔ Discord: ${data.discord?.linked ? "Linked" : "Not Linked"}</p>
  `;

  main.innerHTML = `
    <div class="card-title">Main Character</div>
    <p><b>${data.main_character.name}</b></p>
    <p>Corp: ${data.main_character.corporation}</p>
    <p>Alliance: ${data.main_character.alliance || "None"}</p>
    <p>✔ Registered</p>
  `;

  alts.innerHTML = "";

  if (Array.isArray(data.alts)) {
    data.alts.forEach(c => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p><b>${c.name}</b></p>
        <p>Corp: ${c.corporation}</p>
        <p>✔ Registered</p>
      `;
      alts.appendChild(div);
    });
  }
}

// =============================
// ADD CHARACTER FLOW
// =============================

function addCharacter() {
  window.location.href = `${RENDER_URL}/auth/eve/login`;
}

// =============================
// INIT
// =============================

async function init() {
  const user = await authGuard();

  if (!user) return;

  if (user?.main_character?.character_id) {
    localStorage.setItem("character_id", user.main_character.character_id);
  }

  renderDashboard(user);
}

// =============================
// START APP
// =============================

init();
