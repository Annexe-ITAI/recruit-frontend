const API_URL = "https://everecruiter-api.onrender.com";

// =============================
// COOKIE HELPERS
// =============================
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// =============================
// SESSION (COOKIE-BASED)
// =============================
function getCharacterId() {
  const characterId = getCookie("character_id");

  if (!characterId) return null;

  return characterId;
}

// =============================
// INIT
// =============================
async function init() {
  const debug = new URLSearchParams(window.location.search).get("debug");

  if (debug === "1") {
    console.log("DEBUG MODE: bypass auth enabled");
  } else {
    const character_id = getCharacterId();

    if (!character_id) {
      window.location.href = "/";
      return;
    }
  }

  await loadDashboard(getCharacterId());
}

// =============================
// LOAD DASHBOARD
// =============================
async function loadDashboard(character_id) {
  try {
    const res = await fetch(
      `${API_URL}/api/me?character_id=${character_id}`
    );

    if (!res.ok) {
      throw new Error("Invalid session");
    }

    const data = await res.json();

    renderDashboard(data);

  } catch (err) {
    console.error("Dashboard load failed:", err);

    window.location.href = "/";
  }
}

// =============================
// RENDER UI
// =============================
function renderDashboard(data) {
  document.getElementById("status").innerHTML = `
    <p>✔ EVE Authenticated</p>
  `;

  document.getElementById("mainCharacter").innerHTML = `
    <div class="card-title">Main Character</div>
    <p><b>${data.main_character.name}</b></p>
    <p>Corp: ${data.main_character.corporation}</p>
    <p>Alliance: ${data.main_character.alliance || "None"}</p>
  `;

  const alts = document.getElementById("alts");
  alts.innerHTML = "";

  if (Array.isArray(data.alts)) {
    data.alts.forEach(c => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <p><b>${c.name}</b></p>
        <p>Corp: ${c.corporation}</p>
      `;
      alts.appendChild(div);
    });
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
