const session = localStorage.getItem("loggedIn");

if (!session) {
  window.location.href = "/";
}

const RENDER_URL = "https://everecruiter-api.onrender.com";

// -----------------------------
// Load user data
// -----------------------------
async function loadDashboard() {
  try {
    const res = await fetch(`${RENDER_URL}/api/me`);
    const data = await res.json();

    renderDashboard(data);

  } catch (err) {
    console.error("Failed to load dashboard", err);
  }
}

localStorage.setItem("loggedIn", "true");
localStorage.setItem("character_id", data.character_id);

// -----------------------------
// Render UI
// -----------------------------
function renderDashboard(data) {
  const status = document.getElementById("status");
  const main = document.getElementById("mainCharacter");
  const alts = document.getElementById("alts");

  // Status line
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

// -----------------------------
// Add character flow
// -----------------------------
function addCharacter() {
  window.location.href = `${RENDER_URL}/auth/eve/login`;
}

// Run on load
loadDashboard();
