const TOOL_CORP_ID = 98012419;

// --------------------
// TOKEN HANDLING
// --------------------
function getToken() {
  return localStorage.getItem("session");
}

function setToken(token) {
  localStorage.setItem("session", token);
}

// Only store once after login redirect if ever needed
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
  setToken(tokenFromUrl);
  window.history.replaceState({}, document.title, "/dashboard");
}

// --------------------
// START
// --------------------
checkAuth();

async function checkAuth() {
  const token = getToken();

  if (!token) return showLogin();

  try {
    const res = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) return showLogin();

    const data = await res.json();
    renderDashboard(data);

  } catch (err) {
    console.error(err);
    showLogin();
  }
}

// --------------------
// UI
// --------------------
function showLogin() {
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("dashboardContainer").style.display = "none";
}

function renderDashboard(data) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "block";

  const characters = data.characters || [];

  const list = document.getElementById("characterList");
  list.innerHTML = "";

  characters.forEach(char => {
    const card = document.createElement("div");
    card.className = "character-card";

    card.innerHTML = `
      <div>
        <img src="${char.portrait_url}" />
        <h3>${char.character_name}</h3>

        <p>${char.corporation_name}</p>
        <p>${char.alliance_name || "No Alliance"}</p>

        <div>
          <span>${char.is_member ? "Member" : "External"}</span>
          ${char.role_label ? `<span>${char.role_label}</span>` : ""}
        </div>
      </div>
    `;

    list.appendChild(card);
  });
}
