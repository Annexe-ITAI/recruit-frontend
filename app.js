const API_URL = "https://everecruiter-api.onrender.com";

// =============================
// SESSION
// =============================
function getSession() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlSession = urlParams.get("session");

  if (urlSession) {
    localStorage.setItem("session_token", urlSession);
    return urlSession;
  }

  return localStorage.getItem("session_id");
}

// =============================
// INIT
// =============================
async function init() {
  const session = getSession();

  if (!session) {
    window.location.href = "/";
    return;
  }

  await loadDashboard(session);
}

// =============================
// LOAD DASHBOARD
// =============================
async function loadDashboard(session) {
  try {
    const res = await fetch(`${API_URL}/api/me?session=${session}`);

    if (!res.ok) {
      throw new Error("Invalid session");
    }

    const data = await res.json();

    renderDashboard(data);

  } catch (err) {
    console.error(err);

    localStorage.removeItem("session_id");
    window.location.href = "/";
  }
}

// =============================
// UI
// =============================
function renderDashboard(data) {
  document.getElementById("status").innerHTML =
    `<p>✔ EVE Authenticated</p>`;

  document.getElementById("mainCharacter").innerHTML =
    `<p><b>${data.main_character.name}</b></p>`;

  const alts = document.getElementById("alts");
  alts.innerHTML = "";
}

// =============================
// ADD CHARACTER
// =============================
function addCharacter() {
  window.location.href = `${API_URL}/auth/eve/login`;
}

// =============================
init();
