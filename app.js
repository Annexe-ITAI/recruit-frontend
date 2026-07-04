const TOOL_CORP_ID = 98012419;

// --------------------
// TOKEN HANDLING
// --------------------
const urlParams = new URLSearchParams(window.location.search);
const tokenFromUrl = urlParams.get("token");

if (tokenFromUrl) {
  setToken(tokenFromUrl);
  window.history.replaceState({}, document.title, "/dashboard");
}

function getToken() {
  return localStorage.getItem("session");
}

function setToken(token) {
  localStorage.setItem("session", token);
}

// --------------------
// AUTH CHECK
// --------------------
async function checkAuth() {
  const token = getToken();

  if (!token) {
    showLogin();
    return;
  }

  try {
    const res = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const text = await res.text();
    console.log("API RESPONSE:", res.status, text);

    if (!res.ok) {
      showLogin();
      return;
    }

    const data = JSON.parse(text);
    showDashboard(data);

  } catch (err) {
    console.error(err);
    showLogin();
  }
}

// --------------------
// UI STATES
// --------------------
function showLoading(show) {
  document.getElementById("loading").style.display = show ? "block" : "none";
}

function showLogin() {
  showLoading(false);
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("dashboardContainer").style.display = "none";
}

function showDashboard(data) {
  showLoading(false);

  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "block";

  const character = data?.character;

  if (!character) {
    showLogin();
    return;
  }

  document.getElementById("charName").innerText =
    character.character_name;

  document.getElementById("corp").innerText =
    "Corp ID: " + character.corporation_id;

  document.getElementById("alliance").innerText =
    "Alliance ID: " + (character.alliance_id || "None");

  const isMember = character.corporation_id === TOOL_CORP_ID;

  document.getElementById("status").innerText =
    isMember ? "Member Access" : "External Applicant";

  const applyBtn = document.getElementById("applyBtn");
  applyBtn.style.display = isMember ? "none" : "block";
}

// --------------------
// START APP
// --------------------
checkAuth();
