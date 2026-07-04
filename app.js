async function checkAuth() {
  try {
    const res = await fetch("https://everecruiter-api.onrender.com/api/me", {
      credentials: "include"
    });

    if (res.status === 401) {
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
