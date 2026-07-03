
// =============================
// SESSION CHECK
// =============================

const session = localStorage.getItem("loggedIn");

if (!session) {
  window.location.href = "/";
}

const RENDER_URL = "https://everecruiter-api.onrender.com";

// =============================
// Load user data
// =============================

async function loadDashboard() {
  try {
    const res = await fetch(`${RENDER_URL}/api/me`, {
      headers: {
        Authorization: localStorage.getItem("session_token") || ""
      }
    });

    if (!res.ok) {
      throw new Error("Failed to load user data");
    }

    const data = await res.json();

    // store session AFTER successful fetch
    localStorage.setItem("loggedIn", "true");

    if (data?.main_character?.character_id) {
      localStorage.setItem("character_id", data.main_character.character_id);
    }

    renderDashboard(data);

  } catch (err) {
    console.error("Failed to load dashboard", err);

    // optional safety fallback
    localStorage.removeItem("loggedIn");
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

  // Status
  status.innerHTML = `
    <p>✔ EVE Authenticated</p>
    <p>✔ Discord: ${data.discord?.linked ? "Linked" : "Not Linked"}</p>
  `;

  // Main character
  main.innerHTML = `
    <div class="card-title">Main Character</div>
    <p><b>${data.main_character.name}</b></p>
    <p>Corp: ${data.main_character.corporation}</p>
    <p>Alliance: ${data.main_character.alliance || "None"}</p>
    <p>✔ Registered</p>
  `;

  // Alts
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

loadDashboard();
