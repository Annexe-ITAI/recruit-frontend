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

async function checkAuth() {
  try {
    const token = getToken();

    if (!token) {
      showLogin();
      return;
    }

    const res = await fetch("https://everecruiter-api.onrender.com/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      showLogin();
      return;
    }

    const data = await res.json();
    showDashboard(data);

  } catch (err) {
    showLogin();
  }
}

function showLogin() {
  document.getElementById("loginContainer").style.display = "block";
  document.getElementById("dashboardContainer").style.display = "none";
}

function showDashboard(data) {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("dashboardContainer").style.display = "block";

  document.getElementById("charName").innerText =
    data.character.character_name;

  document.getElementById("corp").innerText =
    data.character.corporation_id;

  const isMember = data.character.corporation_id === 98012419;

  const applyBtn = document.getElementById("applyBtn");
  if (applyBtn) {
    applyBtn.style.display = isMember ? "none" : "block";
  }
}

checkAuth();
