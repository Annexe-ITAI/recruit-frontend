const API_URL = "https://everecruiter-api.onrender.com";

// =============================
// INIT
// =============================
async function init() {
  try {
    const character_id = new URLSearchParams(window.location.search).get("character_id");

    if (!character_id) {
      window.location.href = "/";
      return;
    }

    localStorage.setItem("character_id", character_id);

    const res = await fetch(
      `${API_URL}/api/me?character_id=${character_id}`
    );

    if (!res.ok) {
      window.location.href = "/";
      return;
    }

    const data = await res.json();
    renderDashboard(data);

  } catch (err) {
    console.error("Auth check failed:", err);
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
