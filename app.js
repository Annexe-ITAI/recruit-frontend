// =============================
// CONFIG
// =============================
console.log("FORCE SYNC TEST");

const RENDER_URL = "https://everecruiter-api.onrender.com";

// =============================
// INIT
// =============================

async function init() {
  const session = new URLSearchParams(window.location.search).get("session");

  if (!session) {
    window.location.href = "/";
    return;
  }

  // keep session locally (for refresh / navigation)
  localStorage.setItem("session", session);

  await loadDashboard(session);
}

// =============================
// LOAD DASHBOARD DATA
// =============================

async function loadDashboard(session) {
  try {
    const res = await fetch(`${RENDER_URL}/api/me?session=${session}`);

    if (!res.ok) {
      throw new Error("Failed to load user data");
    }

    const data = await res.json();

    renderDashboard(data);
} catch (err) {
  console.error("Dashboard load failed:", err);
  alert("Dashboard failed");
}
  
}

// =============================
// RENDER UI
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
// START
// =============================

init();
