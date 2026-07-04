const API_URL = "https://everecruiter-api.onrender.com";

// =============================
// SESSION
// =============================
function getSessionToken() {
  return localStorage.getItem("session_token");
}

function setSessionToken(token) {
  localStorage.setItem("session_token", token);
}

// =============================
// AUTH GUARD
// =============================
function requireAuth() {
  const token = getSessionToken();

  if (!token) {
    window.location.href = "/";
    return false;
  }

  return true;
}

// =============================
// INIT
// =============================
async function init() {
  const token = getSessionToken();

  if (!token) {
    window.location.href = "/";
    return;
  }

  await loadDashboard();
}

// =============================
// LOAD DASHBOARD DATA
// =============================
async function loadDashboard() {
  try {
    const res = await fetch(`${API_URL}/api/me`, {
      method: "GET",
      headers: {
        Authorization: getSessionToken()
      }
    });

    if (!res.ok) {
      throw new Error("Unauthorized or failed request");
    }

    const data = await res.json();

    renderDashboard(data);

  } catch (err) {
    console.error("Dashboard failed:", err);

    localStorage.removeItem("session_token");

    window.location.href = "/";
  }
}

// =============================
// RENDER UI
// =============================
function renderDashboard(data) {
  const status = document.getElementById("status");
  const main = document.getElementById("mainCharacter");
  const alts = document.getElementById("alts");

  if (status) {
    status.innerHTML = `
      <p>✔ EVE Authenticated</p>
    `;
  }

  if (main && data.main_character) {
    main.innerHTML = `
      <div class="card-title">Main Character</div>
      <p><b>${data.main_character.name}</b></p>
      <p>Corp: ${data.main_character.corporation || "Unknown"}</p>
      <p>Alliance: ${data.main_character.alliance || "None"}</p>
    `;
  }

  if (alts) {
    alts.innerHTML = "";

    if (Array.isArray(data.alts)) {
      data.alts.forEach(c => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
          <p><b>${c.name}</b></p>
          <p>Corp: ${c.corporation || "Unknown"}</p>
        `;

        alts.appendChild(div);
      });
    }
  }
}

// =============================
// ADD CHARACTER
// =============================
function addCharacter() {
  window.location.href = `${API_URL}/auth/eve/login`;
}

// =============================
// START
// =============================
init();
