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
// START APP
// --------------------
checkAuth();

// --------------------
// AUTH CHECK
// --------------------
async function checkAuth() {
  const token = getToken();

  if (!token) {
    return showLogin();
  }

  try {
    const res = await fetch("/api/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return showLogin();
    }

    const data = await res.json();
    renderDashboard(data);

  } catch (err) {
    console.error(err);
    showLogin();
  }
}

// --------------------
// UI STATES
// --------------------
function showLoading(show) {
  const el = document.getElementById("loading");
  if (el) el.style.display = show ? "block" : "none";
}

function showLogin() {
  showLoading(false);

  const login = document.getElementById("loginContainer");
  const dash = document.getElementById("dashboardContainer");

  if (login) login.style.display = "block";
  if (dash) dash.style.display = "none";
}

// --------------------
// DASHBOARD RENDER
// --------------------
function renderDashboard(data) {
  showLoading(false);

  const login = document.getElementById("loginContainer");
  const dash = document.getElementById("dashboardContainer");

  if (login) login.style.display = "none";
  if (dash) dash.style.display = "block";

  const character = data?.character;
  const access = data?.access;

  if (!character) {
    return showLogin();

  const meta = data.meta;

  document.getElementById("corp").innerText =
    meta.corporation_name;
  
  document.getElementById("alliance").innerText =
    meta.alliance_name || "No Alliance";

    const portrait = document.getElementById("portrait");

if (portrait) {
  portrait.src = meta.portrait_url;
}
  }

  // --------------------
  // BASIC INFO
  // --------------------
  const charName = document.getElementById("charName");
  const corp = document.getElementById("corp");
  const alliance = document.getElementById("alliance");
  const status = document.getElementById("status");

  if (charName) charName.innerText = character.character_name;

  if (corp) {
    corp.innerText = `Corp ID: ${character.corporation_id}`;
  }

  if (alliance) {
    alliance.innerText = `Alliance ID: ${character.alliance_id || "None"}`;
  }

  // --------------------
  // STATUS
  // --------------------
  const isMember = access?.isMember;

  if (status) {
    status.innerText = isMember ? "Member" : "External Applicant";
  }

  // --------------------
  // APPLY BUTTON
  // --------------------
  const applyBtn = document.getElementById("applyBtn");

  if (applyBtn) {
    applyBtn.style.display = isMember ? "none" : "block";

    applyBtn.onclick = async () => {
      applyBtn.innerText = "Submitting...";
      applyBtn.disabled = true;

      try {
        const token = getToken();

        const res = await fetch("/api/apply", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!res.ok) throw new Error("Apply failed");

        applyBtn.innerText = "Applied ✔";

      } catch (err) {
        console.error(err);
        applyBtn.innerText = "Apply";
        applyBtn.disabled = false;
      }
    };
  }

  // --------------------
  // DISCORD BUTTON (placeholder)
  // --------------------
  const discordBtn = document.getElementById("discordBtn");

  if (discordBtn) {
    discordBtn.onclick = () => {
      alert("Discord integration coming next step");
    };
  }
}
